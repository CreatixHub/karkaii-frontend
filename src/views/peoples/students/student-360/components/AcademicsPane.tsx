import type { ExamResult } from '../data/student360.data';

export interface AcademicsPaneProps {
  results: ExamResult[];
}

const AcademicsPane = ({ results }: AcademicsPaneProps) => (
  <div className="tab-pane fade show active" id="s360-academics">
    <h5 className="mb-3">Recent Exam Results</h5>
    <div className="table-responsive">
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Exam</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id}>
              <td>{result.exam}</td>
              <td>{result.subject}</td>
              <td>{result.marks}</td>
              <td>
                <span className={`badge ${result.grade.className}`}>{result.grade.label}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AcademicsPane;
