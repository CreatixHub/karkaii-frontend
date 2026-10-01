import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import ExamTypesGrid from './components/ExamTypesGrid';
import type { ExamTypeGroup } from './components/ExamTypesGrid';
import ExamTypesSkeleton from './components/ExamTypesSkeleton';
import ExamTypesToolbar from './components/ExamTypesToolbar';
import type { FilterChip } from './components/ExamTypesToolbar';
import ExamTypesModals from './modals/ExamTypesModals';
import type {
  CardMenuItem,
  CfgToggleKey,
  EditConfigValues,
  ExamType,
  ExamTypeFormValues,
  ExamTypeModalId,
  ExportAction,
  FilterKey,
  GroupByKey,
  QuickFilterId,
  SortKey,
} from './data/examTypes.data';
import {
  actionToasts,
  cardTones,
  examTypes,
  filterFields,
  groupByOptions,
  groupValue,
  initialFilters,
  matchesFilter,
  matchesQuickFilter,
  quickFilters,
  savedViews,
  sortOptions,
  strings,
} from './data/examTypes.data';

const routes = all_routes;

/** The redesigned list pages settle for this long before revealing. */
const REVEAL_MS = 650;
const REFRESH_MS = 600;

/** "Assessment Category" ships ticked in the Group By menu (L1554). */
const DEFAULT_GROUP_BY: GroupByKey = 'category';

/** "Recently updated" ships marked active in the sort menu (L1611). */
const DEFAULT_SORT: SortKey = 'recent';

