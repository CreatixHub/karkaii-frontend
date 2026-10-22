import { issuedBooks } from '../../data/teacherDetailsPanes.data';

export interface LibraryPaneProps {
  active: boolean;
}

const LibraryPane = ({ active }: LibraryPaneProps) => (
  <div className={`tab-pane fade${active ? ' show active' : ''}`} id="library">
    <div className="card card-hover">
      <div className="card-header">
        <h5 className="d-flex align-items-center gap-2">
          <i className="ti ti-books text-primary" />
          Issued Books
        </h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="thead-light">
              <tr>
                <th>Book</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {issuedBooks.map((row) => (
                <tr key={row.id}>
                  <td>{row.book}</td>
                  <td>{row.issueDate}</td>
                  <td>{row.dueDate}</td>
                  <td>
                    <span className={`badge ${row.statusClass} d-inline-flex align-items-center`}>
                      <i className="ti ti-circle-filled fs-5 me-1" />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default LibraryPane;
