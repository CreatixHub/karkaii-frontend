import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type {
  ExamContext,
  GradeBand,
  MarksEntryModalId,
  RowEvaluation,
  StudentRow,
} from '../data/marksEntry.data';
import { gradeFor, quickRemarks, shortSection } from '../data/marksEntry.data';

const routes = all_routes;

export interface MarksEntryModalsProps {
  active: MarksEntryModalId | null;
  student: StudentRow | null;
  /** The row's live derived state — grade, percentage and status follow the typed mark. */
  evaluation: RowEvaluation | null;
  context: ExamContext;
  maxMarks: number;
  passMarks: number;
  saveState: 'Draft' | 'Published';
  lastSaved: string;
  onClose: () => void;
  onSaveRemark: (id: string, remark: string) => void;
}

interface HistoryLine {
  exam: string;
  marks: string;
  grade: GradeBand;
  result: string;
  resultBadge: string;
  enteredOn: string;
}

const MarksEntryModals = ({
  active,
  student,
  evaluation,
  context,
  maxMarks,
  passMarks,
  saveState,
  lastSaved,
  onClose,
  onSaveRemark,
}: MarksEntryModalsProps) => {
  const [quickRemark, setQuickRemark] = useState(quickRemarks[0]);
  const [remark, setRemark] = useState('');

  // Opening the dialog seeds the textarea from the row; picking a quick remark replaces it.
  useEffect(() => {
    if (active !== 'remarks' || !student) return;
    setRemark(student.remarks);
    setQuickRemark(quickRemarks.includes(student.remarks) ? student.remarks : quickRemarks[0]);
  }, [active, student]);

  if (!student || !evaluation) return null;

  const classAndSection = `${context.className} · ${shortSection(context.section)}`;
  const present = student.attendance === 'Present';

  const history: HistoryLine[] = student.history.map((entry) => {
    const percent = (entry.marks / entry.max) * 100;
    const passed = percent >= (passMarks / maxMarks) * 100;
    return {
      exam: entry.exam,
      marks: `${entry.marks} / ${entry.max}`,
      grade: gradeFor(Math.round(percent * 10) / 10),
      result: passed ? 'Pass' : 'Fail',
      resultBadge: passed ? 'badge-soft-success' : 'badge-soft-danger',
      enteredOn: entry.enteredOn,
    };
  });

  history.push({
    exam: context.examination,
    marks: `${evaluation.value === '' ? '—' : evaluation.value} / ${maxMarks}`,
    grade: evaluation.grade,
    result: saveState,
    resultBadge: saveState === 'Published' ? 'badge-soft-success' : 'badge-soft-warning',
    enteredOn: `Today, ${lastSaved}`,
  });

  return (
    <>
      {/* Student Details */}
      <Modal
        open={active === 'details'}
        onClose={onClose}
        title="Student Details"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to={routes.studentDetail} className="btn btn-primary">
              Open Profile
            </Link>
          </>
        }
      >
        <div className="d-flex align-items-center pb-3 mb-3 border-bottom">
          <span className="avatar avatar-lg rounded me-3 flex-shrink-0">
            <ImageWithBasePath src={student.avatar} alt="Student" />
          </span>
          <div>
            <h5 className="fs-14 mb-1">{student.name}</h5>
            <p className="mb-1 fs-12 text-muted">
              Roll No. {student.id} &nbsp;•&nbsp; {student.admissionNo}
            </p>
            <span
              className={`badge ${present ? 'badge-soft-success' : 'badge-soft-warning'} d-inline-flex align-items-center`}
            >
              <i className={`${present ? 'ti ti-circle-filled fs-5' : 'ti ti-user-off'} me-1`} />
              {student.attendance}
            </span>
          </div>
        </div>
        <div className="border rounded overflow-hidden">
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex align-items-center justify-content-between">
              <span className="fs-13 text-muted">Class &amp; Section</span>
              <span className="fs-13 fw-medium">{classAndSection}</span>
            </li>
            <li className="list-group-item d-flex align-items-center justify-content-between">
              <span className="fs-13 text-muted">Subject</span>
              <span className="fs-13 fw-medium">{context.subject}</span>
            </li>
            <li className="list-group-item d-flex align-items-center justify-content-between">
              <span className="fs-13 text-muted">Marks Obtained</span>
              <span className="fs-13 fw-medium">
                {evaluation.value === '' ? '—' : evaluation.value} / {maxMarks}
              </span>
            </li>
            <li className="list-group-item d-flex align-items-center justify-content-between">
              <span className="fs-13 text-muted">Grade</span>
              <span className={`badge ${evaluation.grade.badge}`}>{evaluation.grade.grade}</span>
            </li>
            <li className="list-group-item d-flex align-items-center justify-content-between">
              <span className="fs-13 text-muted">Parent / Guardian</span>
              <span className="fs-13 fw-medium">{student.guardian}</span>
            </li>
            <li className="list-group-item d-flex align-items-center justify-content-between">
              <span className="fs-13 text-muted">Contact</span>
              <span className="fs-13 fw-medium">{student.contact}</span>
            </li>
          </ul>
        </div>
      </Modal>

      {/* Marks History */}
      <Modal
        open={active === 'history'}
        onClose={onClose}
        title="Marks History"
        dialogClassName="modal-lg"
        titleAccessory={
          <p className="mb-0 fs-12 text-muted ms-2">
            {student.name} &nbsp;•&nbsp; {context.subject} &nbsp;•&nbsp; {classAndSection}
          </p>
        }
        bodyClassName="p-0"
        footer={
          <Link to="#" className="btn btn-light" onClick={onClose}>
            Close
          </Link>
        }
      >
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <caption className="visually-hidden">Previous examination results for {student.name}</caption>
            <thead className="table-light">
              <tr>
                <th>Examination</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Result</th>
                <th>Entered On</th>
              </tr>
            </thead>
            <tbody>
              {history.map((line) => (
                <tr key={line.exam}>
                  <td className="fs-13">{line.exam}</td>
                  <td className="fs-13">{line.marks}</td>
                  <td>
                    <span className={`badge ${line.grade.badge}`}>{line.grade.grade}</span>
                  </td>
                  <td>
                    <span className={`badge ${line.resultBadge}`}>{line.result}</span>
                  </td>
                  <td className="fs-13">{line.enteredOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Edit Remarks */}
      <Modal
        open={active === 'remarks'}
        onClose={onClose}
        title="Edit Remarks"
        titleAccessory={
          <p className="mb-0 fs-12 text-muted ms-2">
            {student.name} &nbsp;•&nbsp; Roll No. {student.id}
          </p>
        }
        onSubmit={(event) => {
          event.preventDefault();
          onSaveRemark(student.id, remark.trim());
          onClose();
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Save Remark
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="me-quick-remark">
            Quick Remark
          </label>
          <select
            className="form-select"
            id="me-quick-remark"
            value={quickRemark}
            onChange={(event) => {
              setQuickRemark(event.target.value);
              setRemark(event.target.value);
            }}
          >
            {quickRemarks.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="me-remark">
            Remark
          </label>
          <textarea
            className="form-control"
            rows={3}
            id="me-remark"
            value={remark}
            onChange={(event) => setRemark(event.target.value)}
          />
        </div>
      </Modal>
    </>
  );
};

export default MarksEntryModals;
