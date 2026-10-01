const ListGroup = () => {
  return (
    <div>
      <div className="page-wrapper">
            <div className="content">
              <div className="page-header">
                <div className="page-title">
                  <h3>List Group</h3>
                </div>
              </div>

              {/* start row */}
                      <div className="row">

                          <div className="col-xl-4">
                              <div className="card">
                                  <div className="card-header">
                                      <h4 className="card-title fs-16 fw-medium">Basic example</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">The most basic list group is an unordered list with list items and the proper classes. Build upon it with the options that follow, or with your own CSS as needed.</p>

                      <ul className="list-group">
                        <li className="list-group-item">
                          <i className="ti ti-brand-slack me-1 align-middle fs-18"></i> Slack Collaboration
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-nextcloud me-1 align-middle fs-18"></i> Nextcloud File Sharing
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-zoom me-1 align-middle fs-18"></i> Zoom Video Meetings
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-stripe me-1 align-middle fs-18"></i> Stripe Billing System
                        </li>
                      </ul>

                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-4">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Active Items</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">Add <code>.active</code> to a <code>.list-group-item</code> to indicate the current active selection.</p>

                      <ul className="list-group">
                        <li className="list-group-item active">
                          <i className="ti ti-brand-slack me-1 align-middle fs-18"></i> Slack Collaboration
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-nextcloud me-1 align-middle fs-18"></i> Nextcloud File Sharing
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-zoom me-1 align-middle fs-18"></i> Zoom Video Meetings
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-notion me-1 align-middle fs-18"></i> Notion Workspace
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-stripe me-1 align-middle fs-18"></i> Stripe Billing System
                        </li>
                      </ul>

                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-4">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Disabled Items</h5>
                                  </div>
                                  <div className="card-body">
                                      <p>Add <code>.disabled</code> to a <code>.list-group-item</code> to make it
                                          <em>appear</em> disabled.
                                      </p>

                      <ul className="list-group">
                        <li className="list-group-item disabled" aria-disabled="true">
                          <i className="ti ti-brand-slack me-1 align-middle fs-18"></i> Slack Collaboration
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-nextcloud me-1 align-middle fs-18"></i> Nextcloud File Sharing
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-zoom me-1 align-middle fs-18"></i> Zoom Video Meetings
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-notion me-1 align-middle fs-18"></i> Notion Workspace
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-stripe me-1 align-middle fs-18"></i> Stripe Billing System
                        </li>
                      </ul>

                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                      </div>
                      {/* end row */}

                      {/* start row */}
                      <div className="row">

                          <div className="col-xl-4">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Links and Buttons</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">Use <code>&lt;a&gt;</code>s or <code>&lt;button&gt;</code>s to create  <em>actionable</em> list group items with hover, disabled, and active states by adding <code>.list-group-item-action</code>.</p>

                      <div className="list-group">
                        <a href="#" className="list-group-item list-group-item-action active">
                          <i className="ti ti-brand-slack me-1 align-middle fs-18"></i> Slack Collaboration
                        </a>
                        <a href="#" className="list-group-item list-group-item-action">
                          <i className="ti ti-brand-nextcloud me-1 align-middle fs-18"></i> Nextcloud File Sharing 
                        </a>
                        <button type="button" className="list-group-item list-group-item-action">
                          <i className="ti ti-brand-zoom me-1 align-middle fs-18"></i> Zoom Video Meetings
                        </button>
                        <button type="button" className="list-group-item list-group-item-action">
                          <i className="ti ti-brand-notion me-1 align-middle fs-18"></i> Notion Workspace
                        </button>
                        <a href="#" className="list-group-item list-group-item-action disabled" tabIndex={-1}>
                          <i className="ti ti-brand-stripe me-1 align-middle fs-18"></i> Stripe Billing System
                        </a>
                      </div>
                    </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-4">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Flush</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">Add <code>.list-group-flush</code> to remove some borders and rounded corners to render list group items edge-to-edge in a parent container (e.g., cards).</p>
                                      <ul className="list-group list-group-flush">
                                          <li className="list-group-item"><i className="ti ti-brand-slack me-1 align-middle fs-18"></i> Slack Collaboration</li>
                                          <li className="list-group-item"><i className="ti ti-brand-nextcloud me-1 align-middle fs-18"></i> Nextcloud File Sharing</li>
                                          <li className="list-group-item"><i className="ti ti-brand-zoom me-1 align-middle fs-18"></i> Zoom Video Meetings</li>
                                          <li className="list-group-item"><i className="ti ti-brand-notion me-1 align-middle fs-18"></i> Notion Workspace</li>
                                          <li className="list-group-item"><i className="ti ti-brand-stripe me-1 align-middle fs-18"></i> Stripe Billing System</li>
                                      </ul>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-4">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Numbered</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">Numbers are generated by <code>counter-reset</code> on the <code>&lt;ol&gt;</code>, and then styled and placed with a <code>::before</code> psuedo-element on the <code>&lt;li&gt;</code> with <code>counter-increment</code> and <code>content</code>. </p>

                                      <ol className="list-group list-group-numbered">
                                          <li className="list-group-item d-flex justify-content-between align-items-start">
                                              <div className="ms-2 me-auto">
                                                  <div className="fw-bold">SmartOne Admin</div>
                                                  SmartOne Admin
                                              </div>
                                              <span className="badge bg-primary rounded-pill">865</span>
                                          </li>
                                          <li className="list-group-item d-flex justify-content-between align-items-start">
                                              <div className="ms-2 me-auto">
                                                  <div className="fw-bold">SmartOne React Admin</div>
                                                  SmartOne React Admin
                                              </div>
                                              <span className="badge bg-primary rounded-pill">140</span>
                                          </li>
                                          <li className="list-group-item d-flex justify-content-between align-items-start">
                                              <div className="ms-2 me-auto">
                                                  <div className="fw-bold">Angular Version</div>
                                                  Angular Version
                                              </div>
                                              <span className="badge bg-primary rounded-pill">85</span>
                                          </li>
                                      </ol>

                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                      </div>
                      {/* end row */}

                      {/* start row */}
                      <div className="row">
                          <div className="col-xl-4">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Contextual Classes</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">Use contextual classes to style list items with a stateful background and color.</p>

                                      <ul className="list-group">
                                          <li className="list-group-item">Dapibus ac facilisis in</li>
                                          <li className="list-group-item list-group-item-primary">A simple primary list group item</li>
                                          <li className="list-group-item list-group-item-secondary">A simple secondary list group item</li>
                                          <li className="list-group-item list-group-item-success">A simple success list group item</li>
                                          <li className="list-group-item list-group-item-danger">A simple danger list group item</li>
                                          <li className="list-group-item list-group-item-warning">A simple warning list group item</li>
                                          <li className="list-group-item list-group-item-info">A simple info list group item</li>
                                          <li className="list-group-item list-group-item-light">A simple light list group item</li>
                                          <li className="list-group-item list-group-item-dark">A simple dark list group item</li>
                                      </ul>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-4">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Contextual Classes with Link</h5>
                                  </div>

                                  <div className="card-body">
                                      <p className="text-muted">Use contextual classes to style list items with a stateful background and color.</p>

                                      <div className="list-group">
                                          <a href="#" className="list-group-item list-group-item-action">Darius ac facilities in</a>
                                          <a href="#" className="list-group-item list-group-item-action list-group-item-primary">A simple primary list group item</a>
                                          <a href="#" className="list-group-item list-group-item-action list-group-item-secondary">A simple secondary list group item</a>
                                          <a href="#" className="list-group-item list-group-item-action list-group-item-success">A simple success list group item</a>
                                          <a href="#" className="list-group-item list-group-item-action list-group-item-danger">A simple danger list group item</a>
                                          <a href="#" className="list-group-item list-group-item-action list-group-item-warning">A simple warning list group item</a>
                                          <a href="#" className="list-group-item list-group-item-action list-group-item-info">A simple info list group item</a>
                                          <a href="#" className="list-group-item list-group-item-action list-group-item-light">A simple light list group item</a>
                                          <a href="#" className="list-group-item list-group-item-action list-group-item-dark">A simple dark list group item</a>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-4">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Custom Content</h5>
                                  </div>

                                  <div className="card-body">
                                      <p className="text-muted">Add nearly any HTML within, even for linked list groups like the one below, with the help of flexbox utilities.</p>

                                      <div className="list-group">
                                          <a href="#" className="list-group-item list-group-item-action active">
                                              <div className="d-flex w-100 justify-content-between">
                                                  <h5 className="fs-16 mb-1 text-white">List group item heading</h5>
                                                  <small>3 days ago</small>
                                              </div>
                                              <p className="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                                              <small>Donec id elit non mi porta.</small>
                                          </a>
                                          <a href="#" className="list-group-item list-group-item-action">
                                              <div className="d-flex w-100 justify-content-between">
                                                  <h5 className="fs-16 mb-1">List group item heading</h5>
                                                  <small className="text-muted">3 days ago</small>
                                              </div>
                                              <p className="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                                              <small className="text-muted">Donec id elit non mi porta.</small>
                                          </a>
                                          <a href="#" className="list-group-item list-group-item-action">
                                              <div className="d-flex w-100 justify-content-between">
                                                  <h5 className="fs-16 mb-1">List group item heading</h5>
                                                  <small className="text-muted">3 days ago</small>
                                              </div>
                                              <p className="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                                              <small className="text-muted">Donec id elit non mi porta.</small>
                                          </a>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                      </div>
                      {/* end row */}

                      {/* start row */}
                      <div className="row">

                          <div className="col-xl-4">
                  <div className="card card-h-100">
                                  <div className="card-header">
                                      <h5 className="card-title">Horizontal</h5>
                                  </div>
                    <div className="card-body">
                      <p>Add <code>.list-group-horizontal</code> to change the layout of list group items from vertical to horizontal across all breakpoints. Alternatively, choose a responsive variant <code>.list-group-horizontal-{"{"}sm|md|lg|xl|xxl{"}"}</code> to make a list group horizontal starting at that breakpoint’s <code>min-width</code>.</p>

                      <ul className="list-group list-group-horizontal mb-3">
                        <li className="list-group-item">
                          <i className="ti ti-brand-slack me-1 align-middle fs-18"></i> Slack
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-zoom me-1 align-middle fs-18"></i> Zoom
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-trello me-1 align-middle fs-18"></i> Trello
                        </li>
                      </ul>

                      <ul className="list-group list-group-horizontal-sm mb-3">
                        <li className="list-group-item">
                          <i className="ti ti-brand-notion me-1 align-middle fs-18"></i> Notion
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-stripe me-1 align-middle fs-18"></i> Stripe
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-box me-1 align-middle fs-18"></i> Dropbox
                        </li>
                      </ul>

                      <ul className="list-group list-group-horizontal-md">
                        <li className="list-group-item">
                          <i className="ti ti-brand-github me-1 align-middle fs-18"></i> GitHub
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-discord me-1 align-middle fs-18"></i> Discord
                        </li>
                        <li className="list-group-item">
                          <i className="ti ti-brand-asana me-1 align-middle fs-18"></i> Asana
                        </li>
                      </ul>

                    </div> {/* end card body */}							
                  </div> {/* end card */}						
                          </div> {/* end col */}

                          <div className="col-xl-4">
                  <div className="card card-h-100">
                                  <div className="card-header">
                                      <h5 className="card-title">With Badges</h5>
                                  </div>
                    <div className="card-body">
                      <p className="text-muted">Add badges to any list group item to show unread counts, activity, and more with the help of some utilities.</p>

                      <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          New Task Assignments
                          <span className="badge bg-primary rounded-pill">5</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Upcoming Meetings
                          <span className="badge bg-success rounded-pill">3</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          System Notifications
                          <span className="badge bg-danger rounded-pill">15+</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Completed Projects
                          <span className="badge bg-success rounded-pill">8</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Overdue Tasks
                          <span className="badge bg-warning rounded-pill">2</span>
                        </li>
                      </ul>
                    </div> {/* end card body */}							
                  </div> {/* end card */}						
                          </div> {/* end col */}

                          <div className="col-xl-4">
                              <div className="card card-h-100">
                                  <div className="card-header">
                                      <h5 className="card-title">Checkboxes and Radios</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">Place Bootstrap’s checkboxes and radios within list group items and customize as needed. You can use them without <code>&lt;label&gt;</code>s, but please remember to include an <code>aria-label</code> attribute and value for accessibility.</p>

                                      <ul className="list-group">
                                          <li className="list-group-item">
                                              <input className="form-check-input me-1" type="checkbox" value="" id="firstCheckbox" />
                                              <label className="form-check-label" htmlFor="firstCheckbox">First checkbox</label>
                                          </li>
                                          <li className="list-group-item">
                                              <input className="form-check-input me-1" type="checkbox" value="" id="secondCheckbox" />
                                              <label className="form-check-label" htmlFor="secondCheckbox">Second checkbox</label>
                                          </li>
                                      </ul>

                                      <ul className="list-group mt-2">
                                          <li className="list-group-item">
                                              <input className="form-check-input me-1" type="radio" name="listGroupRadio" value="" id="firstRadio" checked />
                                              <label className="form-check-label" htmlFor="firstRadio">First radio</label>
                                          </li>
                                          <li className="list-group-item">
                                              <input className="form-check-input me-1" type="radio" name="listGroupRadio" value="" id="secondRadio" />
                                              <label className="form-check-label" htmlFor="secondRadio">Second radio</label>
                                          </li>
                                      </ul>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Data List</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">The repeating row behind most dashboard panels: a tile, a body that flexes, and a trailing value. Rows divide themselves, so no wrapper is required — add <code>.data-list</code> to a parent only to set density or hover for the whole list.</p>
                                      <div className="data-list data-list-hover">
                                          <div className="data-list-item">
                                              <span className="avatar avatar-icon avatar-md bg-success-transparent"><i className="ti ti-bus"></i></span>
                                              <div className="data-list-body">
                                                  <div className="data-list-title">Route 01 &middot; North</div>
                                                  <div className="data-list-subtitle"><i className="ti ti-map-pin"></i>Downtown Ave &middot; 34 km/h</div>
                                              </div>
                                              <span className="badge badge-soft-success">On route</span>
                                          </div>
                                          <div className="data-list-item">
                                              <span className="avatar avatar-icon avatar-md bg-danger-transparent"><i className="ti ti-bus"></i></span>
                                              <div className="data-list-body">
                                                  <div className="data-list-title">Route 07 &middot; South</div>
                                                  <div className="data-list-subtitle"><i className="ti ti-map-pin"></i>5th Junction &middot; 12 km/h</div>
                                              </div>
                                              <span className="badge badge-soft-danger">Traffic</span>
                                          </div>
                                          <div className="data-list-item">
                                              <span className="avatar avatar-icon avatar-md bg-warning-transparent"><i className="ti ti-bus-stop"></i></span>
                                              <div className="data-list-body">
                                                  <div className="data-list-title">Route 09 &middot; West</div>
                                                  <div className="data-list-subtitle"><i className="ti ti-tools"></i>Depot &middot; Maintenance</div>
                                              </div>
                                              <span className="badge badge-soft-warning">Idle</span>
                                          </div>
                                      </div>

                                      <p className="mb-3 mt-4">A leaderboard adds <code>.data-list-index</code>, and <code>.is-top</code> picks out the leading places.</p>
                                      <div className="data-list">
                                          <div className="data-list-item is-top">
                                              <span className="data-list-index">1</span>
                                              <div className="data-list-body">
                                                  <div className="data-list-title">To Kill a Mockingbird</div>
                                                  <div className="data-list-meta">
                                                      <span className="badge badge-soft-warning">Literature</span>
                                                      <span className="chip chip-soft chip-sm chip-success"><i className="ti ti-trending-up"></i>Trending</span>
                                                  </div>
                                              </div>
                                              <div className="data-list-end">
                                                  <div className="stat-value stat-value-xs">86</div>
                                                  <div className="meter meter-xs mt-1" style={{ width: '66px' }}><span className="bg-warning" style={{ width: '100%' }}></span></div>
                                              </div>
                                          </div>
                                          <div className="data-list-item">
                                              <span className="data-list-index">2</span>
                                              <div className="data-list-body">
                                                  <div className="data-list-title">A Brief History of Time</div>
                                                  <div className="data-list-meta">
                                                      <span className="badge badge-soft-primary">Science</span>
                                                  </div>
                                              </div>
                                              <div className="data-list-end">
                                                  <div className="stat-value stat-value-xs">74</div>
                                                  <div className="meter meter-xs mt-1" style={{ width: '66px' }}><span className="bg-primary" style={{ width: '86%' }}></span></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Data List &mdash; Cards</h5>
                                  </div>
                                  <div className="card-body data-list data-list-cards data-list-cards-accent data-list-hover">
                                      <p className="mb-3">Add <code>.data-list-cards</code> to break the rows apart into bordered cards. With <code>.data-list-cards-accent</code> each card takes a leading edge in the row's own accent colour, set once through <code>--avatar-accent</code>.</p>
                                      <div className="data-list-item accent-danger">
                                          <span className="avatar avatar-icon avatar-md bg-danger-transparent"><i className="ti ti-tools"></i></span>
                                          <div className="data-list-body">
                                              <div className="data-list-title">Bus TX-1204 &mdash; Brake inspection</div>
                                              <div className="data-list-meta"><span className="badge badge-soft-danger">Critical</span></div>
                                          </div>
                                          <div className="data-list-end">
                                              <div className="data-list-title">Tomorrow</div>
                                              <span className="stat-label stat-label-sm">09:00 AM</span>
                                          </div>
                                      </div>
                                      <div className="data-list-item accent-primary">
                                          <span className="avatar avatar-icon avatar-md bg-primary-transparent"><i className="ti ti-engine"></i></span>
                                          <div className="data-list-body">
                                              <div className="data-list-title">Bus TX-1188 &mdash; Engine service</div>
                                              <div className="data-list-meta"><span className="badge badge-soft-primary">Scheduled</span></div>
                                          </div>
                                          <div className="data-list-end">
                                              <div className="data-list-title">24 Jul</div>
                                              <span className="stat-label stat-label-sm">11:00 AM</span>
                                          </div>
                                      </div>
                                      <div className="data-list-item accent-success">
                                          <span className="avatar avatar-icon avatar-md bg-success-transparent"><i className="ti ti-circle-check"></i></span>
                                          <div className="data-list-body">
                                              <div className="data-list-title">Bus TX-1150 &mdash; Service completed</div>
                                              <div className="data-list-meta"><span className="badge badge-soft-success">Done</span></div>
                                          </div>
                                          <div className="data-list-end">
                                              <div className="data-list-title">18 Jul</div>
                                              <span className="stat-label stat-label-sm">Health 98%</span>
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

export default ListGroup;
