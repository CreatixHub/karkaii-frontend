
const EmailTemplatesModal = () => {
  return (
   <>
  {/* Add Email Template */}
  <div className="modal fade" id="add_email_template">
    <div className="modal-dialog modal-dialog-centered  modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Add Email Template</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="email-templates.html">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Title"
                    id="title"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="subject">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Subject"
                    id="subject"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Template Content</label>
                  <div className="input-blocks summer-description-box notes-summernote">
                    <label className="form-label">Descriptions</label>
                    <div id="summernote"></div>
                  </div>
                </div>
                <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                  <div className="status-title">
                    <h5>Status</h5>
                    <p>Change the Status by toggle </p>
                  </div>
                  <div className="status-toggle modal-status">
                    <input
                      type="checkbox"
                      id="user4"
                      className="check"
                      defaultChecked
                    />
                    <label htmlFor="user4" className="checktoggle">
                      {" "}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a href="#" className="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </a>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Add Email Template */}
  {/* Edit Email Template */}
  <div className="modal fade" id="edit_email_template">
    <div className="modal-dialog modal-dialog-centered  modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Edit Email Template</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="email-templates.html">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label" htmlFor="title-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Title"
                    defaultValue="Email Verification"
                    id="title-2"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="subject-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Subject"
                    defaultValue="English"
                    id="subject-2"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Template Content</label>
                  <div className="input-blocks summer-description-box notes-summernote">
                    <label className="form-label">Descriptions</label>
                    <div id="summernote2">
                      <p>
                        Hi [User's Name], Welcome to Preskool ! We're thrilled
                        to have you on board. Get ready to experience a seamless
                        and efficient way. To get started, Click here If you
                        have any questions or need assistance, feel free to
                        reach out to our support team at [support@example.com].
                      </p>
                    </div>
                  </div>
                </div>
                <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                  <div className="status-title">
                    <h5>Status</h5>
                    <p>Change the Status by toggle </p>
                  </div>
                  <div className="status-toggle modal-status">
                    <input
                      type="checkbox"
                      id="user5"
                      className="check"
                      defaultChecked
                    />
                    <label htmlFor="user5" className="checktoggle">
                      {" "}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a href="#" className="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </a>
            <button type="submit" className="btn btn-primary">
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Edit Email Template */}
  {/* Delete Modal */}
  <div className="modal fade" id="delete-modal">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <form action="email-templates.html">
          <div className="modal-body text-center">
            <span className="delete-icon">
              <i className="ti ti-trash-x" />
            </span>
            <h4>Confirm Deletion</h4>
            <p>
              You want to delete all the marked items, this cant be undone once
              you delete.
            </p>
            <div className="d-flex justify-content-center">
              <a
                href="javascript:void(0);"
                className="btn btn-light me-2"
                data-bs-dismiss="modal"
              >
                Cancel
              </a>
              <button type="submit" className="btn btn-danger">
                Yes, Delete
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Delete Modal */}
</>

  )
}

export default EmailTemplatesModal