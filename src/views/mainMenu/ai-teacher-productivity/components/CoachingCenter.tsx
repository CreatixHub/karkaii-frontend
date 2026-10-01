import { coachingCards } from '../data/productivity.data';
import type { TeacherModalId } from '../data/modals.data';

export interface CoachingCenterProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

const CoachingCenter = ({ onOpenModal }: CoachingCenterProps) => (
  <div className="row g-4 mb-5">
    {coachingCards.map((card) => (
      <div className="col-xl-3 col-md-6" key={card.id}>
        <div className="tch-coach">
          <span className={`tch-coach-ic ${card.tone}`}>
            <i className={card.icon} />
          </span>
          <p className="tch-coach-title">{card.title}</p>
          <p className="fs-12 text-muted mb-0">{card.summary}</p>

          <div className="tch-coach-foot">
            <span className={`tch-pill ${card.tone}`}>{card.priority}</span>
            <span className="tch-pill is-ai">{card.confidence}%</span>
          </div>
          <div className="d-flex align-items-center justify-content-between gap-2 mt-3">
            <span className="d-flex flex-column">
              <span className="tch-lbl">Expected</span>
              <span className="fs-13 fw-semibold text-dark">{card.expected}</span>
            </span>
            <span className="d-flex flex-column text-end">
              <span className="tch-lbl">Timeline</span>
              <span className="fs-13 fw-semibold text-dark">{card.timeline}</span>
            </span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-primary w-100 mt-3 d-inline-flex align-items-center justify-content-center"
            onClick={() => onOpenModal(card.target)}
          >
            <i className="ti ti-bolt me-1" />
            Apply coaching
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default CoachingCenter;
