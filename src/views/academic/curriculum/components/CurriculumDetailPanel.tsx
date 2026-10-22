import Offcanvas from '@components/ui/Offcanvas';
import { Link } from 'react-router-dom';
import type { CardMenuItem, CurriculumCard } from '../data/curriculum.data';
import { detailActions } from '../data/curriculum.data';

export interface CurriculumDetailPanelProps {
  open: boolean;
  onClose: () => void;
  card: CurriculumCard | null;
  revealed: boolean;
  onAction: (item: CardMenuItem, card: CurriculumCard) => void;
}

const CurriculumDetailPanel = ({ open, onClose, card, revealed, onAction }: CurriculumDetailPanelProps) => (
  <Offcanvas open={open} onClose={onClose} title="Curriculum Details" placement="end">
    {card ? (
      <div id="cur_detail">
        {/* Detail header */}
        <div className="d-flex align-items-start mb-3">
          <span className={`avatar avatar-lg bg-${card.tone}-transparent text-${card.tone} rounded me-3 flex-shrink-0`}>
            <i className={`${card.icon} fs-24`} />
          </span>
          <div className="flex-fill">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h5 className="mb-0">{card.name}</h5>
              <span className={`badge cur-detail-status ${card.statusBadge}`}>{card.status}</span>
            </div>
            <span className="fs-12 text-muted detail-meta">CUR-2025 · {card.meta}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="d-flex align-items-center flex-wrap gap-1 mb-3 pb-3 border-bottom">
          {detailActions.map((item) => (
            <Link
              key={item.id}
              to="#"
              className="btn btn-icon btn-sm rounded-circle flex-shrink-0 btn-outline-light bg-white"
              title={item.label}
              aria-label={item.label}
              onClick={() => onAction(item, card)}
            >
              <i className={item.icon} />
            </Link>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="fs-12 text-muted">Completion</span>
            <span className={`fs-13 fw-semibold cur-detail-pct ${card.barClass.replace('bg-', 'text-')}`}>
              {card.percent}%
            </span>
          </div>
          <div
            className="progress curriculum-progress"
            style={{ height: 6 }}
            role="progressbar"
            aria-valuenow={card.percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`progress-bar cur-detail-bar ${card.barClass}`}
              style={{ width: revealed ? `${card.percent}%` : 0 }}
            />
          </div>
        </div>

        {/* Stat trio */}
        <div className="row text-center g-2 mb-3">
          {[
            { value: card.units, label: 'Units' },
            { value: card.lessons, label: 'Lessons' },
            { value: card.topics, label: 'Topics' },
          ].map((stat) => (
            <div className="col-4" key={stat.label}>
              <div className="bg-light rounded p-2">
                <h6 className="mb-0 detail-stat">{stat.value}</h6>
                <span className="fs-11 text-muted">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Overview */}
        <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Overview</h6>
        <ul className="list-unstyled fs-13 mb-3">
          <li className="d-flex justify-content-between py-1">
            <span className="text-muted">Type</span>
            <span className="text-dark">{card.typeLabel}</span>
          </li>
          <li className="d-flex justify-content-between py-1">
            <span className="text-muted">Status</span>
            <span className="text-dark">{card.status}</span>
          </li>
          <li className="d-flex justify-content-between py-1">
            <span className="text-muted">Last Updated</span>
            <span className="text-dark">{card.updated.replace('Updated ', '')}</span>
          </li>
        </ul>

        <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Structure</h6>
        <p className="fs-13 text-muted mb-0">
          {card.units} units · {card.lessons} lessons · {card.topics} topics across the 2024 / 2025 session.
        </p>
      </div>
    ) : null}
  </Offcanvas>
);

export default CurriculumDetailPanel;
