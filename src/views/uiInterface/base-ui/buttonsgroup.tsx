const ButtonsGroup = () => {
  return (
    <div>
      <div className="page-wrapper">
            <div className="content">
              <div className="page-header">
                <div className="page-title">
                  <h3>Buttons Group</h3>
                </div>
              </div>

              {/* start row */}
                      <div className="row">

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h4 className="card-title fs-16 fw-medium">Custom Button Group</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-2 fs-13 text-muted">Plain buttons</p>
                                      <div className="custom-btn-group mb-3" role="group" aria-label="Date range">
                                          <button type="button" className="btn active">Day</button>
                                          <button type="button" className="btn">Week</button>
                                          <button type="button" className="btn">Month</button>
                                          <button type="button" className="btn">Year</button>
                                      </div>

                                      <p className="mb-2 fs-13 text-muted">Radio group</p>
                                      <div className="custom-btn-group mb-3" role="group" aria-label="View mode">
                                          <input type="radio" className="btn-check" name="cbg_view" id="cbg_grid" checked />
                                          <label className="btn" htmlFor="cbg_grid"><i className="ti ti-layout-grid"></i>Grid</label>
                                          <input type="radio" className="btn-check" name="cbg_view" id="cbg_list" />
                                          <label className="btn" htmlFor="cbg_list"><i className="ti ti-list-details"></i>List</label>
                                          <input type="radio" className="btn-check" name="cbg_view" id="cbg_board" />
                                          <label className="btn" htmlFor="cbg_board"><i className="ti ti-columns-3"></i>Board</label>
                                      </div>

                                      <p className="mb-2 fs-13 text-muted">Full width</p>
                                      <div className="custom-btn-group custom-btn-group-fill" role="group" aria-label="Status filter">
                                          <button type="button" className="btn active">All</button>
                                          <button type="button" className="btn">Active</button>
                                          <button type="button" className="btn">Pending</button>
                                          <button type="button" className="btn disabled">Archived</button>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Custom Button Group Sizes</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-2 fs-13 text-muted">Small</p>
                                      <div className="custom-btn-group custom-btn-group-sm mb-3" role="group" aria-label="Small group">
                                          <button type="button" className="btn active">Day</button>
                                          <button type="button" className="btn">Week</button>
                                          <button type="button" className="btn">Month</button>
                                      </div>

                                      <p className="mb-2 fs-13 text-muted">Default</p>
                                      <div className="custom-btn-group mb-3" role="group" aria-label="Default group">
                                          <button type="button" className="btn active">Day</button>
                                          <button type="button" className="btn">Week</button>
                                          <button type="button" className="btn">Month</button>
                                      </div>

                                      <p className="mb-2 fs-13 text-muted">Large</p>
                                      <div className="custom-btn-group custom-btn-group-lg mb-3" role="group" aria-label="Large group">
                                          <button type="button" className="btn active">Day</button>
                                          <button type="button" className="btn">Week</button>
                                          <button type="button" className="btn">Month</button>
                                      </div>

                                      <p className="mb-2 fs-13 text-muted">Icon only &amp; toggle</p>
                                      <div className="d-flex align-items-center flex-wrap gap-2">
                                          <div className="custom-btn-group" role="group" aria-label="Text align">
                                              <button type="button" className="btn btn-icon active" title="Align left" aria-label="Align left"><i className="ti ti-align-left"></i></button>
                                              <button type="button" className="btn btn-icon" title="Align center" aria-label="Align center"><i className="ti ti-align-center"></i></button>
                                              <button type="button" className="btn btn-icon" title="Align right" aria-label="Align right"><i className="ti ti-align-right"></i></button>
                                          </div>
                                          <div className="custom-btn-group custom-btn-group-sm" role="group" aria-label="Zoom">
                                              <button type="button" className="btn btn-icon" title="Zoom out" aria-label="Zoom out"><i className="ti ti-minus"></i></button>
                                              <button type="button" className="btn btn-icon" title="Zoom in" aria-label="Zoom in"><i className="ti ti-plus"></i></button>
                                          </div>
                                          <div className="custom-btn-group off-item" role="group" aria-label="Notifications">
                                              <button type="button" className="btn" aria-pressed="true">On</button>
                                              <button type="button" className="btn" aria-pressed="false">Off</button>
                                          </div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Basic Button Group</h5>
                                  </div>
                                  <div className="card-body">
                      <div className="btn-group" role="group" aria-label="Basic example">
                        <button className="btn btn-primary" type="button">Left</button>
                        <button className="btn btn-primary" type="button">Middle</button>
                        <button className="btn btn-primary" type="button">Right</button>
                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Outline button group</h5>
                                  </div>
                                  <div className="card-body">
                      <div className="btn-group" role="group" aria-label="Basic example">
                        <button className="btn btn-outline-primary" type="button">Left</button>
                        <button className="btn btn-outline-primary" type="button">Middle</button>
                        <button className="btn btn-outline-primary" type="button">Right</button>
                      </div>
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
                                      <h5 className="card-title">Mixed Styles</h5>
                                  </div>
                                  <div className="card-body">
                                      <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                          <button type="button" className="btn btn-danger">Left</button>
                                          <button type="button" className="btn btn-warning">Middle</button>
                                          <button type="button" className="btn btn-success">Right</button>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Nesting</h5>
                                  </div>
                                  <div className="card-body">
                                      <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
                                          <button type="button" className="btn btn-primary">1</button>
                                          <button type="button" className="btn btn-primary">2</button>
                                          <div className="btn-group" role="group">
                                              <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                  Dropdown
                                              </button>
                                              <ul className="dropdown-menu">
                                                  <li><a className="dropdown-item" href="#">Dropdown link</a></li>
                                                  <li><a className="dropdown-item" href="#">Dropdown link</a></li>
                                              </ul>
                                          </div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Checkbox Button Groups</h5>
                                  </div>
                                  <div className="card-body">
                                      <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                                          <input type="checkbox" className="btn-check" id="btncheck1" checked />
                                          <label className="btn btn-outline-primary" htmlFor="btncheck1">Checkbox 1</label>
                                          <input type="checkbox" className="btn-check" id="btncheck2" />
                                          <label className="btn btn-outline-primary" htmlFor="btncheck2">Checkbox 2</label>
                                          <input type="checkbox" className="btn-check" id="btncheck3" />
                                          <label className="btn btn-outline-primary" htmlFor="btncheck3">Checkbox 3</label>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Radio Button Groups</h5>
                                  </div>
                                  <div className="card-body radio-button-group">
                                      <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                          <input type="radio" className="btn-check" name="btnradio" id="btnradio1" checked />
                                          <label className="btn btn-outline-primary" htmlFor="btnradio1">Radio 1</label>

                                          <input type="radio" className="btn-check" name="btnradio" id="btnradio2" />
                                          <label className="btn btn-outline-primary" htmlFor="btnradio2">Radio 2</label>

                                          <input type="radio" className="btn-check" name="btnradio" id="btnradio3" />
                                          <label className="btn btn-outline-primary" htmlFor="btnradio3">Radio 3</label>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                      </div>
              {/* end row */}

              {/* start row */}
                      <div className="row">

                          <div className="col-xl-12">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Sizing</h5>
                                  </div>
                                  <div className="card-body">
                                      <div className="btn-group btn-group-lg mb-3" role="group" aria-label="Large button group">
                                          <button type="button" className="btn btn-primary">Left</button>
                                          <button type="button" className="btn btn-primary">Middle</button>
                                          <button type="button" className="btn btn-primary">Right</button>
                                      </div>
                                      <br />
                                      <div className="btn-group mb-3" role="group" aria-label="Default button group">
                                          <button type="button" className="btn btn-secondary">Left</button>
                                          <button type="button" className="btn btn-secondary">Middle</button>
                                          <button type="button" className="btn btn-secondary">Right</button>
                                      </div>
                                      <br />
                                      <div className="btn-group btn-group-sm" role="group" aria-label="Small button group">
                                          <button type="button" className="btn btn-light">Left</button>
                                          <button type="button" className="btn btn-light">Middle</button>
                                          <button type="button" className="btn btn-light">Right</button>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Button Toolbar</h5>
                                  </div>
                                  <div className="card-body">
                                      <div className="btn-toolbar mb-3" role="toolbar" aria-label="Toolbar with button groups">
                                          <div className="btn-group me-2 my-1" role="group" aria-label="First group">
                                              <button type="button" className="btn btn-primary">1</button>
                                              <button type="button" className="btn btn-primary">2</button>
                                              <button type="button" className="btn btn-primary">3</button>
                                              <button type="button" className="btn btn-primary">4</button>
                                          </div>
                                          <div className="btn-group me-2 my-1" role="group" aria-label="Second group">
                                              <button type="button" className="btn btn-secondary">5</button>
                                              <button type="button" className="btn btn-secondary">6</button>
                                              <button type="button" className="btn btn-secondary">7</button>
                                          </div>
                                          <div className="btn-group my-1" role="group" aria-label="Third group">
                                              <button type="button" className="btn btn-info">8</button>
                                          </div>
                                      </div>
                                      <div className="btn-toolbar mb-3" role="toolbar" aria-label="Toolbar with button groups">
                                          <div className="btn-group me-2 my-1" role="group" aria-label="First group">
                                              <button type="button" className="btn btn-outline-secondary">1</button>
                                              <button type="button" className="btn btn-outline-secondary">2</button>
                                              <button type="button" className="btn btn-outline-secondary">3</button>
                                              <button type="button" className="btn btn-outline-secondary">4</button>
                                          </div>
                                          <div className="input-group my-1">
                                              <div className="input-group-text" id="btnGroupAddon">@</div>
                                              <input type="text" className="form-control" placeholder="Input group example" aria-label="Input group example" aria-describedby="btnGroupAddon" />
                                          </div>
                                      </div>
                                      <div className="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                                          <div className="btn-group my-1" role="group" aria-label="First group">
                                              <button type="button" className="btn btn-outline-secondary">1</button>
                                              <button type="button" className="btn btn-outline-secondary">2</button>
                                              <button type="button" className="btn btn-outline-secondary">3</button>
                                              <button type="button" className="btn btn-outline-secondary">4</button>
                                          </div>
                                          <div className="input-group my-1">
                                              <div className="input-group-text" id="btnGroupAddon2">@</div>
                                              <input type="text" className="form-control" placeholder="Input group example" aria-label="Input group example" aria-describedby="btnGroupAddon2" />
                                          </div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card card-h-100">
                                  <div className="card-header">
                                      <h5 className="card-title">Vertical</h5>
                                  </div>
                                  <div className="card-body">
                                      <div className="row gap-2">
                                          <div className="col-sm-3">
                                              <div className="btn-group-vertical" role="group" aria-label="Vertical button group">
                                                  <button type="button" className="btn btn-primary">Button</button>
                                                  <div className="btn-group" role="group">
                                                      <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                          Dropdown
                                                      </button>
                                                      <ul className="dropdown-menu">
                                                          <li><a className="dropdown-item" href="#">Dropdown link</a></li>
                                                          <li><a className="dropdown-item" href="#">Dropdown link</a></li>
                                                      </ul>
                                                  </div>
                                                  <div className="btn-group dropstart" role="group">
                                                      <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                          Dropdown
                                                      </button>
                                                      <ul className="dropdown-menu">
                                                          <li><a className="dropdown-item" href="#">Dropdown link</a></li>
                                                          <li><a className="dropdown-item" href="#">Dropdown link</a></li>
                                                      </ul>
                                                  </div>
                                                  <div className="btn-group dropend" role="group">
                                                      <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                          Dropdown
                                                      </button>
                                                      <ul className="dropdown-menu">
                                                          <li><a className="dropdown-item" href="#">Dropdown link</a></li>
                                                          <li><a className="dropdown-item" href="#">Dropdown link</a></li>
                                                      </ul>
                                                  </div>
                                                  <div className="btn-group dropup" role="group">
                                                      <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                          Dropdown
                                                      </button>
                                                      <ul className="dropdown-menu">
                                                          <li><a className="dropdown-item" href="#">Dropdown link</a></li>
                                                          <li><a className="dropdown-item" href="#">Dropdown link</a></li>
                                                      </ul>
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="col-sm-3">
                                              <div className="btn-group-vertical" role="group" aria-label="Vertical button group">
                                                  <button type="button" className="btn btn-primary">Button</button>
                                                  <button type="button" className="btn btn-primary">Button</button>
                                                  <button type="button" className="btn btn-primary">Button</button>
                                                  <button type="button" className="btn btn-primary">Button</button>
                                              </div>
                                          </div>
                                          <div className="col-sm-3">
                                              <div className="btn-group-vertical" role="group" aria-label="Vertical radio toggle button group">
                                                  <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio1" checked />
                                                  <label className="btn btn-outline-primary" htmlFor="vbtn-radio1">Radio 1</label>
                                                  <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio2" />
                                                  <label className="btn btn-outline-primary" htmlFor="vbtn-radio2">Radio 2</label>
                                                  <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio3" />
                                                  <label className="btn btn-outline-primary" htmlFor="vbtn-radio3">Radio 3</label>
                                              </div>
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

export default ButtonsGroup;
