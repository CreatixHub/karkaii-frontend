import { useState } from 'react';
import type { FilterField, WiredFilter } from '../data/studentPromotion.data';

export interface StudentFiltersProps {
  fields: FilterField[];
  wiredValues: Record<WiredFilter, string>;
  onWiredChange: (key: WiredFilter, value: string) => void;
  onReset: () => void;
}

const StudentFilters = ({ fields, wiredValues, onWiredChange, onReset }: StudentFiltersProps) => {
  const decorative = fields.filter((field) => !field.wired);
  const [inertValues, setInertValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(decorative.map((field) => [field.id, field.options[0]?.value ?? ''])),
  );

  return (
    <div className="panel-block-body" style={{ paddingBottom: 0 }}>
      <div className="tile-head mb-3">
        <h6 className="heading-row mb-0">
          <i className="ti ti-adjustments-horizontal" />
          Filters
        </h6>
        <button type="button" className="promotion-button promotion-button-sm" onClick={onReset}>
          <i className="ti ti-rotate-2" />
          Reset
        </button>
      </div>
      <div className="filter-bar-promotion mb-3">
        {fields.map((field) => (
          <div className="form-field" key={field.id}>
            <label htmlFor={field.id}>{field.label}</label>
            <select
              className="select-input"
              id={field.id}
              value={field.wired ? wiredValues[field.wired] : inertValues[field.id]}
              onChange={(event) => {
                if (field.wired) onWiredChange(field.wired, event.target.value);
                else setInertValues((current) => ({ ...current, [field.id]: event.target.value }));
              }}
            >
              {field.options.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentFilters;
