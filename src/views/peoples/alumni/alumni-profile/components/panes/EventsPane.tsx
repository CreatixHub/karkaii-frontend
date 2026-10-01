import { eventsAttended } from '../../data/alumniProfile.data';

const EventsPane = () => (
  <div>
    <h5 className="mb-3">Events Attended</h5>
    <div className="table-responsive">
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Event</th>
            <th>Date</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {eventsAttended.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.date}</td>
              <td>{row.role}</td>
              <td>
                <span className="badge badge-soft-success">{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default EventsPane;
