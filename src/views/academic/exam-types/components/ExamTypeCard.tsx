import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import type { CardMenuItem, ExamType } from '../data/examTypes.data';
import { cardMenuItems } from '../data/examTypes.data';

export interface ExamTypeCardProps {
  row: ExamType;
  revealed: boolean;
  menuOpen: boolean;
  onOpenMenu: (id: string | null) => void;
  onMenuAction: (item: CardMenuItem, row: ExamType) => void;
}

const ExamTypeCard = ({ row, revealed, menuOpen, onOpenMenu, onMenuAction }: ExamTypeCardProps) => (
  <div className="card flex-fill">
    <div className="card-body">
      <div className="d-flex align-items-start justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <span className={`avatar avatar-lg ${row.avatarClass} rounded me-2`}>
            <i className={`${row.icon} fs-20`} />
          </span>
          <div>
            <h6 className="fs-14 mb-1">{row.name}</h6>
            <div className="d-flex align-items-center flex-wrap gap-1">
              <span className="badge badge-soft-bordered fs-10">{row.code}</span>
              <span className={`badge ${row.statusBadge} d-inline-flex align-items-center`}>
                <i className="ti ti-circle-filled fs-5 me-1" />
                {row.status}
              </span>
            </div>
          </div>
        </div>
        <div className="dropdown">
          <Link
            to="#"
            className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
            aria-expanded={menuOpen}
            aria-label="Exam type actions"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onOpenMenu(menuOpen ? null : row.id);
            }}
          >
            <i className="ti ti-dots-vertical" />
          </Link>
          <ul className={`dropdown-menu dropdown-menu-end p-2${menuOpen ? ' show' : ''}`}>
            {cardMenuItems.map((item) => (
              <Fragment key={item.id}>
                {item.divider ? (
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                ) : null}
                <li>
                  <Link
                    className={`dropdown-item rounded-1${item.danger ? ' text-danger' : ''}`}
                    to="#"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onOpenMenu(null);
                      onMenuAction(item, row);
                    }}
                  >
                    <i className={`${item.icon} me-2`} />
                    {item.label}
                  </Link>
                </li>
              </Fragment>
            ))}
          </ul>
        </div>
      </div>

      <p className="fs-12 text-muted mb-3 d-flex align-items-center">
        <i className="ti ti-category-2 me-1" />
        {row.categoryLabel}
      </p>

      <div className="border rounded p-2 mb-3">
        <div className="row g-0 text-center">
          <div className="col-4 border-end">
            <p className="fs-11 text-muted mb-1">Total</p>
            <h6 className="fs-14 mb-0">{row.totalMarks}</h6>
          </div>
          <div className="col-4 border-end">
            <p className="fs-11 text-muted mb-1">Pass</p>
            <h6 className="fs-14 mb-0">{row.passMarks}</h6>
          </div>
          <div className="col-4">
            <p className="fs-11 text-muted mb-1">Duration</p>
            <h6 className="fs-14 mb-0">{row.duration}</h6>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between">
        <span className="fs-12 text-muted">Weightage</span>
        <span className="fs-12 fw-medium">{row.weightageLabel}</span>
      </div>
      <div className="progress progress-sm mt-2">
        <div
          className={`progress-bar ${row.barClass}`}
          role="progressbar"
          style={{ width: revealed ? `${row.weightage}%` : 0 }}
          aria-valuenow={row.weightage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  </div>
);

export default ExamTypeCard;
