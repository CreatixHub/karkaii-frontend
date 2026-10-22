import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { AdmitCardStudent, CardTemplate, Examination, ExamSession } from '../data/admitCard.data';
import { school, signatories, signatureImage, strings } from '../data/admitCard.data';

export interface AdmitCardDocumentProps {
  student: AdmitCardStudent;
  examination: Examination;
  academicYear: string;
  template: CardTemplate;
  schedule: ExamSession[];
  onPrint: () => void;
  onDownload: () => void;
}

interface DetailRow {
  label: string;
  value: string;
}

const AdmitCardDocument = ({
  student,
  examination,
  academicYear,
  template,
  schedule,
  onPrint,
  onDownload,
}: AdmitCardDocumentProps) => {
  /* The eight rows the template lists, in its order. */
  const details: DetailRow[] = [
    { label: 'Candidate Name', value: student.name },
    { label: 'Roll Number', value: student.rollNo },
    { label: 'Registration Number', value: student.registrationNo },
    { label: 'Admission Number', value: student.id },
    { label: 'Class & Section', value: student.classSection },
    { label: 'Date of Birth', value: student.dob },
    { label: 'Parent / Guardian', value: student.parent },
    { label: 'Examination Centre', value: student.centre },
  ];

  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="d-flex align-items-center">
          <span className="avatar avatar-sm bg-primary-transparent text-primary rounded me-2">
            <i className="ti ti-id-badge-2" />
          </span>
          <h6 className="mb-0">Admit Card Preview</h6>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span
            className={`badge ${student.verification.badge} d-inline-flex align-items-center`}
          >
            <i className="ti ti-circle-filled fs-5 me-1" />
            {student.verification.label}
          </span>
          <span className="badge badge-soft-bordered fs-10">{template.badge}</span>
        </div>
      </div>
      <div className="card-body">
        <div className="border rounded p-4">
          {/* School masthead */}
          <div className="d-sm-flex align-items-center justify-content-between border-bottom pb-3 mb-3 flex-wrap gap-3">
            <div className="d-flex align-items-center mb-3 mb-sm-0 flex-wrap gap-3">
              <ImageWithBasePath
                src={school.logo}
                alt="School logo"
                className="me-3"
                width={44}
                height={44}
              />
              <div>
                <h5 className="mb-1">{school.name}</h5>
                <p className="mb-0 fs-12 text-muted">
                  {school.address} &nbsp;•&nbsp; {school.affiliation}
                </p>
              </div>
            </div>
            <div className="text-sm-end">
              <span className="badge badge-soft-primary mb-1">{school.badge}</span>
              <p className="mb-0 fs-12 text-muted">Academic Year {academicYear}</p>
            </div>
          </div>

          <div className="text-center mb-3">
            <h6 className="mb-1 text-uppercase">{examination.heading}</h6>
            <p className="mb-0 fs-12 text-muted">{school.note}</p>
          </div>

          <div className="row g-3">
            {/* Candidate details */}
            <div className="col-12 col-lg-8">
              <div className="border rounded overflow-hidden h-100">
                <ul className="list-group list-group-flush">
                  {details.map((detail) => (
                    <li
                      className="list-group-item d-flex align-items-center justify-content-between"
                      key={detail.label}
                    >
                      <span className="fs-13 text-muted">{detail.label}</span>
                      <span className="fs-13 fw-medium">{detail.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Photograph + QR */}
            <div className="col-12 col-lg-4">
              <div className="border rounded p-3 text-center h-100">
                <ImageWithBasePath
                  src={student.photo}
                  alt="Candidate photograph"
                  className="img-fluid rounded mb-2"
                  width={104}
                  height={120}
                />
                <p className="fs-11 text-muted mb-3">Candidate Photograph</p>
                <div className="border border-dashed rounded p-3">
                  <i className="ti ti-qrcode fs-36 text-dark" />
                  <p className="fs-11 text-muted mb-0 mt-1">Scan to verify</p>
                </div>
              </div>
            </div>
          </div>

          {/* Barcode */}
          <div className="border border-dashed rounded d-flex align-items-center justify-content-between flex-wrap gap-2 px-3 py-2 mt-3">
            <span className="fs-12 text-muted">Card Serial</span>
            <i className="ti ti-barcode fs-40 text-dark" />
            <span className="fs-12 fw-medium">{student.serial}</span>
          </div>

          {/* Examination schedule */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3 mb-2">
            <h6 className="mb-0 fs-14">{strings.scheduleTitle}</h6>
            <span className="fs-12 text-muted">
              Seat No. <span className="fw-medium">{student.seatNo}</span> &nbsp;•&nbsp;{' '}
              {student.centre}
            </span>
          </div>
          <div className="table-responsive border rounded mb-0">
            <table className="table table-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th className="fs-12">#</th>
                  <th className="fs-12">Subject</th>
                  <th className="fs-12">Date</th>
                  <th className="fs-12">Session</th>
                  <th className="fs-12">Timing</th>
                  <th className="fs-12">Duration</th>
                  <th className="fs-12">Room</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, index) => (
                  <tr key={item.id}>
                    <td className="fs-13 text-muted">{String(index + 1).padStart(2, '0')}</td>
                    <td>
                      <span className="fs-13 fw-medium d-block">{item.subject}</span>
                      <span className="fs-11 text-muted">{item.code}</span>
                    </td>
                    <td>
                      <span className="fs-13 d-block">{item.date}</span>
                      <span className="fs-11 text-muted">{item.day}</span>
                    </td>
                    <td className="fs-13">{item.session}</td>
                    <td className="fs-13">{item.time}</td>
                    <td className="fs-13">{item.duration}</td>
                    <td className="fs-13">{item.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fs-11 text-muted mb-0 mt-2">
            <i className="ti ti-alarm me-1" />
            {strings.scheduleNote}
          </p>

          {/* Signatures */}
          <div className="row g-3 mt-2 pt-3 border-top">
            {signatories.map((person) => (
              <div className="col-sm-6 text-center" key={person.id}>
                <ImageWithBasePath src={signatureImage} alt="Signature" className="mb-1" height={36} />
                <p className="mb-0 fs-13 fw-medium">{person.name}</p>
                <span className="fs-11 text-muted">{person.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
        <p className="mb-0 fs-12 text-muted">
          <i className="ti ti-shield-check me-1" />
          Issued on {student.issuedOn} &nbsp;•&nbsp; {examination.validity}
        </p>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
            onClick={onDownload}
          >
            <i className="ti ti-file-type-pdf me-1" />
            Download PDF
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm d-inline-flex align-items-center"
            onClick={onPrint}
          >
            <i className="ti ti-printer me-1" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmitCardDocument;
