import Modal from '@components/ui/Modal';
import { confirmModalChecklist } from '../data/studentPromotion.data';

export interface PromotionModalsProps {
  open: boolean;
  promoteCount: number;
  onClose: () => void;
  onFinalize: () => void;
}

const PromotionModals = ({ open, promoteCount, onClose, onFinalize }: PromotionModalsProps) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Confirm Student Promotion"
    hideHeader
    dialogClassName="modal-lg"
    contentClassName="student-promotion"
    footer={
      <>
        <button type="button" className="btn btn-light" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={onFinalize}>
          <i className="ti ti-check me-1" />
          Confirm &amp; Promote
        </button>
      </>
    }
  >
    <div className="confirm-hero">
      <span className="ic">
        <i className="ti ti-arrow-big-up-lines" />
      </span>
      <div>
        <h4>Confirm Student Promotion</h4>
        <span>2024 - 2025 &rarr; 2025 - 2026 &middot; Grade III-A to Grade IV</span>
      </div>
      <button
        type="button"
        className="btn-close custom-btn-close ms-auto"
        aria-label="Close"
        style={{ filter: 'brightness(4)' }}
        onClick={onClose}
      >
        <i className="ti ti-x" />
      </button>
    </div>
    <div className="confirm-stats mb-3">
      <div className="confirm-stat promotion-tone-success">
        <b id="pwCfPromote">{promoteCount}</b>
        <span>To Promote</span>
      </div>
      <div className="confirm-stat promotion-tone-danger">
        <b>2</b>
        <span>Detained</span>
      </div>
      <div className="confirm-stat promotion-tone-warning">
        <b>3</b>
        <span>With Warnings</span>
      </div>
    </div>
    <div className="check-list mb-3">
      {confirmModalChecklist.map((item) => (
        <label className="column-label" key={item.text}>
          <i className={item.icon} />
          {item.text}
        </label>
      ))}
    </div>
    <div className="alert alert-outline-primary bg-primary-transparent p-2 d-flex align-items-center mb-0">
      <i className="ti ti-info-circle me-1" />
      This action enrolls selected students into the new session and cannot be undone.
    </div>
  </Modal>
);

export default PromotionModals;
