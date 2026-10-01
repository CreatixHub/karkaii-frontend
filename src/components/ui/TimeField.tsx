import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/** flatpickr's `h:i K`. */
const TIME_FORMAT = 'hh:mm A';

export interface TimeFieldProps {
  /**
   * Formatted time string such as "07:10 AM", or '' for empty. Omit it to let
   * the field own its own selection.
   */
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
  placeholder?: string;
  ariaLabel?: string;
  small?: boolean;
  disabled?: boolean;
  /** Render the popup inside this field's wrapper rather than `<body>`. */
  contained?: boolean;
  /** Wrap in the template's `.input-icon-end` + clock addon. */
  withIcon?: boolean;
}

const TimeField = ({
  value,
  onChange,
  id,
  placeholder = 'hh:mm AM',
  ariaLabel,
  small = false,
  disabled = false,
  contained = false,
  withIcon = false,
}: TimeFieldProps) => {
  // `value === undefined` means the caller has not opted into controlled mode.
  const [internal, setInternal] = useState('');
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const parsed = current ? dayjs(current, TIME_FORMAT, true) : null;

  const commit = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const picker = (
    <Calendar
      inputClassName={`form-control timepicker${small ? ' form-control-sm' : ''}`}
      inputId={id}
      aria-label={ariaLabel}
      placeholder={placeholder}
      disabled={disabled}
      showButtonBar
      timeOnly
      // 12-hour with AM/PM, matching flatpickr's `time_24hr: false`.
      hourFormat="12"
      value={parsed !== null && parsed.isValid() ? parsed.toDate() : null}
      onChange={(event) => {
        const next = event.value as Date | null | undefined;
        commit(next ? dayjs(next).format(TIME_FORMAT) : '');
      }}
      appendTo={contained ? 'self' : undefined}
    />
  );

  if (!withIcon) return picker;

  return (
    <div className="input-icon-end position-relative">
      {picker}
      <span className="input-icon-addon">
        <i className="ti ti-clock" />
      </span>
    </div>
  );
};

export default TimeField;
