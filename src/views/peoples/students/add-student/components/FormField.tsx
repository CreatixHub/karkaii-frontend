import DateField from '@components/ui/DateField';
import CommonSelect from '@core/common/commonSelect';
import type { FormFieldSpec } from '../data/studentForm.data';


/** The edit templates carry dates as `DD-MM-YYYY` (and a few as `DD/MM/YYYY`). */

export interface FormFieldProps {
  field: FormFieldSpec;
  value: string;
  onChange: (id: string, value: string) => void;
}

const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

const FormField = ({ field, value, onChange }: FormFieldProps) => {
  const wrapper = field.wrapper ?? 'mb-3';

  const control = () => {
    switch (field.kind) {
      case 'select':
        return (
          <CommonSelect
            inputId={field.id}
            className={field.controlClass}
            options={toOptions(field.options ?? [])}
            value={value ? { value, label: value } : null}
            onChange={(option) => onChange(field.id, option?.value ?? '')}
          />
        );

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
            rows={field.rows ?? 3}
            id={field.id}
            placeholder={field.placeholder}
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
            placeholder={field.placeholder}
            value={value}
            onChange={(event) => onChange(field.id, event.target.value)}
          />
        );
    }
  };

  return (
    <div className={field.col}>
      <div className={wrapper}>
        <label className="form-label" htmlFor={field.id}>
          {field.label}
        </label>
        {control()}
      </div>
    </div>
  );
};

export default FormField;
