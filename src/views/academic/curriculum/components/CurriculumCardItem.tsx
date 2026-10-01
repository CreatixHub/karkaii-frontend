import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import type { CardMenuItem, CurriculumCard } from '../data/curriculum.data';
import { cardMenuItems } from '../data/curriculum.data';

export interface CurriculumCardItemProps {
  card: CurriculumCard;
  active: boolean;
  revealed: boolean;
  menuOpen: boolean;
  onOpenMenu: (id: string | null) => void;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onMenuAction: (item: CardMenuItem, card: CurriculumCard) => void;
}

const CurriculumCardItem = ({
  card,
  active,
  revealed,
  menuOpen,
  onOpenMenu,
  onSelect,
  onToggleFavorite,
  onMenuAction,
}: CurriculumCardItemProps) => (
  <div
    className={`card card-hover curriculum-card mb-0${active ? ' active' : ''}`}
    tabIndex={0}
    aria-current={active}
    onClick={() => onSelect(card.id)}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(card.id);
      }
    }}
    role="tab"
  >
    <div className="card-body">
      <div className="d-flex align-items-start mb-3">
        <span className={`avatar avatar-lg bg-${card.tone}-transparent text-${card.tone} rounded me-2 flex-shrink-0`}>
          <i className={`${card.icon} fs-24`} />
        </span>
        <div className="flex-fill overflow-hidden">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="mb-0 text-truncate">{card.name}</h6>
            <div className="d-flex align-items-center">
              <Link
                to="#"
                className={`btn btn-icon btn-sm rounded-circle flex-shrink-0 ${
                  card.favorite ? 'text-warning' : 'text-muted'
                }`}
                aria-label="Toggle favorite"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onToggleFavorite(card.id);
                }}
              >
                <i className={card.favorite ? 'ti ti-star-filled' : 'ti ti-star'} />
              </Link>
              <div className="dropdown">
                <Link
                  to="#"
                  className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                  aria-label="Curriculum menu"
                  aria-expanded={menuOpen}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onOpenMenu(menuOpen ? null : card.id);
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
                            event.stopPropagation();
                            onOpenMenu(null);
                            onMenuAction(item, card);
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
          </div>
          <span className="fs-12 text-muted d-block">{card.meta}</span>
          <div className="d-flex align-items-center flex-wrap gap-1 mt-2">
            <span className={`badge ${card.typeBadge}`}>{card.typeLabel}</span>
            <span className={`badge ${card.statusBadge} d-inline-flex align-items-center`}>
              <i className="ti ti-circle-filled fs-5 me-1" />
              {card.status}
            </span>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-1">
        <span className="fs-12 text-muted">Completion</span>
        <span className="fs-12 fw-semibold text-dark">{card.percent}%</span>
      </div>
      <div
        className="progress curriculum-progress mb-3"
        style={{ height: 6 }}
        role="progressbar"
        aria-valuenow={card.percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`progress-bar ${card.barClass}`} style={{ width: revealed ? `${card.percent}%` : 0 }} />
      </div>

      <div className="row text-center g-2 curriculum-card-extra">
        {[
          { value: card.units, label: 'Units' },
          { value: card.lessons, label: 'Lessons' },
          { value: card.topics, label: 'Topics' },
        ].map((stat) => (
          <div className="col-4" key={stat.label}>
            <div className="bg-light rounded p-2">
              <h6 className="mb-0">{stat.value}</h6>
              <span className="fs-11 text-muted">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
        <span className="fs-11 text-muted">
          <i className="ti ti-clock me-1" />
          {card.updated}
        </span>
        <Link
          to="#"
          className="btn btn-light btn-sm"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(card.id);
          }}
        >
          Open <i className="ti ti-arrow-right ms-1" />
        </Link>
      </div>
    </div>
  </div>
);

export default CurriculumCardItem;
