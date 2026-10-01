import type { ReactNode } from 'react';
import { MultiSelect as PrimeMultiSelect } from 'primereact/multiselect';
import type { Option } from './Select';

export type { Option };

export interface MultiSelectProps {
  options: Option[];
  /**
   * The selected values. Plain strings rather than option objects, because
   * that is what every call site already keeps in state — the react-select
   * build all normalised with `options.map((option) => option.value)`.
   */
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  inputId?: string;
  name?: string;
  disabled?: boolean;
  /** Shows the panel's filter box. */
  isSearchable?: boolean;
  /**
   * How many chips to draw before collapsing to "N items selected". The
   * control is one `.form-control` tall, so a low cap keeps it from growing.
   */
  maxSelectedLabels?: number;
  /** Render the panel inside this control's wrapper instead of `<body>`. */
  contained?: boolean;
  itemTemplate?: (option: Option) => ReactNode;
}

const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select',
  className,
  inputId,
  name,
  disabled = false,
  isSearchable = false,
  maxSelectedLabels = 3,
  contained = false,
  itemTemplate,
}: MultiSelectProps) => (
  <PrimeMultiSelect
    className={className}
    options={options}
    optionLabel="label"
    // `optionValue` keeps the whole component speaking plain strings.
    optionValue="value"
    value={value}
    onChange={(event) => onChange((event.value as string[]) ?? [])}
    placeholder={placeholder}
    disabled={disabled}
    inputId={inputId}
    name={name}
    filter={isSearchable}
    display="chip"
    maxSelectedLabels={maxSelectedLabels}
    selectedItemsLabel="{0} items selected"
    itemTemplate={itemTemplate}
    appendTo={contained ? 'self' : undefined}
  />
);

export default MultiSelect;
