import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ActiveChip, ColumnDef, Density, FilterField } from './types';

export interface UseWorkspaceConfig<T> {
  rows: T[];
  filterFields: FilterField[];
  columns: ColumnDef<T>[];
  /** Stable row identity, used for selection and expansion sets. */
  getId: (row: T) => string;
  /** Free-text match against the search box; the term arrives lower-cased. */
  search: (row: T, term: string) => boolean;
  /** Applied-filter match. Only called with the committed values. */
  matches: (row: T, filters: Record<string, string>) => boolean;
  /** Quick-filter rail match; null means no quick filter is active. */
  quickMatch?: (row: T, quick: string | null) => boolean;
  /** Saved-view match; the "all" view should always pass. */
  viewMatch?: (row: T, view: string) => boolean;
  compare: (a: T, b: T, sort: string) => number;
  defaultSort: string;
  /**
   * Quick filter the rail opens with.
   *
   * Most of the Campus Operations templates render one `.quick-filter` already
   * `active` on load. Like a filter's `initialValue`, this is opening state and
   * not a default: Reset clears it and it does not come back.
   */
  defaultQuick?: string | null;
  /** Starting rows-per-page; variant-A pages let the user change it. */
  pageSize?: number;
}

export interface UseWorkspaceResult<T> {
  /** Rows passing every narrowing, sorted. */
  visible: T[];
  /** The current page of `visible`. */
  shown: T[];

  search: string;
  setSearch: (value: string) => void;

  /** Uncommitted filter panel values. */
  draft: Record<string, string>;
  setDraftField: (id: string, value: string) => void;
  /**
   * Commit one field without waiting for Apply.
   *
   * The Reports templates' Band 2 is an inline field grid with only Reset and
   * Refresh beside it — no Apply — so a field there narrows the grid as it
   * changes, while the Band 3 dropdown keeps the draft/Apply cycle. Both write
   * into the same committed set, so a chip clears either one.
   */
  applyDraftField: (id: string, value: string) => void;
  /** Committed values — these are what actually narrow the grid. */
  filters: Record<string, string>;
  applyFilters: () => void;
  resetFilters: () => void;
  clearChip: (id: string) => void;
  chips: ActiveChip[];

  view: string;
  setView: (view: string) => void;
  quick: string | null;
  toggleQuick: (id: string) => void;

  sort: string;
  setSort: (sort: string) => void;

  columns: Record<string, boolean>;
  toggleColumn: (id: string) => void;
  showAllColumns: () => void;
  /** Columns still visible, in definition order. */
  visibleColumns: ColumnDef<T>[];

  density: Density;
  setDensity: (density: Density) => void;

  fullscreen: boolean;
  toggleFullscreen: () => void;

  selected: string[];
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  allShownSelected: boolean;
  clearSelection: () => void;

  expanded: string[];
  toggleExpand: (id: string) => void;

  page: number;
  setPage: (page: number) => void;
  /** Rows per page, driven by the footer's Rows select on variant-A pages. */
  pageSize: number;
  setPageSize: (size: number) => void;
  pageCount: number;
  rangeStart: number;
  rangeEnd: number;
}

