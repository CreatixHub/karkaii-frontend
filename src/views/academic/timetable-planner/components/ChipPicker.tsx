import { useMemo, useState } from 'react';

export interface ChipOption {
  id: string;
  label: string;
}

interface Props {
  options: ChipOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  /** Pick at most one. */
  single?: boolean;
  placeholder?: string;
  /** Show the search box once there are more than this many options. */
  searchAbove?: number;
  ariaLabel: string;
}

/** A searchable set of toggle chips: far easier than a multi-select box for 40 teachers. */
const ChipPicker = ({ options, selected, onChange, single = false, placeholder = 'Search…', searchAbove = 8, ariaLabel }: Props) => {
  const [query, setQuery] = useState('');
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q) || selected.includes(o.id)) : options;
  }, [options, query, selected]);

  const toggle = (id: string) => {
    if (single) onChange(selected[0] === id ? [] : [id]);
    else onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  return (
    <div role="group" aria-label={ariaLabel}>
      {options.length > searchAbove ? (
        <input className="form-control form-control-sm mb-2" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={`Search ${ariaLabel}`} />
      ) : null}
      <div className="tp-chips">
        {shown.map((o) => (
          <button key={o.id} type="button" className={`tp-chip ${selected.includes(o.id) ? 'on' : ''}`} aria-pressed={selected.includes(o.id)} onClick={() => toggle(o.id)}>
            {o.label}
          </button>
        ))}
        {shown.length === 0 ? <span className="text-muted fs-12">Nothing matches.</span> : null}
      </div>
    </div>
  );
};

export default ChipPicker;
