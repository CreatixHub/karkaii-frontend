import { useMemo } from 'react';
import Select from './Select';
import type { Option } from './Select';

/**
 * What the pages actually hand in. Several data files carry richer choice
 * objects — `memberChoices`, `bookChoices` — that label themselves but have no
 * separate `value`, because the template's `<option>` printed the label and
 * stored it verbatim. Those keep working: the label doubles as the value.
 */
export type SelectChoice = string | { label: string; value?: string };

export interface SelectFieldProps {
  /** Plain strings, `{ value, label }`, or anything with a `label`. */
  options: readonly SelectChoice[];
  /** The selected value, or '' for none. */
  value: string;
  onChange: (value: string) => void;
  /** Choices.js `searchEnabled`; `.select` is false, `.select2` is true. */
  searchable?: boolean;
  placeholder?: string;
  /** Renders a blank leading option, e.g. the filter panels' "All". */
  blankLabel?: string;
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
}

const toOption = (option: SelectChoice): Option =>
  typeof option === 'string'
    ? { value: option, label: option }
    : { value: option.value ?? option.label, label: option.label };

const SelectField = ({
  options,
  value,
  onChange,
  searchable = false,
  placeholder = 'Select',
  blankLabel,
  id,
  name,
  className,
  disabled = false,
}: SelectFieldProps) => {
  const list = useMemo<Option[]>(() => {
    const mapped = options.map(toOption);
    return blankLabel === undefined ? mapped : [{ value: '', label: blankLabel }, ...mapped];
  }, [options, blankLabel]);

  const selected = useMemo<Option | null>(
    () => list.find((option) => option.value === value) ?? null,
    [list, value],
  );

  return (
    <Select
      options={list}
      value={selected}
      onChange={(option) => onChange(option?.value ?? '')}
      placeholder={placeholder}
      isSearchable={searchable}
      isDisabled={disabled}
      inputId={id}
      name={name}
      className={className}
    />
  );
};

export default SelectField;
