import type { ReviewCard } from '../data/addAdmission.data';
import { reviewCards } from '../data/addAdmission.data';

export interface ReviewStepProps {
  confirmed: boolean;
  onConfirm: (checked: boolean) => void;
  onGoTo: (index: number) => void;
}

const ReviewStep = ({ confirmed, onConfirm, onGoTo }: ReviewStepProps) => (
  <>
    <div className="alert alert-info d-flex align-items-center" role="alert">
      <i className="ti ti-info-circle me-2" />
      <span>Please review the details before submitting. You can go back to any step to make changes.</span>
    </div>
    <div className="row">
      {reviewCards.map((card: ReviewCard) => (
        <div className="col-md-6" key={card.title}>
          <div className="border rounded p-3 mb-3">
            <h6 className="mb-2">{card.title}</h6>
            <p className="fs-13 mb-1 text-muted">{card.summary}</p>
            <a
              href={`#${card.target}`}
              className="link-primary fs-13"
              onClick={(event) => {
                event.preventDefault();
                onGoTo(card.step);
              }}
            >
              Edit
            </a>
          </div>
        </div>
      ))}
    </div>
    <div className="form-check mb-3">
      <input
        className="form-check-input"
        type="checkbox"
        id="confirm_terms"
        checked={confirmed}
        onChange={(event) => onConfirm(event.target.checked)}
      />
      <label className="form-check-label" htmlFor="confirm_terms">
        I confirm the information provided is accurate.
      </label>
    </div>
  </>
);

export default ReviewStep;
