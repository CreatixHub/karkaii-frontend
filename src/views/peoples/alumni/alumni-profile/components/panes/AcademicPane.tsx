import { academicHistory } from '../../data/alumniProfile.data';

const AcademicPane = () => (
  <div>
    <h5 className="mb-3">Academic History</h5>
    <div className="table-responsive">
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Class</th>
            <th>Year</th>
            <th>Grade</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {academicHistory.map((row) => (
            <tr key={row.cls}>
              <td>{row.cls}</td>
              <td>{row.year}</td>
              <td>{row.grade}</td>
              <td>{row.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AcademicPane;
