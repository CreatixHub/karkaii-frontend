const Avatar = () => {
  return (
    <div>
      <div className="page-wrapper">
            <div className="content">
              <div className="page-header">
                <div className="page-title">
                  <h3>Avatars</h3>
                </div>
              </div>

              {/* start row */}
                      <div className="row">

                          <div className="col-xl-6">
                              <div className="card card-h-100">
                                  <div className="card-header">
                                      <h4 className="card-title fs-16 fw-medium">Avatars</h4>
                                  </div>
                                  <div className="card-body">
                      <div className="d-flex align flex-wrap gap-2">
                        <span className="avatar avatar-xl me-2 avatar-rounded">
                          <img src="assets/img/profiles/avatar-02.jpg" alt="img" />
                        </span>
                        <span className="avatar avatar-xl me-2 avatar-radius-0">
                          <img src="assets/img/profiles/avatar-02.jpg" alt="img" />
                        </span>
                        <span className="avatar avatar-xl me-2">
                          <img src="assets/img/profiles/avatar-02.jpg" alt="img" />
                        </span>
                        <span className="avatar avatar-xl bg-primary avatar-rounded">
                          <span className="avatar-initial">SR</span>
                        </span>
                        <span className="avatar avatar-xl bg-success avatar-radius-0">
                          <span className="avatar-initial">SR</span>
                        </span>
                        <span className="avatar avatar-xl bg-danger">
                          <span className="avatar-initial">SR</span>
                        </span>
                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Avatar Sizes</h5>
                                  </div>
                                  <div className="card-body d-flex align-items-center">
                                      <span className="avatar avatar-xs me-2">
                        <img src="assets/img/profiles/avatar-02.jpg" alt="avatar" />
                      </span>
                                      <span className="avatar avatar-sm me-2">
                        <img src="assets/img/profiles/avatar-02.jpg" alt="avatar" />
                      </span>
                                      <span className="avatar avatar-md me-2">
                        <img src="assets/img/profiles/avatar-02.jpg" alt="avatar" />
                      </span>
                                      <span className="avatar avatar-lg me-2 flex-shrink-0">
                        <img src="assets/img/profiles/avatar-02.jpg" alt="avatar" />
                      </span>
                                      <span className="avatar avatar-xl me-2">
                        <img src="assets/img/profiles/avatar-02.jpg" alt="avatar" />
                      </span>
                                      <span className="avatar avatar-xxl me-2">
                        <img src="assets/img/profiles/avatar-02.jpg" alt="avatar" />
                      </span>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                      </div>
              {/* end row */}

              {/* start row */}
              <div className="row">

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Avatar with Status</h5>
                                  </div>
                                  <div className="card-body d-flex align-items-center">
                                      <span className="avatar avatar-xs me-2 online avatar-rounded">
                        <img src="assets/img/profiles/avatar-03.jpg" alt="avatar" />
                      </span>
                                      <span className="avatar avatar-sm online me-2 avatar-rounded">
                        <img src="assets/img/profiles/avatar-03.jpg" alt="avatar" />
                      </span>
                                      <span className="avatar avatar-md me-2 online avatar-rounded">
                        <img src="assets/img/profiles/avatar-03.jpg" alt="avatar" />
                      </span>
                                      <span className="avatar avatar-lg me-2 flex-shrink-0 away avatar-rounded">
                        <img src="assets/img/profiles/avatar-03.jpg" alt="avatar" />
                      </span>
                                      <span className="avatar avatar-xl me-2 online avatar-rounded">
                        <img src="assets/img/profiles/avatar-03.jpg" alt="avatar" />
                      </span>
                                      <span className="avatar avatar-xxl me-2 offline avatar-rounded">
                        <img src="assets/img/profiles/avatar-03.jpg" alt="avatar" />
                      </span>

                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Avatar with Badge</h5>
                                  </div>
                                  <div className="card-body d-flex align-items-center">
                                      <span className="avatar avatar-xs me-2 avatar-rounded">
                        <img src="assets/img/profiles/avatar-02.jpg" alt="avatar" />
                        <span className="badge rounded-pill bg-primary avatar-notification">2</span>
                                      </span>
                                      <span className="avatar avatar-sm me-2 avatar-rounded">
                        <img src="assets/img/profiles/avatar-02.jpg" alt="avatar" />
                        <span className="badge rounded-pill bg-secondary avatar-notification">5</span>
                                      </span>
                                      <span className="avatar avatar-md me-2 avatar-rounded">
                        <img src="assets/img/profiles/avatar-02.jpg" alt="avatar" />
                        <span className="badge rounded-pill bg-warning avatar-notification">1</span>
                                      </span>
                                      <span className="avatar avatar-lg me-2 flex-shrink-0 avatar-rounded">
                        <img src="assets/img/profiles/avatar-02.jpg" alt="avatar" />
                        <span className="badge rounded-pill bg-info avatar-notification">7</span>
                                      </span>
                                      <span className="avatar avatar-xl me-2 avatar-rounded">
                        <img src="assets/img/profiles/avatar-02.jpg" alt="avatar" />
                        <span className="badge rounded-pill bg-success avatar-notification">3</span>
                                      </span>
                                      <span className="avatar avatar-xxl me-2 avatar-rounded">
                        <img src="assets/img/profiles/avatar-02.jpg" alt="avatar" />
                        <span className="badge rounded-pill bg-danger avatar-notification">9</span>
                                      </span>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Solid Background Color</h5>
                                  </div>
                                  <div className="card-body">
                                      <span className="avatar bg-primary avatar-rounded">
                        <span className="avatar-initial">JD</span>
                                      </span>
                                      <span className="avatar bg-secondary avatar-rounded">
                        <span className="avatar-initial">SR</span>
                                      </span>
                                      <span className="avatar bg-success avatar-rounded">
                        <span className="avatar-initial">BJ</span>
                                      </span>
                                      <span className="avatar bg-info avatar-rounded">
                        <span className="avatar-initial">AD</span>
                                      </span>
                                      <span className="avatar bg-warning avatar-rounded">
                        <span className="avatar-initial">CB</span>
                                      </span>
                                      <span className="avatar bg-danger avatar-rounded">
                        <span className="avatar-initial">KL</span>
                                      </span>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Soft Background Color</h5>
                                  </div>
                                  <div className="card-body">
                      <span className="avatar bg-primary-subtle rounded">
                        <span className="avatar-initial text-primary">JD</span>
                      </span>
                      <span className="avatar bg-secondary-subtle rounded">
                        <span className="avatar-initial text-secondary">SR</span>
                      </span>
                      <span className="avatar bg-success-subtle rounded">
                        <span className="avatar-initial text-success">BJ</span>
                      </span>
                      <span className="avatar bg-info-subtle rounded">
                        <span className="avatar-initial text-info">AD</span>
                      </span>
                      <span className="avatar bg-warning-subtle rounded">
                        <span className="avatar-initial text-warning">CB</span>
                      </span>
                      <span className="avatar bg-danger-subtle rounded">
                        <span className="avatar-initial text-danger">KL</span>
                      </span>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Avatar Group - Square</h5>
                                  </div>
                                  <div className="card-body">
                                      <div className="avatar-list-stacked avatar-group-lg mb-3">
                                          <span className="avatar">
                          <img className="border border-white" src="assets/img/profiles/avatar-04.jpg" alt="avatar" />
                        </span>
                                          <span className="avatar">
                          <img className="border border-white" src="assets/img/profiles/avatar-04.jpg" alt="avatar" />
                        </span>
                                          <span className="avatar">
                          <img className="border border-white" src="assets/img/profiles/avatar-04.jpg" alt="avatar" />
                        </span>
                                          <a className="avatar bg-primary" href="javascript:void(0);">
                          +8
                        </a>
                                      </div>
                                      <div className="avatar-list-stacked mb-3">
                                          <span className="avatar">
                          <img className="border border-white" src="assets/img/profiles/avatar-04.jpg" alt="avatar" />
                        </span>
                                          <span className="avatar">
                          <img className="border border-white" src="assets/img/profiles/avatar-04.jpg" alt="avatar" />
                        </span>
                                          <span className="avatar">
                          <img className="border border-white" src="assets/img/profiles/avatar-04.jpg" alt="avatar" />
                        </span>
                                          <a className="avatar bg-primary" href="javascript:void(0);">
                          +8
                        </a>
                                      </div>
                                      <div className="avatar-list-stacked avatar-group-sm">
                                          <span className="avatar">
                          <img className="border border-white" src="assets/img/profiles/avatar-04.jpg" alt="avatar" />
                        </span>
                                          <span className="avatar">
                          <img className="border border-white" src="assets/img/profiles/avatar-04.jpg" alt="avatar" />
                        </span>
                                          <span className="avatar">
                          <img className="border border-white" src="assets/img/profiles/avatar-04.jpg" alt="avatar" />
                        </span>
                                          <a className="avatar bg-primary" href="javascript:void(0);">
                          +8
                        </a>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Avatar Group - Rounded</h5>
                                  </div>
                                  <div className="card-body">
                                      <div className="avatar-list-stacked avatar-group-lg mb-3">
                                          <span className="avatar avatar-rounded">
                          <img className="border border-white" src="assets/img/profiles/avatar-05.jpg" alt="avatar" />
                        </span>
                                          <span className="avatar avatar-rounded">
                          <img className="border border-white" src="assets/img/profiles/avatar-05.jpg" alt="avatar" />
                        </span>
                                          <span className="avatar avatar-rounded">
                          <img className="border border-white" src="assets/img/profiles/avatar-05.jpg" alt="avatar" />
                        </span>
                                          <a className="avatar bg-primary avatar-rounded" href="javascript:void(0);">
                          +8
                        </a>
                                      </div>
                                      <div className="avatar-list-stacked mb-3">
                                          <span className="avatar avatar-rounded">
                          <img className="border border-white" src="assets/img/profiles/avatar-05.jpg" alt="avatar" />
                        </span>
                                          <span className="avatar avatar-rounded">
                          <img className="border border-white" src="assets/img/profiles/avatar-05.jpg" alt="avatar" />
                        </span>
                                          <span className="avatar avatar-rounded">
                          <img className="border border-white" src="assets/img/profiles/avatar-05.jpg" alt="avatar" />
                        </span>
                                          <a className="avatar bg-primary avatar-rounded" href="javascript:void(0);">
                          +8
                        </a>
                                      </div>
                                      <div className="avatar-list-stacked avatar-group-sm">
                                          <span className="avatar avatar-rounded">
                          <img className="border border-white" src="assets/img/profiles/avatar-05.jpg" alt="avatar" />
                        </span>
                                          <span className="avatar avatar-rounded">
                          <img className="border border-white" src="assets/img/profiles/avatar-05.jpg" alt="avatar" />
                        </span>
                                          <span className="avatar avatar-rounded">
                          <img className="border border-white" src="assets/img/profiles/avatar-05.jpg" alt="avatar" />
                        </span>
                                          <a className="avatar bg-primary avatar-rounded" href="javascript:void(0);">
                          +8
                        </a>
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
                                      <p className="mb-3">Add <code>.online</code>, <code>.offline</code>, <code>.away</code> or <code>.busy</code> to place a status dot on the avatar. Add <code>.status-top</code> to move it to the upper corner.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3">
                                          <span className="avatar avatar-lg avatar-rounded online"><img src="assets/img/profiles/avatar-03.jpg" alt="Online" /></span>
                                          <span className="avatar avatar-lg avatar-rounded offline"><img src="assets/img/profiles/avatar-03.jpg" alt="Offline" /></span>
                                          <span className="avatar avatar-lg avatar-rounded away"><img src="assets/img/profiles/avatar-03.jpg" alt="Away" /></span>
                                          <span className="avatar avatar-lg avatar-rounded busy"><img src="assets/img/profiles/avatar-03.jpg" alt="Busy" /></span>
                                          <span className="avatar avatar-lg avatar-rounded online status-top"><img src="assets/img/profiles/avatar-03.jpg" alt="Online, top" /></span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Initials</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">Drop the image and put initials inside the avatar with <code>.avatar-initial</code>. Colour it with any Bootstrap background utility.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3">
                                          <span className="avatar avatar-initial bg-primary">JD</span>
                                          <span className="avatar avatar-initial bg-success avatar-rounded">TS</span>
                                          <span className="avatar avatar-initial bg-warning avatar-lg">RO</span>
                                          <span className="avatar avatar-initial bg-danger avatar-xl avatar-rounded">AP</span>
                                          <span className="avatar avatar-initial bg-soft-primary text-primary avatar-lg">NP</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Icon Avatars</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">Use <code>.avatar-icon</code> to centre an icon instead of an image or initials.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3">
                                          <span className="avatar avatar-icon bg-primary"><i className="ti ti-user"></i></span>
                                          <span className="avatar avatar-icon bg-success avatar-rounded"><i className="ti ti-check"></i></span>
                                          <span className="avatar avatar-icon bg-info avatar-lg"><i className="ti ti-school"></i></span>
                                          <span className="avatar avatar-icon bg-soft-danger text-danger avatar-lg avatar-rounded"><i className="ti ti-bell"></i></span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Bordered</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3"><code>.avatar-bordered</code> adds a white ring, which keeps avatars legible on photos and coloured panels.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3">
                                          <span className="avatar avatar-lg avatar-bordered"><img src="assets/img/profiles/avatar-03.jpg" alt="Bordered" /></span>
                                          <span className="avatar avatar-lg avatar-rounded avatar-bordered"><img src="assets/img/profiles/avatar-03.jpg" alt="Bordered rounded" /></span>
                                          <span className="avatar avatar-xl avatar-rounded avatar-bordered online"><img src="assets/img/profiles/avatar-03.jpg" alt="Bordered with status" /></span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Hover &amp; Overlay</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3"><code>.avatar-hover</code> lifts the avatar on hover. <code>.avatar-overlay</code> reveals its <code>.avatar-overlay-content</code> child.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3">
                                          <span className="avatar avatar-lg avatar-rounded avatar-hover"><img src="assets/img/profiles/avatar-03.jpg" alt="Hover" /></span>
                                          <a href="javascript:void(0);" className="avatar avatar-lg avatar-overlay"><img src="assets/img/profiles/avatar-03.jpg" alt="Overlay" /><span className="avatar-overlay-content"><i className="ti ti-eye"></i></span></a>
                                          <a href="javascript:void(0);" className="avatar avatar-xl avatar-rounded avatar-overlay"><img src="assets/img/profiles/avatar-03.jpg" alt="Overlay rounded" /><span className="avatar-overlay-content"><i className="ti ti-camera"></i></span></a>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Badge on Avatar</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">Pin any Bootstrap badge to a corner with <code>.avatar-badge</code>.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3">
                                          <span className="avatar avatar-lg avatar-rounded"><img src="assets/img/profiles/avatar-03.jpg" alt="With badge" /><span className="badge bg-danger rounded-pill avatar-badge">3</span></span>
                                          <span className="avatar avatar-lg"><img src="assets/img/profiles/avatar-03.jpg" alt="With badge" /><span className="badge bg-success rounded-pill avatar-badge"><i className="ti ti-check"></i></span></span>
                                          <span className="avatar avatar-xl avatar-rounded"><img src="assets/img/profiles/avatar-03.jpg" alt="With badge" /><span className="badge bg-primary rounded-pill avatar-badge">12</span></span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Stacked Group with Counter</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">Close a stacked group with <code>.avatar-count</code> instead of a hand-coloured link.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3">
                                          <div className="avatar-list-stacked">
                                              <span className="avatar avatar-rounded"><img className="border border-white" src="assets/img/profiles/avatar-03.jpg" alt="avatar" /></span>
                                              <span className="avatar avatar-rounded"><img className="border border-white" src="assets/img/profiles/avatar-03.jpg" alt="avatar" /></span>
                                              <span className="avatar avatar-rounded"><img className="border border-white" src="assets/img/profiles/avatar-03.jpg" alt="avatar" /></span>
                                              <span className="avatar avatar-rounded avatar-count">+8</span>
                                          </div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-12">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Icon Tiles</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">The avatar of a subject, channel, event or metric rather than a person. <code>.avatar-icon</code> softens the corners and scales the glyph with the tile, so the dashboards no longer need an icon-wrapper class each.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3 mb-4">
                                          <span className="avatar avatar-icon avatar-sm bg-primary-transparent"><i className="ti ti-book"></i></span>
                                          <span className="avatar avatar-icon avatar-md bg-success-transparent"><i className="ti ti-user-check"></i></span>
                                          <span className="avatar avatar-icon bg-warning-transparent"><i className="ti ti-currency-dollar"></i></span>
                                          <span className="avatar avatar-icon avatar-lg bg-danger-transparent"><i className="ti ti-alert-triangle"></i></span>
                                          <span className="avatar avatar-icon avatar-xl bg-purple-transparent"><i className="ti ti-file-certificate"></i></span>
                                      </div>

                                      <p className="mb-3">Any background utility works, and <code>.avatar-rounded</code> turns a tile into a disc.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3 mb-4">
                                          <span className="avatar avatar-icon bg-primary"><i className="ti ti-school"></i></span>
                                          <span className="avatar avatar-icon bg-success avatar-rounded"><i className="ti ti-checks"></i></span>
                                          <span className="avatar avatar-icon bg-teal"><i className="ti ti-phone"></i></span>
                                          <span className="avatar avatar-icon bg-pink avatar-rounded"><i className="ti ti-heart"></i></span>
                                          <span className="avatar avatar-icon bg-light text-muted"><i className="ti ti-dots"></i></span>
                                      </div>

                                      <p className="mb-3">For lists that recolour row by row, set <code>--avatar-accent</code> and <code>--avatar-accent-soft</code> on an ancestor and let the tile follow with <code>.avatar-accent</code> or <code>.avatar-accent-soft</code> — no class per colour.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3">
                                          <span className="avatar avatar-icon avatar-md avatar-accent-soft accent-primary"><i className="ti ti-calendar-event"></i></span>
                                          <span className="avatar avatar-icon avatar-md avatar-accent-soft accent-success"><i className="ti ti-cash"></i></span>
                                          <span className="avatar avatar-icon avatar-md avatar-accent-soft accent-warning"><i className="ti ti-clock"></i></span>
                                          <span className="avatar avatar-icon avatar-md avatar-accent accent-danger"><i className="ti ti-flame"></i></span>
                                          <span className="avatar avatar-icon avatar-md avatar-accent accent-secondary"><i className="ti ti-plane"></i></span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-12">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Exact Sizes, Radii &amp; Glyphs</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">Dashboard tiles are drawn to their own dimensions rather than the named scale. <code>.avatar-26</code> … <code>.avatar-58</code> set the tile, <code>.avatar-r-8</code> … <code>.avatar-r-16</code> the corner, and <code>.avatar-glyph-14</code> … <code>.avatar-glyph-24</code> the icon inside it — so a page can match a spec to the pixel without a wrapper class of its own.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3 mb-4">
                                          <span className="avatar avatar-icon avatar-26 avatar-r-8 avatar-glyph-15 avatar-accent-soft accent-primary"><i className="ti ti-sparkles"></i></span>
                                          <span className="avatar avatar-icon avatar-28 avatar-r-8 avatar-glyph-14 avatar-accent-soft accent-success"><i className="ti ti-bus"></i></span>
                                          <span className="avatar avatar-icon avatar-32 avatar-r-9 avatar-glyph-15 avatar-accent-soft accent-warning"><i className="ti ti-bell"></i></span>
                                          <span className="avatar avatar-icon avatar-34 avatar-glyph-17 avatar-accent-soft accent-danger"><i className="ti ti-math-symbols"></i></span>
                                          <span className="avatar avatar-icon avatar-38 avatar-r-11 avatar-glyph-17 avatar-accent-soft accent-purple"><i className="ti ti-school"></i></span>
                                          <span className="avatar avatar-icon avatar-48 avatar-r-12 avatar-glyph-24 avatar-accent-soft accent-teal"><i className="ti ti-cash"></i></span>
                                      </div>

                                      <p className="mb-3">The glyph size is declared on the tile rather than the icon, so it never becomes a font-size utility fighting the component. Swap <code>.avatar-accent-soft</code> for <code>.avatar-accent</code> to fill the tile solid.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3">
                                          <span className="avatar avatar-icon avatar-32 avatar-r-9 avatar-glyph-16 avatar-accent accent-primary"><i className="ti ti-calendar-check"></i></span>
                                          <span className="avatar avatar-icon avatar-32 avatar-r-9 avatar-glyph-16 avatar-accent accent-success"><i className="ti ti-circle-check"></i></span>
                                          <span className="avatar avatar-icon avatar-32 avatar-r-9 avatar-glyph-16 avatar-accent accent-warning"><i className="ti ti-clock"></i></span>
                                          <span className="avatar avatar-icon avatar-32 avatar-r-9 avatar-glyph-16 avatar-accent accent-danger"><i className="ti ti-urgent"></i></span>
                                          <span className="avatar avatar-icon avatar-32 avatar-r-9 avatar-glyph-16 avatar-accent accent-info"><i className="ti ti-speakerphone"></i></span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-12">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">AI Orb</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3"><code>.avatar-ai</code> marks machine-generated content — a summary, a prediction, an assistant reply. One violet-to-primary gradient across the whole template, so every AI surface is recognisable at a glance. Unlike the accent tiles it does not follow its surroundings: the gradient is the signal.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3">
                                          <span className="avatar avatar-icon avatar-26 avatar-r-8 avatar-glyph-15 avatar-ai"><i className="ti ti-sparkles"></i></span>
                                          <span className="avatar avatar-icon avatar-34 avatar-r-11 avatar-glyph-18 avatar-ai"><i className="ti ti-robot"></i></span>
                                          <span className="avatar avatar-icon avatar-md avatar-ai"><i className="ti ti-wand"></i></span>
                                          <span className="avatar avatar-icon avatar-lg avatar-rounded avatar-ai"><i className="ti ti-brain"></i></span>
                                          <span className="avatar avatar-icon avatar-xl avatar-ai"><i className="ti ti-message-chatbot"></i></span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-12">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Medal Tiles</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">The award finish of the icon tile. <code>.avatar-medal</code> lights the accent fill with a diagonal sheen and drops it onto a glow of its own colour, for achievement, badge and certificate galleries where the tile is the trophy rather than a label.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3 mb-4">
                                          <span className="avatar avatar-icon avatar-48 avatar-rounded avatar-glyph-24 avatar-medal accent-warning"><i className="ti ti-medal"></i></span>
                                          <span className="avatar avatar-icon avatar-48 avatar-rounded avatar-glyph-24 avatar-medal accent-success"><i className="ti ti-run"></i></span>
                                          <span className="avatar avatar-icon avatar-48 avatar-rounded avatar-glyph-24 avatar-medal accent-purple"><i className="ti ti-microphone-2"></i></span>
                                          <span className="avatar avatar-icon avatar-48 avatar-rounded avatar-glyph-24 avatar-medal accent-info"><i className="ti ti-book"></i></span>
                                          <span className="avatar avatar-icon avatar-48 avatar-rounded avatar-glyph-24 avatar-medal accent-primary"><i className="ti ti-calendar-check"></i></span>
                                          <span className="avatar avatar-icon avatar-48 avatar-rounded avatar-glyph-24 avatar-medal accent-pink"><i className="ti ti-star"></i></span>
                                      </div>

                                      <p className="mb-3">The colour comes from the accent pair on the tile or any ancestor, so a gallery recolours row by row without a class per medal. Every size in the scale works, and dropping <code>.avatar-rounded</code> keeps the softened square.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-3">
                                          <span className="avatar avatar-icon avatar-sm avatar-rounded avatar-medal accent-teal"><i className="ti ti-trophy"></i></span>
                                          <span className="avatar avatar-icon avatar-md avatar-rounded avatar-medal accent-danger"><i className="ti ti-flame"></i></span>
                                          <span className="avatar avatar-icon avatar-lg avatar-rounded avatar-medal accent-primary"><i className="ti ti-award"></i></span>
                                          <span className="avatar avatar-icon avatar-xl avatar-rounded avatar-medal accent-purple"><i className="ti ti-crown"></i></span>
                                          <span className="avatar avatar-icon avatar-lg avatar-medal accent-success"><i className="ti ti-certificate"></i></span>
                                          <span className="avatar avatar-icon avatar-xl avatar-medal accent-warning"><i className="ti ti-file-certificate"></i></span>
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

export default Avatar;
