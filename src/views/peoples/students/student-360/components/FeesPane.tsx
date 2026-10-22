import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import type { FeeTransaction } from '../data/student360.data';

const routes = all_routes;

export interface FeesPaneProps {
  transactions: FeeTransaction[];
}

const FeesPane = ({ transactions }: FeesPaneProps) => (
  <div className="tab-pane fade show active" id="s360-fees">
    <div className="d-flex align-items-center justify-content-between mb-3">
      <h5 className="mb-0">Fee Transactions</h5>
      <Link to={routes.studentFees} className="btn btn-sm btn-light">
        Fee Details
      </Link>
    </div>
    <div className="table-responsive">
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Receipt</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.receipt}</td>
              <td>{transaction.type}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.date}</td>
              <td>
                <span className={`badge ${transaction.status.className}`}>
                  {transaction.status.label}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default FeesPane;
