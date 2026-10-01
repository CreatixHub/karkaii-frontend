import type { LeaveBalance, LeaveRow } from '../../data/teacherLeaves.data';
import { leaveStatusClass } from '../../data/teacherLeaves.data';

export interface LeavesPaneProps {
  balances: LeaveBalance[];
  rows: LeaveRow[];
  onApplyLeave: () => void;
}

const LeavesPane = ({ balances, rows, onApplyLeave }: LeavesPaneProps) => (
  <>
    <div className="row gx-3">
      {balances.map((balance) => (
        <div className="col-lg-6 col-xxl-3 d-flex" key={balance.id}>
          <div className="card flex-fill">
            <div className="card-body">
              <h5 className="mb-2">
                {balance.type} ({balance.allocated})
              </h5>
              <div className="d-flex align-items-center flex-wrap">
                <p className="border-end pe-2 me-2 mb-0">Used : {balance.used}</p>
                <p className="mb-0">Available : {balance.allocated - balance.used}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
        <h4 className="mb-3">Leaves</h4>
        {/* `data-bs-toggle="modal"` in the template; real state here. */}
        <button
          type="button"
          className="btn btn-primary d-inline-flex align-items-center mb-3"
          onClick={onApplyLeave}
        >
          <i className="ti ti-calendar-event me-2" />
          Apply Leave
        </button>
      </div>
      {/* Leaves List */}
      <div className="card-body p-0 py-3">
        <div className="custom-datatable-filter table-responsive">
          <table className="table datatable dataTable">
            <thead className="thead-light">
              <tr>
                <th className="no-sort">Leave Type</th>
                <th className="no-sort">Leave Date</th>
                <th className="no-sort">No of Days</th>
                <th className="no-sort">Applied On</th>
                <th className="no-sort">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="text-dark">{row.type}</td>
                  <td>{row.dateRange}</td>
                  <td>{row.days}</td>
                  <td>{row.appliedOn}</td>
                  <td>
                    <span
                      className={`badge ${leaveStatusClass[row.status]} d-inline-flex align-items-center`}
                    >
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
      {/* /Leaves List */}
    </div>
  </>
);

export default LeavesPane;
