import { documentCards } from '../../data/admissionDetails.data';

export interface DocumentsPaneProps {
  onUpload: () => void;
}

const DocumentsPane = ({ onUpload }: DocumentsPaneProps) => (
  <div>
    <div className="d-flex align-items-center justify-content-between mb-3">
      <h5 className="mb-0">Required Documents</h5>
      <button type="button" className="btn btn-sm btn-primary" onClick={onUpload}>
        <i className="ti ti-upload me-1" />
        Upload
      </button>
    </div>
    <div className="row g-3">
      {documentCards.map((doc) => (
        <div className="col-md-6 col-xl-4 d-flex" key={doc.id}>
          <div className="card card-hover w-100 mb-0">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between mb-3">
                <span className={`avatar avatar-lg ${doc.iconAccent} rounded`}>
                  <i className={`${doc.icon} fs-24`} />
                </span>
                <span className={`badge ${doc.status.className} d-inline-flex align-items-center`}>
                  <i className="ti ti-circle-filled fs-5 me-1" />
                  {doc.status.label}
                </span>
              </div>
              <h6 className="mb-1 text-truncate">{doc.title}</h6>
              <p className="fs-12 text-muted mb-3">
                <i className="ti ti-clock me-1" />
                {doc.meta}
              </p>
              {doc.action === 'preview' ? (
                <div className="d-flex align-items-center gap-2">
                  <a
                    href="#preview"
                    className="btn btn-sm btn-outline-light bg-white flex-fill d-inline-flex align-items-center justify-content-center"
                    onClick={(event) => event.preventDefault()}
                  >
                    <i className="ti ti-eye me-1" />
                    Preview
                  </a>
                  <a
                    href="#download"
                    className="btn btn-sm btn-outline-light bg-white flex-fill d-inline-flex align-items-center justify-content-center"
                    onClick={(event) => event.preventDefault()}
                  >
                    <i className="ti ti-download me-1" />
                    Download
                  </a>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
                    onClick={onUpload}
                  >
                    <i className="ti ti-upload me-1" />
                    Upload
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DocumentsPane;
