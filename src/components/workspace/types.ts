import type { ReactNode } from 'react';
import type { DateFormat } from '@components/ui/DateField';
import type { RangeFormat } from '@components/ui/DateRangeField';

/**
 * What the filter panel renders for a field.
 *
 * The templates mount these with flatpickr (`assets/js/script.js`): `date` is
 * `.filter-datepicker`, `daterange` is `.filter-daterange`, `time` is
 * `.timepicker`. `select` stays a native `form-select` — the panels never mount
 * Choices.js over their own selects, only the modal forms do.
 */
export type FilterKind = 'select' | 'date' | 'daterange' | 'time' | 'number' | 'toggle';

/**
 * Which of a report page's two filter surfaces renders the field.
 *
 * The Reports templates split their filters in two. Band 2 of the report
 * toolbar is a collapsed accordion of inline fields — the ones you narrow a
 * report by before you run it (date range, class, term). The Band 3 "More
 * Filters" dropdown holds, in the template's own words, "only what is not
 * already a field above": the numeric bands and the exception switch.
 *
 * Both surfaces commit into the same draft, so a chip cleared on one clears the
 * field on the other. Defaults to `menu`, which is where every non-report
 * workspace puts all of its fields.
 */
export type FilterSurface = 'band' | 'menu';

export interface FilterField {
  /** Matches the template's `id`, and doubles as the state key. */
  id: string;
  label: string;
  kind: FilterKind;
  options?: string[];
  surface?: FilterSurface;
  /** Grid classes for a `band` field; the template varies these per field. */
  span?: string;
  /** `number` fields only — the template sets a floor on each. */
  min?: string;
  /** `toggle` fields only — the sentence beside the switch. */
  switchLabel?: string;
  /** Shown on date inputs; the template pre-fills some with a value. */
  placeholder?: string;
  /**
   * Value the field resets to. Blank for "All" selects; some date fields carry
   * a preset range in the template.
   */
  defaultValue?: string;
  /**
   * Value the field starts applied at, when that differs from `defaultValue`.
   *
   * Some templates render the grid with filters already committed — Financial
   * Reports and Tax Reports both open with a Financial Year and a Period chip
   * showing. Those chips are active state, not defaults: Reset clears them and
   * they do not come back. Falls back to `defaultValue` when omitted.
   */
  initialValue?: string;
  /** Short form used on the active-filter chip, e.g. "Dept" for Department. */
  chipLabel?: string;
  /**
   * Copy on the blank option. Most selects say "All", but the date-valued ones
   * say "Any date" in the templates. Defaults to "All".
   */
  allLabel?: string;
  /** For `kind: 'date'` — the flatpickr format the source page uses. */
  dateFormat?: DateFormat;
  /** For `kind: 'daterange'` — the flatpickr range format. */
  rangeFormat?: RangeFormat;
}

export interface SavedView {
  id: string;
  label: string;
  icon: string;
  /** Rendered as the `view-count` badge; omit to hide it. */
  count?: number;
}

export interface QuickFilter {
  id: string;
  label: string;
  icon: string;
  /** Rendered as the `quick-filter-count` badge. */
  count?: number;
}

export interface SortOption {
  id: string;
  label: string;
  icon: string;
}

export type Density = 'compact' | 'default' | 'comfortable';

/**
 * One grid column. `render` receives the row; `id` doubles as the Columns-menu
 * key, so hiding a column drops its `<th>` and `<td>` together.
 */
export interface ColumnDef<T> {
  id: string;
  label: string;
  render: (row: T) => ReactNode;
  /** Omit or set false to make the column permanent (not in the Columns menu). */
  toggleable?: boolean;
  /** Adds `dt-sortable`; the id is passed back to the page's comparator. */
  sortable?: boolean;
  /**
   * `text-end` / `text-center` on both the header and the cell. Money columns
   * take `end`; the Reports grids centre every counted column.
   */
  align?: 'end' | 'center';
  /** Extra classes for the `<td>` only, e.g. `fs-13`. */
  cellClassName?: string;
}

export interface ActiveChip {
  id: string;
  label: string;
  value: string;
}
