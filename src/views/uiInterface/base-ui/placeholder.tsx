const Placeholder = () => {
  return (
    <div>
      <div className="page-wrapper">
            <div className="content">
              <div className="page-header">
                <div className="page-title">
                  <h3>Placeholders</h3>
                </div>
              </div>

              {/* start row */}
                      <div className="row">

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h4 className="card-title fs-16 fw-medium">Placeholders</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">
                                          In the example below, we take a typical card component and recreate it with placeholders applied to create a “loading card”. Size and proportions are the same between the two.
                                      </p>

                                      {/* start row */}
                                      <div className="row">

                                          <div className="col-md-6">
                                              <div className="card border shadow-none mb-md-0">
                                                  <img src="assets/img/media/img-1.jpg" className="card-img-top" alt="..." />

                                                  <div className="card-body">
                                                      <h5 className="card-title">Card title</h5>
                                                      <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.
                                                      </p>
                                                      <a href="#" className="btn btn-primary">Go somewhere</a>
                                                  </div> {/* end card body */}
                                              </div> {/* end card */}
                                          </div> {/* end col */}

                                          <div className="col-md-6">
                                              <div className="card border shadow-none mb-0" aria-hidden="true">
                                                  <img src="assets/img/media/img-2.jpg" className="card-img-top" alt="..." />
                                                  <div className="card-body">
                                                      <p className="header-title placeholder-glow">
                                                          <span className="placeholder col-6"></span>
                                                      </p>
                                                      <p className="card-text placeholder-glow">
                                                          <span className="placeholder col-7"></span>
                                                          <span className="placeholder col-4"></span>
                                                          <span className="placeholder col-4"></span>
                                                          <span className="placeholder col-6"></span>
                                                          <span className="placeholder col-8"></span>
                                                      </p>
                                                      <a className="btn btn-primary disabled placeholder col-6" aria-disabled="true"> <span className="invisible">Read Only</span></a>
                                                  </div> {/* end card body */}
                                              </div> {/* end card */}
                                          </div> {/* end col */}

                                      </div>
                      {/* end row */}

                                  </div> {/* end card body */}
                              </div> {/* end card */}

                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Width</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">
                                          You can change the <code>width</code> through grid column classes, width utilities, or inline styles.
                                      </p>
                                      <span className="placeholder col-6"></span>
                                      <span className="placeholder w-75"></span>
                                      <span className="placeholder" style={{ width: '25%' }}></span>
                                      <span className="placeholder d-block" style={{ width: '10%' }}></span>

                                  </div> {/* end card body */}
                              </div> {/* end card */}

                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Sizing</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">
                                          The size of <code>.placeholder</code>s are based on the typographic style of the parent element. Customize them with sizing modifiers: <code>.placeholder-lg</code>, <code>.placeholder-sm</code>, or <code>.placeholder-xs</code>.
                                      </p>
                                      <span className="placeholder col-12 placeholder-lg"></span>
                                      <span className="placeholder col-12"></span>
                                      <span className="placeholder col-12 placeholder-sm"></span>
                                      <span className="placeholder col-12 placeholder-xs"></span>

                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Color</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">
                                          By default, the <code>placeholder</code> uses <code>currentColor</code>. This can be overriden with a custom color or utility class.
                                      </p>
                                      <span className="placeholder col-12"></span>
                                      <span className="placeholder col-12 bg-primary"></span>
                                      <span className="placeholder col-12 bg-secondary"></span>
                                      <span className="placeholder col-12 bg-success"></span>
                                      <span className="placeholder col-12 bg-danger"></span>
                                      <span className="placeholder col-12 bg-warning"></span>
                                      <span className="placeholder col-12 bg-info"></span>
                                      <span className="placeholder col-12 bg-light"></span>
                                      <span className="placeholder col-12 bg-dark"></span>

                                  </div> {/* end card body */}
                              </div> {/* end card */}

                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">How it works</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">
                                          Create placeholders with the <code>.placeholder</code> class and a grid column class (e.g., <code>.col-6</code>) to set the <code>width</code>. They can replace the text inside an element or as be added as a modifier
                                          class to an existing component.
                                      </p>
                                      <p aria-hidden="true">
                                          <span className="placeholder col-6"></span>
                                      </p>

                                      <a href="#" className="btn btn-primary disabled placeholder col-4" aria-hidden="true"></a>

                                  </div> {/* end card body */}
                              </div> {/* end card */}

                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Animation</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">
                                          Animate placehodlers with <code>.placeholder-glow</code> or <code>.placeholder-wave</code> to better convey the perception of something being <em>actively</em> loaded.
                                      </p>
                                      <p className="placeholder-glow">
                                          <span className="placeholder col-12"></span>
                                      </p>
                                      <p className="placeholder-wave mb-0">
                                          <span className="placeholder col-12"></span>
                                      </p>

                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                      </div>
                      {/* end row */}

                      {/* Skeleton loader — the template's single loading-placeholder
                           system. Compose any shape from `.skeleton` plus a modifier;
                           wrap in `.skeleton-loader` and add `.hidden` when the live
                           content is ready. */}
                      <div className="row">
                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Skeleton Loader &mdash; shapes</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">
                                          Add <code>.skeleton</code> for the shimmer surface and one shape modifier:
                                          <code>.skeleton-line</code>, <code>.skeleton-thin</code>, <code>.skeleton-avatar</code>,
                                          <code>.skeleton-circle</code>, <code>.skeleton-pill</code>, <code>.skeleton-btn</code>,
                                          <code>.skeleton-card</code>. Width and spacing come from Bootstrap utilities.
                                      </p>
                                      <div className="skeleton-loader">
                                          <div className="d-flex align-items-center gap-3 mb-3">
                                              <div className="skeleton skeleton-avatar"></div>
                                              <div className="skeleton-stack">
                                                  <div className="skeleton skeleton-line mb-2"></div>
                                                  <div className="skeleton skeleton-line w-50"></div>
                                              </div>
                                              <div className="skeleton skeleton-circle"></div>
                                          </div>
                                          <div className="skeleton skeleton-line mb-2"></div>
                                          <div className="skeleton skeleton-line w-75 mb-3"></div>
                                          <div className="d-flex gap-2">
                                              <div className="skeleton skeleton-pill"></div>
                                              <div className="skeleton skeleton-btn"></div>
                                          </div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Skeleton Loader &mdash; layouts</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">
                                          The same primitive covers cards, lists, tables and media rows &mdash; lay them out with
                                          the Bootstrap grid and flex utilities rather than a per-page skeleton.
                                      </p>
                                      <div className="skeleton-loader">
                                          <div className="row g-3 mb-3">
                                              <div className="col-6"><div className="skeleton skeleton-card"></div></div>
                                              <div className="col-6"><div className="skeleton skeleton-card"></div></div>
                                          </div>
                                          <div className="d-flex align-items-center gap-3 mb-2">
                                              <div className="skeleton skeleton-circle"></div>
                                              <div className="skeleton skeleton-line flex-fill"></div>
                                              <div className="skeleton skeleton-pill"></div>
                                          </div>
                                          <div className="d-flex align-items-center gap-3 mb-2">
                                              <div className="skeleton skeleton-circle"></div>
                                              <div className="skeleton skeleton-line flex-fill"></div>
                                              <div className="skeleton skeleton-pill"></div>
                                          </div>
                                          <div className="d-flex align-items-center gap-3">
                                              <div className="skeleton skeleton-circle"></div>
                                              <div className="skeleton skeleton-line flex-fill"></div>
                                              <div className="skeleton skeleton-pill"></div>
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

export default Placeholder;
