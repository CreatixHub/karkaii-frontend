import { useRef, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { OverlayPanel } from 'primereact/overlaypanel';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/** The format the control both displays and reports. */
export const RANGE_DISPLAY_FORMAT = 'YYYY/MM/DD';
const SEPARATOR = ' - ';

type Range = [dayjs.Dayjs, dayjs.Dayjs];

/**
 * The preset list, in the order the template shows it. Built on each open so
 * "Today" stays today in a long-lived tab.
 */
const buildPresets = (): Record<string, Range> => ({
  Today: [dayjs(), dayjs()],
  Yesterday: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')],
  'Last 7 Days': [dayjs().subtract(6, 'day'), dayjs()],
  'Last 30 Days': [dayjs().subtract(29, 'day'), dayjs()],
  'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
  'Last Month': [
    dayjs().subtract(1, 'month').startOf('month'),
    dayjs().subtract(1, 'month').endOf('month'),
  ],
});

const print = ([start, end]: Range): string =>
  `${start.format(RANGE_DISPLAY_FORMAT)}${SEPARATOR}${end.format(RANGE_DISPLAY_FORMAT)}`;

/** The control's initial selection when the caller supplies none. */
export const defaultRange = (): string => print(buildPresets()['Last 7 Days']);

const parse = (value: string): Date[] | null => {
  if (!value) return null;
  const [from, to] = value.split(SEPARATOR);
  const start = dayjs(from?.trim(), RANGE_DISPLAY_FORMAT, true);
  const end = dayjs(to?.trim(), RANGE_DISPLAY_FORMAT, true);
  return start.isValid() && end.isValid() ? [start.toDate(), end.toDate()] : null;
};

export interface DateRangePickerProps {
  /**
   * `'YYYY/MM/DD - YYYY/MM/DD'`. Omit entirely to let the control own its own
   * selection — the antd version this replaces was uncontrolled with no way to
   * read the value back, so every existing call site relies on that.
   */
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  id?: string;
}

const DateRangePicker = ({ value, onChange, className, id }: DateRangePickerProps) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string>(defaultRange);
  const current = isControlled ? value ?? '' : internal;

  const panel = useRef<OverlayPanel>(null);
  const [custom, setCustom] = useState<Date[] | null>(() => parse(current));
  const [showCustom, setShowCustom] = useState(false);

  const commit = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const choosePreset = (label: string) => {
    const next = print(buildPresets()[label]);
    setCustom(parse(next));
    commit(next);
    setShowCustom(false);
    panel.current?.hide();
  };

  return (
    <>
      <div
        className={`custome-range-picker${className ? ` ${className}` : ''}`}
        onClick={(event) => panel.current?.toggle(event)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            panel.current?.toggle(event);
          }
        }}
      >
        <i className="ti ti-calendar" />
        <input id={id} readOnly value={current} aria-label="Date range" />
      </div>

      <OverlayPanel ref={panel} className="range-picker-panel" onHide={() => setShowCustom(false)}>
        <ul className="range-picker-presets">
          {Object.keys(buildPresets()).map((label) => (
            <li key={label}>
              <button type="button" onClick={() => choosePreset(label)}>
                {label}
              </button>
            </li>
          ))}
          <li className="range-picker-divider" role="separator" />
          <li>
            <button
              type="button"
              className={showCustom ? 'is-active' : undefined}
              onClick={() => setShowCustom((open) => !open)}
            >
              Custom Range
            </button>
          </li>
        </ul>

        {showCustom && (
          <Calendar
            inline
            selectionMode="range"
            value={custom}
            onChange={(event) => {
              const next = (event.value as (Date | null)[] | null) ?? null;
              setCustom(next as Date[] | null);
              if (next && next[0] && next[1]) {
                commit(print([dayjs(next[0]), dayjs(next[1])]));
                setShowCustom(false);
                panel.current?.hide();
              }
            }}
          />
        )}
      </OverlayPanel>
    </>
  );
};

export default DateRangePicker;
