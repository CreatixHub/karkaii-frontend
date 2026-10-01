

const SecuritySettings = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content">
      {/* ===================== 1. ACCOUNT SECURITY HERO ===================== */}
      <div className="acs-hero">
        <div className="acs-hero-id">
          <div className="acs-hero-top">
            <span className="acs-portrait">
              LR
              <i className="ti ti-check acs-portrait-tick" />
            </span>
            <div className="flex-fill">
              <h1 className="acs-hero-name">Ms. Latha Rao</h1>
              <p className="acs-hero-role">
                Super Administrator ·{" "}
                <span className="acs-mono">latha.rao@preskool.edu</span>
              </p>
            </div>
            <span className="acs-badge is-safe">
              <i className="ti ti-shield-check" />
              Account active
            </span>
          </div>
          <div className="acs-hero-facts">
            <div className="acs-hero-fact">
              <span>Security status</span>
              <strong>
                Good{" "}
                <span className="acs-badge is-watch">
                  <i className="ti ti-alert-circle" />2 to fix
                </span>
              </strong>
              <small>
                Nothing urgent, two items worth an hour of your time
              </small>
            </div>
            <div className="acs-hero-fact">
              <span>Authentication</span>
              <strong>Password + authenticator app</strong>
              <small>Single sign-on is not in use on this account</small>
            </div>
            <div className="acs-hero-fact">
              <span>Two-factor</span>
              <strong>
                <i className="ti ti-circle-check-filled text-success" />
                Enabled
              </strong>
              <small>Authenticator app, with 8 recovery codes unused</small>
            </div>
            <div className="acs-hero-fact">
              <span>Last login</span>
              <strong>Today, 08:42 AM</strong>
              <small>Chrome on Windows · Chennai, India</small>
            </div>
            <div className="acs-hero-fact">
              <span>Last password change</span>
              <strong>112 days ago</strong>
              <small>Expires in 68 days · 11 Apr 2026</small>
            </div>
            <div className="acs-hero-fact">
              <span>Active sessions</span>
              <strong>4 across 3 devices</strong>
              <small>One has been idle for 9 days</small>
            </div>
          </div>
          <div className="acs-hero-actions">
            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#acs_password"
            >
              <i className="ti ti-key me-1" />
              Change password
            </button>
            <button
              type="button"
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#acs_2fa"
            >
              <i className="ti ti-device-mobile-check me-1" />
              Manage 2FA
            </button>
            <button
              type="button"
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#acs_verify"
            >
              <i className="ti ti-scan me-1" />
              Run security scan
            </button>
            <button
              type="button"
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#acs_recovery"
            >
              <i className="ti ti-device-floppy me-1" />
              Save changes
            </button>
          </div>
        </div>
        <div className="acs-posture">
          <span className="acs-shield acs-p-78">
            <span className="acs-shield-n">
              <b>78</b>
              <span>of 100</span>
            </span>
          </span>
          <p className="acs-posture-title">Security posture</p>
          <p className="acs-posture-txt">
            Two-factor and a strong password carry most of this. Verifying the
            recovery email and clearing one stale device would take it past 90.
          </p>
        </div>
      </div>
      {/* /Account Security Hero */}
      <div className="row g-4">
        {/* ===================== 2. STICKY SETTINGS NAVIGATION ===================== */}
        <div className="col-xxl-3 col-lg-4">
          <div
            className="acs-nav nav flex-column"
            role="tablist"
            aria-label="Account and security sections"
          >
            <span className="acs-nav-hdr">Account</span>
            <button
              className="acs-nav-link active"
              id="acstab-profile"
              data-bs-toggle="pill"
              data-bs-target="#acspane-profile"
              type="button"
              role="tab"
              aria-controls="acspane-profile"
              aria-selected="true"
            >
              <i className="ti ti-user-circle" />
              <span className="acs-nav-txt">Profile</span>
            </button>
            <button
              className="acs-nav-link"
              id="acstab-account"
              data-bs-toggle="pill"
              data-bs-target="#acspane-account"
              type="button"
              role="tab"
              aria-controls="acspane-account"
              aria-selected="false"
            >
              <i className="ti ti-id" />
              <span className="acs-nav-txt">Account Information</span>
            </button>
            <span className="acs-nav-hdr">Sign-in</span>
            <button
              className="acs-nav-link"
              id="acstab-auth"
              data-bs-toggle="pill"
              data-bs-target="#acspane-auth"
              type="button"
              role="tab"
              aria-controls="acspane-auth"
              aria-selected="false"
            >
              <i className="ti ti-fingerprint" />
              <span className="acs-nav-txt">Authentication</span>
            </button>
            <button
              className="acs-nav-link"
              id="acstab-password"
              data-bs-toggle="pill"
              data-bs-target="#acspane-password"
              type="button"
              role="tab"
              aria-controls="acspane-password"
              aria-selected="false"
            >
              <i className="ti ti-key" />
              <span className="acs-nav-txt">Password Policy</span>
            </button>
            <button
              className="acs-nav-link"
              id="acstab-twofa"
              data-bs-toggle="pill"
              data-bs-target="#acspane-twofa"
              type="button"
              role="tab"
              aria-controls="acspane-twofa"
              aria-selected="false"
            >
              <i className="ti ti-device-mobile-check" />
              <span className="acs-nav-txt">Two-Factor Authentication</span>
            </button>
            <button
              className="acs-nav-link"
              id="acstab-recovery"
              data-bs-toggle="pill"
              data-bs-target="#acspane-recovery"
              type="button"
              role="tab"
              aria-controls="acspane-recovery"
              aria-selected="false"
            >
              <i className="ti ti-lifebuoy" />
              <span className="acs-nav-txt">Recovery Options</span>
              <i
                className="ti ti-alert-triangle-filled acs-nav-flag"
                aria-label="Needs attention"
                role="img"
              />
            </button>
            <span className="acs-nav-hdr">Access</span>
            <button
              className="acs-nav-link"
              id="acstab-sessions"
              data-bs-toggle="pill"
              data-bs-target="#acspane-sessions"
              type="button"
              role="tab"
              aria-controls="acspane-sessions"
              aria-selected="false"
            >
              <i className="ti ti-windmill" />
              <span className="acs-nav-txt">Login Sessions</span>
            </button>
            <button
              className="acs-nav-link"
              id="acstab-devices"
              data-bs-toggle="pill"
              data-bs-target="#acspane-devices"
              type="button"
              role="tab"
              aria-controls="acspane-devices"
              aria-selected="false"
            >
              <i className="ti ti-devices" />
              <span className="acs-nav-txt">Trusted Devices</span>
              <i
                className="ti ti-alert-triangle-filled acs-nav-flag"
                aria-label="Needs attention"
                role="img"
              />
            </button>
            <button
              className="acs-nav-link"
              id="acstab-history"
              data-bs-toggle="pill"
              data-bs-target="#acspane-history"
              type="button"
              role="tab"
              aria-controls="acspane-history"
              aria-selected="false"
            >
              <i className="ti ti-history-toggle" />
              <span className="acs-nav-txt">Login History</span>
            </button>
            <span className="acs-nav-hdr">Control</span>
            <button
              className="acs-nav-link"
              id="acstab-privacy"
              data-bs-toggle="pill"
              data-bs-target="#acspane-privacy"
              type="button"
              role="tab"
              aria-controls="acspane-privacy"
              aria-selected="false"
            >
              <i className="ti ti-eye-off" />
              <span className="acs-nav-txt">Privacy</span>
            </button>
            <button
              className="acs-nav-link"
              id="acstab-notifications"
              data-bs-toggle="pill"
              data-bs-target="#acspane-notifications"
              type="button"
              role="tab"
              aria-controls="acspane-notifications"
              aria-selected="false"
            >
              <i className="ti ti-bell" />
              <span className="acs-nav-txt">Notifications</span>
            </button>
            <button
              className="acs-nav-link"
              id="acstab-permissions"
              data-bs-toggle="pill"
              data-bs-target="#acspane-permissions"
              type="button"
              role="tab"
              aria-controls="acspane-permissions"
              aria-selected="false"
            >
              <i className="ti ti-lock-access" />
              <span className="acs-nav-txt">Permissions</span>
            </button>
            <span className="acs-nav-hdr">Records</span>
            <button
              className="acs-nav-link"
              id="acstab-logs"
              data-bs-toggle="pill"
              data-bs-target="#acspane-logs"
              type="button"
              role="tab"
              aria-controls="acspane-logs"
              aria-selected="false"
            >
              <i className="ti ti-list-details" />
              <span className="acs-nav-txt">Security Logs</span>
            </button>
            <button
              className="acs-nav-link"
              id="acstab-advanced"
              data-bs-toggle="pill"
              data-bs-target="#acspane-advanced"
              type="button"
              role="tab"
              aria-controls="acspane-advanced"
              aria-selected="false"
            >
              <i className="ti ti-terminal-2" />
              <span className="acs-nav-txt">Advanced</span>
            </button>
            <button
              className="acs-nav-link"
              id="acstab-audit"
              data-bs-toggle="pill"
              data-bs-target="#acspane-audit"
              type="button"
              role="tab"
              aria-controls="acspane-audit"
              aria-selected="false"
            >
              <i className="ti ti-file-search" />
              <span className="acs-nav-txt">Audit History</span>
            </button>
            <div className="acs-nav-foot">
              <span className="acs-lbl">Session</span>
              <p className="fs-12 text-muted mb-2">
                Signed in from Chennai on Chrome. This session expires after 30
                minutes idle.
              </p>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm w-100 d-inline-flex align-items-center justify-content-center"
                data-bs-toggle="modal"
                data-bs-target="#acs_terminate"
              >
                <i className="ti ti-logout me-1" />
                Sign out everywhere
              </button>
            </div>
          </div>
        </div>
        {/* /Sticky Settings Navigation */}
        {/* ===================== 3&ndash;7. SECURITY WORKSPACE ===================== */}
        <div className="col-xxl-9 col-lg-8">
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="acspane-profile"
              role="tabpanel"
              aria-labelledby="acstab-profile"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 01</span>
                  <h2 className="acs-hero-name fs-20 mb-1">Profile</h2>
                  <p className="fs-13 text-muted mb-0">
                    Who this account belongs to, and what protects it.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="acs-card">
                    <div className="acs-card-head">
                      <span className="acs-card-ic">
                        <i className="ti ti-user-circle" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Profile</p>
                        <p>How this account appears to everyone else</p>
                      </div>
                      <span className="acs-badge is-safe">
                        <i className="ti ti-check" />
                        Verified
                      </span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Display name</span>
                          <strong>Ms. Latha Rao</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <input
                            type="text"
                            className="acs-input"
                            defaultValue="Latha Rao"
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Title</span>
                          <strong>Super Administrator</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="badge-meta">
                            <i className="ti ti-shield" />
                            Highest role
                          </span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Department</span>
                          <strong>Administration · Head Office</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <select
                            className="acs-select"
                            aria-label="Setting value"
                          >
                            <option>Administration</option>
                            <option>Academics</option>
                            <option>Accounts</option>
                            <option>IT</option>
                          </select>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Photograph</span>
                          <strong>
                            Initials shown — no photograph uploaded
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#acs_workspace"
                            aria-label="Open security workspace for Photograph"
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Visible to</span>
                          <strong>
                            Staff directory and internal correspondence
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <select
                            className="acs-select"
                            aria-label="Setting value"
                          >
                            <option>Staff only</option>
                            <option>Staff and guardians</option>
                            <option>Nobody</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Profile"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-card is-watch">
                    <div className="acs-card-head flex-wrap gap-3">
                      <span className="acs-card-ic is-safe">
                        <i className="ti ti-shield-half" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">
                          What protects this account
                        </p>
                        <p>Four layers, three of them armed</p>
                      </div>
                      <span className="acs-badge is-watch">1 gap</span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-rule">
                        <i className="ti ti-circle-check-filled" />A password
                        that meets every policy rule
                      </div>
                      <div className="acs-rule">
                        <i className="ti ti-circle-check-filled" />
                        An authenticator app, required at every sign-in
                      </div>
                      <div className="acs-rule">
                        <i className="ti ti-circle-check-filled" />
                        Eight unused recovery codes, printed and held offline
                      </div>
                      <div className="acs-rule is-off">
                        <i className="ti ti-circle" />A verified recovery email
                        outside the school domain
                      </div>
                      <p className="fs-12 text-muted mb-0 mt-3">
                        The last one matters more than it looks. If the school
                        domain ever becomes unreachable, a recovery address on
                        it is unreachable too.
                      </p>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">Reviewed today</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Account protection"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <span className="acs-lbl">Security recommendations</span>
                  <p className="fs-13 text-muted mb-3">
                    Ordered by how much risk each one removes, not by how
                    quickly it can be done.
                  </p>
                  <div className="acs-rec is-high">
                    <span className="acs-rec-n">1</span>
                    <div className="overflow-hidden">
                      <p className="acs-rec-title">Verify the recovery email</p>
                      <p className="acs-rec-txt">
                        The address on file is latha.rao@preskool.edu, which
                        sits on the same domain as the account it recovers. Add
                        a personal address so a domain outage does not lock you
                        out.
                      </p>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                        <span className="acs-badge is-risk">High priority</span>
                        <span className="badge-meta">
                          <i className="ti ti-shield" />
                          +7 posture
                        </span>
                        <span className="badge-meta">
                          <i className="ti ti-clock" />2 minutes
                        </span>
                      </div>
                    </div>
                    <div className="acs-rec-act">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#acs_recovery"
                      >
                        Verify now
                      </button>
                    </div>
                  </div>
                  <div className="acs-rec is-medium">
                    <span className="acs-rec-n">2</span>
                    <div className="overflow-hidden">
                      <p className="acs-rec-title">Remove an unused device</p>
                      <p className="acs-rec-txt">
                        A Samsung tablet last seen 94 days ago is still trusted,
                        which means it can skip two-factor. If it has been
                        retired, remove it.
                      </p>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                        <span className="acs-badge is-watch">
                          Medium priority
                        </span>
                        <span className="badge-meta">
                          <i className="ti ti-shield" />
                          +5 posture
                        </span>
                        <span className="badge-meta">
                          <i className="ti ti-clock" />1 minute
                        </span>
                      </div>
                    </div>
                    <div className="acs-rec-act">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#acs_removedevice"
                      >
                        Review device
                      </button>
                    </div>
                  </div>
                  <div className="acs-rec is-medium">
                    <span className="acs-rec-n">3</span>
                    <div className="overflow-hidden">
                      <p className="acs-rec-title">Review active sessions</p>
                      <p className="acs-rec-txt">
                        Four sessions across three devices. One on Safari has
                        been idle for nine days and can safely be ended.
                      </p>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                        <span className="acs-badge is-watch">
                          Medium priority
                        </span>
                        <span className="badge-meta">
                          <i className="ti ti-shield" />
                          +4 posture
                        </span>
                        <span className="badge-meta">
                          <i className="ti ti-clock" />1 minute
                        </span>
                      </div>
                    </div>
                    <div className="acs-rec-act">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Active sessions"
                      >
                        Review sessions
                      </button>
                    </div>
                  </div>
                  <div className="acs-rec is-medium">
                    <span className="acs-rec-n">4</span>
                    <div className="overflow-hidden">
                      <p className="acs-rec-title">
                        Rotate the personal API key
                      </p>
                      <p className="acs-rec-txt">
                        The key issued for the reporting integration is 214 days
                        old. School policy asks for 180.
                      </p>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                        <span className="acs-badge is-watch">
                          Medium priority
                        </span>
                        <span className="badge-meta">
                          <i className="ti ti-shield" />
                          +3 posture
                        </span>
                        <span className="badge-meta">
                          <i className="ti ti-clock" />5 minutes
                        </span>
                      </div>
                    </div>
                    <div className="acs-rec-act">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for API keys"
                      >
                        Rotate key
                      </button>
                    </div>
                  </div>
                  <div className="acs-rec is-done">
                    <span className="acs-rec-n">5</span>
                    <div className="overflow-hidden">
                      <p className="acs-rec-title">Update the password</p>
                      <p className="acs-rec-txt">
                        Changed 112 days ago and still inside policy. It expires
                        in 68 days and will prompt automatically.
                      </p>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                        <span className="acs-badge is-safe">Not due</span>
                        <span className="badge-meta">
                          <i className="ti ti-shield" />
                          No change
                        </span>
                        <span className="badge-meta">
                          <i className="ti ti-clock" />
                          Due 11 Oct
                        </span>
                      </div>
                    </div>
                    <div className="acs-rec-act">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#acs_password"
                      >
                        Change anyway
                      </button>
                    </div>
                  </div>
                  <div className="acs-rec is-done">
                    <span className="acs-rec-n">6</span>
                    <div className="overflow-hidden">
                      <p className="acs-rec-title">
                        Enable two-factor authentication
                      </p>
                      <p className="acs-rec-txt">
                        Armed on 22 Feb 2026 with an authenticator app. Required
                        at every sign-in, including on trusted devices.
                      </p>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                        <span className="acs-badge is-safe">Complete</span>
                        <span className="badge-meta">
                          <i className="ti ti-shield" />
                          Already counted
                        </span>
                        <span className="badge-meta">
                          <i className="ti ti-clock" />—
                        </span>
                      </div>
                    </div>
                    <div className="acs-rec-act">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#acs_2fa"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                  <div className="acs-rec is-done">
                    <span className="acs-rec-n">7</span>
                    <div className="overflow-hidden">
                      <p className="acs-rec-title">Update security questions</p>
                      <p className="acs-rec-txt">
                        Retired in March. Questions were replaced by recovery
                        codes, which cannot be researched from a public profile.
                      </p>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                        <span className="acs-badge is-safe">Retired</span>
                        <span className="badge-meta">
                          <i className="ti ti-shield" />
                          No longer used
                        </span>
                        <span className="badge-meta">
                          <i className="ti ti-clock" />—
                        </span>
                      </div>
                    </div>
                    <div className="acs-rec-act">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Security questions"
                      >
                        Read why
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="acspane-account"
              role="tabpanel"
              aria-labelledby="acstab-account"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 02</span>
                  <h2 className="acs-hero-name fs-20 mb-1">
                    Account Information
                  </h2>
                  <p className="fs-13 text-muted mb-0">
                    What the school holds on record.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="acs-card">
                    <div className="acs-card-head">
                      <span className="acs-card-ic">
                        <i className="ti ti-id" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Identity</p>
                        <p>What the school holds on record</p>
                      </div>
                      <span className="acs-badge is-safe">
                        <i className="ti ti-check" />
                        Confirmed
                      </span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Full name</span>
                          <strong>Latha Rao</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <input
                            type="text"
                            className="acs-input"
                            defaultValue="Latha Rao"
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Username</span>
                          <strong>latha.rao</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="badge-meta">
                            <i className="ti ti-lock" />
                            Cannot be changed
                          </span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Employee ID</span>
                          <strong>PRSK-EMP-0114</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="badge-meta">
                            <i className="ti ti-lock" />
                            Issued by HR
                          </span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Date joined</span>
                          <strong>14 January 2019</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="badge-meta">7 years</span>
                        </div>
                      </div>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">4 fields</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Identity"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-card is-watch">
                    <div className="acs-card-head">
                      <span className="acs-card-ic">
                        <i className="ti ti-mail" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Contact</p>
                        <p>Where the school reaches this account</p>
                      </div>
                      <span className="acs-badge is-watch">
                        <i className="ti ti-alert-circle" />1 unverified
                      </span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Email address</span>
                          <strong>
                            latha.rao@preskool.edu{" "}
                            <span className="acs-badge is-safe">Verified</span>
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <input
                            type="text"
                            className="acs-input"
                            defaultValue="latha.rao@preskool.edu"
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Recovery email</span>
                          <strong>
                            Not set — the same address is being used
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#acs_recovery"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Phone number</span>
                          <strong>
                            +91 98765 44710{" "}
                            <span className="acs-badge is-safe">Verified</span>
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <input
                            type="text"
                            className="acs-input"
                            defaultValue="+91 98765 44710"
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Recovery phone</span>
                          <strong>Same as the number above</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_1"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_1"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">
                        4 fields · 1 needs attention
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Contact"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-card">
                    <div className="acs-card-head">
                      <span className="acs-card-ic">
                        <i className="ti ti-briefcase" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Role &amp; placement</p>
                        <p>What this account is entitled to do</p>
                      </div>
                      <span className="acs-badge is-info">Highest role</span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Role</span>
                          <strong>Super Administrator</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="badge-meta">
                            <i className="ti ti-lock" />
                            Changed by the Principal only
                          </span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Department</span>
                          <strong>Administration</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <select
                            className="acs-select"
                            aria-label="Setting value"
                          >
                            <option>Administration</option>
                            <option>Academics</option>
                            <option>Accounts</option>
                            <option>IT</option>
                          </select>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Reports to</span>
                          <strong>Dr. Anitha Krishnan, Principal</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="badge-meta">Approver</span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Campus access</span>
                          <strong>All three campuses</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <select
                            className="acs-select"
                            aria-label="Setting value"
                          >
                            <option>All campuses</option>
                            <option>Main campus only</option>
                            <option>Head office only</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">4 fields</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Role and placement"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-card">
                    <div className="acs-card-head">
                      <span className="acs-card-ic is-safe">
                        <i className="ti ti-user-check" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Account status</p>
                        <p>Whether this account may be used at all</p>
                      </div>
                      <span className="acs-badge is-safe">
                        <i className="ti ti-circle-check" />
                        Active
                      </span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Status</span>
                          <strong>Active since 14 January 2019</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="acs-badge is-safe">Active</span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Locked out</span>
                          <strong>
                            No — last lockout was 22 Feb 2026 after 5 failed
                            attempts
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="badge-meta">Auto-cleared</span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Account expiry</span>
                          <strong>None set — permanent staff</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <select
                            className="acs-select"
                            aria-label="Setting value"
                          >
                            <option>No expiry</option>
                            <option>End of academic year</option>
                            <option>Custom date</option>
                          </select>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Deactivation</span>
                          <strong>
                            Suspends sign-in without deleting any record
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#acs_workspace"
                            aria-label="Open security workspace for Deactivation"
                          >
                            Deactivate
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">4 fields</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Account status"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="acspane-auth"
              role="tabpanel"
              aria-labelledby="acstab-auth"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 03</span>
                  <h2 className="acs-hero-name fs-20 mb-1">Authentication</h2>
                  <p className="fs-13 text-muted mb-0">
                    Every way this account can prove who it is.
                  </p>
                </div>
              </div>
              <p className="fs-13 text-muted mb-3">
                Every way this account can prove who it is. A factor that is
                armed is required at sign-in; one that is not is simply
                available.
              </p>
              <div className="row g-4">
                <div className="col-12">
                  <div className="acs-factor is-on">
                    <div className="acs-factor-top">
                      <span className="acs-factor-ic">
                        <i className="ti ti-key" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-factor-title">Password</p>
                        <span className="acs-badge is-safe">Armed</span>
                      </div>
                    </div>
                    <p className="acs-factor-txt">
                      A 16-character passphrase, changed 112 days ago and inside
                      every policy rule.
                    </p>
                    <div>
                      <span className="acs-lbl">Strength</span>
                      <span className="acs-strength is-4">
                        <i />
                        <i />
                        <i />
                        <i />
                        <em>Strong</em>
                      </span>
                    </div>
                    <div className="acs-factor-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="acs_sw_2"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="acs_sw_2"
                        >
                          Enable
                        </label>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#acs_password"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-factor is-on">
                    <div className="acs-factor-top">
                      <span className="acs-factor-ic">
                        <i className="ti ti-device-mobile-check" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-factor-title">Authenticator app</p>
                        <span className="acs-badge is-safe">Armed</span>
                      </div>
                    </div>
                    <p className="acs-factor-txt">
                      Google Authenticator on the primary phone. A six-digit
                      code at every sign-in.
                    </p>
                    <div>
                      <span className="acs-lbl">Strength</span>
                      <span className="acs-strength is-4">
                        <i />
                        <i />
                        <i />
                        <i />
                        <em>Strong</em>
                      </span>
                    </div>
                    <div className="acs-factor-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="acs_sw_3"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="acs_sw_3"
                        >
                          Enable
                        </label>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#acs_2fa"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-factor is-on">
                    <div className="acs-factor-top">
                      <span className="acs-factor-ic">
                        <i className="ti ti-mail-check" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-factor-title">Email verification</p>
                        <span className="acs-badge is-safe">Armed</span>
                      </div>
                    </div>
                    <p className="acs-factor-txt">
                      A one-time link when signing in from a device that has
                      never been seen before.
                    </p>
                    <div>
                      <span className="acs-lbl">Strength</span>
                      <span className="acs-strength is-3">
                        <i />
                        <i />
                        <i />
                        <i />
                        <em>Good</em>
                      </span>
                    </div>
                    <div className="acs-factor-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="acs_sw_4"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="acs_sw_4"
                        >
                          Enable
                        </label>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Email verification"
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-factor is-off">
                    <div className="acs-factor-top">
                      <span className="acs-factor-ic">
                        <i className="ti ti-message-2-code" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-factor-title">SMS verification</p>
                        <span className="acs-badge">Not in use</span>
                      </div>
                    </div>
                    <p className="acs-factor-txt">
                      Off by design. A code sent by text can be intercepted by
                      swapping the SIM, so it is kept as a fallback only.
                    </p>
                    <div>
                      <span className="acs-lbl">Strength</span>
                      <span className="acs-strength is-2">
                        <i />
                        <i />
                        <i />
                        <i />
                        <em>Fallback</em>
                      </span>
                    </div>
                    <div className="acs-factor-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="acs_sw_5"
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="acs_sw_5"
                        >
                          Enable
                        </label>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#acs_2fa"
                      >
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-factor is-on">
                    <div className="acs-factor-top">
                      <span className="acs-factor-ic">
                        <i className="ti ti-fingerprint" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-factor-title">Biometric sign-in</p>
                        <span className="acs-badge is-safe">Armed</span>
                      </div>
                    </div>
                    <p className="acs-factor-txt">
                      Windows Hello on the office desktop. The fingerprint never
                      leaves that machine.
                    </p>
                    <div>
                      <span className="acs-lbl">Strength</span>
                      <span className="acs-strength is-4">
                        <i />
                        <i />
                        <i />
                        <i />
                        <em>Strong</em>
                      </span>
                    </div>
                    <div className="acs-factor-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="acs_sw_6"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="acs_sw_6"
                        >
                          Enable
                        </label>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Biometric sign-in"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-factor is-off">
                    <div className="acs-factor-top">
                      <span className="acs-factor-ic">
                        <i className="ti ti-lock-square-rounded" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-factor-title">Passkey</p>
                        <span className="acs-badge">Not in use</span>
                      </div>
                    </div>
                    <p className="acs-factor-txt">
                      Available but unused. A passkey cannot be phished, because
                      it will not present itself to the wrong site.
                    </p>
                    <div>
                      <span className="acs-lbl">Strength</span>
                      <span className="acs-strength is-4">
                        <i />
                        <i />
                        <i />
                        <i />
                        <em>Strongest</em>
                      </span>
                    </div>
                    <div className="acs-factor-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="acs_sw_7"
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="acs_sw_7"
                        >
                          Enable
                        </label>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#acs_device"
                      >
                        Add passkey
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-factor is-off">
                    <div className="acs-factor-top">
                      <span className="acs-factor-ic">
                        <i className="ti ti-building-arch" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-factor-title">Single sign-on</p>
                        <span className="acs-badge">Not in use</span>
                      </div>
                    </div>
                    <p className="acs-factor-txt">
                      The school has not federated with an identity provider.
                      Accounts are held here.
                    </p>
                    <div>
                      <span className="acs-lbl">Strength</span>
                      <span className="acs-strength is-1">
                        <i />
                        <i />
                        <i />
                        <i />
                        <em>Not in use</em>
                      </span>
                    </div>
                    <div className="acs-factor-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="acs_sw_8"
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="acs_sw_8"
                        >
                          Enable
                        </label>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Single sign-on"
                      >
                        Read more
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-factor is-on">
                    <div className="acs-factor-top">
                      <span className="acs-factor-ic">
                        <i className="ti ti-lifebuoy" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-factor-title">Recovery codes</p>
                        <span className="acs-badge is-safe">Armed</span>
                      </div>
                    </div>
                    <p className="acs-factor-txt">
                      Ten codes issued on 22 Feb, of which two have been spent.
                      Held on paper in the safe.
                    </p>
                    <div>
                      <span className="acs-lbl">Strength</span>
                      <span className="acs-strength is-3">
                        <i />
                        <i />
                        <i />
                        <i />
                        <em>Good</em>
                      </span>
                    </div>
                    <div className="acs-factor-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="acs_sw_9"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="acs_sw_9"
                        >
                          Enable
                        </label>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Recovery codes"
                      >
                        View codes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="acspane-password"
              role="tabpanel"
              aria-labelledby="acstab-password"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 04</span>
                  <h2 className="acs-hero-name fs-20 mb-1">Password Policy</h2>
                  <p className="fs-13 text-muted mb-0">
                    The one factor everybody has, and the rules it must satisfy.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="acs-card">
                    <div className="acs-card-head">
                      <span className="acs-card-ic is-safe">
                        <i className="ti ti-key" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Current password</p>
                        <p>Changed 11 April 2026</p>
                      </div>
                      <span className="acs-badge is-safe">Strong</span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-age mt-2">
                        <div className="acs-age-track acs-p-62">
                          <span />
                        </div>
                        <div className="acs-age-meta">
                          <span>112 days old</span>
                          <span>
                            expires in <b>68 days</b>
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="acs-lbl">Strength</span>
                        <span className="acs-strength is-4">
                          <i />
                          <i />
                          <i />
                          <i />
                          <em>16 characters · not in any breach list</em>
                        </span>
                      </div>
                      <p className="fs-12 text-muted mb-0 mt-3">
                        A prompt appears automatically seven days before expiry.
                        There is no benefit to changing it early unless you
                        believe it is known to someone else.
                      </p>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">
                        Next prompt 04 Oct 2026
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary d-inline-flex align-items-center"
                        data-bs-toggle="modal"
                        data-bs-target="#acs_password"
                      >
                        <i className="ti ti-key me-1" />
                        Change password
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-card">
                    <div className="acs-card-head">
                      <span className="acs-card-ic">
                        <i className="ti ti-list-check" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Password policy</p>
                        <p>Applies to every administrator account</p>
                      </div>
                      <span className="acs-badge is-info">School-wide</span>
                    </div>
                    <div className="acs-card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="acs-rule">
                            <i className="ti ti-circle-check-filled" />
                            At least 12 characters
                          </div>
                          <div className="acs-rule">
                            <i className="ti ti-circle-check-filled" />
                            Upper and lower case
                          </div>
                          <div className="acs-rule">
                            <i className="ti ti-circle-check-filled" />
                            At least one number
                          </div>
                          <div className="acs-rule">
                            <i className="ti ti-circle-check-filled" />
                            At least one symbol
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="acs-rule">
                            <i className="ti ti-circle-check-filled" />
                            Checked against known breaches
                          </div>
                          <div className="acs-rule">
                            <i className="ti ti-circle-check-filled" />
                            May not contain your name
                          </div>
                          <div className="acs-rule">
                            <i className="ti ti-circle-check-filled" />
                            May not repeat the last 5
                          </div>
                          <div className="acs-rule is-off">
                            <i className="ti ti-circle" />
                            No forced mix of character classes
                          </div>
                        </div>
                      </div>
                      <hr className="my-3" />
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Expiry</span>
                          <strong>Every 180 days</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <select
                            className="acs-select"
                            aria-label="Setting value"
                          >
                            <option>180 days</option>
                            <option>90 days</option>
                            <option>365 days</option>
                            <option>Never</option>
                          </select>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>History</span>
                          <strong>
                            The last 5 passwords may not be reused
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <input
                            type="text"
                            className="acs-input"
                            defaultValue={5}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Failed attempts</span>
                          <strong>
                            Lock the account for 15 minutes after 5 failures
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <input
                            type="text"
                            className="acs-input"
                            defaultValue={5}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Minimum age</span>
                          <strong>
                            1 day, so a password cannot be cycled back
                            immediately
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <input
                            type="text"
                            className="acs-input"
                            defaultValue={1}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">
                        Length is weighted above complexity, which is what
                        current guidance recommends
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Password policy"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="acspane-twofa"
              role="tabpanel"
              aria-labelledby="acstab-twofa"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 05</span>
                  <h2 className="acs-hero-name fs-20 mb-1">
                    Two-Factor Authentication
                  </h2>
                  <p className="fs-13 text-muted mb-0">
                    The second factor, and the way back in without it.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="acs-card">
                    <div className="acs-card-head">
                      <span className="acs-card-ic is-safe">
                        <i className="ti ti-device-mobile-check" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Authenticator app</p>
                        <p>The second factor in use</p>
                      </div>
                      <span className="acs-badge is-safe">
                        <i className="ti ti-check" />
                        Armed
                      </span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Application</span>
                          <strong>Google Authenticator</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="badge-meta">
                            <i className="ti ti-device-mobile" />
                            Primary phone
                          </span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Enrolled</span>
                          <strong>22 February 2026</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="badge-meta">160 days</span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Code length</span>
                          <strong>Six digits, rotating every 30 seconds</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="badge-meta acs-mono">TOTP</span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Required on</span>
                          <strong>
                            Every sign-in, including trusted devices
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_10"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_10"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Last used</span>
                          <strong>Today at 08:42 AM</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="acs-badge is-safe">Accepted</span>
                        </div>
                      </div>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Authenticator app"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-card">
                    <div className="acs-card-head">
                      <span className="acs-card-ic">
                        <i className="ti ti-shield-question" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Other second factors</p>
                        <p>Available, and why they are or are not used</p>
                      </div>
                      <span className="acs-badge">2 off</span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Security key</span>
                          <strong>
                            No hardware key registered on this account
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            data-bs-toggle="modal"
                            data-bs-target="#acs_device"
                          >
                            Register
                          </button>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>SMS code</span>
                          <strong>
                            Off — a text can be intercepted by swapping the SIM
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_11"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_11"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Email code</span>
                          <strong>
                            Used only for a device that has never been seen
                            before
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_12"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_12"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Push approval</span>
                          <strong>
                            Not offered by the current authenticator
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="badge-meta">
                            <i className="ti ti-minus" />
                            Unavailable
                          </span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Trusted device skip</span>
                          <strong>
                            Off — two-factor is asked for every time
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_13"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_13"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Other second factors"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-card">
                    <div className="acs-card-head">
                      <span className="acs-card-ic is-safe">
                        <i className="ti ti-lifebuoy" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Recovery codes</p>
                        <p>Ten codes issued 22 Feb 2026 · two spent</p>
                      </div>
                      <span className="acs-badge is-safe">8 remaining</span>
                    </div>
                    <div className="acs-card-body">
                      <p className="fs-13 text-muted mb-3">
                        Each code works once. They are the only way back in if
                        the authenticator app is lost, so they belong on paper
                        somewhere the account holder can reach and nobody else
                        can.
                      </p>
                      <div className="acs-codes">
                        <span className="acs-code">4K2M-91XD</span>
                        <span className="acs-code">8PQR-3A7C</span>
                        <span className="acs-code is-used">D14N-6BZE</span>
                        <span className="acs-code">7VYH-22LK</span>
                        <span className="acs-code">QW38-5NRT</span>
                        <span className="acs-code is-used">B60F-8JMS</span>
                        <span className="acs-code">X92C-14PD</span>
                        <span className="acs-code">L5TA-70GV</span>
                        <span className="acs-code">N83E-6WQY</span>
                        <span className="acs-code">R21K-49HB</span>
                      </div>
                      <p className="fs-12 text-muted mb-0 mt-3">
                        Generating a new set immediately invalidates all ten of
                        these, including the eight that are unused.
                      </p>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">
                        Two spent: 14 Mar during a phone replacement, 02 Jun
                        while travelling
                      </span>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#acs_export"
                        >
                          <i className="ti ti-download me-1" />
                          Download
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#acs_2fa"
                        >
                          <i className="ti ti-refresh me-1" />
                          Generate new set
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="acspane-recovery"
              role="tabpanel"
              aria-labelledby="acstab-recovery"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 06</span>
                  <h2 className="acs-hero-name fs-20 mb-1">Recovery Options</h2>
                  <p className="fs-13 text-muted mb-0">
                    How you get back in when the usual route is gone.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="acs-card is-risk">
                    <div className="acs-card-head">
                      <span className="acs-card-ic is-watch">
                        <i className="ti ti-mail-forward" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Recovery email</p>
                        <p>Where a reset link would be sent</p>
                      </div>
                      <span className="acs-badge is-risk">
                        <i className="ti ti-alert-triangle" />
                        Not verified
                      </span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Current address</span>
                          <strong>
                            latha.rao@preskool.edu — the account’s own address
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="acs-badge is-watch">
                            Same domain
                          </span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Why this matters</span>
                          <strong>
                            If the school domain is unreachable, so is the
                            recovery route
                          </strong>
                        </div>
                        <div className="acs-fact-ctl" />
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Suggested</span>
                          <strong>
                            A personal address outside preskool.edu
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#acs_recovery"
                          >
                            Add address
                          </button>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Notify on change</span>
                          <strong>
                            Both the old and new address are told when this
                            changes
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_14"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_14"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">
                        The single highest-value fix on this account
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Recovery email"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-card">
                    <div className="acs-card-head">
                      <span className="acs-card-ic is-safe">
                        <i className="ti ti-device-mobile" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Recovery phone</p>
                        <p>Where a reset code would be texted</p>
                      </div>
                      <span className="acs-badge is-safe">
                        <i className="ti ti-check" />
                        Verified
                      </span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Number</span>
                          <strong>+91 98765 44710</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="acs-badge is-safe">
                            Verified 22 Feb
                          </span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Use for recovery</span>
                          <strong>
                            A code is sent only after identity is confirmed
                            another way
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_15"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_15"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Use as a second factor</span>
                          <strong>
                            Off — the authenticator app is stronger
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_16"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_16"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Notify on change</span>
                          <strong>
                            The old number is told when this changes
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_17"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_17"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Recovery phone"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <span className="acs-lbl">Security questions</span>
                  <div className="acs-empty">
                    <i className="ti ti-help-octagon" />
                    <h3 className="fs-15 fw-medium">
                      Security questions are no longer used
                    </h3>
                    <p>
                      They were retired across the school in March 2026. The
                      answers to most of them — a mother’s maiden name, a first
                      school, a pet — can be found on a public profile, which
                      makes them a weaker factor than the password they protect.
                      Recovery codes replaced them.
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#acs_workspace"
                      aria-label="Open security workspace for Security questions"
                    >
                      <i className="ti ti-file-text me-1" />
                      Read the policy note
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="acspane-sessions"
              role="tabpanel"
              aria-labelledby="acstab-sessions"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 07</span>
                  <h2 className="acs-hero-name fs-20 mb-1">Login Sessions</h2>
                  <p className="fs-13 text-muted mb-0">
                    Where this account is signed in right now.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <p className="fs-13 text-muted mb-0">
                  Four sessions, one of which is the browser you are reading
                  this in. Ending a session signs that device out immediately;
                  it does not remove its trust.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#acs_terminate"
                >
                  <i className="ti ti-logout me-1" />
                  End all other sessions
                </button>
              </div>
              <div className="acs-device is-current">
                <span className="acs-device-ic">
                  <i className="ti ti-device-desktop" />
                </span>
                <div className="overflow-hidden">
                  <p className="acs-device-name">
                    Windows 11 · Chrome 127
                    <span className="acs-badge is-safe">
                      <i className="ti ti-point-filled" />
                      This device
                    </span>
                  </p>
                  <p className="acs-device-meta">
                    <span>
                      <i className="ti ti-map-pin" />
                      Chennai, India
                    </span>
                    <span>
                      <i className="ti ti-world" />
                      103.21.58.14
                    </span>
                    <span>
                      <i className="ti ti-clock" />
                      Signed in 08:42 AM today
                    </span>
                    <span>
                      <i className="ti ti-shield-check" />
                      Trusted device
                    </span>
                  </p>
                </div>
                <div className="acs-device-act">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Current session"
                  >
                    View details
                  </button>
                  <span className="badge-meta">
                    <i className="ti ti-lock" />
                    Cannot end
                  </span>
                </div>
              </div>
              <div className="acs-device">
                <span className="acs-device-ic">
                  <i className="ti ti-device-mobile" />
                </span>
                <div className="overflow-hidden">
                  <p className="acs-device-name">Android 15 · Chrome Mobile</p>
                  <p className="acs-device-meta">
                    <span>
                      <i className="ti ti-map-pin" />
                      Chennai, India
                    </span>
                    <span>
                      <i className="ti ti-world" />
                      49.207.188.62
                    </span>
                    <span>
                      <i className="ti ti-clock" />
                      Active 22 minutes ago
                    </span>
                    <span>
                      <i className="ti ti-shield-check" />
                      Trusted device
                    </span>
                  </p>
                </div>
                <div className="acs-device-act">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Mobile session"
                  >
                    View details
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#acs_terminate"
                  >
                    End session
                  </button>
                </div>
              </div>
              <div className="acs-device">
                <span className="acs-device-ic">
                  <i className="ti ti-device-laptop" />
                </span>
                <div className="overflow-hidden">
                  <p className="acs-device-name">
                    macOS 15 · Safari 18
                    <span className="acs-badge is-watch">
                      <i className="ti ti-clock-pause" />
                      Idle 9 days
                    </span>
                  </p>
                  <p className="acs-device-meta">
                    <span>
                      <i className="ti ti-map-pin" />
                      Coimbatore, India
                    </span>
                    <span>
                      <i className="ti ti-world" />
                      117.204.11.8
                    </span>
                    <span>
                      <i className="ti ti-clock" />
                      Last active 23 Jul
                    </span>
                    <span>
                      <i className="ti ti-shield-off" />
                      Not a trusted device
                    </span>
                  </p>
                </div>
                <div className="acs-device-act">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Safari session"
                  >
                    View details
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#acs_terminate"
                  >
                    End session
                  </button>
                </div>
              </div>
              <div className="acs-device">
                <span className="acs-device-ic">
                  <i className="ti ti-api" />
                </span>
                <div className="overflow-hidden">
                  <p className="acs-device-name">
                    Reporting integration · API key
                    <span className="acs-badge is-info">
                      <i className="ti ti-code" />
                      Machine
                    </span>
                  </p>
                  <p className="acs-device-meta">
                    <span>
                      <i className="ti ti-server" />
                      preskool-reports-01
                    </span>
                    <span>
                      <i className="ti ti-world" />
                      10.20.4.19
                    </span>
                    <span>
                      <i className="ti ti-clock" />
                      Last call 4 minutes ago
                    </span>
                    <span>
                      <i className="ti ti-key" />
                      Key issued 214 days ago
                    </span>
                  </p>
                </div>
                <div className="acs-device-act">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for API session"
                  >
                    View details
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#acs_terminate"
                  >
                    Revoke key
                  </button>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="acspane-devices"
              role="tabpanel"
              aria-labelledby="acstab-devices"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 08</span>
                  <h2 className="acs-hero-name fs-20 mb-1">Trusted Devices</h2>
                  <p className="fs-13 text-muted mb-0">
                    Machines this account recognises.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <p className="fs-13 text-muted mb-0">
                  A trusted device is one this account has signed in from before
                  and recognises. Because two-factor is required every time,
                  trust here shortens nothing except the new-device email.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#acs_device"
                >
                  <i className="ti ti-plus me-1" />
                  Add trusted device
                </button>
              </div>
              <div className="acs-device is-current">
                <span className="acs-device-ic">
                  <i className="ti ti-device-desktop" />
                </span>
                <div className="overflow-hidden">
                  <p className="acs-device-name">
                    Office desktop · Dell OptiPlex
                    <span className="acs-badge is-safe">
                      <i className="ti ti-point-filled" />
                      This device
                    </span>
                  </p>
                  <p className="acs-device-meta">
                    <span>
                      <i className="ti ti-fingerprint" />
                      Windows Hello enrolled
                    </span>
                    <span>
                      <i className="ti ti-calendar" />
                      Trusted since 22 Feb 2026
                    </span>
                    <span>
                      <i className="ti ti-clock" />
                      Last seen today
                    </span>
                    <span>
                      <i className="ti ti-map-pin" />
                      Head office, Chennai
                    </span>
                  </p>
                </div>
                <div className="acs-device-act">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Office desktop"
                  >
                    View details
                  </button>
                </div>
              </div>
              <div className="acs-device">
                <span className="acs-device-ic">
                  <i className="ti ti-device-mobile" />
                </span>
                <div className="overflow-hidden">
                  <p className="acs-device-name">
                    Primary phone · Pixel 9
                    <span className="acs-badge is-info">
                      <i className="ti ti-device-mobile-check" />
                      Authenticator
                    </span>
                  </p>
                  <p className="acs-device-meta">
                    <span>
                      <i className="ti ti-shield-lock" />
                      Holds the authenticator app
                    </span>
                    <span>
                      <i className="ti ti-calendar" />
                      Trusted since 22 Feb 2026
                    </span>
                    <span>
                      <i className="ti ti-clock" />
                      Last seen 22 minutes ago
                    </span>
                    <span>
                      <i className="ti ti-map-pin" />
                      Chennai, India
                    </span>
                  </p>
                </div>
                <div className="acs-device-act">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Primary phone"
                  >
                    View details
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#acs_removedevice"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="acs-device">
                <span className="acs-device-ic">
                  <i className="ti ti-device-laptop" />
                </span>
                <div className="overflow-hidden">
                  <p className="acs-device-name">Home laptop · MacBook Air</p>
                  <p className="acs-device-meta">
                    <span>
                      <i className="ti ti-shield-check" />
                      Two-factor still required
                    </span>
                    <span>
                      <i className="ti ti-calendar" />
                      Trusted since 11 Apr 2026
                    </span>
                    <span>
                      <i className="ti ti-clock" />
                      Last seen 4 days ago
                    </span>
                    <span>
                      <i className="ti ti-map-pin" />
                      Chennai, India
                    </span>
                  </p>
                </div>
                <div className="acs-device-act">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Home laptop"
                  >
                    View details
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#acs_removedevice"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="acs-device is-stale">
                <span className="acs-device-ic">
                  <i className="ti ti-device-tablet" />
                </span>
                <div className="overflow-hidden">
                  <p className="acs-device-name">
                    Samsung Galaxy Tab S9
                    <span className="acs-badge is-watch">
                      <i className="ti ti-alert-triangle" />
                      Not seen in 94 days
                    </span>
                  </p>
                  <p className="acs-device-meta">
                    <span>
                      <i className="ti ti-shield-check" />
                      Two-factor still required
                    </span>
                    <span>
                      <i className="ti ti-calendar" />
                      Trusted since 03 Mar 2026
                    </span>
                    <span>
                      <i className="ti ti-clock" />
                      Last seen 29 Apr 2026
                    </span>
                    <span>
                      <i className="ti ti-map-pin" />
                      Chennai, India
                    </span>
                  </p>
                </div>
                <div className="acs-device-act">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Samsung tablet"
                  >
                    View details
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#acs_removedevice"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="acspane-history"
              role="tabpanel"
              aria-labelledby="acstab-history"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 09</span>
                  <h2 className="acs-hero-name fs-20 mb-1">Login History</h2>
                  <p className="fs-13 text-muted mb-0">
                    Every attempt, successful or not.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <p className="fs-13 text-muted mb-0">
                  The last 8 of 214 sign-in attempts. The five refusals on 18
                  July came from one address in a four-minute window and stopped
                  when the account locked; nothing was reached.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#acs_export"
                >
                  <i className="ti ti-download me-1" />
                  Export history
                </button>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-check" />
                </span>
                <div className="acs-login-body">
                  <strong>Signed in successfully</strong>
                  <span>
                    Chrome 127 on Windows 11 · trusted device · two-factor
                    accepted
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Chennai, India
                  </span>
                  <span className="acs-login-ip">103.21.58.14</span>
                  <span className="fs-12 text-muted">Today, 08:42 AM</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Signed in successfully"
                  >
                    Details
                  </button>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-check" />
                </span>
                <div className="acs-login-body">
                  <strong>Signed in successfully</strong>
                  <span>
                    Chrome Mobile on Android 15 · trusted device · two-factor
                    accepted
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Chennai, India
                  </span>
                  <span className="acs-login-ip">49.207.188.62</span>
                  <span className="fs-12 text-muted">Today, 07:15 AM</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Signed in successfully"
                  >
                    Details
                  </button>
                </div>
              </div>
              <div className="acs-login is-flagged">
                <span className="acs-login-mark">
                  <i className="ti ti-alert-triangle" />
                </span>
                <div className="acs-login-body">
                  <strong>Signed in from a new location</strong>
                  <span>
                    Safari 18 on macOS · new device · email verification sent
                    and confirmed
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Coimbatore, India
                  </span>
                  <span className="acs-login-ip">117.204.11.8</span>
                  <span className="fs-12 text-muted">
                    23 Jul 2026, 02:11 PM
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Signed in from a new location"
                  >
                    Details
                  </button>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-check" />
                </span>
                <div className="acs-login-body">
                  <strong>Signed in successfully</strong>
                  <span>Chrome 127 on Windows 11 · trusted device</span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Chennai, India
                  </span>
                  <span className="acs-login-ip">103.21.58.14</span>
                  <span className="fs-12 text-muted">
                    23 Jul 2026, 08:38 AM
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Signed in successfully"
                  >
                    Details
                  </button>
                </div>
              </div>
              <div className="acs-login is-fail">
                <span className="acs-login-mark">
                  <i className="ti ti-x" />
                </span>
                <div className="acs-login-body">
                  <strong>Sign-in refused — wrong password</strong>
                  <span>Attempt 5 of 5 · account locked for 15 minutes</span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Unknown · via proxy
                  </span>
                  <span className="acs-login-ip">185.220.101.44</span>
                  <span className="fs-12 text-muted">
                    18 Jul 2026, 03:02 AM
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Sign-in refused — wrong password"
                  >
                    Details
                  </button>
                </div>
              </div>
              <div className="acs-login is-fail">
                <span className="acs-login-mark">
                  <i className="ti ti-x" />
                </span>
                <div className="acs-login-body">
                  <strong>Sign-in refused — wrong password</strong>
                  <span>Attempts 1 to 4 · from the same address</span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Unknown · via proxy
                  </span>
                  <span className="acs-login-ip">185.220.101.44</span>
                  <span className="fs-12 text-muted">
                    18 Jul 2026, 02:58 AM
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Sign-in refused — wrong password"
                  >
                    Details
                  </button>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-check" />
                </span>
                <div className="acs-login-body">
                  <strong>Signed in successfully</strong>
                  <span>Chrome 127 on Windows 11 · trusted device</span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Chennai, India
                  </span>
                  <span className="acs-login-ip">103.21.58.14</span>
                  <span className="fs-12 text-muted">
                    17 Jul 2026, 09:04 AM
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Signed in successfully"
                  >
                    Details
                  </button>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-lifebuoy" />
                </span>
                <div className="acs-login-body">
                  <strong>Signed in with a recovery code</strong>
                  <span>
                    Code spent while travelling · authenticator unavailable
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Singapore
                  </span>
                  <span className="acs-login-ip">203.116.44.9</span>
                  <span className="fs-12 text-muted">
                    02 Jun 2026, 11:26 AM
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acs_workspace"
                    aria-label="Open security workspace for Signed in with a recovery code"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="acspane-privacy"
              role="tabpanel"
              aria-labelledby="acstab-privacy"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 10</span>
                  <h2 className="acs-hero-name fs-20 mb-1">Privacy</h2>
                  <p className="fs-13 text-muted mb-0">
                    What others can see, and where information travels.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="acs-card">
                    <div className="acs-card-head">
                      <span className="acs-card-ic">
                        <i className="ti ti-eye-off" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Privacy controls</p>
                        <p>What others can see about this account</p>
                      </div>
                      <span className="acs-badge is-info">Restricted</span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Profile visibility</span>
                          <strong>
                            Staff directory only — not visible to guardians
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <select
                            className="acs-select"
                            aria-label="Setting value"
                          >
                            <option>Staff only</option>
                            <option>Staff and guardians</option>
                            <option>Nobody</option>
                          </select>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Show email in the directory</span>
                          <strong>
                            Colleagues can see the address to write to you
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_18"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_18"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Show phone in the directory</span>
                          <strong>
                            Off — the office number is listed instead
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_19"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_19"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Online status</span>
                          <strong>
                            Off — nobody is shown whether you are signed in
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_20"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_20"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Read receipts</span>
                          <strong>Off for internal messages</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_21"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_21"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Privacy controls"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-card">
                    <div className="acs-card-head">
                      <span className="acs-card-ic">
                        <i className="ti ti-database-share" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Data sharing</p>
                        <p>Where information about this account travels</p>
                      </div>
                      <span className="acs-badge is-safe">Minimal</span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Usage analytics</span>
                          <strong>
                            Aggregate only — never tied to your name
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_22"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_22"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Crash reports</span>
                          <strong>
                            Sent with the page and the error, no record contents
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_23"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_23"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Improvement programme</span>
                          <strong>
                            Off — no session recording of any kind
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_24"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_24"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Export my data</span>
                          <strong>
                            Everything held about this account, as a
                            downloadable file
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            data-bs-toggle="modal"
                            data-bs-target="#acs_export"
                          >
                            Request
                          </button>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Retention</span>
                          <strong>
                            Security logs are kept for 3 academic years
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <select
                            className="acs-select"
                            aria-label="Setting value"
                          >
                            <option>3 academic years</option>
                            <option>1 year</option>
                            <option>Indefinite</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Data sharing"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <span className="acs-lbl">Third-party access</span>
                  <div className="acs-empty">
                    <i className="ti ti-plug-connected-x" />
                    <h3 className="fs-15 fw-medium">
                      No third-party application has access to this account
                    </h3>
                    <p>
                      Nothing outside the school ERP can read or act on your
                      behalf. If you ever authorise an external tool, it will
                      appear here with the exact scopes it was granted and a
                      button to withdraw them.
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#acs_workspace"
                      aria-label="Open security workspace for Third-party access"
                    >
                      <i className="ti ti-list-search me-1" />
                      View authorisation history
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="acspane-notifications"
              role="tabpanel"
              aria-labelledby="acstab-notifications"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 11</span>
                  <h2 className="acs-hero-name fs-20 mb-1">Notifications</h2>
                  <p className="fs-13 text-muted mb-0">
                    What this account is told about itself.
                  </p>
                </div>
              </div>
              <p className="fs-13 text-muted mb-3">
                Security notices are deliberately hard to switch off. The four
                that matter most go to both the account address and the recovery
                address, so no change can be made quietly.
              </p>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-login" />
                </span>
                <div className="acs-login-body">
                  <strong>Sign-in from a new device</strong>
                  <span>
                    Sent the moment an unrecognised device signs in, before it
                    can do anything.
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-mail" />
                    Email
                  </span>
                  <span className="badge-meta">
                    <i className="ti ti-message" />
                    SMS
                  </span>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="acs_sw_25"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="acs_sw_25"
                    >
                      Enable
                    </label>
                  </div>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-map-pin-exclamation" />
                </span>
                <div className="acs-login-body">
                  <strong>Sign-in from a new location</strong>
                  <span>
                    A city this account has not been seen in before, even on a
                    trusted device.
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-mail" />
                    Email
                  </span>
                  <span className="badge-meta">
                    <i className="ti ti-message" />
                    SMS
                  </span>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="acs_sw_26"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="acs_sw_26"
                    >
                      Enable
                    </label>
                  </div>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-key" />
                </span>
                <div className="acs-login-body">
                  <strong>Password changed</strong>
                  <span>
                    Sent to both the account address and the recovery address,
                    so a silent change is impossible.
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-mail" />
                    Email
                  </span>
                  <span className="badge-meta">
                    <i className="ti ti-message" />
                    SMS
                  </span>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="acs_sw_27"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="acs_sw_27"
                    >
                      Enable
                    </label>
                  </div>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-device-mobile-check" />
                </span>
                <div className="acs-login-body">
                  <strong>Two-factor changed</strong>
                  <span>
                    Any change to the second factor, including generating new
                    recovery codes.
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-mail" />
                    Email
                  </span>
                  <span className="badge-meta">
                    <i className="ti ti-message" />
                    SMS
                  </span>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="acs_sw_28"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="acs_sw_28"
                    >
                      Enable
                    </label>
                  </div>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-lock-exclamation" />
                </span>
                <div className="acs-login-body">
                  <strong>Account locked out</strong>
                  <span>
                    After five failed attempts. Includes the address the
                    attempts came from.
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-mail" />
                    Email
                  </span>
                  <span className="badge-meta text-muted">
                    <i className="ti ti-message-off" />
                    No SMS
                  </span>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="acs_sw_29"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="acs_sw_29"
                    >
                      Enable
                    </label>
                  </div>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-shield-check" />
                </span>
                <div className="acs-login-body">
                  <strong>Trusted device added or removed</strong>
                  <span>Sent whenever the trusted list changes.</span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-mail" />
                    Email
                  </span>
                  <span className="badge-meta text-muted">
                    <i className="ti ti-message-off" />
                    No SMS
                  </span>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="acs_sw_30"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="acs_sw_30"
                    >
                      Enable
                    </label>
                  </div>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-user-shield" />
                </span>
                <div className="acs-login-body">
                  <strong>Permission changed by an administrator</strong>
                  <span>
                    Sent even when you make the change yourself, as a record.
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-mail" />
                    Email
                  </span>
                  <span className="badge-meta text-muted">
                    <i className="ti ti-message-off" />
                    No SMS
                  </span>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="acs_sw_31"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="acs_sw_31"
                    >
                      Enable
                    </label>
                  </div>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-file-text" />
                </span>
                <div className="acs-login-body">
                  <strong>Weekly security summary</strong>
                  <span>
                    Off. Everything in it appears on this page anyway.
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-mail" />
                    Email
                  </span>
                  <span className="badge-meta text-muted">
                    <i className="ti ti-message-off" />
                    No SMS
                  </span>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="acs_sw_32"
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="acs_sw_32"
                    >
                      Enable
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="acspane-permissions"
              role="tabpanel"
              aria-labelledby="acstab-permissions"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 12</span>
                  <h2 className="acs-hero-name fs-20 mb-1">Permissions</h2>
                  <p className="fs-13 text-muted mb-0">
                    What this role is entitled to do.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="acs-card">
                    <div className="acs-card-head">
                      <span className="acs-card-ic">
                        <i className="ti ti-lock-access" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">Role permissions</p>
                        <p>
                          Super Administrator · inherited from the role, not set
                          here
                        </p>
                      </div>
                      <span className="acs-badge is-info">Read-only</span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-perm is-head">
                        <span>Area</span>
                        <span>View</span>
                        <span>Edit</span>
                        <span>Create</span>
                        <span>Delete</span>
                      </div>
                      <div className="acs-perm">
                        <span className="acs-perm-name">
                          Students — records and admissions
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                      </div>
                      <div className="acs-perm">
                        <span className="acs-perm-name">
                          Staff — records and payroll
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-cond">
                          <i className="ti ti-alert-triangle" />
                        </span>
                      </div>
                      <div className="acs-perm">
                        <span className="acs-perm-name">
                          Fees, invoices and collections
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip">
                          <i className="ti ti-minus" />
                        </span>
                      </div>
                      <div className="acs-perm">
                        <span className="acs-perm-name">
                          Examinations and results
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-cond">
                          <i className="ti ti-alert-triangle" />
                        </span>
                        <span className="acs-pip">
                          <i className="ti ti-minus" />
                        </span>
                      </div>
                      <div className="acs-perm">
                        <span className="acs-perm-name">Attendance</span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                      </div>
                      <div className="acs-perm">
                        <span className="acs-perm-name">
                          Financial settings
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-cond">
                          <i className="ti ti-alert-triangle" />
                        </span>
                        <span className="acs-pip">
                          <i className="ti ti-minus" />
                        </span>
                      </div>
                      <div className="acs-perm">
                        <span className="acs-perm-name">
                          Email and SMS configuration
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip">
                          <i className="ti ti-minus" />
                        </span>
                      </div>
                      <div className="acs-perm">
                        <span className="acs-perm-name">
                          User accounts and roles
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-cond">
                          <i className="ti ti-alert-triangle" />
                        </span>
                        <span className="acs-pip is-cond">
                          <i className="ti ti-alert-triangle" />
                        </span>
                      </div>
                      <div className="acs-perm">
                        <span className="acs-perm-name">
                          Security logs and audit history
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip">
                          <i className="ti ti-minus" />
                        </span>
                        <span className="acs-pip">
                          <i className="ti ti-minus" />
                        </span>
                        <span className="acs-pip">
                          <i className="ti ti-minus" />
                        </span>
                      </div>
                      <div className="acs-perm">
                        <span className="acs-perm-name">
                          Backup and restore
                        </span>
                        <span className="acs-pip is-yes">
                          <i className="ti ti-check" />
                        </span>
                        <span className="acs-pip is-cond">
                          <i className="ti ti-alert-triangle" />
                        </span>
                        <span className="acs-pip">
                          <i className="ti ti-minus" />
                        </span>
                        <span className="acs-pip">
                          <i className="ti ti-minus" />
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-3 flex-wrap mt-3 pt-3 border-top">
                        <span className="d-inline-flex align-items-center gap-2 fs-12 text-muted">
                          <span className="acs-pip is-yes">
                            <i className="ti ti-check" />
                          </span>
                          Granted
                        </span>
                        <span className="d-inline-flex align-items-center gap-2 fs-12 text-muted">
                          <span className="acs-pip is-cond">
                            <i className="ti ti-alert-triangle" />
                          </span>
                          Granted, but needs a second approver
                        </span>
                        <span className="d-inline-flex align-items-center gap-2 fs-12 text-muted">
                          <span className="acs-pip">
                            <i className="ti ti-minus" />
                          </span>
                          Not granted
                        </span>
                      </div>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">
                        Even the highest role cannot delete a security log —
                        that is the point of one
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for Role permissions"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="acs-card is-watch">
                    <div className="acs-card-head">
                      <span className="acs-card-ic is-watch">
                        <i className="ti ti-api-app" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="acs-card-title">API access</p>
                        <p>Keys that act as this account</p>
                      </div>
                      <span className="acs-badge is-watch">1 overdue</span>
                    </div>
                    <div className="acs-card-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Reporting integration</span>
                          <strong>Read-only · issued 214 days ago</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="acs-badge is-watch">Rotate</span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Scopes granted</span>
                          <strong>
                            students.read, fees.read, attendance.read
                          </strong>
                        </div>
                        <div className="acs-fact-ctl" />
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Last used</span>
                          <strong>4 minutes ago from 10.20.4.19</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <span className="badge-meta">Active</span>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Rotation policy</span>
                          <strong>Every 180 days</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <select
                            className="acs-select"
                            aria-label="Setting value"
                          >
                            <option>180 days</option>
                            <option>90 days</option>
                            <option>Manual</option>
                          </select>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Revoke</span>
                          <strong>Stops the integration immediately</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            data-bs-toggle="modal"
                            data-bs-target="#acs_terminate"
                          >
                            Revoke
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="acs-card-foot">
                      <span className="fs-12 text-muted">
                        One key, one integration
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#acs_workspace"
                        aria-label="Open security workspace for API access"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="acspane-logs"
              role="tabpanel"
              aria-labelledby="acstab-logs"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 13</span>
                  <h2 className="acs-hero-name fs-20 mb-1">Security Logs</h2>
                  <p className="fs-13 text-muted mb-0">
                    The record that cannot be edited.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <p className="fs-13 text-muted mb-0">
                  Every security-relevant event on this account, kept for three
                  academic years. Entries here cannot be edited or removed by
                  anyone, including a Super Administrator.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#acs_export"
                >
                  <i className="ti ti-download me-1" />
                  Export security log
                </button>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-check" />
                </span>
                <div className="acs-login-body">
                  <strong>Security scan completed</strong>
                  <span>
                    Posture 78 of 100 · 2 recommendations raised, 0 issues found
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    System
                  </span>
                  <span className="acs-login-ip">—</span>
                  <span className="fs-12 text-muted">Today, 06:00 AM</span>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-login" />
                </span>
                <div className="acs-login-body">
                  <strong>Sign-in accepted</strong>
                  <span>
                    Chrome on Windows · trusted device · TOTP verified
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Chennai
                  </span>
                  <span className="acs-login-ip">103.21.58.14</span>
                  <span className="fs-12 text-muted">Today, 08:42 AM</span>
                </div>
              </div>
              <div className="acs-login is-flagged">
                <span className="acs-login-mark">
                  <i className="ti ti-device-desktop" />
                </span>
                <div className="acs-login-body">
                  <strong>New device signed in</strong>
                  <span>
                    Safari on macOS · email verification required and confirmed
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Coimbatore
                  </span>
                  <span className="acs-login-ip">117.204.11.8</span>
                  <span className="fs-12 text-muted">23 Jul, 02:11 PM</span>
                </div>
              </div>
              <div className="acs-login is-fail">
                <span className="acs-login-mark">
                  <i className="ti ti-lock-exclamation" />
                </span>
                <div className="acs-login-body">
                  <strong>Account locked out</strong>
                  <span>
                    5 failed passwords in 4 minutes · lock cleared automatically
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Unknown
                  </span>
                  <span className="acs-login-ip">185.220.101.44</span>
                  <span className="fs-12 text-muted">18 Jul, 03:02 AM</span>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-shield-check" />
                </span>
                <div className="acs-login-body">
                  <strong>Trusted device added</strong>
                  <span>
                    MacBook Air · added by the account holder after verification
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Chennai
                  </span>
                  <span className="acs-login-ip">103.21.58.14</span>
                  <span className="fs-12 text-muted">11 Apr, 10:22 AM</span>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-key" />
                </span>
                <div className="acs-login-body">
                  <strong>Password changed</strong>
                  <span>
                    By the account holder · notice sent to the account address
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Chennai
                  </span>
                  <span className="acs-login-ip">103.21.58.14</span>
                  <span className="fs-12 text-muted">11 Apr, 10:04 AM</span>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-lifebuoy" />
                </span>
                <div className="acs-login-body">
                  <strong>Recovery code spent</strong>
                  <span>
                    Code 6 of 10 · authenticator unavailable while travelling
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Singapore
                  </span>
                  <span className="acs-login-ip">203.116.44.9</span>
                  <span className="fs-12 text-muted">02 Jun, 11:26 AM</span>
                </div>
              </div>
              <div className="acs-login">
                <span className="acs-login-mark">
                  <i className="ti ti-device-mobile-check" />
                </span>
                <div className="acs-login-body">
                  <strong>Two-factor enabled</strong>
                  <span>
                    Authenticator app enrolled · 10 recovery codes issued
                  </span>
                </div>
                <div className="acs-login-side">
                  <span className="badge-meta">
                    <i className="ti ti-map-pin" />
                    Chennai
                  </span>
                  <span className="acs-login-ip">103.21.58.14</span>
                  <span className="fs-12 text-muted">22 Feb, 09:15 AM</span>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="acspane-advanced"
              role="tabpanel"
              aria-labelledby="acstab-advanced"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 14</span>
                  <h2 className="acs-hero-name fs-20 mb-1">Advanced</h2>
                  <p className="fs-13 text-muted mb-0">
                    Sessions, sign-in protection, keys and account actions.
                  </p>
                </div>
              </div>
              <div className="accordion acs-acc" id="acsAdvanced">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="acsacc-hsess">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#acsacc-sess"
                      aria-expanded="true"
                      aria-controls="acsacc-sess"
                    >
                      <i className="ti ti-clock-shield" />
                      Session behaviour
                      <span className="acs-badge is-info acs-acc-spacer">
                        30 min idle
                      </span>
                    </button>
                  </h2>
                  <div
                    id="acsacc-sess"
                    className="accordion-collapse collapse show"
                    aria-labelledby="acsacc-hsess"
                    data-bs-parent="#acsAdvanced"
                    role="region"
                  >
                    <div className="accordion-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Idle timeout</span>
                          <strong>
                            30 minutes without activity, then a re-prompt
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <select
                            className="acs-select"
                            aria-label="Setting value"
                          >
                            <option>30 minutes</option>
                            <option>15 minutes</option>
                            <option>1 hour</option>
                            <option>8 hours</option>
                          </select>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Absolute lifetime</span>
                          <strong>12 hours, whatever the activity</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <select
                            className="acs-select"
                            aria-label="Setting value"
                          >
                            <option>12 hours</option>
                            <option>8 hours</option>
                            <option>24 hours</option>
                          </select>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Concurrent sessions</span>
                          <strong>Up to 5 — currently using 4</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <input
                            type="text"
                            className="acs-input"
                            defaultValue={5}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Sign out on password change</span>
                          <strong>
                            Every other session ends when the password changes
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_33"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_33"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="acsacc-hsignin">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#acsacc-signin"
                      aria-expanded="false"
                      aria-controls="acsacc-signin"
                    >
                      <i className="ti ti-shield-bolt" />
                      Sign-in protection
                    </button>
                  </h2>
                  <div
                    id="acsacc-signin"
                    className="accordion-collapse collapse"
                    aria-labelledby="acsacc-hsignin"
                    data-bs-parent="#acsAdvanced"
                    role="region"
                  >
                    <div className="accordion-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Failed attempt lockout</span>
                          <strong>5 attempts, then a 15-minute lock</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <input
                            type="text"
                            className="acs-input"
                            defaultValue={5}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Impossible travel</span>
                          <strong>
                            Refuse a sign-in that could not physically follow
                            the last one
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_34"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_34"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Known-breach password check</span>
                          <strong>
                            Refuse a password that appears in a public breach
                            list
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_35"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_35"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>New-device email</span>
                          <strong>
                            Always sent, and cannot be switched off
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="acs_sw_36"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="acs_sw_36"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="acsacc-hkeys">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#acsacc-keys"
                      aria-expanded="false"
                      aria-controls="acsacc-keys"
                    >
                      <i className="ti ti-key" />
                      Personal API keys
                      <span className="acs-badge is-watch acs-acc-spacer">
                        1 overdue
                      </span>
                    </button>
                  </h2>
                  <div
                    id="acsacc-keys"
                    className="accordion-collapse collapse"
                    aria-labelledby="acsacc-hkeys"
                    data-bs-parent="#acsAdvanced"
                    role="region"
                  >
                    <div className="accordion-body">
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Reporting integration</span>
                          <strong>
                            prsk_••••••••4dA2 · read-only · 214 days old
                          </strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            data-bs-toggle="modal"
                            data-bs-target="#acs_terminate"
                          >
                            Revoke
                          </button>
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Maximum keys</span>
                          <strong>2 per account</strong>
                        </div>
                        <div className="acs-fact-ctl">
                          <input
                            type="text"
                            className="acs-input"
                            defaultValue={2}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>Scope ceiling</span>
                          <strong>
                            A personal key can never exceed the role it belongs
                            to
                          </strong>
                        </div>
                        <div className="acs-fact-ctl" />
                      </div>
                      <div className="acs-fact">
                        <div className="acs-fact-txt">
                          <span>On revoking</span>
                          <strong>
                            Calls fail immediately; nothing is queued
                          </strong>
                        </div>
                        <div className="acs-fact-ctl" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="acsacc-hdanger">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#acsacc-danger"
                      aria-expanded="false"
                      aria-controls="acsacc-danger"
                    >
                      <i className="ti ti-alert-octagon" />
                      Account actions
                    </button>
                  </h2>
                  <div
                    id="acsacc-danger"
                    className="accordion-collapse collapse"
                    aria-labelledby="acsacc-hdanger"
                    data-bs-parent="#acsAdvanced"
                    role="region"
                  >
                    <div className="accordion-body">
                      <p className="fs-13 text-muted">
                        Deactivating suspends sign-in and ends every session,
                        but keeps every record this account created. Deleting is
                        handled by HR through the leaver process and is not
                        available here.
                      </p>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#acs_terminate"
                        >
                          <i className="ti ti-logout me-1" />
                          Sign out everywhere
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm d-inline-flex align-items-center"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#acs_workspace"
                          aria-label="Open security workspace for Deactivate account"
                        >
                          <i className="ti ti-user-off me-1" />
                          Deactivate account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="acspane-audit"
              role="tabpanel"
              aria-labelledby="acstab-audit"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="acs-lbl">Section 15</span>
                  <h2 className="acs-hero-name fs-20 mb-1">Audit History</h2>
                  <p className="fs-13 text-muted mb-0">
                    Every change, with the name against it.
                  </p>
                </div>
              </div>
              <div className="acs-card">
                <div className="acs-card-head">
                  <span className="acs-card-ic">
                    <i className="ti ti-file-search" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="acs-card-title">Audit history</p>
                    <p>
                      Every change to this account, retained for 3 academic
                      years
                    </p>
                  </div>
                  <span className="acs-badge">10 of 214 entries</span>
                </div>
                <div className="acs-card-body">
                  <div className="acs-audit">
                    <div className="acs-audit-when">
                      <strong>01 Aug 2026</strong>06:00
                    </div>
                    <div className="acs-audit-what">
                      Security scan completed — posture 78
                      <span>System · scheduled daily</span>
                    </div>
                  </div>
                  <div className="acs-audit">
                    <div className="acs-audit-when">
                      <strong>23 Jul 2026</strong>14:11
                    </div>
                    <div className="acs-audit-what">
                      Signed in from a new device and location
                      <span>
                        Safari on macOS · Coimbatore · verified by email
                      </span>
                    </div>
                  </div>
                  <div className="acs-audit">
                    <div className="acs-audit-when">
                      <strong>18 Jul 2026</strong>03:02
                    </div>
                    <div className="acs-audit-what">
                      Account locked after 5 failed sign-in attempts
                      <span>
                        From 185.220.101.44 · lock cleared automatically after
                        15 minutes
                      </span>
                    </div>
                  </div>
                  <div className="acs-audit">
                    <div className="acs-audit-when">
                      <strong>02 Jun 2026</strong>11:26
                    </div>
                    <div className="acs-audit-what">
                      Recovery code spent
                      <span>Code 6 of 10 · authenticator unavailable</span>
                    </div>
                  </div>
                  <div className="acs-audit">
                    <div className="acs-audit-when">
                      <strong>11 Apr 2026</strong>10:22
                    </div>
                    <div className="acs-audit-what">
                      Trusted device added — MacBook Air
                      <span>
                        By the account holder after email verification
                      </span>
                    </div>
                  </div>
                  <div className="acs-audit">
                    <div className="acs-audit-when">
                      <strong>11 Apr 2026</strong>10:04
                    </div>
                    <div className="acs-audit-what">
                      Password changed
                      <span>
                        By the account holder · every other session ended
                      </span>
                    </div>
                  </div>
                  <div className="acs-audit">
                    <div className="acs-audit-when">
                      <strong>14 Mar 2026</strong>09:48
                    </div>
                    <div className="acs-audit-what">
                      Recovery code spent during a phone replacement
                      <span>
                        Code 3 of 10 · authenticator re-enrolled the same day
                      </span>
                    </div>
                  </div>
                  <div className="acs-audit">
                    <div className="acs-audit-when">
                      <strong>03 Mar 2026</strong>16:30
                    </div>
                    <div className="acs-audit-what">
                      Trusted device added — Samsung Galaxy Tab S9
                      <span>Not seen since 29 Apr</span>
                    </div>
                  </div>
                  <div className="acs-audit">
                    <div className="acs-audit-when">
                      <strong>22 Feb 2026</strong>09:15
                    </div>
                    <div className="acs-audit-what">
                      Two-factor authentication enabled
                      <span>Authenticator app · 10 recovery codes issued</span>
                    </div>
                  </div>
                  <div className="acs-audit">
                    <div className="acs-audit-when">
                      <strong>14 Jan 2019</strong>11:00
                    </div>
                    <div className="acs-audit-what">
                      Account created
                      <span>
                        By Mr. R. Venkatesh · role Administrator, raised to
                        Super Administrator in 2022
                      </span>
                    </div>
                  </div>
                </div>
                <div className="acs-card-foot">
                  <span className="fs-12 text-muted">
                    Entries cannot be edited or removed
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#acs_export"
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
      {/* ===================== 8. SECURITY ACTIVITY ===================== */}
      <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mt-5 mb-2">
        <div>
          <h2 className="acs-hero-name fs-20 mb-1">Security activity</h2>
          <p className="fs-13 text-muted mb-0">
            The moments that shaped how protected this account is today.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
          data-bs-toggle="modal"
          data-bs-target="#acs_export"
        >
          <i className="ti ti-download me-1" />
          Export activity
        </button>
      </div>
      <div className="acs-time">
        <div className="acs-time-item is-done">
          <div className="acs-time-card">
            <h3 className="fs-15 fw-medium">
              <i className="ti ti-user-plus" />
              Account created
            </h3>
            <time dateTime="2019-01-14T11:00">14 Jan 2019 · 11:00</time>
            <p>
              Opened by Mr. R. Venkatesh as an Administrator. Raised to Super
              Administrator in August 2022.
            </p>
          </div>
        </div>
        <div className="acs-time-item is-done">
          <div className="acs-time-card">
            <h4 className="fs-15 fw-medium">
              <i className="ti ti-key" />
              Password changed
            </h4>
            <time dateTime="2026-04-11T10:04">11 Apr 2026 · 10:04</time>
            <p>
              A 16-character passphrase, checked against public breach lists.
              Every other session ended at the same moment.
            </p>
          </div>
        </div>
        <div className="acs-time-item is-done">
          <div className="acs-time-card">
            <h5 className="fs-15">
              <i className="ti ti-device-mobile-check" />
              Two-factor enabled
            </h5>
            <time dateTime="2026-02-22T09:15">22 Feb 2026 · 09:15</time>
            <p>
              Authenticator app enrolled and ten recovery codes issued. Required
              at every sign-in since.
            </p>
          </div>
        </div>
        <div className="acs-time-item is-done">
          <div className="acs-time-card">
            <h6>
              <i className="ti ti-device-desktop" />
              New device signed in
            </h6>
            <time dateTime="2026-07-23T14:11">23 Jul 2026 · 14:11</time>
            <p>
              Safari on macOS from Coimbatore. Verified by email before it was
              allowed to do anything.
            </p>
          </div>
        </div>
        <div className="acs-time-item is-done">
          <div className="acs-time-card">
            <h6>
              <i className="ti ti-lock-access" />
              Permission updated
            </h6>
            <time dateTime="2026-06-02T15:40">02 Jun 2026 · 15:40</time>
            <p>
              Backup and restore moved behind a second approver, following the
              term-end policy review.
            </p>
          </div>
        </div>
        <div className="acs-time-item is-current">
          <div className="acs-time-card">
            <h6>
              <i className="ti ti-scan" />
              Security scan completed
            </h6>
            <time dateTime="2026-08-13T06:00">Today · 06:00</time>
            <p>
              Posture scored 78 of 100. Two recommendations raised, neither of
              them urgent. No issues found.
            </p>
          </div>
        </div>
      </div>
      {/* /Security Activity */}
    </div>
  </div>
  {/* /Page Wrapper */}
</>

  )
}

export default SecuritySettings