const ExamTypes = () => {
  const [rows, setRows] = useState<ExamType[]>(examTypes);

  const [search, setSearch] = useState('');
  const [savedView, setSavedView] = useState<QuickFilterId | null>(null);
  const [quickFilter, setQuickFilter] = useState<QuickFilterId | null>(null);
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>(initialFilters);
  const [filterDraft, setFilterDraft] = useState<Partial<Record<FilterKey, string>>>(initialFilters);
  const [groupBy, setGroupBy] = useState<GroupByKey | null>(DEFAULT_GROUP_BY);
  const [sort, setSort] = useState<SortKey>(DEFAULT_SORT);

  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ExamTypeModalId | null>(null);
  const [activeRow, setActiveRow] = useState<ExamType | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const searchRef = useRef<HTMLInputElement | null>(null);
  const { toasts, push, dismiss } = useToasts();
  const { loading: booting, revealed } = useReveal(REVEAL_MS);
  const loading = booting || refreshing;

  /* ------------------------------ Derived rows ------------------------------ */

  /** Search, saved view and quick filter, but not the facets — the facet menu's own
   *  live count needs the set the draft would narrow, so the two are separated. */
  const preFacet = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (needle && !row.search.includes(needle)) return false;
      if (savedView && !matchesQuickFilter(row, savedView)) return false;
      if (quickFilter && !matchesQuickFilter(row, quickFilter)) return false;
      return true;
    });
  }, [rows, search, savedView, quickFilter]);

  const applyFacets = useCallback(
    (source: ExamType[], facets: Partial<Record<FilterKey, string>>) =>
      source.filter((row) =>
        (Object.entries(facets) as [FilterKey, string][]).every(
          ([key, value]) => !value || matchesFilter(row, key, value),
        ),
      ),
    [],
  );

  const filtered = useMemo(
    () => applyFacets(preFacet, filters),
    [applyFacets, preFacet, filters],
  );

  const sorted = useMemo(() => {
    // "Recently updated" is the order the cards ship in, so it never re-sorts.
    if (sort === 'recent') return filtered;

    return [...filtered].sort((left, right) => {
      switch (sort) {
        case 'name':
          return left.name.localeCompare(right.name);
        case 'code':
          return left.code.localeCompare(right.code);
        case 'weightage':
          return right.weightage - left.weightage;
        case 'category':
          return left.category.localeCompare(right.category);
        default:
          return 0;
      }
    });
  }, [filtered, sort]);

  /** The grid takes rows already bucketed; clearing the grouping leaves one unheaded group. */
  const groups = useMemo<ExamTypeGroup[]>(() => {
    if (!groupBy) return [{ key: 'all', title: '', icon: '', rows: sorted }];

    const option = groupByOptions.find((entry) => entry.key === groupBy);
    const buckets = new Map<string, ExamType[]>();
    sorted.forEach((row) => {
      const title = groupValue(row, groupBy);
      const bucket = buckets.get(title);
      if (bucket) bucket.push(row);
      else buckets.set(title, [row]);
    });

    return [...buckets.entries()].map(([title, bucketRows]) => ({
      key: title,
      title,
      icon: option?.icon ?? '',
      rows: bucketRows,
    }));
  }, [sorted, groupBy]);

  /* --------------------------------- Counts --------------------------------- */

  const quickCounts = useMemo(() => {
    const counts = {} as Record<QuickFilterId, number>;
    quickFilters.forEach((entry) => {
      counts[entry.id] = applyFacets(
        rows.filter((row) => matchesQuickFilter(row, entry.id)),
        filters,
      ).length;
    });
    return counts;
  }, [rows, filters, applyFacets]);

  const viewCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    savedViews.forEach((view) => {
      counts[view.label] = view.id
        ? rows.filter((row) => matchesQuickFilter(row, view.id as QuickFilterId)).length
        : rows.length;
    });
    return counts;
  }, [rows]);

  /** What the *draft* facet selection would leave visible — the menu's live match line. */
  const draftMatchCount = useMemo(
    () => applyFacets(preFacet, filterDraft).length,
    [applyFacets, preFacet, filterDraft],
  );

  const chips = useMemo<FilterChip[]>(
    () =>
      (Object.entries(filters) as [FilterKey, string][])
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => {
          const field = filterFields.find((entry) => entry.key === key);
          return { key, label: `${field?.label ?? key}: ${value}` };
        }),
    [filters],
  );

  const appliedCount = chips.length;

  /* --------------------------------- Actions -------------------------------- */

  const runRefresh = useCallback(
    (message: string) => {
      setRefreshing(true);
      window.setTimeout(() => {
        setRefreshing(false);
        push(message);
      }, REFRESH_MS);
    },
    [push],
  );

  const handleSavedView = useCallback(
    (id: QuickFilterId | null, label: string) => {
      setSavedView(id);
      setQuickFilter(null);
      push(`Showing ${label.toLowerCase()}.`);
    },
    [push],
  );

  const handleQuickFilter = useCallback((id: QuickFilterId) => {
    setQuickFilter((current) => (current === id ? null : id));
  }, []);

  const handleFilterDraft = useCallback((key: FilterKey, value: string) => {
    setFilterDraft((current) => ({ ...current, [key]: value }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    setFilters(filterDraft);
    push(actionToasts.apply_filters);
  }, [filterDraft, push]);

  const handleResetFilters = useCallback(() => {
    setFilterDraft({});
    setFilters({});
    push(actionToasts.clear_filters);
  }, [push]);

  const handleRemoveChip = useCallback((key: FilterKey) => {
    setFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    setFilterDraft((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }, []);

  const handleClearChips = useCallback(() => {
    setFilters({});
    setFilterDraft({});
    push(actionToasts.clear_filters);
  }, [push]);

  const handleGroupBy = useCallback(
    (key: GroupByKey | null) => {
      setGroupBy(key);
      push(key ? actionToasts.group_by : actionToasts.clear_grouping);
    },
    [push],
  );

  const handleSort = useCallback(
    (key: SortKey) => {
      setSort(key);
      if (key === 'recent') {
        push(strings.recentSort, 'info');
        return;
      }
      const option = sortOptions.find((entry) => entry.key === key);
      push(`Sorted by ${option?.label ?? key}.`);
    },
    [push],
  );

  const handleExport = useCallback(
    (action: ExportAction) => {
      push(actionToasts[action.id] ?? 'Preparing export…');
    },
    [push],
  );

  const handleToggleFullscreen = useCallback(() => setFullscreen((current) => !current), []);

  /* ------------------------------- Card menus ------------------------------- */

  const handleMenuAction = useCallback(
    (item: CardMenuItem, row: ExamType) => {
      setMenuOpen(null);

      if (item.modal) {
        setActiveRow(row);
        setActiveModal(item.modal);
        return;
      }

      if (item.id === 'duplicate') {
        const copy: ExamType = {
          ...row,
          id: `${row.id}-copy-${Date.now()}`,
          name: `${row.name} (Copy)`,
          code: `${row.code}-C`,
          status: 'Draft',
          statusBadge: 'badge-soft-warning',
        };
        setRows((current) => [copy, ...current]);
        push(actionToasts.duplicate);
        return;
      }

      if (item.id === 'print') {
        push(actionToasts.print, 'info');
        window.setTimeout(() => window.print(), 60);
      }
    },
    [push],
  );

  /* ------------------------------ Row mutations ----------------------------- */

  const handleAdd = useCallback(
    (values: ExamTypeFormValues) => {
      const tone = cardTones[rows.length % cardTones.length];
      const weightage = Number(values.weightage) || 0;
      const created: ExamType = {
        id: `et-${Date.now()}`,
        name: values.name || 'Untitled Exam Type',
        code: values.code || 'NEW',
        avatarClass: tone.avatarClass,
        icon: tone.icon,
        barClass: tone.barClass,
        status: values.status as ExamType['status'],
        statusBadge:
          values.status === 'Active'
            ? 'badge-soft-success'
            : values.status === 'Draft'
              ? 'badge-soft-warning'
              : 'badge-soft-danger',
        categoryLabel: `${values.category} Assessment`,
        category: values.category as ExamType['category'],
        totalMarks: values.totalMarks,
        passMarks: values.passMarks,
        duration: values.duration,
        weightage,
        weightageLabel: `${weightage < 10 ? `0${weightage}` : weightage}%`,
        academicYear: values.academicYear,
        term: 'Term I',
        classGroup: 'Secondary (IX – X)',
        gradingSystem: 'CBSE 8-Point',
        practicalComponent: 'Optional',
        description: values.description,
        search: `${values.name} ${values.code} ${values.category} ${values.status} ${values.description}`.toLowerCase(),
      };
      setRows((current) => [created, ...current]);
      setActiveModal(null);
      push(actionToasts.created);
    },
    [rows.length, push],
  );

  const handleSave = useCallback(
    (id: string, values: ExamTypeFormValues) => {
      const weightage = Number(values.weightage) || 0;
      setRows((current) =>
        current.map((row) =>
          row.id === id
            ? {
                ...row,
                name: values.name,
                code: values.code,
                category: values.category as ExamType['category'],
                categoryLabel: `${values.category} Assessment`,
                academicYear: values.academicYear,
                totalMarks: values.totalMarks,
                passMarks: values.passMarks,
                duration: values.duration,
                weightage,
                weightageLabel: `${weightage < 10 ? `0${weightage}` : weightage}%`,
                status: values.status as ExamType['status'],
                statusBadge:
                  values.status === 'Active'
                    ? 'badge-soft-success'
                    : values.status === 'Draft'
                      ? 'badge-soft-warning'
                      : 'badge-soft-danger',
                description: values.description,
                search: `${values.name} ${values.code} ${values.category} ${values.status} ${values.description}`.toLowerCase(),
              }
            : row,
        ),
      );
      setActiveModal(null);
      push(actionToasts.updated);
    },
    [push],
  );

  /** The sheet writes back the handful of fields the card actually shows. */
  const handleSaveConfig = useCallback(
    (id: string, values: EditConfigValues, _toggles: Record<CfgToggleKey, boolean>) => {
      const weightage = Number(values.contributionToFinalResult) || 0;
      setRows((current) =>
        current.map((row) =>
          row.id === id
            ? {
                ...row,
                name: values.examTypeName,
                code: values.shortCode,
                category: values.assessmentCategory as ExamType['category'],
                categoryLabel: `${values.assessmentCategory} Assessment`,
                academicYear: values.academicYear,
                term: values.term,
                status: values.status as ExamType['status'],
                totalMarks: values.totalMarks,
                passMarks: values.overallPassMark,
                weightage,
                weightageLabel: `${weightage < 10 ? `0${weightage}` : weightage}%`,
              }
            : row,
        ),
      );
      setActiveModal(null);
      push(actionToasts.config_saved);
    },
    [push],
  );

  const handleConfirmDelete = useCallback(() => {
    if (activeRow) setRows((current) => current.filter((row) => row.id !== activeRow.id));
    setActiveModal(null);
    setActiveRow(null);
    push(actionToasts.deleted);
  }, [activeRow, push]);

  /* -------------------------------- Shortcuts ------------------------------- */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (event.key === 'Escape' && fullscreen) setFullscreen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen]);

  /* --------------------------------- Render --------------------------------- */

  return (
    <>
      <div className="page-wrapper">
        <div className={`content${fullscreen ? ' dt-fullscreen' : ''}`}>
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Exam Types</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Exam Types
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={() => {
                    setActiveRow(null);
                    setActiveModal('add');
                  }}
                >
                  <i className="ti ti-circle-plus me-2" />
                  Add Exam Type
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {loading ? (
            <ExamTypesSkeleton />
          ) : (
            <>
              <ExamTypesToolbar
                searchRef={searchRef}
                search={search}
                onSearch={setSearch}
                savedView={savedView}
                onSavedView={handleSavedView}
                onSaveCurrentView={() => push(actionToasts.save_view)}
                filterDraft={filterDraft}
                onFilterDraft={handleFilterDraft}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
                draftMatchCount={draftMatchCount}
                totalCount={rows.length}
                appliedCount={appliedCount}
                groupBy={groupBy}
                onGroupBy={handleGroupBy}
                quickFilter={quickFilter}
                onQuickFilter={handleQuickFilter}
                quickCounts={quickCounts}
                viewCounts={viewCounts}
                sort={sort}
                onSort={handleSort}
                chips={chips}
                onRemoveChip={handleRemoveChip}
                onClearChips={handleClearChips}
                onImport={() => push(actionToasts.import, 'info')}
                onExport={handleExport}
                onPrint={() => {
                  push(actionToasts.print, 'info');
                  window.setTimeout(() => window.print(), 60);
                }}
                onRefresh={() => runRefresh(actionToasts.refresh)}
                fullscreen={fullscreen}
                onToggleFullscreen={handleToggleFullscreen}
              />

              <ExamTypesGrid
                groups={groups}
                revealed={revealed}
                menuOpen={menuOpen}
                onOpenMenu={setMenuOpen}
                onMenuAction={handleMenuAction}
                onAdd={() => {
                  setActiveRow(null);
                  setActiveModal('add');
                }}
                onClearFilters={handleClearChips}
              />
            </>
          )}
        </div>
      </div>

      <ExamTypesModals
        active={activeModal}
        row={activeRow}
        onClose={() => setActiveModal(null)}
        onAdd={handleAdd}
        onSave={handleSave}
        onSaveConfig={handleSaveConfig}
        onConfirmDelete={handleConfirmDelete}
        onEditConfig={() => setActiveModal('editConfig')}
        onPrintConfig={() => {
          push(actionToasts.config_print, 'info');
          window.setTimeout(() => window.print(), 60);
        }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export default ExamTypes;
