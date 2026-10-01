import ImageWithBasePath from '@core/common/imageWithBasePath';
import type {
  ExamOption,
  ReportCardRecord,
  ReportSummary,
} from '../data/reportCards.data';
import { COHORT_SIZE, pad2, school, signatories } from '../data/reportCards.data';

export interface ReportCardDocumentProps {
  student: ReportCardRecord;
  summary: ReportSummary;
  exam: ExamOption;
  yearLabel: string;
  classLabel: string;
  sectionLabel: string;
  published: boolean;
}

const ReportCardDocument = ({
  student,
  summary,
  exam,
  yearLabel,
  classLabel,
  sectionLabel,
  published,
}: ReportCardDocumentProps) => {
  const sectionLetter = sectionLabel.replace('Section ', '');

  return (
    <div className="col-xxl-9 col-xl-8 d-flex">
      <div className="card flex-fill">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center">
            <span className="avatar avatar-sm bg-primary-transparent text-primary rounded me-2">
              <i className="ti ti-certificate" />
            </span>
            <h5 className="mb-0 fs-15">Report Card Preview</h5>
          </div>
          <div className="d-flex align-items-center flex-wrap gap-2">
            {published ? (
              <span className="badge badge-soft-primary d-inline-flex align-items-center">
                <i className="ti ti-lock me-1" />
                Published
              </span>
            ) : null}
            <span className="badge badge-soft-bordered fs-10">
              {exam.short} &middot; {yearLabel}
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="border rounded p-4" id="rc-document">
            {/* Masthead */}
            <div className="d-sm-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
              <div className="d-flex align-items-center mb-3 mb-sm-0">
                <ImageWithBasePath
                  src={school.logo}
                  alt="School logo"
                  className="me-3"
                  width={44}
                  height={44}
                />
                <div>
                  <h5 className="mb-1">{school.name}</h5>
                  <p className="mb-0 fs-12 text-muted">{school.address}</p>
                </div>
              </div>
              <div className="text-sm-end">
                <span className="badge badge-soft-primary mb-1">Report Card</span>
                <p className="mb-0 fs-12 text-muted">
                  {exam.label} &middot; {exam.period}
                </p>
              </div>
            </div>

            {/* Student details */}
            <div className="row g-3 pb-3 mb-3 border-bottom">
              <div className="col-md-3 col-6">
                <p className="fs-12 text-muted mb-1">Student Name</p>
                <h6 className="fs-14 mb-0">{student.name}</h6>
              </div>
              <div className="col-md-3 col-6">
                <p className="fs-12 text-muted mb-1">Admission No</p>
                <h6 className="fs-14 mb-0">{student.admissionNo}</h6>
              </div>
              <div className="col-md-3 col-6">
                <p className="fs-12 text-muted mb-1">Roll No</p>
                <h6 className="fs-14 mb-0">{student.rollNo}</h6>
              </div>
              <div className="col-md-3 col-6">
                <p className="fs-12 text-muted mb-1">Class &amp; Section</p>
                <h6 className="fs-14 mb-0">
                  {classLabel} &middot; {sectionLetter}
                </h6>
              </div>
            </div>

            {/* Subject-wise marks */}
            <div className="border rounded overflow-hidden mb-3">
              <table className="table table-sm mb-0">
                <caption className="visually-hidden">
                  Subject-wise marks for {student.name}
                </caption>
                <thead className="table-light">
                  <tr>
                    <th>Subject</th>
                    <th className="text-center">Marks</th>
                    <th className="text-center">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.rows.map((row) => (
                    <tr key={row.subjectId}>
                      <td className="fs-13">{row.name}</td>
                      <td className="fs-13 text-center">{row.marksLabel}</td>
                      <td className="text-center">
                        <span className={`badge ${row.band.badge}`}>{row.band.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Result strip */}
            <div className="border rounded p-3 mb-3">
              <div className="row g-3 text-center">
                <div className="col-md col-4">
                  <p className="fs-12 text-muted mb-1">Total</p>
                  <h6 className="fs-14 mb-0">{summary.totalLabel}</h6>
                </div>
                <div className="col-md col-4">
                  <p className="fs-12 text-muted mb-1">Percentage</p>
                  <h6 className="fs-14 mb-0">{summary.percentageLabel}</h6>
                </div>
                <div className="col-md col-4">
                  <p className="fs-12 text-muted mb-1">GPA / Grade</p>
                  <h6 className="fs-14 mb-0">
                    {summary.gpa} &middot; {summary.overall.grade}
                  </h6>
                </div>
                <div className="col-md col-6">
                  <p className="fs-12 text-muted mb-1">Rank</p>
                  <h6 className="fs-14 mb-0">
                    {pad2(student.rank)} of {COHORT_SIZE}
                  </h6>
                </div>
                <div className="col-md col-6">
                  <p className="fs-12 text-muted mb-1">Result</p>
                  <span className={`badge ${summary.statusBadge}`}>{summary.status}</span>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="mb-3">
              <p className="fs-12 text-muted mb-1">Class Teacher Remarks</p>
              <p className="fs-13 mb-0">{student.remarks}</p>
            </div>

            {/* Signatures */}
            <div className="row g-3 pt-3 border-top">
              {signatories.map((signatory) => (
                <div className="col-sm-6 text-center" key={signatory.role}>
                  <ImageWithBasePath
                    src={signatory.signature}
                    alt="Signature"
                    className="mb-1"
                    height={36}
                  />
                  <p className="mb-0 fs-13 fw-medium">{signatory.name}</p>
                  <span className="fs-11 text-muted">{signatory.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCardDocument;
