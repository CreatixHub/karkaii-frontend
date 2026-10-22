import { feeSummary } from '../../data/admissionDetails.data';

export interface FeesPaneProps {
  onCollect: () => void;
}

const FeesPane = ({ onCollect }: FeesPaneProps) => (
  <div>
    <div className="d-flex align-items-center justify-content-between mb-3">
      <h5 className="mb-0">Fee Collection</h5>
      <button type="button" className="btn btn-sm btn-primary" onClick={onCollect}>
        <i className="ti ti-report-money me-1" />
        Collect Fees
      </button>
    </div>
    <div className="row mb-3">
      <div className="col-md-4">
        <div className="border rounded p-3">
          <span className="fs-12 text-muted">Total</span>
          <h5 className="mb-0">{feeSummary.total}</h5>
        </div>
      </div>
      <div className="col-md-4">
        <div className="border rounded p-3">
          <span className="fs-12 text-muted">Paid</span>
          <h5 className="mb-0 text-success">{feeSummary.paid}</h5>
        </div>
      </div>
      <div className="col-md-4">
        <div className="border rounded p-3">
          <span className="fs-12 text-muted">Balance</span>
          <h5 className="mb-0 text-danger">{feeSummary.balance}</h5>
        </div>
      </div>
    </div>
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="thead-light">
          <tr>
            <th>Receipt</th>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} className="text-center text-muted py-4">
              No payments collected yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default FeesPane;
