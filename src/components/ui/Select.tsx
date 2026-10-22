import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Dropdown } from 'primereact/dropdown';

export type Option = {
  value: string;
  label: string;
  /** Optional avatar/icon path, used by the templated selects. */
  image?: string;
};

/** An `<optgroup>`: a heading with its own options beneath it. */
export type OptionGroup = {
  label: string;
  options: Option[];
};

export interface SelectProps {
  /** A flat option list, or groups for the template's "nested" selects. */
  options: Option[] | OptionGroup[];
  defaultValue?: Option;
  className?: string;
  /**
   * Controlled selection. When provided, the parent owns the value and this
   * component stops tracking its own — pair it with `onChange`.
   */
  value?: Option | null;
  /** Notifies the parent of a selection. Safe to use with or without `value`. */
  onChange?: (option: Option | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  inputId?: string;
  name?: string;
  /**
   * Shows the panel's filter box. Defaults to off, matching the template's
   * `.select` (Choices.js `searchEnabled: false`) and `SelectField`'s own
   * default. The previous react-select build defaulted this to `true`, but
   * there "searchable" only meant *typing was allowed* — it drew no search
   * affordance. PrimeReact's `filter` renders a visible box, so honouring the
   * old default literally would add a search field to ~42 selects that have
   * never shown one. Off is the setting that preserves the design.
   */
  isSearchable?: boolean;
  /** Renders one option inside the panel. */
  itemTemplate?: (option: Option) => ReactNode;
  /** Renders the selected value on the closed control. */
  valueTemplate?: (option: Option | null) => ReactNode;
  /**
   * Render the panel inside this control's own wrapper instead of `<body>`.
   * Needed anywhere the select sits in a scrolling dropdown or offcanvas.
   */
  contained?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  defaultValue,
  className,
  value,
  onChange,
  placeholder = 'Select',
  isDisabled,
  inputId,
  name,
  isSearchable = false,
  itemTemplate,
  valueTemplate,
  contained = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(defaultValue);

  // `value === undefined` means the caller has not opted into controlled mode,
  // so the internal state keeps driving the input — preserving the behaviour
  // every existing usage relies on.
  const isControlled = value !== undefined;

  const handleChange = (option: Option | null) => {
    if (!isControlled) {
      setSelectedOption(option || undefined);
    }
    onChange?.(option);
  };

  useEffect(() => {
    if (isControlled) return;
    setSelectedOption(defaultValue || undefined);
  }, [defaultValue, isControlled]);

  const current = (isControlled ? value : selectedOption) ?? null;

  // Groups carry their entries under `options`; a flat list does not.
  const isGrouped = options.length > 0 && 'options' in options[0];

  /** Every option, with groups flattened, for resolving a value back to its option. */
  const flatOptions = useMemo<Option[]>(
    () =>
      isGrouped
        ? (options as OptionGroup[]).flatMap((group) => group.options)
        : (options as Option[]),
    [options, isGrouped],
  );

  return (
    <Dropdown
      className={className}
      options={options}
      optionLabel="label"
      // PrimeReact already reads `option.value` off a `{ value, label }` pair,
      // so the Dropdown speaks plain values, not option objects. Saying so
      // explicitly keeps `value` and `onChange` on the same footing -- passing
      // the object here leaves the control unable to match its own selection,
      // which showed up as the placeholder never being replaced.
      optionValue="value"
      optionGroupLabel={isGrouped ? 'label' : undefined}
      optionGroupChildren={isGrouped ? 'options' : undefined}
      value={current?.value ?? null}
      onChange={(event) =>
        handleChange(flatOptions.find((option) => option.value === event.value) ?? null)
      }
      placeholder={placeholder}
      disabled={isDisabled}
      inputId={inputId}
      name={name}
      filter={isSearchable}
      itemTemplate={itemTemplate}
      valueTemplate={
        valueTemplate
          ? (option: Option | null) => valueTemplate(option ?? null)
          : undefined
      }
      appendTo={contained ? 'self' : undefined}
    />
  );
};

export default Select;
