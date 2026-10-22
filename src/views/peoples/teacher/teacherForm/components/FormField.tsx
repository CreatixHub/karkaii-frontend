import DateField from '@components/ui/DateField';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CommonSelect from '@core/common/commonSelect';
import type { FormFieldSpec } from '../data/teacherForm.data';

// `dayjs(value, 'DD-MM-YYYY')` only honours the format string with this plugin;
// without it the edit page's `15-12-2023` prefills parse to Invalid Date and the
// pickers render empty.
dayjs.extend(customParseFormat);


/** The edit template carries dates as `DD-MM-YYYY`. */

const toOptions = (values: string[]) => values.map((option) => ({ value: option, label: option }));

export interface FormFieldProps {
  field: FormFieldSpec;
  value: string;
  onChange: (id: string, value: string) => void;
  /** `edit-teacher.html` widens the Notes column; everything else is shared. */
  isEdit?: boolean;
}

const FormField = ({ field, value, onChange, isEdit = false }: FormFieldProps) => {
  const col = isEdit && field.editCol ? field.editCol : field.col;

  const control = () => {
    switch (field.kind) {
      case 'select': {
        const options = field.options ?? [];
        const current = value || options[0] || '';
        return (
          <CommonSelect
            inputId={field.id}
            options={toOptions(options)}
            value={current ? { value: current, label: current } : null}
            onChange={(option) => onChange(field.id, option?.value ?? '')}
          />
        );
      }

      case 'date':
        return (
          <div className="input-icon position-relative">
            <span className="input-icon-addon">
              <i className="ti ti-calendar" />
            </span>
            <DateField
              id={field.id}
              value={value}
              onChange={(dateString) => onChange(field.id, dateString as string)}
            />
          </div>
        );

      case 'textarea':
        return (
          <textarea
            className="form-control"
            placeholder={field.placeholder}
            rows={field.rows ?? 3}
            id={field.id}
            value={value}
            onChange={(event) => onChange(field.id, event.target.value)}
          />
        );

      case 'tags':
        return (
          <input
            className="input-tags form-control"
            type="text"
            data-role="tagsinput"
            name="Label"
            id={field.id}
            value={value}
            onChange={(event) => onChange(field.id, event.target.value)}
          />
        );

      default:
        return (
          <input
            type={field.kind}
            className="form-control"
            id={field.id}
            value={value}
            onChange={(event) => onChange(field.id, event.target.value)}
          />
        );
    }
  };

  return (
    <div className={col}>
      <div className="mb-3">
        <label className="form-label" htmlFor={field.id}>
          {field.label}
        </label>
        {control()}
      </div>
    </div>
  );
};

export default FormField;
