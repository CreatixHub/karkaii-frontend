import type { AcademicYear } from '../data/subjectPerformance.data';
import { academicYears, classOptions, dateRangePlaceholder } from '../data/subjectPerformance.data';

export interface PerformanceFiltersProps {
  year: AcademicYear;
  onYearChange: (year: AcademicYear) => void;
  klass: string;
  onClassChange: (klass: string) => void;
  range: string;
  onRangeChange: (range: string) => void;
  onApply: () => void;
}

const PerformanceFilters = ({
  year,
  onYearChange,
  klass,
  onClassChange,
  range,
  onRangeChange,
  onApply,
}: PerformanceFiltersProps) => (
  <div className="card">
    <div className="card-body pb-0">
      <div className="row align-items-end g-3 mb-3">
        <div className="col-md-3">
          <label className="form-label" htmlFor="sp-academic-year">
            Academic Year
          </label>
          <select
            className="form-select"
            id="sp-academic-year"
            value={year}
            onChange={(event) => onYearChange(event.target.value as AcademicYear)}
          >
            {academicYears.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="sp-class">
            Class
          </label>
          <select
            className="form-select"
            id="sp-class"
            value={klass}
            onChange={(event) => onClassChange(event.target.value)}
          >
            {classOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="sp-date-range">
            Date Range
          </label>
          <input
            type="text"
            className="form-control"
            placeholder={dateRangePlaceholder}
            id="sp-date-range"
            value={range}
            onChange={(event) => onRangeChange(event.target.value)}
            // The button is the template's only submit, so Enter has to reach it.
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onApply();
              }
            }}
          />
        </div>
        <div className="col-md-3">
          <button type="button" className="btn btn-primary w-100" onClick={onApply}>
            <i className="ti ti-filter me-1" />
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default PerformanceFilters;
