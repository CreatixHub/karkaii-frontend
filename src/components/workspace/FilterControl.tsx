import DateField from '@components/ui/DateField';
import DateRangeField from '@components/ui/DateRangeField';
import TimeField from '@components/ui/TimeField';
import type { FilterField } from './types';

export interface FilterControlProps {
  field: FilterField;
  value: string;
  onChange: (value: string) => void;
  /** `form-control-sm` / `form-select-sm`; Band 2 renders small, the panel does not. */
  small?: boolean;
}

const FilterControl = ({ field, value, onChange, small = false }: FilterControlProps) => {
  const sizing = small ? ' form-control-sm' : '';

  switch (field.kind) {
    case 'date':
      return (
        <DateField
          value={value}
          onChange={onChange}
          format={field.dateFormat ?? 'd-m-Y'}
          id={field.id}
          placeholder={field.placeholder}
          small
          contained
        />
      );

    case 'daterange':
      return (
        <DateRangeField
          value={value}
          onChange={onChange}
          format={field.rangeFormat ?? 'd M Y'}
          id={field.id}
          small
          contained
        />
      );

    case 'time':
      return (
        <TimeField
          value={value}
          onChange={onChange}
          id={field.id}
          placeholder={field.placeholder}
          small
          contained
        />
      );

    case 'number':
      return (
        <input
          type="number"
          className={`form-control${sizing || ' form-control-sm'}`}
          id={field.id}
          min={field.min ?? '0'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      );

    /*
     * A switch stores the template's own label as its value rather than a
     * boolean, so it reads on the chip rail the way every other filter does —
     * "Exceptions: Only records with attendance exceptions".
     */
    case 'toggle':
      return (
        <div className="form-check form-switch mb-0">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={field.id}
            checked={value !== ''}
            onChange={(event) => onChange(event.target.checked ? field.switchLabel ?? field.label : '')}
          />
          <label className="form-check-label fs-13" htmlFor={field.id}>
            {field.switchLabel ?? field.label}
          </label>
        </div>
      );

    default:
      return (
        <select
          className={`form-select${small ? ' lh-base' : ''}`}
          id={field.id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{field.allLabel ?? 'All'}</option>
          {field.options?.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      );
  }
};

export default FilterControl;
