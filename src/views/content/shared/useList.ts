import { useMemo, useState } from 'react';
import type { SortId } from './ListToolbar';

export interface UseListConfig<T> {
  rows: T[];
  getId: (row: T) => string;
  /** Whether a row survives the applied filters. */
  matches: (row: T, filters: Record<string, string>) => boolean;
  /** What the A–Z sort compares. */
  sortKey: (row: T) => string;
}

export interface UseListResult<T> {
  visible: T[];
  filters: Record<string, string>;
  applyFilters: (filters: Record<string, string>) => void;
  resetFilters: () => void;
  sort: SortId;
  setSort: (sort: SortId) => void;
  selected: string[];
  isSelected: (id: string) => boolean;
  toggleRow: (id: string, checked: boolean) => void;
  toggleAll: (checked: boolean) => void;
  allSelected: boolean;
  clearSelection: () => void;
}

export function useList<T>({ rows, getId, matches, sortKey }: UseListConfig<T>): UseListResult<T> {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortId>('asc');
  const [selected, setSelected] = useState<string[]>([]);

  const visible = useMemo(() => {
    const kept = rows.filter((row) => matches(row, filters));

    /**
     * The template offers four orders. Two are alphabetical; the other two are
     * "recently viewed" and "recently added", which the register cannot tell
     * apart from each other, so both read newest-first — the order the rows are
     * stated in, reversed.
     */
    if (sort === 'asc') {
      return [...kept].sort((left, right) => sortKey(left).localeCompare(sortKey(right)));
    }
    if (sort === 'desc') {
      return [...kept].sort((left, right) => sortKey(right).localeCompare(sortKey(left)));
    }
    return [...kept].reverse();
  }, [rows, filters, sort, matches, sortKey]);

  const visibleIds = visible.map(getId);
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));

  return {
    visible,
    filters,
    applyFilters: setFilters,
    resetFilters: () => setFilters({}),
    sort,
    setSort,
    selected,
    isSelected: (id) => selected.includes(id),
    toggleRow: (id, checked) =>
      setSelected((current) =>
        checked ? [...current, id] : current.filter((entry) => entry !== id),
      ),
    toggleAll: (checked) => setSelected(checked ? visibleIds : []),
    allSelected,
    clearSelection: () => setSelected([]),
  };
}
