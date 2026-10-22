import { donationRows, donationSummary } from '../../data/alumniProfile.data';

export interface DonationsPaneProps {
  onAddDonation: () => void;
}

const DonationsPane = ({ onAddDonation }: DonationsPaneProps) => (
  <div>
    <div className="d-flex align-items-center justify-content-between mb-3">
      <h5 className="mb-0">Donations</h5>
      <button type="button" className="btn btn-sm btn-primary" onClick={onAddDonation}>
        <i className="ti ti-plus me-1" />
        Add Donation
      </button>
    </div>
    <div className="row mb-3">
      {donationSummary.map((tile) => (
        <div className="col-md-4" key={tile.id}>
          <div className="border rounded p-3">
            <span className="fs-12 text-muted">{tile.label}</span>
            <h5 className={`mb-0${tile.valueClass ? ` ${tile.valueClass}` : ''}`}>{tile.value}</h5>
          </div>
        </div>
      ))}
    </div>
    <div className="table-responsive">
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Amount</th>
            <th>Purpose</th>
            <th>Date</th>
            <th>Receipt</th>
          </tr>
        </thead>
        <tbody>
          {donationRows.map((row) => (
            <tr key={row.receipt}>
              <td>{row.amount}</td>
              <td>{row.purpose}</td>
              <td>{row.date}</td>
              <td>
                <a href="#" className="link-primary" onClick={(event) => event.preventDefault()}>
                  {row.receipt}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DonationsPane;