export function useWorkspace<T>(config: UseWorkspaceConfig<T>): UseWorkspaceResult<T> {
  const {
    rows,
    filterFields,
    columns: columnDefs,
    getId,
    search: searchFn,
    matches,
    quickMatch,
    viewMatch,
    compare,
    defaultSort,
    defaultQuick = null,
    pageSize: initialPageSize = 10,
  } = config;

  /** Blank for selects; some template date fields ship with a preset range. */
  const defaults = useMemo(
    () => Object.fromEntries(filterFields.map((field) => [field.id, field.defaultValue ?? ''])),
    [filterFields],
  );

  /**
   * What the grid opens with. Differs from `defaults` only on the pages whose
   * template renders committed chips on load; Reset still returns to `defaults`,
   * so those chips clear and stay cleared, matching the template.
   */
  const initial = useMemo(
    () =>
      Object.fromEntries(
        filterFields.map((field) => [field.id, field.initialValue ?? field.defaultValue ?? '']),
      ),
    [filterFields],
  );

  const allColumnsOn = useMemo(
    () => Object.fromEntries(columnDefs.map((column) => [column.id, true])),
    [columnDefs],
  );

  const [search, setSearchValue] = useState('');
  const [draft, setDraft] = useState<Record<string, string>>(initial);
  const [filters, setFilters] = useState<Record<string, string>>(initial);
  const [view, setViewValue] = useState('all');
  const [quick, setQuick] = useState<string | null>(defaultQuick);
  const [sort, setSort] = useState(defaultSort);
  const [columns, setColumns] = useState<Record<string, boolean>>(allColumnsOn);
  const [density, setDensity] = useState<Density>('default');
  const [fullscreen, setFullscreen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeValue] = useState(initialPageSize);

  /* ------------------------------- Narrowing -------------------------------- */

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    const list = rows.filter((row) => {
      if (term && !searchFn(row, term)) return false;
      if (viewMatch && !viewMatch(row, view)) return false;
      if (quickMatch && !quickMatch(row, quick)) return false;
      return matches(row, filters);
    });

    return [...list].sort((a, b) => compare(a, b, sort));
  }, [rows, search, searchFn, view, viewMatch, quick, quickMatch, filters, matches, compare, sort]);

  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const shown = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const rangeStart = visible.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, visible.length);

  /* --------------------------------- Chips ---------------------------------- */

  const chips = useMemo<ActiveChip[]>(
    () =>
      filterFields
        .filter((field) => {
          const value = filters[field.id];
          return Boolean(value) && value !== (field.defaultValue ?? '');
        })
        .map((field) => ({
          id: field.id,
          label: field.chipLabel ?? field.label,
          value: filters[field.id],
        })),
    [filterFields, filters],
  );

  /* -------------------------------- Handlers -------------------------------- */

  const setPageSize = useCallback((size: number) => {
    setPageSizeValue(size);
    setPage(1);
  }, []);

  const setSearch = useCallback((value: string) => {
    setSearchValue(value);
    setPage(1);
  }, []);

  const setDraftField = useCallback((id: string, value: string) => {
    setDraft((current) => ({ ...current, [id]: value }));
  }, []);

  const applyDraftField = useCallback((id: string, value: string) => {
    setDraft((current) => ({ ...current, [id]: value }));
    setFilters((current) => ({ ...current, [id]: value }));
    setPage(1);
  }, []);

  const applyFilters = useCallback(() => {
    setFilters(draft);
    setPage(1);
  }, [draft]);

  const resetFilters = useCallback(() => {
    setDraft(defaults);
    setFilters(defaults);
    setSearchValue('');
    setViewValue('all');
    setQuick(null);
    setPage(1);
  }, [defaults]);

  const clearChip = useCallback(
    (id: string) => {
      const fallback = filterFields.find((field) => field.id === id)?.defaultValue ?? '';
      setDraft((current) => ({ ...current, [id]: fallback }));
      setFilters((current) => ({ ...current, [id]: fallback }));
      setPage(1);
    },
    [filterFields],
  );

  const setView = useCallback((next: string) => {
    setViewValue(next);
    setPage(1);
  }, []);

  const toggleQuick = useCallback((id: string) => {
    setQuick((current) => (current === id ? null : id));
    setPage(1);
  }, []);

  const toggleColumn = useCallback((id: string) => {
    setColumns((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  const showAllColumns = useCallback(() => setColumns(allColumnsOn), [allColumnsOn]);

  const visibleColumns = useMemo(
    () => columnDefs.filter((column) => column.toggleable === false || columns[column.id] !== false),
    [columnDefs, columns],
  );

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }, []);

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement !== null);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const shownIds = useMemo(() => shown.map(getId), [shown, getId]);
  const allShownSelected = shownIds.length > 0 && shownIds.every((id) => selected.includes(id));

  const toggleSelect = useCallback((id: string) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelected((current) =>
      allShownSelected
        ? current.filter((id) => !shownIds.includes(id))
        : Array.from(new Set([...current, ...shownIds])),
    );
  }, [allShownSelected, shownIds]);

  const clearSelection = useCallback(() => setSelected([]), []);

  const toggleExpand = useCallback((id: string) => {
    setExpanded((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }, []);

  return {
    visible,
    shown,
    search,
    setSearch,
    draft,
    setDraftField,
    applyDraftField,
    filters,
    applyFilters,
    resetFilters,
    clearChip,
    chips,
    view,
    setView,
    quick,
    toggleQuick,
    sort,
    setSort,
    columns,
    toggleColumn,
    showAllColumns,
    visibleColumns,
    density,
    setDensity,
    fullscreen,
    toggleFullscreen,
    selected,
    toggleSelect,
    toggleSelectAll,
    allShownSelected,
    clearSelection,
    expanded,
    toggleExpand,
    page: currentPage,
    setPage,
    pageSize,
    setPageSize,
    pageCount,
    rangeStart,
    rangeEnd,
  };
}
