import { routineRows } from '../../data/teacherDetailsPanes.data';

export interface RoutinePaneProps {
  active: boolean;
}

const RoutinePane = ({ active }: RoutinePaneProps) => (
  <div className={`tab-pane fade${active ? ' show active' : ''}`} id="routine">
    <div className="card card-hover">
      <div className="card-header">
        <h5 className="d-flex align-items-center gap-2">
          <i className="ti ti-table-options text-primary" />
          Weekly Routine
        </h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="thead-light">
              <tr>
                <th>Day</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Time</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {routineRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.day}</td>
                  <td>{row.subject}</td>
                  <td>{row.className}</td>
                  <td>{row.time}</td>
                  <td>{row.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default RoutinePane;
