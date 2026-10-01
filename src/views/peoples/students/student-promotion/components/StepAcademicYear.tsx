import type { YearCard } from '../data/studentPromotion.data';

export interface StepAcademicYearProps {
  active: boolean;
  years: YearCard[];
  selected: string;
  onSelect: (id: string) => void;
  onNext: () => void;
}

const StepAcademicYear = ({ active, years, selected, onSelect, onNext }: StepAcademicYearProps) => (
  <div className={`wizard-step-panel${active ? ' active' : ''}`} data-panel="1">
    <div className="panel-block panel-block-body">
      <h4 className="heading-row fs-15 fw-medium">
        <i className="ti ti-calendar-stats" />
        Select Academic Year
      </h4>
      <div className="year-cards">
        {years.map((year) => (
          <div
            className={`year-card${year.id === selected ? ' sel' : ''}${year.current ? ' cur' : ''}`}
            data-year={year.id}
            key={year.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(year.id)}
          >
            <b>{year.label}</b>
            <span>{year.sub}</span>
          </div>
        ))}
      </div>
      <div className="wizard-navbar">
        <span className="sub-label">
          <i className="ti ti-info-circle me-1" />
          Promotion source: <strong>2024 - 2025</strong>
        </span>
        <button type="button" className="promotion-button promotion-button-primary" onClick={onNext}>
          Continue
          <i className="ti ti-arrow-right" />
        </button>
      </div>
    </div>
  </div>
);

export default StepAcademicYear;
