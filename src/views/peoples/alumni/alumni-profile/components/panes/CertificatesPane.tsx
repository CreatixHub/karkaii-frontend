import { certificates } from '../../data/alumniProfile.data';

const CertificatesPane = () => (
  <div>
    <h5 className="mb-3">Certificates</h5>
    {certificates.map((cert, index) => (
      <div
        className={`d-flex align-items-center justify-content-between border rounded p-2${index < certificates.length - 1 ? ' mb-2' : ' mb-0'}`}
        key={cert.title}
      >
        <div className="d-flex align-items-center">
          <span className="avatar avatar-md bg-light-300 rounded me-2">
            <i className="ti ti-file-type-pdf text-danger" />
          </span>
          <div>
            <p className="mb-0 text-dark">{cert.title}</p>
            <small className="text-muted">{cert.meta}</small>
          </div>
        </div>
        <a href="#" className="btn btn-icon btn-sm btn-outline-light bg-white" onClick={(event) => event.preventDefault()}>
          <i className="ti ti-download" />
        </a>
      </div>
    ))}
  </div>
);

export default CertificatesPane;
