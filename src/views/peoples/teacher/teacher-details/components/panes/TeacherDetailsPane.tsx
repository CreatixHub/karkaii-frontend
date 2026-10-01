import type { DocumentCard, FieldRow } from '../../data/teacherDetailsWorkspace.data';
import {
  addresses,
  bankDetails,
  documents,
  otherInfo,
  previousSchool,
  profileDetails,
  socialMedia,
  workDetails,
} from '../../data/teacherDetailsWorkspace.data';

export interface TeacherDetailsPaneProps {
  active: boolean;
  onPreviewDocument: (document: DocumentCard) => void;
  onDownloadDocument: (document: DocumentCard) => void;
}

/** The `col-md-4` field block the school / bank / work cards all repeat. */
const FieldColumn = ({ row, className }: { row: FieldRow; className: string }) => (
  <div className={className}>
    <div className="mb-3">
      <p className="mb-1 text-dark fw-medium">{row.label}</p>
      <p>{row.value}</p>
    </div>
  </div>
);

const TeacherDetailsPane = ({
  active,
  onPreviewDocument,
  onDownloadDocument,
}: TeacherDetailsPaneProps) => (
  <div className={`tab-pane fade${active ? ' show active' : ''}`} id="teacher_details">
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="d-flex align-items-center gap-2">
              <i className="ti ti-user text-primary" />
              Profile Details
            </h5>
          </div>
          <div className="card-body">
            <div className="border rounded p-3 pb-0">
              <div className="row">
                {profileDetails.map((row) => (
                  <div className="col-sm-6 col-lg-4" key={row.label}>
                    <div className="mb-3">
                      <p className="text-dark fw-medium mb-1">{row.label}</p>
                      <p>{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-xxl-6 d-flex">
        <div className="card flex-fill card-hover">
          <div className="card-header">
            <h5 className="d-flex align-items-center gap-2">
              <i className="ti ti-files text-primary" />
              Documents
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {documents.map((document) => (
                <div className="col-sm-6 d-flex" key={document.id}>
                  <div className="card card-hover w-100 mb-0">
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between mb-2">
                        <span className="avatar avatar-lg bg-danger-transparent text-danger rounded">
                          <i className="ti ti-file-type-pdf fs-24" />
                        </span>
                        <span
                          className={`badge ${document.statusClass} d-inline-flex align-items-center`}
                        >
                          <i className="ti ti-circle-filled fs-5 me-1" />
                          {document.status}
                        </span>
                      </div>
                      <h6 className="mb-1 text-truncate">{document.name}</h6>
                      <p className="fs-12 text-muted mb-3">
                        <i className="ti ti-clock me-1" />
                        {document.date}
                      </p>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white flex-fill d-inline-flex align-items-center justify-content-center"
                          onClick={() => onPreviewDocument(document)}
                        >
                          <i className="ti ti-eye me-1" />
                          Preview
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white flex-fill d-inline-flex align-items-center justify-content-center"
                          onClick={() => onDownloadDocument(document)}
                        >
                          <i className="ti ti-download me-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-xxl-6 d-flex">
        <div className="card flex-fill card-hover">
          <div className="card-header">
            <h5 className="d-flex align-items-center gap-2">
              <i className="ti ti-map-pin text-primary" />
              Address
            </h5>
          </div>
          <div className="card-body">
            {addresses.map((address, index) => (
              <div
                className={`d-flex align-items-center${index < addresses.length - 1 ? ' mb-3' : ''}`}
                key={address.id}
              >
                <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                  <i className={address.icon} />
                </span>
                <div>
                  <p className="text-dark fw-medium mb-1">{address.label}</p>
                  <p>{address.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="d-flex align-items-center gap-2">
              <i className="ti ti-school text-primary" />
              Previous School Details
            </h5>
          </div>
          <div className="card-body pb-1">
            <div className="row">
              {previousSchool.map((row) => (
                <FieldColumn row={row} className="col-md-4" key={row.label} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-xxl-6 d-flex">
        <div className="card flex-fill card-hover">
          <div className="card-header">
            <h5 className="d-flex align-items-center gap-2">
              <i className="ti ti-building-bank text-primary" />
              Bank Details
            </h5>
          </div>
          <div className="card-body pb-1">
            <div className="row">
              {bankDetails.map((row) => (
                <FieldColumn row={row} className="col-md-4" key={row.label} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-xxl-6 d-flex">
        <div className="card flex-fill card-hover">
          <div className="card-header">
            <h5 className="d-flex align-items-center gap-2">
              <i className="ti ti-briefcase text-primary" />
              Work Details
            </h5>
          </div>
          <div className="card-body pb-1">
            <div className="row">
              {workDetails.map((row) => (
                <FieldColumn row={row} className="col-md-4" key={row.label} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 d-flex">
        <div className="card flex-fill card-hover">
          <div className="card-header">
            <h5 className="d-flex align-items-center gap-2">
              <i className="ti ti-share text-primary" />
              Social Media
            </h5>
          </div>
          <div className="card-body pb-1">
            <div className="row row-cols-xxl-5 row-cols-xl-3">
              {socialMedia.map((row) => (
                <FieldColumn row={row} className="col" key={row.label} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="d-flex align-items-center gap-2">
              <i className="ti ti-info-circle text-primary" />
              Other Info
            </h5>
          </div>
          <div className="card-body">
            <p>{otherInfo}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TeacherDetailsPane;
