const Badges = () => {
  return (
    <div>
      <div className="page-wrapper">
            <div className="content">
              <div className="page-header">
                <div className="page-title">
                  <h3>Badges</h3>
                </div>
              </div>

              {/* start row */}
                      <div className="row">

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h4 className="card-title fs-16 fw-medium">Default Badges</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-xl mb-3">Use the <span className="text-secondary">badge</span> class to show a default badge.</p>
                                      <div className="d-flex flex-wrap gap-2">
                                          <span className="badge bg-primary">Primary</span>
                                          <span className="badge bg-secondary">Secondary</span>
                                          <span className="badge bg-success">Success</span>
                                          <span className="badge bg-danger">Danger</span>
                                          <span className="badge bg-warning">Warning</span>
                                          <span className="badge bg-info">Info</span>
                                          <span className="badge bg-light text-dark">Light</span>
                                          <span className="badge bg-dark text-white">Dark</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Rounded Badges</h5>
                                  </div>
                                  <div className="card-body">
                                      <p>Use the <code>.rounded-pill</code> to create a soft badge more rounded.</p>
                                      <div className="d-flex flex-wrap gap-2">
                                          <span className="badge rounded-pill bg-primary">Primary</span>
                                          <span className="badge rounded-pill bg-secondary">Secondary</span>
                                          <span className="badge rounded-pill bg-success">Success</span>
                                          <span className="badge rounded-pill bg-danger">Danger</span>
                                          <span className="badge rounded-pill bg-warning">Warning</span>
                                          <span className="badge rounded-pill bg-info">Info</span>
                                          <span className="badge rounded-pill bg-light text-dark">Light</span>
                                          <span className="badge rounded-pill bg-dark text-white">Dark</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Soft Badges</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-xl mb-3">Use the <code>badge-soft-</code> class to create a softer badge.</p>
                                      <div className="d-flex flex-wrap gap-2">
                                          <span className="badge badge-soft-primary">Primary</span>
                                          <span className="badge badge-soft-secondary">Secondary</span>
                                          <span className="badge badge-soft-success">Success</span>
                                          <span className="badge badge-soft-danger">Danger</span>
                                          <span className="badge badge-soft-warning">Warning</span>
                                          <span className="badge badge-soft-info">Info</span>
                                          <span className="badge badge-soft-light">Light</span>
                                          <span className="badge badge-soft-dark">Dark</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Soft Rounded Badges</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-xl mb-3">Use the <code>rounded-pill  badge-soft-</code> to create a soft badge more rounded</p>
                                      <div className="d-flex flex-wrap gap-2">
                                          <span className="badge rounded-pill badge-soft-primary">Primary</span>
                                          <span className="badge rounded-pill badge-soft-secondary">Secondary</span>
                                          <span className="badge rounded-pill badge-soft-success">Success</span>
                                          <span className="badge rounded-pill badge-soft-danger">Danger</span>
                                          <span className="badge rounded-pill badge-soft-warning">Warning</span>
                                          <span className="badge rounded-pill badge-soft-info">Info</span>
                                          <span className="badge rounded-pill badge-soft-light text-dark">Light</span>
                                          <span className="badge rounded-pill badge-soft-dark">Dark</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Outline Badges</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-xl mb-3">Use the <code>badge-outline-</code> to create a badge with the outline.</p>
                                      <div className="d-flex flex-wrap gap-2">
                                          <span className="badge badge-outline-primary">Primary</span>
                                          <span className="badge badge-outline-secondary">Secondary</span>
                                          <span className="badge badge-outline-success">Success</span>
                                          <span className="badge badge-outline-danger">Danger</span>
                                          <span className="badge badge-outline-warning">Warning</span>
                                          <span className="badge badge-outline-info">Info</span>
                                          <span className="badge badge-outline-light text-dark">Light</span>
                                          <span className="badge badge-outline-dark">Dark</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Outline Rounded Badges</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-xl mb-3">Use the <code>rounded-pill badge-outline-</code> class to create a outline pill badge.</p>
                                      <div className="d-flex flex-wrap gap-2">
                                          <span className="badge rounded-pill badge-outline-primary">Primary</span>
                                          <span className="badge rounded-pill badge-outline-secondary">Secondary</span>
                                          <span className="badge rounded-pill badge-outline-success">Success</span>
                                          <span className="badge rounded-pill badge-outline-danger">Danger</span>
                                          <span className="badge rounded-pill badge-outline-warning">Warning</span>
                                          <span className="badge rounded-pill badge-outline-info">Info</span>
                                          <span className="badge rounded-pill badge-outline-light text-dark">Light</span>
                                          <span className="badge rounded-pill badge-outline-dark">Dark</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Soft Border Badges</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-xl mb-3">Use the <code>badge-border</code> and <code>badge-soft-</code> with below mentioned modifier classes to make badges with border &amp; soft backgorund.</p>
                                      <div className="d-flex flex-wrap gap-2">
                                          <span className="badge badge-soft-primary border border-primary">Primary</span>
                                          <span className="badge badge-soft-secondary border border-secondary">Secondary</span>
                                          <span className="badge badge-soft-success border border-success">Success</span>
                                          <span className="badge badge-soft-danger border border-danger">Danger</span>
                                          <span className="badge badge-soft-warning border border-warning">Warning</span>
                                          <span className="badge badge-soft-info border border-info">Info</span>
                                          <span className="badge badge-soft-light border border-light text-dark">Light</span>
                                          <span className="badge badge-soft-dark border border-dark">Dark</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Soft Border Rounded Badges</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-xl mb-3">Use the <code>badge-border</code> and <code>badge-soft-</code> with below mentioned modifier classes to make badges with border &amp; soft backgorund.</p>
                                      <div className="d-flex flex-wrap gap-2">
                                          <span className="badge rounded-pill badge-soft-primary border border-primary">Primary</span>
                                          <span className="badge rounded-pill badge-soft-secondary border border-secondary">Secondary</span>
                                          <span className="badge rounded-pill badge-soft-success border border-success">Success</span>
                                          <span className="badge rounded-pill badge-soft-danger border border-danger">Danger</span>
                                          <span className="badge rounded-pill badge-soft-warning border border-warning">Warning</span>
                                          <span className="badge rounded-pill badge-soft-info border border-info">Info</span>
                                          <span className="badge rounded-pill badge-soft-light border border-light text-dark">Light</span>
                                          <span className="badge rounded-pill badge-soft-dark border border-dark">Dark</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                <div className="col-xl-6">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">Gradient Badges</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-flex flex-wrap gap-2">
                        <span className="badge bg-primary-gradient">Primary</span>
                        <span className="badge bg-secondary-gradient">Secondary</span>
                        <span className="badge bg-success-gradient">Success</span>
                        <span className="badge bg-danger-gradient">Danger</span>
                        <span className="badge bg-warning-gradient">Warning</span>
                        <span className="badge bg-info-gradient">Info</span>
                        <span className="badge bg-orange-gradient">orange</span>
                        <span className="badge bg-purple-gradient">purple</span>
                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                <div className="col-xl-6">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">Gradient Pill Badges</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-flex flex-wrap gap-2">
                        <span className="badge rounded-pill bg-primary-gradient">Primary</span>
                        <span className="badge rounded-pill bg-secondary-gradient">Secondary</span>
                        <span className="badge rounded-pill bg-success-gradient">Success</span>
                        <span className="badge rounded-pill bg-danger-gradient">Danger</span>
                        <span className="badge rounded-pill bg-warning-gradient">Warning</span>
                        <span className="badge rounded-pill bg-info-gradient">Info</span>
                        <span className="badge rounded-pill bg-orange-gradient">orange</span>
                        <span className="badge rounded-pill bg-purple-gradient">purple</span>
                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Badge Usage</h5>
                                  </div>
                                  <div className="card-body d-flex flex-wrap gap-4">
                                      <button type="button" className="btn btn-primary btn-md position-relative">
                                          Inbox
                                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                          99+
                          <span className="visually-hidden">unread messages</span>
                                          </span>
                                      </button>
                                      <button type="button" className="btn btn-primary btn-md position-relative">
                                          Profile
                                          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-warning border border-light rounded-circle flex-shrink-0">
                          <span className="visually-hidden">New alerts</span>
                                          </span>
                                      </button>
                                      <button type="button" className="btn btn-primary btn-md btn-icon position-relative">
                                          <i className="ti ti-chevron-left"></i>
                                          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-warning border border-light rounded-circle flex-shrink-0">
                          <span className="visually-hidden">New alerts</span>
                                          </span>
                                      </button>
                                      <button type="button" className="btn btn-light rounded-circle flex-shrink-0 btn-md btn-icon position-relative">
                                          <i className="ti ti-bell-filled  text-dark"></i>
                                      </button>
                                      <button type="button" className="btn btn-light rounded-circle flex-shrink-0 btn-md btn-icon position-relative">
                                          <i className="ti ti-baseline-density-medium text-dark"></i>
                                          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-warning border border-light rounded-circle flex-shrink-0">
                          <span className="visually-hidden">New alerts</span>
                                          </span>
                                      </button>
                                  </div> {/* end card body */}
                              </div> {/* end card */}

                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Buttons With Badges </h5>
                                  </div>
                                  <div className="card-body d-flex flex-wrap gap-2">
                                      <button type="button" className="btn btn-primary my-1 me-2">
                                          Notifications <span className="badge ms-2 bg-secondary">3</span>
                                      </button>
                                      <button type="button" className="btn btn-secondary my-1 me-2">
                                          Notifications <span className="badge ms-2 bg-white text-dark">24</span>
                                      </button>
                                      <button type="button" className="btn btn-success my-1 me-2">
                                          Notifications <span className="badge ms-2 bg-danger">15</span>
                                      </button>
                                      <button type="button" className="btn btn-danger my-1 me-2">
                                          Notifications <span className="badge ms-2 bg-white text-dark">24</span>
                                      </button>
                                      <button type="button" className="btn btn-warning my-1 me-2">
                                          Notifications <span className="badge ms-2 bg-secondary">3</span>
                                      </button>
                                      <button type="button" className="btn btn-info my-1 me-2">
                                          Notifications <span className="badge ms-2 bg-danger">15</span>
                                      </button>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Headings</h5>
                                  </div>
                                  <div className="card-body">
                                      <h1 className="mb-3">Example heading <span className="badge bg-primary">New</span></h1>
                                      <h2 className="mb-3">Example heading <span className="badge bg-secondary">New</span></h2>
                                      <h3 className="mb-3">Example heading <span className="badge bg-success">New</span></h3>
                                      <h4 className="mb-3">Example heading <span className="badge bg-info">New</span></h4>
                                      <h5 className="mb-3">Example heading <span className="badge bg-warning">New</span></h5>
                                      <h6 className="mb-0">Example heading <span className="badge bg-danger">New</span></h6>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Chips</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">A badge labels a thing; a <code>.chip</code> annotates one — a timestamp, a trend, a priority. It is lighter than a badge and sits inline beside a title. Add <code>.chip-soft</code> for the tinted pill and a tone class for colour.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                          <span className="chip chip-soft chip-muted"><i className="ti ti-clock"></i>20m</span>
                                          <span className="chip chip-soft chip-success"><i className="ti ti-trending-up"></i>Trending</span>
                                          <span className="chip chip-soft chip-danger"><i className="ti ti-trending-down"></i>-4%</span>
                                          <span className="chip chip-soft chip-info"><i className="ti ti-clock-hour-4"></i>SLA 2h</span>
                                          <span className="chip chip-soft chip-purple"><i className="ti ti-sparkles"></i>New</span>
                                      </div>

                                      <p className="mb-3">Squared corners read as a priority or status stamp, and <code>.chip-lg</code> / <code>.chip-sm</code> adjust the scale.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                          <span className="chip chip-square chip-soft chip-danger"><i className="ti ti-flag-3-filled"></i>High</span>
                                          <span className="chip chip-square chip-soft chip-warning"><i className="ti ti-flag-3-filled"></i>Med</span>
                                          <span className="chip chip-soft chip-sm chip-success">+9</span>
                                          <span className="chip chip-lg chip-soft chip-primary"><i className="ti ti-users"></i>42 students</span>
                                      </div>

                                      <p className="mb-3">Without <code>.chip-soft</code> a chip is transparent, so it works as plain inline meta — including a chart legend, where a bare <code>&lt;i&gt;</code> becomes a swatch.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3">
                                          <span className="chip chip-muted"><i className="ti ti-paperclip"></i>2 files</span>
                                          <span className="chip chip-lg text-success"><span className="status-dot status-dot-sm status-dot-pulse"></span>Live</span>
                                          <span className="chip"><i className="bg-primary"></i>Science <b>32%</b></span>
                                          <span className="chip"><i className="bg-warning"></i>Literature <b>14%</b></span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Status Indicators</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">A <code>.status-dot</code> marks state without taking a word to do it. It inherits <code>currentcolor</code> by default, so it also works inside coloured text.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3 mb-3">
                                          <span className="chip chip-lg"><span className="status-dot status-dot-success"></span>Online</span>
                                          <span className="chip chip-lg"><span className="status-dot status-dot-warning"></span>Away</span>
                                          <span className="chip chip-lg"><span className="status-dot status-dot-danger"></span>Busy</span>
                                          <span className="chip chip-lg"><span className="status-dot status-dot-muted"></span>Offline</span>
                                      </div>

                                      <p className="mb-3">Sizes run <code>.status-dot-sm</code> to <code>.status-dot-lg</code>; <code>.status-dot-square</code> turns it into a legend swatch and <code>.status-dot-pulse</code> marks anything reporting live.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3">
                                          <span className="status-dot status-dot-sm status-dot-primary"></span>
                                          <span className="status-dot status-dot-primary"></span>
                                          <span className="status-dot status-dot-lg status-dot-primary"></span>
                                          <span className="status-dot status-dot-lg status-dot-square status-dot-info"></span>
                                          <span className="chip chip-lg text-success"><span className="status-dot status-dot-sm status-dot-pulse"></span>Streaming</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}


                                              <div className="col-xl-12">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Badge &#8212; Tag</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">The one accent-driven filled label in the template &#8212; status, category, subject, discount and inbox tags are all this component. Colour comes from <code>--accent</code> / <code>--accent-soft</code>, so set <code>accent-*</code> on the badge or any ancestor and it follows; there is no class per colour and no page-specific variant.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2 mb-4">
                                          <span className="badge badge-tag accent-primary d-inline-flex align-items-center text-nowrap">Primary</span>
                                          <span className="badge badge-tag accent-success d-inline-flex align-items-center text-nowrap">Success</span>
                                          <span className="badge badge-tag accent-warning d-inline-flex align-items-center text-nowrap">Warning</span>
                                          <span className="badge badge-tag accent-danger d-inline-flex align-items-center text-nowrap">Danger</span>
                                          <span className="badge badge-tag accent-info d-inline-flex align-items-center text-nowrap">Info</span>
                                          <span className="badge badge-tag accent-purple d-inline-flex align-items-center text-nowrap">Purple</span>
                                          <span className="badge badge-tag accent-teal d-inline-flex align-items-center text-nowrap">Teal</span>
                                          <span className="badge badge-tag accent-pink d-inline-flex align-items-center text-nowrap">Pink</span>
                                          <span className="badge badge-tag accent-slate d-inline-flex align-items-center text-nowrap">Slate</span>
                                      </div>

                                      <p className="mb-3">A leading glyph is markup, not a variant &#8212; <code>.d-inline-flex</code> and <code>.align-items-center</code> are all it takes, and the component sizes the icon itself. <code>.badge-tag-dot</code> swaps the glyph for a status dot.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2 mb-4">
                                          <span className="badge badge-tag badge-tag-dot accent-success d-inline-flex align-items-center text-nowrap">Present today</span>
                                          <span className="badge badge-tag badge-tag-dot accent-warning d-inline-flex align-items-center text-nowrap">Pending</span>
                                          <span className="badge badge-tag accent-success d-inline-flex align-items-center text-nowrap"><i className="ti ti-award"></i>Scholarship 15%</span>
                                          <span className="badge badge-tag accent-info d-inline-flex align-items-center text-nowrap"><i className="ti ti-discount"></i>Sibling 5%</span>
                                          <span className="badge badge-tag accent-purple d-inline-flex align-items-center text-nowrap"><i className="ti ti-star"></i>Top 5%</span>
                                          <span className="badge badge-tag accent-info d-inline-flex align-items-center text-nowrap"><i className="ti ti-globe"></i>Social</span>
                                      </div>

                                      <p className="mb-3">Three densities: the default for panel headers and card footers, <code>.badge-tag-sm</code> for the category label above a card title, <code>.badge-tag-xs</code> for a dense inbox or table row.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2 mb-4">
                                          <span className="badge badge-tag accent-primary d-inline-flex align-items-center text-nowrap"><i className="ti ti-math-symbols"></i>Math</span>
                                          <span className="badge badge-tag badge-tag-sm accent-primary d-inline-flex align-items-center text-nowrap"><i className="ti ti-math-symbols"></i>Math</span>
                                          <span className="badge badge-tag badge-tag-xs accent-primary d-inline-flex align-items-center text-nowrap"><i className="ti ti-math-symbols"></i>Math</span>
                                          <span className="badge badge-tag rounded-pill accent-primary d-inline-flex align-items-center text-nowrap"><i className="ti ti-math-symbols"></i>Math</span>
                                      </div>

                                      <p className="mb-3">Because the colour is inherited, a section recolours every badge beneath it with one class. All three of these read the same <code>accent-purple</code> declared on the row.</p>
                                      <div className="accent-purple d-flex align-items-center flex-wrap gap-2">
                                          <span className="badge badge-tag d-inline-flex align-items-center text-nowrap"><i className="ti ti-robot"></i>AI</span>
                                          <span className="badge badge-tag badge-tag-sm d-inline-flex align-items-center text-nowrap"><i className="ti ti-microphone"></i>Voice &#183; 0:42</span>
                                          <span className="notification-dot notification-dot-accent d-inline-block"></span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Badge &#8212; Meta</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">The bordered tag that carries a record's secondary facts inside a list row: a channel, a template type, a language. Quieter than the accent tag because it stays on the page's own greys instead of taking a colour. Six pages had drawn this for themselves; <code>.badge-meta</code> is now the only one.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                          <span className="badge-meta"><i className="ti ti-mail"></i>Email</span>
                                          <span className="badge-meta"><i className="ti ti-message"></i>SMS</span>
                                          <span className="badge-meta"><i className="ti ti-brand-whatsapp"></i>WhatsApp</span>
                                          <span className="badge-meta"><i className="ti ti-language"></i>English</span>
                                      </div>
                                      <div className="d-flex align-items-center flex-wrap gap-2">
                                          <span className="badge-meta">Transactional</span>
                                          <span className="badge-meta">Template</span>
                                          <span className="badge-meta">v2.1</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Badge &#8212; Status</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">The bordered pill that reports a record's state at the end of a list row. <code>.badge-status-lg</code> is the roomier step for card headers; <code>.badge-status-strong</code> darkens the label where the pill is the row's primary content rather than an aside.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                          <span className="badge-status"><i className="ti ti-circle-check"></i>Published</span>
                                          <span className="badge-status badge-status-lg"><i className="ti ti-clock"></i>Scheduled</span>
                                          <span className="badge-status badge-status-strong"><i className="ti ti-bolt"></i>Live</span>
                                      </div>

                                      <p className="mb-3">Seven pages drew this pill byte for byte; the geometry now lives here once. Those pages keep their own class name only because each carries a different state palette &#8212; <code>.is-draft</code> is one colour on a form field and another on a broadcast.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2">
                                          <span className="badge-status"><i className="ti ti-file"></i>Draft</span>
                                          <span className="badge-status"><i className="ti ti-archive"></i>Archived</span>
                                          <span className="badge-status badge-status-lg">Review</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Chip &#8212; Meta</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">The chip counterpart to <code>.badge-meta</code>: fully rounded and filled with the page surface rather than the grey, for facts that sit beside a name instead of inside a list row. <code>.meta-chip</code> carries a record's secondary facts beside its name &#8212; an ID, a term, a portal state. It reads quieter than a badge because the fill stays on the page surface and only the border draws the shape.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                          <span className="meta-chip d-inline-flex align-items-center"><i className="ti ti-id"></i>PAR-2043</span>
                                          <span className="meta-chip d-inline-flex align-items-center"><i className="ti ti-calendar"></i>2024&#8211;25</span>
                                          <span className="meta-chip d-inline-flex align-items-center"><i className="ti ti-shield-check"></i>Portal Active</span>
                                      </div>

                                      <p className="mb-3">Without an icon it works as a plain inline fact.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2">
                                          <span className="meta-chip d-inline-flex align-items-center">Grade 4</span>
                                          <span className="meta-chip d-inline-flex align-items-center">Section A</span>
                                          <span className="meta-chip d-inline-flex align-items-center">Roll 12</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Progress Badges</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">A percentage badge closing a bar. The badge is the accent tag and the bar is Bootstrap's <code>.progress</code>, so the pair needs no component of its own &#8212; the shared accent keeps both in the same colour.</p>
                                      <div className="accent-success d-flex align-items-center gap-2 mb-2">
                                          <div className="progress flex-grow-1"><div className="progress-bar bg-success w-75"></div></div>
                                          <span className="badge badge-tag d-inline-flex align-items-center text-nowrap">75%</span>
                                      </div>
                                      <div className="accent-warning d-flex align-items-center gap-2 mb-2">
                                          <div className="progress flex-grow-1"><div className="progress-bar bg-warning w-50"></div></div>
                                          <span className="badge badge-tag d-inline-flex align-items-center text-nowrap">50%</span>
                                      </div>
                                      <div className="accent-danger d-flex align-items-center gap-2 mb-3">
                                          <div className="progress flex-grow-1"><div className="progress-bar bg-danger w-25"></div></div>
                                          <span className="badge badge-tag d-inline-flex align-items-center text-nowrap">25%</span>
                                      </div>

                                      <p className="mb-3">Priority flags name a fixed scale instead of following an accent, so each level keeps its own colour wherever it appears.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2">
                                          <span className="priority-flag priority-flag-high">High</span>
                                          <span className="priority-flag priority-flag-medium">Medium</span>
                                          <span className="priority-flag priority-flag-low">Low</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Notification Badges</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3"><code>.notification-dot</code> is a badge with a state but no content &#8212; the unread marker on an inbox row, a tab or a menu item. Add <code>.notification-dot-accent</code> where the list already recolours row by row.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3 mb-3">
                                          <span className="d-inline-flex align-items-center gap-2"><span className="notification-dot d-inline-block"></span>Unread</span>
                                          <span className="accent-danger d-inline-flex align-items-center gap-2"><span className="notification-dot notification-dot-accent d-inline-block"></span>Urgent</span>
                                          <span className="accent-success d-inline-flex align-items-center gap-2"><span className="notification-dot notification-dot-accent d-inline-block"></span>Resolved</span>
                                      </div>

                                      <p className="mb-3">For a count rather than a state, Bootstrap's pill badge carries the number.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2">
                                          <button type="button" className="btn btn-primary d-inline-flex align-items-center gap-2">Inbox <span className="badge rounded-pill bg-light text-dark">2</span></button>
                                          <button type="button" className="btn btn-outline-primary d-inline-flex align-items-center gap-2">Alerts <span className="badge rounded-pill bg-danger">15</span></button>
                                          <span className="badge rounded-pill bg-danger">9+</span>
                                          <span className="badge rounded-pill badge-soft-primary">New</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Pill Badges</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3"><code>.rounded-pill</code> works on any badge in the family. The meta chip is already fully rounded, so a pill row can mix the two without them reading as different shapes.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                          <span className="badge rounded-pill bg-primary">Primary</span>
                                          <span className="badge rounded-pill badge-soft-success">Success</span>
                                          <span className="badge rounded-pill badge-outline-warning">Warning</span>
                                          <span className="badge rounded-pill bg-dark text-white">Dark</span>
                                      </div>
                                      <div className="d-flex align-items-center flex-wrap gap-2">
                                          <span className="badge badge-tag rounded-pill accent-success d-inline-flex align-items-center text-nowrap"><i className="ti ti-check"></i>Present</span>
                                          <span className="badge badge-tag badge-tag-sm rounded-pill accent-info d-inline-flex align-items-center"><i className="ti ti-globe"></i>Social</span>
                                          <span className="meta-chip d-inline-flex align-items-center"><i className="ti ti-id"></i>STU-1042</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-12">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Badge States</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">Every badge in the family answers to the same set of states, so a page never needs a one-off. Nothing below carries inline CSS &#8212; the icon, the avatar and the spacing are all Bootstrap utilities on top of the component class.</p>
                                      <div className="row g-4 mb-2">
                                          <div className="col-lg-3 col-md-4 col-6">
                                              <p className="fs-12 text-muted mb-2">Default</p>
                                              <span className="badge badge-tag accent-primary d-inline-flex align-items-center text-nowrap">Enrolled</span>
                                          </div>
                                          <div className="col-lg-3 col-md-4 col-6">
                                              <p className="fs-12 text-muted mb-2">With icon</p>
                                              <span className="badge badge-tag accent-primary d-inline-flex align-items-center text-nowrap"><i className="ti ti-user-check"></i>Enrolled</span>
                                          </div>
                                          <div className="col-lg-3 col-md-4 col-6">
                                              <p className="fs-12 text-muted mb-2">With avatar</p>
                                              <span className="badge badge-tag accent-primary d-inline-flex align-items-center gap-1 text-nowrap"><img className="avatar avatar-xs avatar-rounded" src="assets/img/students/student-01.jpg" alt="" />Emma Daniel</span>
                                          </div>
                                          <div className="col-lg-3 col-md-4 col-6">
                                              <p className="fs-12 text-muted mb-2">Soft</p>
                                              <span className="badge badge-soft-primary">Enrolled</span>
                                          </div>
                                          <div className="col-lg-3 col-md-4 col-6">
                                              <p className="fs-12 text-muted mb-2">Accent</p>
                                              <span className="badge badge-tag accent-teal d-inline-flex align-items-center text-nowrap">Enrolled</span>
                                          </div>
                                          <div className="col-lg-3 col-md-4 col-6">
                                              <p className="fs-12 text-muted mb-2">Notification</p>
                                              <span className="d-inline-flex align-items-center gap-2"><span className="notification-dot d-inline-block"></span>Enrolled</span>
                                          </div>
                                          <div className="col-lg-3 col-md-4 col-6">
                                              <p className="fs-12 text-muted mb-2">Disabled</p>
                                              <span className="badge badge-tag accent-primary badge-disabled d-inline-flex align-items-center text-nowrap"><i className="ti ti-user-check"></i>Enrolled</span>
                                          </div>
                                          <div className="col-lg-3 col-md-4 col-6">
                                              <p className="fs-12 text-muted mb-2">Long text</p>
                                              <span className="badge badge-tag accent-primary d-inline-flex align-items-center text-truncate mw-100"><i className="ti ti-user-check"></i>Enrolled in Grade 4 &#183; Section A &#183; Roll 12</span>
                                          </div>
                                      </div>

                                      <p className="mb-3 mt-4">Long labels wrap by default; drop <code>.text-nowrap</code> to let a badge run to two lines, or add <code>.text-truncate</code> with <code>.mw-100</code> to clip it to the column instead.</p>
                                      <div className="row g-3">
                                          <div className="col-md-4">
                                              <span className="badge badge-tag accent-warning d-inline-flex align-items-center">Term II tuition is due on 25 December 2024 for Emma Daniel</span>
                                          </div>
                                          <div className="col-md-4">
                                              <span className="badge badge-tag accent-warning d-inline-flex align-items-center text-truncate mw-100">Term II tuition is due on 25 December 2024 for Emma Daniel</span>
                                          </div>
                                          <div className="col-md-4">
                                              <span className="badge badge-soft-warning d-block text-truncate">Term II tuition is due on 25 December 2024 for Emma Daniel</span>
                                          </div>
                                      </div>

                                      <p className="mb-3 mt-4"><code>.badge-disabled</code> drains the colour and dims the label rather than restyling it, so a disabled badge still reads as the badge it was. One modifier covers every family.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2">
                                          <span className="badge badge-tag accent-success badge-disabled d-inline-flex align-items-center text-nowrap"><i className="ti ti-check"></i>Present</span>
                                          <span className="badge badge-tag badge-tag-sm accent-info badge-disabled d-inline-flex align-items-center"><i className="ti ti-globe"></i>Social</span>
                                          <span className="priority-flag priority-flag-high badge-disabled">High</span>
                                          <span className="meta-chip badge-disabled d-inline-flex align-items-center"><i className="ti ti-id"></i>PAR-2043</span>
                                          <span className="badge bg-primary badge-disabled">Primary</span>
                                          <span className="badge badge-soft-danger badge-disabled">Danger</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Dark Mode</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">Every badge here is built from theme variables rather than fixed colours, so dark mode needs no variant. The panel below sets <code>data-bs-theme="dark"</code> on itself and the same markup re-reads its surfaces and tints.</p>
                                      <div className="border rounded p-3 bg-body" data-bs-theme="dark">
                                          <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                              <span className="badge badge-tag badge-tag-dot accent-success d-inline-flex align-items-center text-nowrap">Present today</span>
                                              <span className="badge badge-tag accent-purple d-inline-flex align-items-center text-nowrap"><i className="ti ti-star"></i>Top 5%</span>
                                              <span className="badge badge-tag badge-tag-sm accent-info d-inline-flex align-items-center"><i className="ti ti-globe"></i>Social</span>
                                              <span className="priority-flag priority-flag-medium">Medium</span>
                                          </div>
                                          <div className="d-flex align-items-center flex-wrap gap-2">
                                              <span className="meta-chip d-inline-flex align-items-center"><i className="ti ti-id"></i>PAR-2043</span>
                                              <span className="badge bg-primary">Primary</span>
                                              <span className="badge badge-soft-success">Success</span>
                                              <span className="badge rounded-pill bg-danger">9+</span>
                                          </div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">RTL Compatible</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">No badge in the family sets a physical left or right &#8212; spacing is <code>gap</code> and the leading dot is a flex child &#8212; so the icon, the dot and the label reorder on their own under <code>dir="rtl"</code>. Use the logical <code>.ms-*</code> / <code>.me-*</code> utilities rather than fixed-side margins when a badge needs its own offset.</p>
                                      <div className="border rounded p-3" dir="rtl">
                                          <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                              <span className="badge badge-tag badge-tag-dot accent-success d-inline-flex align-items-center text-nowrap">Present today</span>
                                              <span className="badge badge-tag accent-warning d-inline-flex align-items-center text-nowrap"><i className="ti ti-book"></i>1 HW</span>
                                              <span className="badge badge-tag badge-tag-sm accent-info d-inline-flex align-items-center"><i className="ti ti-globe"></i>Social</span>
                                          </div>
                                          <div className="d-flex align-items-center flex-wrap gap-2">
                                              <span className="meta-chip d-inline-flex align-items-center"><i className="ti ti-id"></i>PAR-2043</span>
                                              <span className="d-inline-flex align-items-center gap-2"><span className="notification-dot d-inline-block"></span>Unread</span>
                                              <span className="badge rounded-pill bg-danger">9+</span>
                                          </div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                      </div>
                      {/* end row */}

            </div>
          </div>
    </div>
  );
};

export default Badges;
