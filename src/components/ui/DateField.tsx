import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/** The four flatpickr formats the templates use, by their flatpickr token. */
export type DateFormat = 'd-m-Y' | 'd/m/Y' | 'd M Y' | 'M Y';

/**
 * Each flatpickr token maps to two things: the dayjs pattern that parses and
 * prints the string this component stores, and the PrimeReact `dateFormat`
 * that renders the same shape inside the calendar's own input.
 */
const FORMATS: Record<DateFormat, { stored: string; calendar: string }> = {
  'd-m-Y': { stored: 'DD-MM-YYYY', calendar: 'dd-mm-yy' },
  'd/m/Y': { stored: 'DD/MM/YYYY', calendar: 'dd/mm/yy' },
  'd M Y': { stored: 'DD MMM YYYY', calendar: 'dd M yy' },
  'M Y': { stored: 'MMM YYYY', calendar: 'M yy' },
};

export interface DateFieldProps {
  /**
   * Formatted date string, or '' for empty. Omit it entirely to let the field
   * own its own selection — the template's presentational pickers pass neither
   * `value` nor `onChange`.
   */
  value?: string;
  onChange?: (value: string) => void;
  /** Matches the template's class: `.datetimepicker` is `d-m-Y`. */
  format?: DateFormat;
  id?: string;
  placeholder?: string;
  ariaLabel?: string;
  /** The template's `form-control-sm`, used inside filter panels. */
  small?: boolean;
  disabled?: boolean;
  /**
   * Render the popup inside this input's own wrapper instead of `<body>`.
   * Required anywhere the field sits inside a dropdown or an offcanvas.
   */
  contained?: boolean;
  /**
   * Wrap in the template's `.input-icon-end` + calendar addon. The modal forms
   * use this; the filter panels render a bare input.
   */
  withIcon?: boolean;
}

const DateField = ({
  value,
  onChange,
  format = 'd-m-Y',
  id,
  placeholder,
  ariaLabel,
  small = false,
  disabled = false,
  contained = false,
  withIcon = false,
}: DateFieldProps) => {
  const pattern = FORMATS[format];

  // `value === undefined` means the caller has not opted into controlled mode.
  const [internal, setInternal] = useState('');
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const parsed = current ? dayjs(current, pattern.stored, true) : null;

  const commit = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const picker = (
    <Calendar
      // `className` lands on the `.p-calendar` wrapper; the template's
      // form-control styling belongs on the input itself.
      inputClassName={`form-control datetimepicker${small ? ' form-control-sm' : ''}`}
      inputId={id}
      aria-label={ariaLabel}
      placeholder={placeholder ?? pattern.stored}
      disabled={disabled}
      // `showButtonBar` is PrimeReact's equivalent of the old `allowClear`.
      showButtonBar
      // `M Y` is flatpickr's year picker; PrimeReact calls that a month view.
      view={format === 'M Y' ? 'month' : 'date'}
      dateFormat={pattern.calendar}
      value={parsed !== null && parsed.isValid() ? parsed.toDate() : null}
      onChange={(event) => {
        const next = event.value as Date | null | undefined;
        commit(next ? dayjs(next).format(pattern.stored) : '');
      }}
      appendTo={contained ? 'self' : undefined}
    />
  );

  if (!withIcon) return picker;

  return (
    <div className="input-icon-end position-relative">
      {picker}
      <span className="input-icon-addon">
        <i className="ti ti-calendar" />
      </span>
    </div>
  );
};

export default DateField;
