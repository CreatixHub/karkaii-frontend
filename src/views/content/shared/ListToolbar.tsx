import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ActionLink } from '@components/workspace';

export interface FilterFieldDef {
  id: string;
  label: string;
  /** The options the template offers, without its leading "Select". */
  options: string[];
}

export type SortId = 'asc' | 'desc' | 'viewed' | 'added';

export const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: 'asc', label: 'Ascending' },
  { id: 'desc', label: 'Descending' },
  { id: 'viewed', label: 'Recently Viewed' },
  { id: 'added', label: 'Recently Added' },
];

export interface ListToolbarProps {
  title: string;
  /** The range the template prints in the date field. */
  range?: string;
  fields: FilterFieldDef[];
  /** The applied filters, keyed by field id. An empty string means "any". */
  filters: Record<string, string>;
  onApply: (filters: Record<string, string>) => void;
  onReset: () => void;
  sort: SortId;
  onSort: (sort: SortId) => void;
  /** Anything the page slots after the sort menu. */
  extra?: ReactNode;
}

/** One dropdown, closed by an outside click or Escape the way Bootstrap's is. */
const useDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return { open, setOpen, ref };
};

const ListToolbar = ({
  title,
  range = 'Academic Year : 2024 / 2025',
  fields,
  filters,
  onApply,
  onReset,
  sort,
  onSort,
  extra,
}: ListToolbarProps) => {
  const filterMenu = useDropdown();
  const sortMenu = useDropdown();
  const [draft, setDraft] = useState<Record<string, string>>(filters);

  // Opening the menu shows what is applied, not what was last typed and dropped.
  useEffect(() => {
    if (filterMenu.open) setDraft(filters);
  }, [filterMenu.open, filters]);

  const sortLabel = SORT_OPTIONS.find((option) => option.id === sort)?.label ?? 'Ascending';

  return (
    <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
      <h4 className="mb-3">{title}</h4>
      <div className="d-flex align-items-center flex-wrap">
        <div className="input-icon-start mb-3 me-2 position-relative">
          <span className="icon-addon">
            <i className="ti ti-calendar" />
          </span>
          <input
            type="text"
            className="form-control date-range bookingrange"
            placeholder="Select"
            defaultValue={range}
            aria-label="Select a date range"
          />
        </div>

        <div className="dropdown mb-3 me-2" ref={filterMenu.ref}>
          <ActionLink
            className="btn btn-outline-light bg-white dropdown-toggle"
            ariaExpanded={filterMenu.open}
            onClick={() => filterMenu.setOpen((current) => !current)}
          >
            <i className="ti ti-filter me-2" />
            Filter
          </ActionLink>
          <div className={`dropdown-menu drop-width${filterMenu.open ? ' show' : ''}`}>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onApply(draft);
                filterMenu.setOpen(false);
              }}
            >
              <div className="d-flex align-items-center border-bottom p-3">
                <h4>Filter</h4>
              </div>
              <div className="p-3 border-bottom">
                <div className="row">
                  {fields.map((field, index) => (
                    <div className="col-md-12" key={field.id}>
                      <div className={index === fields.length - 1 ? 'mb-0' : 'mb-3'}>
                        <label className="form-label" htmlFor={`filter-${field.id}`}>
                          {field.label}
                        </label>
                        <select
                          className="form-select"
                          id={`filter-${field.id}`}
                          value={draft[field.id] ?? ''}
                          onChange={(event) =>
                            setDraft((current) => ({ ...current, [field.id]: event.target.value }))
                          }
                        >
                          <option value="">Select</option>
                          {field.options.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3 d-flex align-items-center justify-content-end">
                <ActionLink
                  className="btn btn-light me-3"
                  onClick={() => {
                    setDraft({});
                    onReset();
                    filterMenu.setOpen(false);
                  }}
                >
                  Reset
                </ActionLink>
                <button type="submit" className="btn btn-primary">
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="dropdown mb-3" ref={sortMenu.ref}>
          <ActionLink
            className="btn btn-outline-light bg-white dropdown-toggle"
            ariaExpanded={sortMenu.open}
            onClick={() => sortMenu.setOpen((current) => !current)}
          >
            <i className="ti ti-sort-ascending-2 me-2" />
            Sort by {sortLabel === 'Ascending' ? 'A-Z' : sortLabel}
          </ActionLink>
          <ul className={`dropdown-menu p-3${sortMenu.open ? ' show' : ''}`}>
            {SORT_OPTIONS.map((option) => (
              <li key={option.id}>
                <ActionLink
                  className={`dropdown-item rounded-1${sort === option.id ? ' active' : ''}`}
                  onClick={() => {
                    onSort(option.id);
                    sortMenu.setOpen(false);
                  }}
                >
                  {option.label}
                </ActionLink>
              </li>
            ))}
          </ul>
        </div>

        {extra}
      </div>
    </div>
  );
};

export default ListToolbar;
