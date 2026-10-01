const FormElements = () => (
  <>
<div className="page-wrapper">
			<div className="content">
				<div className="page-header">
					<div className="page-title">
						<h3>Form Elements</h3>
					</div>
				</div>
				<div className="row">
					<div className="col-xl-12">
						<div className="card">
							<div className="card-header">
								<h4 className="card-title fs-16 fw-medium">Input Types</h4>
							</div>
							<div className="card-body">
								<div className="row gy-4">
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-label" className="form-label">Basic Input:</label>
										<input type="text" className="form-control" id="input" aria-label="Basic Input:" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-label" className="form-label">Form Input With Label</label>
										<input type="text" className="form-control" id="input-label" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-placeholder" className="form-label">Form Input With
											Placeholder</label>
										<input type="text" className="form-control" id="input-placeholder" placeholder="Placeholder" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-text" className="form-label">Type Text</label>
										<input type="text" className="form-control" id="input-text" placeholder="Text" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-number" className="form-label">Type Number</label>
										<input type="number" className="form-control" id="input-number" placeholder="Number" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-password" className="form-label">Type Password</label>
										<input type="password" autoComplete="current-password" className="form-control" id="input-password" placeholder="Password" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-email" className="form-label">Type Email</label>
										<input type="email" className="form-control" id="input-email" placeholder="Email@xyz.com" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-tel" className="form-label">Type Tel</label>
										<input type="tel" className="form-control" id="input-tel" placeholder="+1100-2031-1233" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-date" className="form-label">Type Date</label>
										<input type="text" className="form-control datetimepicker" id="input-date" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-week" className="form-label">Type Week</label>
										<input type="week" className="form-control" id="input-week" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-month" className="form-label">Type Month</label>
										<input type="month" className="form-control" id="input-month" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-time" className="form-label">Type Time</label>
										<input type="time" className="form-control" id="input-time" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-datetime-local" className="form-label">Type datetime-local</label>
										<input type="datetime-local" className="form-control" id="input-datetime-local" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-search" className="form-label">Type Search</label>
										<input type="search" className="form-control" id="input-search" placeholder="Search" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-submit" className="form-label">Type Submit</label>
										<input type="submit" className="form-control" id="input-submit" defaultValue="Submit" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-reset" className="form-label">Type Reset</label>
										<input type="reset" className="form-control" id="input-reset" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-button" className="form-label">Type Button</label>
										<input type="button" className="form-control btn btn-primary" id="input-button" defaultValue="Button" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<div className="row">
											<div className="col-xl-3">
												<label className="form-label" htmlFor="type-color">Type Color</label>
												<input className="form-control form-input-color" type="color" defaultValue="#136bd0" id="type-color" />
											</div>
											<div className="col-xl-5">
												<div className="form-check">
													<p className="mb-3 px-0 text-muted">Type Checkbox</p>
													<input className="form-check-input ms-2" type="checkbox" defaultValue="" checked aria-label="Type Checkbox" />
												</div>
											</div>
											<div className="col-xl-4">
												<div className="form-check">
													<p className="mb-3 px-0 text-muted">Type Radio</p>
													<input className="form-check-input ms-2" type="radio" checked aria-label="Type Radio" />
												</div>
											</div>
										</div>
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-file" className="form-label">Type File</label>
										<input className="form-control" type="file" id="input-file" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label className="form-label" htmlFor="type-url">Type Url</label>
										<input className="form-control" type="url" name="website" placeholder="http://example.com" id="type-url" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-disabled" className="form-label">Type Disabled</label>
										<input type="text" id="input-disabled" className="form-control" placeholder="Disabled input" disabled />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-readonlytext" className="form-label">Input Readonly Text</label>
										<input type="text" readOnly className="form-control-plaintext" id="input-readonlytext" defaultValue="email@example.com" />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="disabled-readonlytext" className="form-label">Disabled Readonly
											Input</label>
										<input className="form-control" type="text" defaultValue="Disabled readonly input" id="disabled-readonlytext" aria-label="Disabled input example" disabled readOnly />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label className="form-label">Type Readonly Input</label>
										<input className="form-control" type="text" defaultValue="Readonly input here..." aria-label="readonly input example" readOnly />
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="text-area" className="form-label">Textarea</label>
										<textarea className="form-control" id="text-area" rows={1}></textarea>
									</div>
									<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
										<label htmlFor="input-DataList" className="form-label">Datalist example</label>
										<input className="form-control" list="datalistOptions" id="input-DataList" placeholder="Type to search..." />
										<datalist id="datalistOptions">
											<option defaultValue="San Francisco">
											</option>
											<option defaultValue="New York">
											</option>
											<option defaultValue="Seattle">
											</option>
											<option defaultValue="Los Angeles">
											</option>
											<option defaultValue="Chicago">
											</option>
										</datalist>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="col-md-6">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Input Shapes</h5>
							</div>
							<div className="card-body">
								<div className="row gy-3">
									<div className="col-xl-12">
										<label htmlFor="input-noradius" className="form-label">Input With No Radius</label>
										<input type="text" className="form-control rounded-0" id="input-noradius" placeholder="No Radius" />
									</div>
									<div className="col-xl-12">
										<label htmlFor="input-rounded" className="form-label">Input With Radius</label>
										<input type="text" className="form-control" id="input-rounded" placeholder="Default Radius" />
									</div>
									<div className="col-xl-12">
										<label htmlFor="input-rounded-pill" className="form-label">Rounded Input</label>
										<input type="text" className="form-control rounded-pill" id="input-rounded-pill" placeholder="Rounded" />
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="col-md-6">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Input border Styles</h5>
							</div>
							<div className="card-body">
								<div className="row gy-3">
									<div className="col-xl-12">
										<label htmlFor="input-rounded1" className="form-label">Default</label>
										<input type="text" className="form-control" id="input-rounded1" placeholder="Default" />
									</div>
									<div className="col-xl-12">
										<label htmlFor="input-rounded2" className="form-label">Dotted Input</label>
										<input type="text" className="form-control border-dotted" id="input-rounded2" placeholder="Dotted" />
									</div>
									<div className="col-xl-12">
										<label htmlFor="input-rounded3" className="form-label">Dashed Input</label>
										<input type="text" className="form-control border-dashed" id="input-rounded3" placeholder="Dashed" />
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="col-md-6">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Input Sizing</h5>
							</div>
							<div className="card-body">
								<input className="form-control form-control-sm mb-3" type="text" placeholder=".form-control-sm" aria-label=".form-control-sm example" />
								<input className="form-control mb-3" type="text" placeholder="Default input" aria-label="default input example" />
								<input className="form-control form-control-lg" type="text" placeholder=".form-control-lg" aria-label=".form-control-lg example" />
							</div>
						</div>
					</div>

					<div className="col-md-6">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Disabled forms</h5>
							</div>
							<div className="card-body">
								<form>
									<div className="mb-3">
										<label htmlFor="disabledTextInput" className="form-label">Disabled
											input</label>
										<input type="text" id="disabledTextInput" className="form-control" placeholder="Disabled input" />
									</div>
									<div className="mb-3">
										<label htmlFor="disabledSelect" className="form-label">Disabled select
											menu</label>
										<select id="disabledSelect" className="form-select">
											<option>Disabled select</option>
										</select>
									</div>
									<div className="mb-3">
										<div className="form-check">
											<input className="form-check-input" type="checkbox" id="disabledFieldsetCheck" disabled />
											<label className="form-check-label" htmlFor="disabledFieldsetCheck">
												Can't check this
											</label>
										</div>
									</div>
									<button type="submit" className="btn btn-primary">Submit</button>
								</form>
							</div>
						</div>
					</div>

					<div className="col-md-6">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Input With Tooltip</h5>
							</div>
							<div className="card-body">
								<div className="row gy-3">
									<div className="col-xl-12">
										<label htmlFor="input-rounded1" className="form-label">Tooltip Bottom</label>
										<input type="text" title="Tooltip on bottom" className="form-control" placeholder="Bottom" aria-label="Bottom" />
									</div>
									<div className="col-xl-12">
										<label htmlFor="input-rounded2" className="form-label">Tooltip Right</label>
										<input type="text" title="Tooltip on Right" className="form-control" placeholder="Right" aria-label="Right" />
									</div>
									<div className="col-xl-12">
										<label htmlFor="input-rounded3" className="form-label">Tooltip Top</label>
										<input type="text" title="Tooltip on Top" className="form-control" placeholder="Top" aria-label="Top" />
									</div>
									<div className="col-xl-12">
										<label htmlFor="input-rounded3" className="form-label">Tooltip Left</label>
										<input type="text" title="Tooltip on Left" className="form-control" placeholder="Left" aria-label="Left" />
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
		
  </>
);

export default FormElements;
