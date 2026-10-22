import Swal from "sweetalert2";

// Ported from the template's assets/js/sweetalerts.js, which wired these
// buttons by id. React binds them directly instead.
const BTN = {
  primary: "btn btn-primary mt-2",
  confirmPair: "btn btn-primary me-2 mt-2",
  cancelPair: "btn btn-danger mt-2",
};

const basic = () =>
  Swal.fire({
    title: "Any fool can use a computer",
    customClass: { confirmButton: BTN.primary },
    buttonsStyling: false,
  });

const withTitle = () =>
  Swal.fire({
    title: "The Internet?",
    text: "That thing is still around?",
    icon: "question",
    customClass: { confirmButton: BTN.primary },
    buttonsStyling: false,
    showCloseButton: true,
  });

const htmlAlert = () =>
  Swal.fire({
    title: "<i>HTML</i> <u>example</u>",
    icon: "info",
    html: 'You can use <b>bold text</b>, <a href="#">links</a> and other HTML tags',
    showCloseButton: true,
    showCancelButton: true,
    customClass: { confirmButton: "btn btn-success me-2", cancelButton: "btn btn-danger" },
    buttonsStyling: false,
    confirmButtonText: '<i class="ti ti-thumb-up-filled me-1"></i> Great!',
    cancelButtonText: '<i class="ti ti-thumb-down-filled"></i>',
  });

const byIcon = (icon: "info" | "warning" | "error" | "success" | "question", cls: string) => () =>
  Swal.fire({
    text: `Here's an example of ${icon === "info" ? "an" : "a"} ${icon} SweetAlert!`,
    icon,
    buttonsStyling: false,
    confirmButtonText: "Ok, got it!",
    customClass: { confirmButton: `btn ${cls}` },
  });

const longContent = () =>
  Swal.fire({
    imageUrl: "https://placeholder.pics/svg/300x1500",
    imageHeight: 1500,
    imageAlt: "A tall image",
    customClass: { confirmButton: BTN.primary },
    buttonsStyling: false,
    showCloseButton: true,
  });

const confirmDelete = () =>
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    customClass: { confirmButton: BTN.confirmPair, cancelButton: BTN.cancelPair },
    confirmButtonText: "Yes, delete it!",
    buttonsStyling: false,
    showCloseButton: true,
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
        customClass: { confirmButton: BTN.primary },
        buttonsStyling: false,
      });
    }
  });

const confirmParams = () =>
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    customClass: { confirmButton: BTN.confirmPair, cancelButton: BTN.cancelPair },
    buttonsStyling: false,
    showCloseButton: true,
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
        customClass: { confirmButton: BTN.primary },
        buttonsStyling: false,
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: "Cancelled",
        text: "Your imaginary file is safe :)",
        icon: "error",
        customClass: { confirmButton: BTN.primary },
        buttonsStyling: false,
      });
    }
  });

const customImage = () =>
  Swal.fire({
    title: "Sweet!",
    text: "Modal with a custom image.",
    imageUrl: "assets/img/karkaii-logo.png",
    imageHeight: 40,
    customClass: { confirmButton: BTN.primary },
    buttonsStyling: false,
    showCloseButton: true,
  });

const autoClose = () => {
  let timer: ReturnType<typeof setInterval>;
  Swal.fire({
    title: "Auto close alert!",
    html: "I will close in <strong></strong> seconds.",
    timer: 2000,
    timerProgressBar: true,
    showCloseButton: true,
    didOpen: () => {
      Swal.showLoading();
      timer = setInterval(() => {
        const el = Swal.getHtmlContainer()?.querySelector("strong");
        if (el) el.textContent = String(Swal.getTimerLeft());
      }, 100);
    },
    willClose: () => clearInterval(timer),
  });
};

const atPosition = (position: "top-start" | "top-end" | "bottom-start" | "bottom-end") => () =>
  Swal.fire({
    position,
    icon: "success",
    text: "Your work has been saved",
    showConfirmButton: false,
    timer: 1500,
    customClass: { confirmButton: "btn btn-primary" },
    buttonsStyling: false,
  });

const customWidth = () =>
  Swal.fire({
    title: "Custom width, padding, background.",
    width: 600,
    padding: 100,
    customClass: { confirmButton: "btn btn-primary" },
    buttonsStyling: false,
    background: "var(--bs-secondary-bg)",
  });

const ajaxAlert = () =>
  Swal.fire({
    title: "Submit email to run ajax request",
    input: "email",
    showCancelButton: true,
    confirmButtonText: "Submit",
    showLoaderOnConfirm: true,
    customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-danger" },
    buttonsStyling: false,
    showCloseButton: true,
    preConfirm: (email: string) =>
      new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (email === "taken@example.com") reject(new Error("This email is already taken."));
          else resolve();
        }, 2000);
      }),
    allowOutsideClick: false,
  }).then((result) => {
    if (!result.isConfirmed) return;
    Swal.fire({
      icon: "success",
      title: "Ajax request finished!",
      customClass: { confirmButton: "btn btn-primary" },
      buttonsStyling: false,
      html: `Submitted email: ${result.value}`,
    });
  });

