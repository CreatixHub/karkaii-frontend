import { copilotActions } from '../data/productivity.data';
import type { TeacherModalId } from '../data/modals.data';

export interface TeachingCopilotProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

const TeachingCopilot = ({ onOpenModal }: TeachingCopilotProps) => (
  <div className="card mb-5">
    <div className="card-body">
      <div className="row g-3">
        {copilotActions.map((action) => (
          <div className="col-12 col-xl-6" key={action.n}>
            <button type="button" className="tch-do" onClick={() => onOpenModal(action.target)}>
              <span className="tch-do-n">{action.n}</span>
              <span className="flex-fill overflow-hidden">
                <span className="d-block fs-14 fw-medium text-dark">{action.title}</span>
                <span className="d-block fs-12 text-muted">{action.summary}</span>
              </span>
              <i className="ti ti-arrow-right tch-do-go" />
            </button>
          </div>
        ))}
      </div>
      <div className="tch-empty mt-4">
        <span className="tch-empty-ic">
          <i className="ti ti-file-off" />
        </span>
        <p className="fs-15 fw-semibold text-dark mb-1">No drafts awaiting review</p>
        <p className="fs-13 text-muted mb-0">
          Anything the copilot produces waits here until you publish or discard it. Nothing is
          shared with a teacher automatically.
        </p>
      </div>
    </div>
  </div>
);

export default TeachingCopilot;
