import DateField from '@components/ui/DateField';
import CommonSelect from '@core/common/commonSelect';
import type { WizardFieldSpec } from '../data/addAdmission.data';


const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

export interface WizardFieldProps {
  field: WizardFieldSpec;
  value: string;
  onChange: (id: string, value: string) => void;
}

const WizardField = ({ field, value, onChange }: WizardFieldProps) => {
  const wrapper = field.wrapper ?? 'mb-3';

  const control = () => {
    switch (field.kind) {
      case 'select':
        return (
          <CommonSelect
            inputId={field.id}
            options={toOptions(field.options ?? [])}
            value={value ? { value, label: value } : null}
            onChange={(option) => onChange(field.id, option?.value ?? '')}
          />
        );

      case 'date':
        return (
          <div className="date-pic">
            <DateField
              placeholder="Select"
              id={field.id}
              value={value}
              onChange={(dateString) => onChange(field.id, dateString as string)}
            />
            <span className="cal-icon">
              <i className="ti ti-calendar" />
            </span>
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

      case 'file':
        return (
          <input
            type="file"
            className="form-control"
            id={field.id}
            accept={field.accept}
            required={field.required}
            onChange={(event) => onChange(field.id, event.target.files?.[0]?.name ?? '')}
          />
        );

      default:
        return (
          <input
            type={field.kind}
            className="form-control"
            id={field.id}
            placeholder={field.placeholder}
            required={field.required}
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
          {field.required ? <span className="text-danger"> *</span> : null}
        </label>
        {control()}
      </div>
    </div>
  );
};

export default WizardField;
