import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { ReportCardRecord, ReportSummary } from '../data/reportCards.data';
import { COHORT_SIZE, pad2 } from '../data/reportCards.data';

export interface StudentSummaryProps {
  student: ReportCardRecord;
  summary: ReportSummary;
  classLabel: string;
  sectionLabel: string;
}

const StudentSummary = ({ student, summary, classLabel, sectionLabel }: StudentSummaryProps) => (
  <div className="col-xxl-3 col-xl-4">
    <div className="card">
      <div className="card-body">
        <div className="text-center pb-3 border-bottom">
          <span className="avatar avatar-xxl rounded mb-2">
            <ImageWithBasePath src={student.avatar} alt="Student" />
          </span>
          <h4 className="fs-14 mb-1 fw-medium">{student.name}</h4>
          <p className="mb-0 fs-12 text-muted">
            {classLabel} &middot; {sectionLabel}
          </p>
        </div>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">
          <span className="fs-13 text-muted">Admission No</span>
          <span className="fs-13 fw-medium">{student.admissionNo}</span>
        </li>
        <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">
          <span className="fs-13 text-muted">Roll No</span>
          <span className="fs-13 fw-medium">{student.rollNo}</span>
        </li>
        <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">
          <span className="fs-13 text-muted">Class</span>
          <span className="fs-13 fw-medium">{classLabel}</span>
        </li>
        <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">
          <span className="fs-13 text-muted">Section</span>
          <span className="fs-13 fw-medium">{sectionLabel.replace('Section ', '')}</span>
        </li>
        <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">
          <span className="fs-13 text-muted">Parent Name</span>
          <span className="fs-13 fw-medium">{student.parentName}</span>
        </li>
        <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">
          <span className="fs-13 text-muted">Rank</span>
          <span className="fs-13 fw-medium">
            {pad2(student.rank)} of {COHORT_SIZE}
          </span>
        </li>
        <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">
          <span className="fs-13 text-muted">Attendance</span>
          <span className="fs-13 fw-medium">{student.attendance}</span>
        </li>
        <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">
          <span className="fs-13 text-muted">Result</span>
          <span className={`badge ${summary.statusBadge} d-inline-flex align-items-center`}>
            <i className={`${summary.statusIcon} me-1`} />
            {summary.status}
          </span>
        </li>
      </ul>
    </div>
  </div>
);

export default StudentSummary;
