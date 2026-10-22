import type { ReportCardRecord, ReportSummary } from '../data/reportCards.data';
import { pad2 } from '../data/reportCards.data';

export interface SubjectPerformanceProps {
  student: ReportCardRecord;
  summary: ReportSummary;
}

const SubjectPerformance = ({ student, summary }: SubjectPerformanceProps) => (
  <div className="card">
    <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
      <div className="d-flex align-items-center">
        <span className="avatar avatar-sm bg-info-transparent text-info rounded me-2">
          <i className="ti ti-list-details" />
        </span>
        <h6 className="mb-0">Subject Performance</h6>
      </div>
      <span className="badge badge-soft-bordered fs-10">{pad2(summary.rows.length)} Subjects</span>
    </div>
    <div className="data-table">
      <table className="table align-middle">
        <caption className="visually-hidden">
          Subject performance for {student.name} with max marks, marks obtained, grade and
          remarks
        </caption>
        <thead>
          <tr>
            <th>Subject</th>
            <th className="text-center">Max Marks</th>
            <th className="text-center">Obtained Marks</th>
            <th className="text-center">Grade</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {summary.rows.map((row) => (
            <tr key={row.subjectId}>
              <td>
                <div className="d-flex align-items-center">
                  <span
                    className={`avatar avatar-sm bg-${row.tone}-transparent text-${row.tone} rounded me-2`}
                  >
                    <i className={row.icon} />
                  </span>
                  <h6 className="fs-14 mb-0">{row.name}</h6>
                </div>
              </td>
              <td className="text-center">{row.maxMarks}</td>
              <td className="text-center fw-medium">{row.marks === null ? '—' : row.marks}</td>
              <td className="text-center">
                <span className={`badge ${row.band.badge}`}>{row.band.grade}</span>
              </td>
              <td className="fs-13">
                {row.remark ? row.remark : <span className="text-muted">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Performance Summary */}
    <div className="card-footer">
      <div className="row g-3 align-items-center">
        <div className="col-xl col-md-4 col-6">
          <p className="fs-12 text-muted mb-1">Total Marks</p>
          <h6 className="fs-14 mb-0">{summary.totalLabel}</h6>
        </div>
        <div className="col-xl col-md-4 col-6">
          <p className="fs-12 text-muted mb-1">Percentage</p>
          <h6 className="fs-14 mb-0">{summary.percentageLabel}</h6>
        </div>
        <div className="col-xl col-md-4 col-6">
          <p className="fs-12 text-muted mb-1">Overall Grade</p>
          <h6 className="fs-14 mb-0">{summary.overall.grade}</h6>
        </div>
        <div className="col-xl col-md-4 col-6">
          <p className="fs-12 text-muted mb-1">Attendance</p>
          <h6 className="fs-14 mb-0">{student.attendance}</h6>
        </div>
        <div className="col-xl col-md-4 col-6">
          <p className="fs-12 text-muted mb-1">Result Status</p>
          <span className={`badge ${summary.statusBadge} d-inline-flex align-items-center`}>
            <i className={`${summary.statusIcon} me-1`} />
            {summary.status}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default SubjectPerformance;
