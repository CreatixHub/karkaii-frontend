import { Calendar } from 'primereact/calendar';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/** The two flatpickr range formats the templates use. */
export type RangeFormat = 'd M Y' | 'n/j/Y';

const FORMATS: Record<RangeFormat, { stored: string; calendar: string }> = {
  'd M Y': { stored: 'DD MMM YYYY', calendar: 'dd M yy' },
  // flatpickr's `n/j/Y` is a non-padded month/day; dayjs writes that as M/D.
  'n/j/Y': { stored: 'M/D/YYYY', calendar: 'm/d/yy' },
};

export interface DateRangeFieldProps {
  /** The joined range, e.g. "01 Jul 2026 - 31 Jul 2026", or '' for empty. */
  value: string;
  onChange: (value: string) => void;
  format?: RangeFormat;
  /** flatpickr's `rangeSeparator`. */
  separator?: string;
  id?: string;
  ariaLabel?: string;
  small?: boolean;
  disabled?: boolean;
  /** Render the popup inside this field's wrapper rather than `<body>`. */
  contained?: boolean;
  /** Wrap in the template's `.input-icon-end` + calendar addon. */
  withIcon?: boolean;
}

/** flatpickr's `.bookingrange` default: the last seven days, inclusive. */
export const lastSevenDays = (format: RangeFormat = 'n/j/Y', separator = ' - '): string => {
  const pattern = FORMATS[format].stored;
  return `${dayjs().subtract(6, 'day').format(pattern)}${separator}${dayjs().format(pattern)}`;
};

const DateRangeField = ({
  value,
  onChange,
  format = 'd M Y',
  separator = ' - ',
  id,
  ariaLabel,
  small = false,
  disabled = false,
  contained = false,
  withIcon = false,
}: DateRangeFieldProps) => {
  const pattern = FORMATS[format];

  /** Split the stored string back into the pair PrimeReact wants. */
  const parsed = (): Date[] | null => {
    if (!value) return null;
    const [from, to] = value.split(separator);
    if (!from || !to) return null;
    const start = dayjs(from.trim(), pattern.stored, true);
    const end = dayjs(to.trim(), pattern.stored, true);
    return start.isValid() && end.isValid() ? [start.toDate(), end.toDate()] : null;
  };

  const picker = (
    <Calendar
      inputClassName={`form-control${small ? ' form-control-sm' : ''}`}
      inputId={id}
      aria-label={ariaLabel}
      disabled={disabled}
      showButtonBar
      selectionMode="range"
      // PrimeReact prints a range as "start - end"; keep our own separator by
      // reading `readOnlyInput` off and formatting the stored value ourselves.
      dateFormat={pattern.calendar}
      value={parsed()}
      onChange={(event) => {
        const next = event.value as (Date | null)[] | null | undefined;
        if (!next || !next[0] || !next[1]) {
          onChange('');
          return;
        }
        onChange(
          `${dayjs(next[0]).format(pattern.stored)}${separator}${dayjs(next[1]).format(pattern.stored)}`,
        );
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

export default DateRangeField;
