import DateField from '@components/ui/DateField';
import type { FilterChip } from '../data/attendanceRegister.data';
import { filterSelects, savedViews } from '../data/attendanceRegister.data';

export interface AttendanceFilterBarProps {
  activeView: string;
  onView: (id: string) => void;
  onSaveView: () => void;
  search: string;
  onSearch: (value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  filters: Record<string, string>;
  onFilterChange: (id: string, value: string) => void;
  date: string;
  onDateChange: (value: string) => void;
  onOpenAdvanced: () => void;
  chips: FilterChip[];
  onRemoveChip: (id: string) => void;
  onClearAll: () => void;
}

const AttendanceFilterBar = ({
  activeView,
  onView,
  onSaveView,
  search,
  onSearch,
  searchInputRef,
  filters,
  onFilterChange,
  date,
  onDateChange,
  onOpenAdvanced,
  chips,
  onRemoveChip,
  onClearAll,
}: AttendanceFilterBarProps) => (
  <section className="filter-bar mb-3" aria-label="Filters">
    <div className="view-toggle-group" role="group" aria-label="Saved views">
      {savedViews.map((view) => (
        <button
          key={view.id}
          type="button"
          className={`view-toggle${activeView === view.id ? ' is-on' : ''}`}
          aria-pressed={activeView === view.id}
          onClick={() => onView(view.id)}
        >
          <i className={view.icon} />
          {view.label}
          <span>{view.count}</span>
        </button>
      ))}
      <button type="button" className="view-toggle is-add" onClick={onSaveView}>
        <i className="ti ti-plus" />
        Save view
      </button>
    </div>

    <div className="d-flex flex-wrap align-items-center gap-2 py-3">
      <div className="search-field">
        <i className="ti ti-search" aria-hidden="true" />
        <input
          type="search"
          id="attSearch"
          placeholder="Search students, admission no., roll no…"
          aria-label="Search students"
          ref={searchInputRef}
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
        <kbd>/</kbd>
      </div>

      {filterSelects.map((field) => (
        <label className="select-field" key={field.id}>
          <span>{field.label}</span>
          <select
            aria-label={field.ariaLabel}
            value={filters[field.id] ?? field.options[0]}
            onChange={(event) => onFilterChange(field.id, event.target.value)}
          >
            {field.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      ))}

      <label className="select-field">
        <span>Date</span>
        <DateField
          value={date}
          ariaLabel="Attendance date"
          onChange={(dateString) => onDateChange(dateString as string)}
        />
      </label>

      <button type="button" className="toolbar-button toolbar-button-sm" onClick={onOpenAdvanced}>
        <i className="ti ti-adjustments-alt" />
        More
      </button>
    </div>

    <div className="d-flex flex-wrap align-items-center gap-2 chip-row">
      <span className="sub-text">Applied</span>
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          className="filter-tag"
          onClick={() => onRemoveChip(chip.id)}
        >
          {chip.label}
          <i className="ti ti-x" />
        </button>
      ))}
      <button type="button" className="clear-button" onClick={onClearAll}>
        Clear all
      </button>
    </div>
  </section>
);

export default AttendanceFilterBar;
