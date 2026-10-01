import {
  academicYearOptions,
  classOptions,
  DATE_RANGE_PLACEHOLDER,
} from '../data/progressReports.data';
import type { ProgressFilterState } from '../data/progressReports.data';

export interface ProgressFiltersProps {
  draft: ProgressFilterState;
  onChange: (patch: Partial<ProgressFilterState>) => void;
  onApply: () => void;
}

const ProgressFilters = ({ draft, onChange, onApply }: ProgressFiltersProps) => (
  <div className="card">
    <div className="card-body pb-0">
      <div className="row align-items-end g-3 mb-3">
        <div className="col-md-3">
          <label className="form-label" htmlFor="pr-academic-year">
            Academic Year
          </label>
          <select
            className="form-select"
            id="pr-academic-year"
            value={draft.academicYear}
            onChange={(event) => onChange({ academicYear: event.target.value })}
          >
            {academicYearOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="pr-class">
            Class
          </label>
          <select
            className="form-select"
            id="pr-class"
            value={draft.className}
            onChange={(event) => onChange({ className: event.target.value })}
          >
            {classOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="pr-date-range">
            Date Range
          </label>
          <input
            type="text"
            className="form-control"
            placeholder={DATE_RANGE_PLACEHOLDER}
            id="pr-date-range"
            value={draft.dateRange}
            onChange={(event) => onChange({ dateRange: event.target.value })}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;
              event.preventDefault();
              onApply();
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

export default ProgressFilters;
