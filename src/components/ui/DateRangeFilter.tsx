import { Calendar } from 'primereact/calendar';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const DATE_RANGE_FORMAT = 'YYYY/MM/DD';
/** The PrimeReact spelling of the pattern above. */
const CALENDAR_FORMAT = 'yy/mm/dd';
const SEPARATOR = ' - ';

/** Splits the stored string back into the pair PrimeReact wants, or null. */
const parseRange = (value: string): Date[] | null => {
  if (!value) return null;
  const [from, to] = value.split(SEPARATOR);
  const start = dayjs(from, DATE_RANGE_FORMAT, true);
  const end = dayjs(to, DATE_RANGE_FORMAT, true);
  return start.isValid() && end.isValid() ? [start.toDate(), end.toDate()] : null;
};

export interface DateRangeFilterProps {
  /** `'YYYY/MM/DD - YYYY/MM/DD'`, or an empty string for "no range selected". */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

const DateRangeFilter = ({
  value,
  onChange,
  placeholder = 'Select date range',
  className = 'form-control form-control-sm date-range bookingrange',
  id,
}: DateRangeFilterProps) => (
  <Calendar
    inputId={id}
    inputClassName={className}
    placeholder={placeholder}
    selectionMode="range"
    dateFormat={CALENDAR_FORMAT}
    showButtonBar
    value={parseRange(value)}
    onChange={(event) => {
      const dates = event.value as (Date | null)[] | null | undefined;
      if (!dates || !dates[0] || !dates[1]) {
        onChange('');
        return;
      }
      onChange(
        `${dayjs(dates[0]).format(DATE_RANGE_FORMAT)}${SEPARATOR}${dayjs(dates[1]).format(DATE_RANGE_FORMAT)}`,
      );
    }}
  />
);

export default DateRangeFilter;
