import { fromClassOptions, fromSectionOptions, toClassOptions, toSectionOptions } from '../data/studentPromotion.data';

export interface StepMapClassProps {
  active: boolean;
  fromClass: string;
  fromSection: string;
  toClass: string;
  toSection: string;
  onFromClass: (value: string) => void;
  onFromSection: (value: string) => void;
  onToClass: (value: string) => void;
  onToSection: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const StepMapClass = ({
  active,
  fromClass,
  fromSection,
  toClass,
  toSection,
  onFromClass,
  onFromSection,
  onToClass,
  onToSection,
  onBack,
  onNext,
}: StepMapClassProps) => (
  <div className={`wizard-step-panel${active ? ' active' : ''}`} data-panel="2">
    <div className="panel-block panel-block-body">
      <h5 className="heading-row fs-15">
        <i className="ti ti-arrows-exchange" />
        Map Class &amp; Section
      </h5>
      <div className="map-block">
        <div className="map-card">
          <div className="lbl mb-2">Promote From</div>
          <div className="row g-2">
            <div className="col-6 form-field">
              <label htmlFor="pwFromClass">Class</label>
              <select
                className="select-input"
                id="pwFromClass"
                value={fromClass}
                onChange={(event) => onFromClass(event.target.value)}
              >
                {fromClassOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="col-6 form-field">
              <label htmlFor="pwFromSec">Section</label>
              <select
                className="select-input"
                id="pwFromSec"
                value={fromSection}
                onChange={(event) => onFromSection(event.target.value)}
              >
                {fromSectionOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <span className="map-example">
          <i className="ti ti-arrow-right" />
        </span>
        <div className="map-card to">
          <div className="lbl mb-2">Promote To</div>
          <div className="row g-2">
            <div className="col-6 form-field">
              <label htmlFor="pwToClass">Class</label>
              <select
                className="select-input"
                id="pwToClass"
                value={toClass}
                onChange={(event) => onToClass(event.target.value)}
              >
                {toClassOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="col-6 form-field">
              <label htmlFor="pwToSec">Section</label>
              <select
                className="select-input"
                id="pwToSec"
                value={toSection}
                onChange={(event) => onToSection(event.target.value)}
              >
                {toSectionOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="wizard-navbar">
        <button type="button" className="promotion-button" onClick={onBack}>
          <i className="ti ti-arrow-left" />
          Back
        </button>
        <button type="button" className="promotion-button promotion-button-primary" onClick={onNext}>
          Load Eligible Students
          <i className="ti ti-arrow-right" />
        </button>
      </div>
    </div>
  </div>
);

export default StepMapClass;
