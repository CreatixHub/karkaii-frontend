import type { ExamContext } from '../data/marksEntry.data';
import { pad2, shortExamName } from '../data/marksEntry.data';

export interface EntrySummary {
  students: number;
  entered: number;
  pending: number;
  absent: number;
}

export interface ExamSelectionPanelProps {
  context: ExamContext;
  maxMarks: number;
  passMarks: number;
  markingType: string;
  gradingMethod: string;
  summary: EntrySummary;
  lastSaved: string;
}

const ExamSelectionPanel = ({
  context,
  maxMarks,
  passMarks,
  markingType,
  gradingMethod,
  summary,
  lastSaved,
}: ExamSelectionPanelProps) => (
  <div className="row">
    {/* Exam Selection Panel */}
    <div className="col-12 col-xl-8 d-flex">
      <div className="card flex-fill">
        <div className="card-body d-flex align-items-center">
          <div className="row g-3 w-100">
            <div className="col-md-3 col-6">
              <p className="fs-12 text-muted mb-1">Examination</p>
              <h4 className="fs-14 mb-0 fw-medium">{shortExamName(context.examination)}</h4>
            </div>
            <div className="col-md-3 col-6">
              <p className="fs-12 text-muted mb-1">Subject</p>
              <h5 className="fs-14 mb-0">{context.subject}</h5>
            </div>
            <div className="col-md-3 col-6">
              <p className="fs-12 text-muted mb-1">Class</p>
              <h6 className="fs-14 mb-0">{context.className}</h6>
            </div>
            <div className="col-md-3 col-6">
              <p className="fs-12 text-muted mb-1">Section</p>
              <h6 className="fs-14 mb-0">{context.section}</h6>
            </div>
            <div className="col-md-3 col-6">
              <p className="fs-12 text-muted mb-1">Maximum Marks</p>
              <h6 className="fs-14 mb-0">{maxMarks}</h6>
            </div>
            <div className="col-md-3 col-6">
              <p className="fs-12 text-muted mb-1">Pass Marks</p>
              <h6 className="fs-14 mb-0">{passMarks}</h6>
            </div>
            <div className="col-md-3 col-6">
              <p className="fs-12 text-muted mb-1">Total Students</p>
              <h6 className="fs-14 mb-0">{summary.students}</h6>
            </div>
            <div className="col-md-3 col-6">
              <p className="fs-12 text-muted mb-1">Marking Type</p>
              <span className="badge badge-soft-primary">{markingType}</span>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-3">
          <span className="fs-13">
            <span className="text-muted">Students</span> <span className="fw-medium">{summary.students}</span>
          </span>
          <span className="fs-13">
            <span className="text-muted">Marks Entered</span>{' '}
            <span className="fw-medium text-success">{summary.entered}</span>
          </span>
          <span className="fs-13">
            <span className="text-muted">Pending</span>{' '}
            <span className="fw-medium text-warning">{pad2(summary.pending)}</span>
          </span>
          <span className="fs-13">
            <span className="text-muted">Absent</span>{' '}
            <span className="fw-medium text-danger">{pad2(summary.absent)}</span>
          </span>
          <span className="fs-13">
            <span className="text-muted">Last Saved</span> <span className="fw-medium">{lastSaved}</span>
          </span>
        </div>
      </div>
    </div>

    {/* Exam Information */}
    <div className="col-12 col-xl-4 d-flex">
      <div className="card flex-fill">
        <div className="card-header d-flex align-items-center">
          <span className="avatar avatar-sm bg-primary-transparent text-primary rounded me-2">
            <i className="ti ti-info-circle" />
          </span>
          <h6 className="mb-0">Exam Information</h6>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">
            <span className="fs-13 text-muted">Exam Name</span>
            <span className="fs-13 fw-medium">{context.examination}</span>
          </li>
          <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">
            <span className="fs-13 text-muted">Subject</span>
            <span className="fs-13 fw-medium">{context.subject}</span>
          </li>
          <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">
            <span className="fs-13 text-muted">Teacher</span>
            <span className="fs-13 fw-medium">{context.teacher}</span>
          </li>
          <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">
            <span className="fs-13 text-muted">Maximum Marks</span>
            <span className="fs-13 fw-medium">{maxMarks}</span>
          </li>
          <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">
            <span className="fs-13 text-muted">Passing Marks</span>
            <span className="fs-13 fw-medium">{passMarks}</span>
          </li>
          <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2 py-2">
            <span className="fs-13 text-muted">Grading Method</span>
            <span className="fs-13 fw-medium">{gradingMethod}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default ExamSelectionPanel;
