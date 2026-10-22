import { Link } from 'react-router-dom';
import type { RankingRecord } from '../data/rankingSystem.data';
import { statusBadges } from '../data/rankingSystem.data';

export interface RankingCardProps {
  record: RankingRecord;
  onEdit: (record: RankingRecord) => void;
  onDelete: (record: RankingRecord) => void;
}

const RankingCard = ({ record, onEdit, onDelete }: RankingCardProps) => (
  <div className="card flex-fill">
    <div className="card-body">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className={`avatar avatar-lg bg-${record.tone}-transparent text-${record.tone} rounded`}>
          <i className={`${record.icon} fs-24`} />
        </span>
        <span className={`badge ${statusBadges[record.status]} d-inline-flex align-items-center`}>
          <i className="ti ti-circle-filled fs-5 me-1" />
          {record.status}
        </span>
      </div>
      <h5 className="mb-1">{record.name}</h5>
      <p className="text-muted mb-3">{record.description}</p>
      <ul className="list-unstyled mb-3">
        <li className="d-flex justify-content-between py-1 fs-13">
          <span className="text-muted">Members</span>
          <span className="text-dark">{record.members}</span>
        </li>
        <li className="d-flex justify-content-between py-1 fs-13">
          <span className="text-muted">Updated</span>
          <span className="text-dark">{record.updated}</span>
        </li>
      </ul>
      <div className="d-flex align-items-center gap-2">
        <Link
          to="#"
          className="btn btn-light btn-sm flex-fill"
          onClick={(event) => {
            event.preventDefault();
            onEdit(record);
          }}
        >
          <i className="ti ti-edit me-1" />
          Edit
        </Link>
        <Link
          to="#"
          className="btn btn-outline-danger btn-sm"
          title="Delete"
          aria-label={`Delete ${record.name}`}
          onClick={(event) => {
            event.preventDefault();
            onDelete(record);
          }}
        >
          <i className="ti ti-trash" />
        </Link>
      </div>
    </div>
  </div>
);

export default RankingCard;
