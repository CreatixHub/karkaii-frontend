const UiTextEditor = () => (
  <>
<div className="page-wrapper cardhead">
			<div className="content ">

				{/* Page Header */}
				<div className="page-header">
					<div className="row">
						<div className="col-sm-12">
							<h3 className="page-title">Text Editor</h3>
						</div>
					</div>
				</div>
				{/* /Page Header */}

				<div className="row">

					{/* Editor */}
					<div className="col-md-12">
						<div className="card">
							<div className="card-header">
								<h4 className="card-title fs-16 fw-medium">Editor</h4>
							</div>
							<div className="card-body">
								<div id="summernote"></div>
							</div>
						</div>
					</div>
					{/* /Editor */}

				</div>
			</div>
		</div>
  </>
);

export default UiTextEditor;
