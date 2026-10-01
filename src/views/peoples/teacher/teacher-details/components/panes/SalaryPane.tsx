import type { PayslipRow, SalaryLine } from '../../data/teacherDetailsPanes.data';
import { payslips, salaryDeductions, salaryEarnings } from '../../data/teacherDetailsPanes.data';

export interface SalaryPaneProps {
  active: boolean;
  onDownloadPayslip: (payslip: PayslipRow) => void;
}

/** One `.border.rounded.p-3` breakdown block. */
const Breakdown = ({ title, lines }: { title: string; lines: SalaryLine[] }) => (
  <div className="col-12 col-md-6">
    <div className="border rounded p-3">
      <h6 className="mb-3">{title}</h6>
      <ul className="list-unstyled mb-0">
        {lines.map((line) => (
          <li
            className={`d-flex justify-content-between py-1 fs-13${
              line.total ? ' border-top pt-2 mt-1' : ''
            }`}
            key={line.id}
          >
            <span className={line.total ? 'fw-medium text-dark' : 'text-muted'}>{line.label}</span>
            <span className={line.total ? 'fw-medium text-success' : 'text-dark'}>{line.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const SalaryPane = ({ active, onDownloadPayslip }: SalaryPaneProps) => (
  <div className={`tab-pane fade${active ? ' show active' : ''}`} id="salary">
    <div className="row g-3 mb-3">
      <Breakdown title="Earnings" lines={salaryEarnings} />
      <Breakdown title="Deductions" lines={salaryDeductions} />
    </div>
    <div className="card card-hover">
      <div className="card-header">
        <h5 className="d-flex align-items-center gap-2">
          <i className="ti ti-report-money text-primary" />
          Recent Payslips
        </h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="thead-light">
              <tr>
                <th>Month</th>
                <th>Net Pay</th>
                <th>Paid On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map((row) => (
                <tr key={row.id}>
                  <td>{row.month}</td>
                  <td>{row.netPay}</td>
                  <td>{row.paidOn}</td>
                  <td>
                    <span className={`badge ${row.statusClass} d-inline-flex align-items-center`}>
                      <i className="ti ti-circle-filled fs-5 me-1" />
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-outline-light bg-white"
                      title={`Download ${row.month} payslip`}
                      aria-label={`Download ${row.month} payslip`}
                      onClick={() => onDownloadPayslip(row)}
                    >
                      <i className="ti ti-download" />
                    </button>
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

export default SalaryPane;
