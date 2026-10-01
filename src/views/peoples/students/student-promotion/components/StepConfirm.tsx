export interface StepConfirmProps {
  active: boolean;
  promoteCount: number;
  checklist: string[];
  onBack: () => void;
  onOpenConfirm: () => void;
}

const StepConfirm = ({ active, promoteCount, checklist, onBack, onOpenConfirm }: StepConfirmProps) => (
  <div className={`wizard-step-panel${active ? ' active' : ''}`} data-panel="4">
    <div className="panel-block panel-block-body">
      <h6 className="heading-row">
        <i className="ti ti-clipboard-check" />
        Confirm Promotion
      </h6>
      <div className="confirm-stats mb-3">
        <div className="confirm-stat promotion-tone-success">
          <b id="pwSumPromote">{promoteCount}</b>
          <span>Students to Promote</span>
        </div>
        <div className="confirm-stat promotion-tone-danger">
          <b>2</b>
          <span>Students Detained</span>
        </div>
        <div className="confirm-stat promotion-tone-warning">
          <b>3</b>
          <span>Students with Warnings</span>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="overview-block promotion-tone-info">
            <span className="ic">
              <i className="ti ti-door" />
            </span>
            <div className="tx">
              <b>8 seats available</b>
              <span>Grade IV capacity: 50</span>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="overview-block promotion-tone-success">
            <span className="ic">
              <i className="ti ti-checks" />
            </span>
            <div className="tx">
              <b>Within capacity</b>
              <span>37 &lt; 50 &middot; safe to promote</span>
            </div>
          </div>
        </div>
      </div>
      <h6 className="heading-row">
        <i className="ti ti-checklist" />
        Confirmation Checklist
      </h6>
      <div className="check-list mb-3">
        {checklist.map((item) => (
          <label className="column-label" key={item}>
            <i className="ti ti-circle-check" />
            {item}
          </label>
        ))}
      </div>
      <div className="wizard-navbar">
        <button type="button" className="promotion-button" onClick={onBack}>
          <i className="ti ti-arrow-left" />
          Back
        </button>
        <button type="button" className="promotion-button promotion-button-primary" onClick={onOpenConfirm}>
          <i className="ti ti-arrow-big-up-lines" />
          Confirm Promotion
        </button>
      </div>
    </div>
  </div>
);

export default StepConfirm;
