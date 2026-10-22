const UiRating = () => (
  <>
<div className="page-wrapper cardhead">
			<div className="content">

				{/* Page Header */}
				<div className="page-header">
					<div className="row">
						<div className="col-sm-12">
							<h3 className="page-title">Rating</h3>
						</div>
					</div>
				</div>
				{/* /Page Header */}

				{/* start row */}
                <div className="row">

                    <div className="col-xxl-4 col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    Basic Rater
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-wrap align-items-center justify-content-between">
                                    <p className="fs-14 mb-0 fw-semibold">Show Some <span className="text-danger">&#10084;</span> with rating :</p>
                                    <div id="rater-basic"></div>
                                </div>
                            </div> {/* end card body */}
                        </div> {/* end card */}
                    </div> {/* end col */}

                    <div className="col-xxl-4 col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    5 star rater with steps
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-wrap align-items-center justify-content-between">
                                    <p className="fs-14 mb-0 fw-semibold">Dont forget to rate the product :</p>
                                    <div id="rater-steps"></div>
                                </div>
                            </div> {/* end card body */}
                        </div> {/* end card */}
                    </div> {/* end col */}

                    <div className="col-xxl-4 col-xl-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    Custom Messages
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-wrap align-items-center justify-content-between">
                                    <p className="fs-14 mb-0 fw-semibold">Your rating is much appreciated&#128079; :</p>
                                    <div id="custom-messages"></div>
                                </div>
                            </div> {/* end card body */}
                        </div> {/* end card */}
                    </div> {/* end col */}

                    <div className="col-xxl-6 col-xl-6 d-flex">
                        <div className="card flex-fill">
                            <div className="card-header">
                                <div className="card-title">
                                    Unlimited number of stars readOnly
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-wrap align-items-center justify-content-between">
                                    <p className="fs-14 mb-0 fw-semibold">Thanks for rating :</p>
                                    <div id="stars-unlimited"></div>
                                </div>
                            </div> {/* end card body */}
                        </div> {/* end card */}
                    </div> {/* end col */}

                    <div className="col-xxl-6 col-xl-6 d-flex">
                        <div className="card flex-fill">
                            <div className="card-header">
                                <div className="card-title">
                                    5 Star rater with custom isBusyText and simulated backend
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-wrap align-items-center justify-content-between">
                                    <p className="fs-14 mb-0 fw-semibold">Thanks for rating :</p>
                                    <div id="stars-busytext"></div>
                                </div>
                            </div> {/* end card body */}
                        </div> {/* end card */}
                    </div> {/* end col */}

                    <div className="col-xxl-4 col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    On hover event
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-wrap align-items-center justify-content-between">
                                    <p className="fs-14 mb-0 fw-semibold">Please give your valuable rating :</p>
                                    <div className="d-flex flex-wrap align-items-center">
                                        <div id="stars-hover"></div>
                                        <span className="live-rating badge bg-success ms-3">
											1
										</span>
                                    </div>
                                </div>
                            </div> {/* end card body */}
                        </div> {/* end card */}
                    </div> {/* end col */}

                    <div className="col-xxl-4 col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    Clear/reset rater
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-wrap align-items-center justify-content-between">
                                    <p className="fs-14 mb-0 fw-semibold">Thank You so much for your support :</p>
                                    <div className="d-flex flex-wrap align-items-center">
                                        <div id="rater-reset"></div>
                                        <button type="button" className="btn btn-icon btn-sm btn-soft-danger ms-3" id="rater-reset-button">
                                            <i className="ti ti-rotate"></i>
                                        </button>
                                    </div>
                                </div>
                            </div> {/* end card body */}
                        </div> {/* end card */}
                    </div> {/* end col */}

                </div>
                {/* end row */}

			</div>
		</div>
  </>
);

export default UiRating;
