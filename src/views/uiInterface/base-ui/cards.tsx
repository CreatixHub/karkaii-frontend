const Cards = () => {
  return (
    <div>
      <div className="page-wrapper">
            <div className="content">
              <div className="page-header">
                <div className="page-title">
                  <h3>Cards</h3>
                </div>
              </div>

              <h4 className="mb-3 fs-16 fw-medium">Profile Directory Card</h4>
              <p className="mb-3">A directory record composed entirely from existing components &mdash; no new CSS. It pairs <span className="text-secondary">card</span> with <span className="text-secondary">avatar</span> + <span className="text-secondary">avatar-status</span> for presence, <span className="text-secondary">chip chip-soft</span> for tags, <span className="text-secondary">border-end</span> dividers for the compact fact strip, <span className="text-secondary">info-list-item</span> for the related-person row. Used by the Student Directory; reuse it for teachers, staff or guardians.</p>
              <div className="row">
                <div className="col-xl-4 col-md-6">
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between gap-2">
                      <span className="fs-12 fw-medium text-muted text-truncate">AD9892434</span>
                      <span className="d-inline-flex align-items-center fs-12 fw-medium text-success"><span className="status-dot me-1"></span>Active</span>
                    </div>
                    <div className="card-body pb-2">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="avatar avatar-lg flex-shrink-0">
                          <img src="assets/img/students/student-01.jpg" className="img-fluid rounded-circle flex-shrink-0" alt="Janet Daniel" />
                          <span className="avatar-status avatar-status-sm avatar-status-inset is-online"></span>
                        </span>
                        <div className="flex-fill overflow-hidden">
                          <h5 className="mb-0 text-truncate fs-15">Janet Daniel</h5>
                          <p className="fs-12 text-muted mb-1 text-truncate">Class III &middot; A &middot; Red House</p>
                          <div className="d-flex align-items-center flex-wrap gap-1">
                            <span className="chip chip-soft chip-primary">Scholar</span>
                            <span className="chip chip-soft chip-info">Sports</span>
                          </div>
                        </div>
                      </div>
                      <div className="row g-0 text-center border-top border-bottom py-2 mb-3">
                        <div className="col-4 border-end px-1">
                          <span className="stat-caption d-block">Roll</span>
                          <span className="fw-semibold fs-13">35013</span>
                        </div>
                        <div className="col-4 border-end px-1">
                          <span className="stat-caption d-block">Rank</span>
                          <span className="fw-semibold fs-13">#4</span>
                        </div>
                        <div className="col-4 px-1">
                          <span className="stat-caption d-block">Age</span>
                          <span className="fw-semibold fs-13">12</span>
                        </div>
                      </div>
                      <div className="info-list-item info-list-item-sm d-flex align-items-center">
                        <span className="avatar bg-body-secondary text-body-secondary flex-shrink-0"><i className="ti ti-user-shield"></i></span>
                        <div className="info-list-body"><b>Ronald Daniel</b><span>Parent &middot; +1 46548 84498</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h5 className="mb-3">Flush Card</h5>
              <p className="mb-3">Add <span className="text-secondary">card-flush</span> to a <span className="text-secondary">card</span> for a quiet, token-driven surface: no bottom margin, no hover transition, a lighter shadow and an 18px body. It follows the dark theme, unlike the default card background. Use it for dashboard panels that host their own content.</p>
              <div className="row mb-4">
                <div className="col-lg-4">
                  <div className="card card-flush">
                    <div className="card-body">
                      <h5 className="card-title">Today at a Glance</h5>
                      <p className="mb-0">A flush card sits flat against the page grid, so panels in a row line up without doubled spacing.</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card card-flush">
                    <div className="card-header">
                      <h5 className="card-title mb-0">With a Header</h5>
                    </div>
                    <div className="card-body">
                      <p className="mb-0">The standard <span className="text-secondary">card-header</span> works unchanged.</p>
                    </div>
                  </div>
                </div>
              </div>

              <h5 className="mb-3">Accent Card Header</h5>
              <p className="mb-3">Add <span className="text-secondary">card-header-accent</span> to the <span className="text-secondary">card-header</span> to give its title a leading accent bar. Pair it with <span className="text-secondary">accent-success</span>, <span className="text-secondary">accent-info</span>, <span className="text-secondary">accent-warning</span>, <span className="text-secondary">accent-danger</span> or <span className="text-secondary">accent-dark</span> to recolour the bar.</p>
              <div className="row">
                <div className="col-lg-4">
                  <div className="card">
                    <div className="card-header card-header-accent">
                      <h5 className="card-title mb-0">Class-wise Distribution</h5>
                    </div>
                    <div className="card-body">
                      <p className="card-text mb-0">Default accent bar, using the primary colour.</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card">
                    <div className="card-header card-header-accent accent-success">
                      <h5 className="card-title mb-0">Attendance Overview</h5>
                    </div>
                    <div className="card-body">
                      <p className="card-text mb-0">The success variant of the accent bar.</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card">
                    <div className="card-header card-header-accent accent-info">
                      <h5 className="card-title mb-0">Fee Collection</h5>
                    </div>
                    <div className="card-body">
                      <p className="card-text mb-0">The info variant of the accent bar.</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card">
                    <div className="card-header card-header-accent accent-warning">
                      <h5 className="card-title mb-0">Pending Approvals</h5>
                    </div>
                    <div className="card-body">
                      <p className="card-text mb-0">The warning variant of the accent bar.</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card">
                    <div className="card-header card-header-accent accent-danger">
                      <h5 className="card-title mb-0">Overdue Invoices</h5>
                    </div>
                    <div className="card-body">
                      <p className="card-text mb-0">The danger variant of the accent bar.</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card">
                    <div className="card-header card-header-accent accent-dark">
                      <h5 className="card-title mb-0">Staff Directory</h5>
                    </div>
                    <div className="card-body">
                      <p className="card-text mb-0">The dark variant of the accent bar.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                  <div className="col-lg-4">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">Card Default</h5>
                      </div>
                      <div className="card-body">
                        <img className="card-img-top pb-2 rounded-0" src="assets/img/media/img-8.jpg" alt="Card image cap" />
                        <h5 className="card-title mb-2">Card title</h5>
                        <p className="card-text">Some quick example text to build on the card..</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">With Link</h5>
                      </div>
                      <div className="card-body">
                        <img className="card-img-top pb-2 rounded-0" src="assets/img/media/img-8.jpg" alt="Card image cap" />
                        <h5 className="card-title mb-2">Card title</h5>
                        <p className="card-text">Some quick example text to build on the card..</p>
                        <a href="#" className="card-link text-decoration-underline text-primary">View More</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">With Link</h5>
                      </div>
                      <div className="card-body">
                        <img className="card-img-top pb-2 rounded-0" src="assets/img/media/img-8.jpg" alt="Card image cap" />
                        <h5 className="card-title mb-2">Card title</h5>
                        <p className="card-text">Some quick example text to build on the card..</p>
                        <a href="#" className="btn btn-primary">Go Somewhere</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="card">
                              <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <a href="#" className="card-link text-decoration-underline text-primary">Card link</a>
                                <a href="#" className="card-link text-decoration-underline text-primary">Another link</a>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="card mb-0">
                              <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <a href="#" className="card-link text-decoration-underline text-primary">Card link</a>
                                <a href="#" className="card-link text-decoration-underline text-primary">Another link</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">Header</h5>
                      </div>
                      <div className="card-body">
                        <div className="card mb-0">
                          <div className="card-header bg-light">
                            <h5 className="card-title">Card Header</h5>
                          </div>
                          <div className="card-body">
                            <h6 className="mb-2">Special title treatment</h6>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">Footer</h5>
                      </div>
                      <div className="card-body">
                        <div className="card mb-0">
                          <div className="card-body">
                            <h6 className="mb-2">Special title treatment</h6>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                          </div>
                          <div className="card-footer bg-light">
                            <h5>Card Footer</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">Header and footer</h5>
                      </div>
                      <div className="card-body">
                        <div className="card mb-0">
                          <div className="card-header bg-light">
                            <h5 className="card-title">Card Header</h5>
                          </div>
                          <div className="card-body">
                            <h6 className="mb-2">Special title treatment</h6>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                          </div>
                          <div className="card-footer bg-light">
                            <h5>Card Footer</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">Horizontal Right Align Content</h5>
                      </div>
                      <div className="card-body">
                        <div className="card mb-0">
                          <div className="row g-0">
                            <div className="col-md-4">
                              <img src="assets/img/media/img-9.jpg" className="img-fluid rounded-start h-100" alt="..." />
                            </div>
                            <div className="col-md-8">
                              <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                                <p className="card-text mb-1">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">Horizontal Right Align Content</h5>
                      </div>
                      <div className="card-body">
                        <div className="card mb-0">
                          <div className="row g-0">
                            <div className="col-md-8">
                              <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                                <p className="card-text mb-1">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <img src="assets/img/media/img-9.jpg" className="img-fluid rounded-end h-100" alt="..." />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">Card styles</h5>
                      </div>
                      <div className="card-body card-header-border pb-0">
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="card text-white bg-primary">
                              <div className="card-header">
                                <h5 className="card-title text-white">Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-white">Special title treatment</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="card text-white bg-secondary">
                              <div className="card-header">
                                <h5 className="card-title text-white">Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-white">Special title treatment</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="card text-white bg-dark">
                              <div className="card-header">
                                <h5 className="card-title text-white">Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-white">Special title treatment</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="card text-white bg-success">
                              <div className="card-header">
                                <h5 className="card-title text-white">Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-white">Special title treatment</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="card text-white bg-warning">
                              <div className="card-header">
                                <h5 className="card-title text-white">Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-white">Special title treatment</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="card text-white bg-danger">
                              <div className="card-header">
                                <h5 className="card-title text-white">Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-white">Special title treatment</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="card text-white bg-info">
                              <div className="card-header">
                                <h5 className="card-title text-white">Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-white">Special title treatment</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="card text-white bg-pink">
                              <div className="card-header">
                                <h5 className="card-title text-white">Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-white">Special title treatment</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>



                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">Card Border</h5>
                      </div>
                      <div className="card-body card-header-border pb-0">
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="card border-primary">
                              <div className="card-header bg-light">
                                <h5 className="card-title">Card Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-primary">Primary card title</h5>
                                <p className="card-text text-primary">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="card border-secondary">
                              <div className="card-header bg-light">
                                <h5 className="card-title">Card Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-secondary">Secondary card title</h5>
                                <p className="card-text text-secondary">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="card border-success">
                              <div className="card-header bg-light">
                                <h5 className="card-title">Card Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-success">Success card title</h5>
                                <p className="card-text text-success">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="card border-danger">
                              <div className="card-header bg-light">
                                <h5 className="card-title">Card Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-danger">Danger card title</h5>
                                <p className="card-text text-danger">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="card border-warning">
                              <div className="card-header bg-light">
                                <h5 className="card-title">Card Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-warning">Warning card title</h5>
                                <p className="card-text text-warning">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="card border-info">
                              <div className="card-header bg-light">
                                <h5 className="card-title">Card Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-info">Info card title</h5>
                                <p className="card-text text-info">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="card">
                              <div className="card-header bg-light">
                                <h5 className="card-title">Card Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title">Light card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-3">
                            <div className="card border-dark">
                              <div className="card-header bg-light">
                                <h5 className="card-title">Card Header</h5>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title text-dark">Dark card title</h5>
                                <p className="card-text text-dark">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                            </div>
                          </div>


                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">Card Groups</h5>
                      </div>
                      <div className="card-body pb-0 card-header-border">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="card-group">
                              <div className="card">
                                <img src="assets/img/media/img-10.jpg" className="card-img-top" alt="..." />
                                <div className="card-body">
                                  <h5 className="card-title">Card title</h5>
                                  <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                  <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                                </div>
                              </div>
                              <div className="card">
                                <img src="assets/img/media/img-10.jpg" className="card-img-top" alt="..." />
                                <div className="card-body">
                                  <h5 className="card-title">Card title</h5>
                                  <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                  <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                                </div>
                              </div>
                              <div className="card">
                                <img src="assets/img/media/img-10.jpg" className="card-img-top" alt="..." />
                                <div className="card-body">
                                  <h5 className="card-title">Card title</h5>
                                  <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                  <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h5 className="mb-3 mt-2">Card with Toolbar &amp; Footer</h5>
                <p className="mb-3">A workspace-style card that pairs the <span className="text-secondary">sw-toolbar</span> component (search, saved views, filters, columns, density and quick filters) in the <span className="text-secondary">card-header</span> with the <span className="text-secondary">sw-footer</span> pagination component. Wrap the body in <span className="text-secondary">data-workspace cls sw-loaded</span> so the toolbar and footer render. Reused as-is from the Classes page.</p>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="data-workspace classes-workspace is-loaded" data-density="default">

                        {/* Toolbar component */}
                        <div className="card-header border-bottom">
                          <div className="page-toolbar">

                            {/* Search */}
                            <div className="search-toolbar">
                              <i className="ti ti-search search-toolbar-icon"></i>
                              <input type="text" id="uicSearch" placeholder="Search class, code, teacher or room&#8230;" aria-label="Search classes" />
                              <span className="search-toolbar-kbd">&#8984;K</span>
                            </div>

                            {/* Saved Views */}
                            <div className="dropdown">
                              <button type="button" className="workspace-button dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="ti ti-bookmark"></i>Saved Views
                              </button>
                              <ul className="dropdown-menu">
                                <li className="context-menu-head">My Views</li>
                                <li><a className="dropdown-item" href="javascript:void(0);"><i className="ti ti-layout-list"></i>All Classes</a></li>
                                <li><a className="dropdown-item" href="javascript:void(0);"><i className="ti ti-circle-check"></i>Active Classes</a></li>
                                <li><a className="dropdown-item" href="javascript:void(0);"><i className="ti ti-sparkles"></i>New This Year</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item text-primary" href="javascript:void(0);"><i className="ti ti-plus"></i>Save current view</a></li>
                              </ul>
                            </div>

                            {/* Filters */}
                            <div className="dropdown">
                              <button type="button" className="workspace-button dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                <i className="ti ti-adjustments-horizontal"></i>Filters
                              </button>
                              <div className="dropdown-menu p-3 filter-menu">
                                <div className="row g-3">
                                  <div className="col-6">
                                    <label className="form-label mb-1" htmlFor="category">Category</label>
                                    <select className="form-select" id="category">
                                      <option value="">All</option><option>Primary</option><option>Middle</option><option>Secondary</option>
                                    </select>
                                  </div>
                                  <div className="col-6">
                                    <label className="form-label mb-1" htmlFor="section">Section</label>
                                    <select className="form-select" id="section">
                                      <option value="">All</option><option>A</option><option>B</option><option>C</option>
                                    </select>
                                  </div>
                                  <div className="col-6">
                                    <label className="form-label mb-1" htmlFor="status">Status</label>
                                    <select className="form-select" id="status">
                                      <option value="">All</option><option>Active</option><option>Inactive</option><option>New</option>
                                    </select>
                                  </div>
                                  <div className="col-6">
                                    <label className="form-label mb-1" htmlFor="academic-year">Academic Year</label>
                                    <select className="form-select" id="academic-year">
                                      <option value="">All</option><option>2024/2025</option><option>2023/2024</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top">
                                  <button type="button" className="btn btn-light btn-sm">Reset</button>
                                  <button type="button" className="btn btn-primary btn-sm">Apply</button>
                                </div>
                              </div>
                            </div>

                            {/* Columns */}
                            <div className="dropdown">
                              <button type="button" className="workspace-button dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                <i className="ti ti-columns-3"></i>Columns
                              </button>
                              <ul className="dropdown-menu p-2 column-menu">
                                <li className="context-menu-head">Toggle columns</li>
                                <li><label className="dropdown-item"><input className="form-check-input me-2 mt-0" type="checkbox" checked />Class</label></li>
                                <li><label className="dropdown-item"><input className="form-check-input me-2 mt-0" type="checkbox" checked />Status</label></li>
                                <li><label className="dropdown-item"><input className="form-check-input me-2 mt-0" type="checkbox" checked />Category</label></li>
                                <li><label className="dropdown-item"><input className="form-check-input me-2 mt-0" type="checkbox" checked />Class Teacher</label></li>
                              </ul>
                            </div>

                            <span className="flex-grow-1"></span>

                            {/* Density */}
                            <div className="density-toggle" role="group" aria-label="Row density">
                              <button type="button" data-bs-toggle="tooltip" title="Compact" aria-label="Compact rows"><i className="ti ti-baseline-density-small"></i></button>
                              <button type="button" className="active" data-bs-toggle="tooltip" title="Default" aria-label="Default rows"><i className="ti ti-baseline-density-medium"></i></button>
                              <button type="button" data-bs-toggle="tooltip" title="Comfortable" aria-label="Comfortable rows"><i className="ti ti-baseline-density-large"></i></button>
                            </div>

                            {/* Refresh */}
                            <button type="button" className="workspace-button workspace-button-icon" data-bs-toggle="tooltip" title="Refresh" aria-label="Refresh"><i className="ti ti-refresh"></i></button>

                            {/* Fullscreen */}
                            <button type="button" className="workspace-button workspace-button-icon" data-bs-toggle="tooltip" title="Fullscreen" aria-label="Toggle fullscreen"><i className="ti ti-arrows-maximize"></i></button>
                          </div>

                          {/* Quick filters */}
                          <div className="quick-filters">
                            <span className="text-muted fs-12 fw-semibold me-1">Quick:</span>
                            <button type="button" className="quick-filter"><i className="ti ti-circle-check"></i>Active <span className="quick-filter-count">4</span></button>
                            <button type="button" className="quick-filter"><i className="ti ti-sparkles"></i>New <span className="quick-filter-count">1</span></button>
                            <button type="button" className="quick-filter"><i className="ti ti-circle-x"></i>Inactive <span className="quick-filter-count">1</span></button>
                            <div className="dropdown ms-auto">
                              <button type="button" className="workspace-button dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="ti ti-sort-ascending-2"></i>Sort
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li className="context-menu-head">Sort by</li>
                                <li><button type="button" className="dropdown-item"><i className="ti ti-abc"></i>Class name (A&#8211;Z)</button></li>
                                <li><button type="button" className="dropdown-item"><i className="ti ti-users"></i>Student strength</button></li>
                                <li><button type="button" className="dropdown-item active"><i className="ti ti-clock"></i>Recently updated</button></li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Table */}
                        <div className="data-table">
                          <table className="table">
                            <caption className="visually-hidden">Sample class list demonstrating the workspace toolbar and footer components</caption>
                            <thead>
                              <tr>
                                <th className="dt-pin card-select"><input type="checkbox" className="dt-check" aria-label="Select all classes" /></th>
                                <th>Class</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Class Teacher</th>
                                <th>Students</th>
                                <th className="text-end card-actions-row">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="dt-row">
                                <td className="dt-pin"><input type="checkbox" className="dt-check" aria-label="Select Class I - Section A" /></td>
                                <td>
                                  <div className="dt-user">
                                    <span className="record-icon-tile accent-primary">I</span>
                                    <div>
                                      <a href="javascript:void(0);" className="dt-name">Class I &#183; Section A</a>
                                      <div className="dt-sub"><span className="link-primary">CLS-2024-001</span><span className="dt-dot">&#8226;</span><span>Room 204</span></div>
                                    </div>
                                  </div>
                                </td>
                                <td><span className="dt-pill s-active"><span className="dt-pill-dot"></span>Active</span></td>
                                <td>Primary</td>
                                <td>
                                  <div className="dt-user">
                                    <a href="teachers.html" className="dt-avatar"><img src="assets/img/teachers/teacher-01.jpg" alt="Ms. Teresa Susan" /></a>
                                    <div><a href="teachers.html" className="dt-name">Ms. Teresa Susan</a><div className="dt-sub"><span>Mathematics</span></div></div>
                                  </div>
                                </td>
                                <td>30</td>
                                <td>
                                  <div className="dt-actions">
                                    <a href="javascript:void(0);" className="dt-ib" title="View Class" aria-label="View"><i className="ti ti-eye"></i></a>
                                    <a href="javascript:void(0);" className="dt-ib" title="Edit" aria-label="Edit"><i className="ti ti-edit"></i></a>
                                    <a href="students.html" className="dt-ib success" title="Students" aria-label="Students"><i className="ti ti-users"></i></a>
                                  </div>
                                </td>
                              </tr>
                              <tr className="dt-row">
                                <td className="dt-pin"><input type="checkbox" className="dt-check" aria-label="Select Class II - Section B" /></td>
                                <td>
                                  <div className="dt-user">
                                    <span className="record-icon-tile accent-success">II</span>
                                    <div>
                                      <a href="javascript:void(0);" className="dt-name">Class II &#183; Section B</a>
                                      <div className="dt-sub"><span className="link-primary">CLS-2024-002</span><span className="dt-dot">&#8226;</span><span>Room 108</span></div>
                                    </div>
                                  </div>
                                </td>
                                <td><span className="dt-pill s-active"><span className="dt-pill-dot"></span>Active</span></td>
                                <td>Primary</td>
                                <td>
                                  <div className="dt-user">
                                    <a href="teachers.html" className="dt-avatar"><img src="assets/img/teachers/teacher-02.jpg" alt="Mr. John Doe" /></a>
                                    <div><a href="teachers.html" className="dt-name">Mr. John Doe</a><div className="dt-sub"><span>Science</span></div></div>
                                  </div>
                                </td>
                                <td>28</td>
                                <td>
                                  <div className="dt-actions">
                                    <a href="javascript:void(0);" className="dt-ib" title="View Class" aria-label="View"><i className="ti ti-eye"></i></a>
                                    <a href="javascript:void(0);" className="dt-ib" title="Edit" aria-label="Edit"><i className="ti ti-edit"></i></a>
                                    <a href="students.html" className="dt-ib success" title="Students" aria-label="Students"><i className="ti ti-users"></i></a>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Footer component */}
                        <div className="workspace-footer">
                          <div className="workspace-footer-info">
                            Showing <span className="range-from">1</span>&#8211;<span className="range-to">2</span>
                            of <span className="range-total">42</span> classes
                          </div>
                          <div className="workspace-footer-size">
                            <label className="mb-0">Rows:</label>
                            <select className="form-select" aria-label="Rows per page">
                              <option value="10">10</option>
                              <option value="25">25</option>
                              <option value="50">50</option>
                              <option value="100">100</option>
                            </select>
                          </div>
                          <nav className="workspace-pagination" aria-label="Classes pagination">
                            <button type="button" className="workspace-page-button" aria-label="First page" disabled><i className="ti ti-chevrons-left"></i></button>
                            <button type="button" className="workspace-page-button" aria-label="Previous page" disabled><i className="ti ti-chevron-left"></i></button>
                            <span className="workspace-page-numbers">
                              <button type="button" className="workspace-page-button active" aria-current="page">1</button>
                              <button type="button" className="workspace-page-button">2</button>
                              <button type="button" className="workspace-page-button">3</button>
                              <span className="pagination-gap" aria-hidden="true">&#8230;</span>
                              <button type="button" className="workspace-page-button">7</button>
                            </span>
                            <button type="button" className="workspace-page-button" aria-label="Next page"><i className="ti ti-chevron-right"></i></button>
                            <button type="button" className="workspace-page-button" aria-label="Last page"><i className="ti ti-chevrons-right"></i></button>
                          </nav>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

            </div>
          </div>
    </div>
  );
};

export default Cards;