const SweetAlert = () => {
  return (
    <div>
      <div className="page-wrapper cardhead">
            <div className="content ">

              {/* Page Header */}
              <div className="page-header">
                <div className="row">
                  <div className="col-sm-12">
                    <h3 className="page-title">Sweetalerts</h3>
                  </div>
                </div>
              </div>
              {/* /Page Header */}

              {/* start row */}
                      <div className="row">

                          <div className="col-lg-6">
                              <div className="card">
                                  <div className="card-header border-bottom d-flex align-items-center">
                                      <h4 className="header-title">A Basic Message</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">Here's a basic example of SweetAlert.</p>
                                      <button type="button" className="btn btn-primary" id="sweetalert-basic" onClick={basic}>Click me</button>
                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-lg-6">
                              <div className="card">
                                  <div className="card-header border-bottom d-flex align-items-center">
                                      <h4 className="header-title">Title</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">A Title with a Text Under.</p>
                                      <button type="button" className="btn btn-primary" id="sweetalert-title" onClick={withTitle}>Click Me</button>
                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-lg-6">
                              <div className="card card-h-100">
                                  <div className="card-header border-bottom d-flex align-items-center">
                                      <h4 className="header-title">HTML</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">Here's an example of SweetAlert with HTML content.</p>
                                      <button type="button" className="btn btn-primary" id="custom-html-alert" onClick={htmlAlert}>Toggle HTML SweetAlert</button>
                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-lg-6">
                              <div className="card card-h-100">
                                  <div className="card-header border-bottom d-flex align-items-center">
                                      <h4 className="header-title">All States</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">Here are examples for each of SweetAlert's states.</p>

                                      <div className="d-flex flex-wrap gap-2">
                                          <button type="button" id="sweetalert-info" className="btn btn-info" onClick={byIcon("info", "btn-info")}>Toggle Info</button>
                                          <button type="button" id="sweetalert-warning" className="btn btn-warning" onClick={byIcon("warning", "btn-warning")}>Toggle Warning</button>
                                          <button type="button" id="sweetalert-error" className="btn btn-danger" onClick={byIcon("error", "btn-danger")}>Toggle Error</button>
                                          <button type="button" id="sweetalert-success" className="btn btn-success" onClick={byIcon("success", "btn-success")}>Toggle Success</button>
                                          <button type="button" id="sweetalert-question" className="btn btn-primary" onClick={byIcon("question", "btn-primary")}>Toggle Question</button>
                                      </div>
                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-lg-6">
                              <div className="card">
                                  <div className="card-header border-bottom d-flex align-items-center">
                                      <h4 className="header-title">Long Content</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">A modal window with a long content inside.</p>

                                      <button type="button" id="sweetalert-longcontent" className="btn btn-secondary" onClick={longContent}>Click Me</button>
                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-lg-6">
                              <div className="card">
                                  <div className="card-header border-bottom d-flex align-items-center">
                                      <h4 className="header-title">With Confirm Button</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">A warning message, with a function attached to the "Confirm"-button...</p>

                                      <button type="button" id="sweetalert-confirm-button" className="btn btn-secondary" onClick={confirmDelete}>Click Me</button>
                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-lg-6">
                              <div className="card">
                                  <div className="card-header border-bottom d-flex align-items-center">
                                      <h4 className="header-title">With Cancel Button</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">By passing a parameter, you can execute something else for "Cancel".</p>

                                      <button type="button" id="sweetalert-params" className="btn btn-secondary" onClick={confirmParams}>Click Me</button>
                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-lg-6">
                              <div className="card">
                                  <div className="card-header border-bottom d-flex align-items-center">
                                      <h4 className="header-title">With Image Header (Logo)</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">A message with custom Image Header.</p>

                                      <button type="button" id="sweetalert-image" className="btn btn-secondary" onClick={customImage}>Click Me</button>
                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-lg-6">
                              <div className="card">
                                  <div className="card-header border-bottom d-flex align-items-center">
                                      <h4 className="header-title">Auto Close</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">A message with auto close timer.</p>

                                      <button type="button" id="sweetalert-close" className="btn btn-secondary" onClick={autoClose}>Click Me</button>
                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-lg-6">
                              <div className="card">
                                  <div className="card-header border-bottom d-flex align-items-center">
                                      <h4 className="header-title">Position</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">A custom positioned dialog.</p>

                                      <div className="d-flex flex-wrap gap-2">
                                          <button type="button" className="btn btn-primary" id="position-top-start" onClick={atPosition("top-start")}>Top Start</button>
                                          <button type="button" className="btn btn-primary" id="position-top-end" onClick={atPosition("top-end")}>Top End</button>
                                          <button type="button" className="btn btn-primary" id="position-bottom-start" onClick={atPosition("bottom-start")}>Bottom Starts</button>
                                          <button type="button" className="btn btn-primary" id="position-bottom-end" onClick={atPosition("bottom-end")}>Bottom End</button>
                                      </div>
                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-lg-6">
                              <div className="card">
                                  <div className="card-header border-bottom d-flex align-items-center">
                                      <h4 className="header-title">With Custom Padding, Background</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">A message with custom width, padding and background.</p>
                                      <button type="button" id="custom-padding-width-alert" className="btn btn-secondary" onClick={customWidth}>Click Me</button>
                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-lg-6">
                              <div className="card">
                                  <div className="card-header border-bottom d-flex align-items-center">
                                      <h4 className="header-title">Ajax Request</h4>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">Ajax request example.</p>
                                      <button type="button" id="ajax-alert" className="btn btn-secondary" onClick={ajaxAlert}>Click Me</button>
                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                      </div>
                      {/* end row */}

            </div>
          </div>
    </div>
  );
};

export default SweetAlert;
