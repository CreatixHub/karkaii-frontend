import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import LessonDetailPanel from './components/LessonDetailPanel';
import LessonPlanCard from './components/LessonPlanCard';
import LessonPlanRow from './components/LessonPlanRow';
import LessonSidebar from './components/LessonSidebar';
import LessonSkeleton from './components/LessonSkeleton';
import LessonToolbar from './components/LessonToolbar';
import type { ToolbarChip } from './components/LessonToolbar';
import LessonModals from './modals/LessonModals';
import type {
  ActivityDraft,
  AssignDraft,
  LessonDraft,
  ResourceDraft,
} from './modals/LessonModals';
import type {
  DetailTabId,
  ExportAction,
  FilterKey,
  LayoutView,
  LessonAction,
  LessonModalId,
  LessonPlan,
  LessonResource,
  RailGroupKey,
  SavedViewId,
  SortKey,
  StructureKey,
  ToolbarMenu,
} from './data/lessonPlanning.data';
import {
  actionToasts,
  filterChipLabels,
  filterChipTones,
  initialRail,
  lessonPlans,
  railGroups,
  savedViews,
  sortOptions,
} from './data/lessonPlanning.data';

const routes = all_routes;

/** The Academic module's non-table pages settle for this long before revealing. */
const REVEAL_MS = 650;
const REFRESH_MS = 600;

/** How a rail group narrows a plan. Year, term and category are the template's radios. */
const railMatches = (plan: LessonPlan, group: RailGroupKey, value: string): boolean => {
  switch (group) {
    case 'year':
      return plan.year === value;
    case 'term':
      return plan.term === value;
    case 'grade':
      return plan.grade === value;
    case 'class':
      return plan.classLetter === value;
    case 'daypart':
      return plan.daypart === value;
    case 'subject':
      return plan.subject === value;
    case 'category':
      return value === 'all' || plan.category === value;
    case 'planType':
      return plan.planType === value;
    // The Library group is a status shelf rather than a field.
    case 'library':
      if (value === 'drafts') return plan.status === 'Draft';
      if (value === 'published') return plan.status === 'Published';
      return plan.status !== 'Archived';
    default:
      return true;
  }
};

/** How a toolbar facet narrows a plan. */
const facetMatches = (plan: LessonPlan, key: FilterKey, value: string): boolean => {
  switch (key) {
    case 'year':
      return plan.year === value;
    case 'grade':
      return plan.grade === value;
    case 'class':
      return plan.classLetter === value;
    case 'section':
      return plan.daypart === value;
    case 'subject':
      return plan.subject === value;
    case 'teacher':
      return plan.teacher === value;
    case 'status':
      return plan.status === value;
    case 'lessonType':
      return plan.category === value.toLowerCase();
    case 'week':
      return plan.week === value;
    case 'dateRange':
    default:
      return true;
  }
};

const matchesSavedView = (plan: LessonPlan, view: SavedViewId): boolean => {
  if (view === 'published') return plan.status === 'Published';
  if (view === 'drafts') return plan.status === 'Draft';
  return true;
};

const LessonPlanning = () => {
  const [plans, setPlans] = useState<LessonPlan[]>(lessonPlans);

  /* ---------------------------------- State --------------------------------- */
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [sort, setSort] = useState<SortKey>('recent');
  const [view, setView] = useState<SavedViewId>('all');
  const [layout, setLayout] = useState<LayoutView>('grid');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);

  const [rail, setRail] = useState<Partial<Record<RailGroupKey, string>>>(initialRail);
  const [railOpen, setRailOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(lessonPlans[0]?.id ?? null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cardMenu, setCardMenu] = useState<string | null>(null);

  const [detailTab, setDetailTab] = useState<DetailTabId>('overview');
  const [openSection, setOpenSection] = useState<StructureKey | null>('intro');

  const [activeModal, setActiveModal] = useState<LessonModalId | null>(null);
  const [activePlan, setActivePlan] = useState<LessonPlan | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { toasts, push, dismiss } = useToasts();
  const { loading: booting, revealed } = useReveal(REVEAL_MS);
  const loading = booting || refreshing;

  /* ------------------------------ Derived plans ----------------------------- */

  /** Narrowed by the rail alone — the set the rail's own badges count against. */
  const railScoped = useMemo(
    () =>
      plans.filter((plan) =>
        (Object.entries(rail) as [RailGroupKey, string][]).every(
          ([group, value]) => !value || railMatches(plan, group, value),
        ),
      ),
    [plans, rail],
  );

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();

    const matches = railScoped.filter((plan) => {
      if (needle && !plan.search.includes(needle)) return false;
      if (!matchesSavedView(plan, view)) return false;
      return (Object.entries(filters) as [FilterKey, string][]).every(
        ([key, value]) => !value || facetMatches(plan, key, value),
      );
    });

    // "Recently updated" is the order the cards ship in, so it never re-sorts.
    if (sort === 'recent') return matches;

    return [...matches].sort((left, right) => {
      switch (sort) {
        case 'title':
          return left.title.localeCompare(right.title);
        case 'week':
          return left.weekNumber - right.weekNumber;
        case 'completion':
          return right.percent - left.percent;
        default:
          return 0;
      }
    });
  }, [railScoped, search, view, filters, sort]);

  const selected = useMemo(
    () => plans.find((plan) => plan.id === selectedId) ?? null,
    [plans, selectedId],
  );

  /* --------------------------------- Counts --------------------------------- */

  /** Keyed `"<group>:<item>"`, for the rail entries that carry a badge. */
  const railCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    railGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (!item.badgeClass) return;
        // Count against the rail with this group's own selection lifted, so a badge
        // shows what picking it would yield rather than what is already picked.
        const others = { ...rail };
        delete others[group.key];
        counts[`${group.key}:${item.id}`] = plans.filter(
          (plan) =>
            (Object.entries(others) as [RailGroupKey, string][]).every(
              ([key, value]) => !value || railMatches(plan, key, value),
            ) && railMatches(plan, group.key, item.id),
        ).length;
      });
    });
    return counts;
  }, [plans, rail]);

  const viewCounts = useMemo(() => {
    const counts = {} as Record<SavedViewId, number>;
    savedViews.forEach((entry) => {
      counts[entry.id] = railScoped.filter((plan) => matchesSavedView(plan, entry.id)).length;
    });
    return counts;
  }, [railScoped]);

  const chips = useMemo<ToolbarChip[]>(
    () =>
      (Object.entries(filters) as [FilterKey, string][])
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => ({
          id: key,
          label: `${filterChipLabels[key]}: ${value}`,
          tone: filterChipTones[key] ?? 'secondary',
        })),
    [filters],
  );

  /* --------------------------------- Actions -------------------------------- */

  const handleFilter = useCallback((key: FilterKey, value: string) => {
    setFilters((current) => {
      const next = { ...current };
      if (value) next[key] = value;
      else delete next[key];
      return next;
    });
  }, []);

  const handleClearChip = useCallback((id: string) => {
    setFilters((current) => {
      const next = { ...current };
      delete next[id as FilterKey];
      return next;
    });
  }, []);

  const handleRailSelect = useCallback(
    (group: RailGroupKey, item: string, required: boolean) => {
      setRail((current) => {
        const next = { ...current };
        // Radio groups always keep a selection; the rest toggle off.
        if (!required && current[group] === item) delete next[group];
        else next[group] = item;
        return next;
      });
    },
    [],
  );

  const runRefresh = useCallback(() => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      push(actionToasts.refresh);
    }, REFRESH_MS);
  }, [push]);

  const handleSort = useCallback(
    (id: SortKey) => {
      setSort(id);
      const option = sortOptions.find((entry) => entry.id === id);
      push(`Sorted by ${option?.label ?? id}.`);
    },
    [push],
  );

  const openModal = useCallback((id: LessonModalId, plan: LessonPlan | null) => {
    setActivePlan(plan);
    setActiveModal(id);
  }, []);

  /** Shared by the card kebab menus and the detail panel's quick-action row. */
  const handleAction = useCallback(
    (item: LessonAction, plan: LessonPlan) => {
      setCardMenu(null);

      if (item.modal) {
        setSelectedId(plan.id);
        openModal(item.modal, plan);
        return;
      }

      if (item.id === 'duplicate') {
        const copy: LessonPlan = {
          ...plan,
          id: `${plan.id}_copy_${Date.now()}`,
          code: `${plan.code}-C`,
          title: `${plan.title} (Copy)`,
          status: 'Draft',
          statusBadge: 'badge-soft-warning',
        };
        setPlans((current) => [copy, ...current]);
        push(actionToasts.duplicate);
        return;
      }

      if (item.id === 'archive') {
        setPlans((current) =>
          current.map((entry) =>
            entry.id === plan.id
              ? { ...entry, status: 'Archived', statusBadge: 'badge-soft-secondary' }
              : entry,
          ),
        );
        push(actionToasts.archive);
        return;
      }

      if (item.id === 'print') {
        push(actionToasts.print);
        window.setTimeout(() => window.print(), 60);
        return;
      }

      if (item.id === 'download') push(actionToasts.download);
      else if (item.id === 'assign_class') push(actionToasts.assign_class);
    },
    [openModal, push],
  );

  const handleResourceAction = useCallback(
    (resource: LessonResource, action: 'open' | 'download') => {
      push(
        action === 'download'
          ? actionToasts.resource_download
          : resource.downloadable
            ? actionToasts.preview
            : actionToasts.resource_open,
      );
    },
    [push],
  );

  /* ------------------------------ Plan mutations ---------------------------- */

  const applyDraft = (plan: LessonPlan, draft: LessonDraft): LessonPlan => {
    const category = draft.lessonType.toLowerCase() === 'elective' ? 'elective' : 'core';
    return {
      ...plan,
      title: draft.title || plan.title,
      subject: draft.subject,
      grade: draft.grade,
      className: draft.className,
      classLetter: draft.className.replace('Section ', ''),
      sectionLabel: draft.className.replace('Section ', 'Sec '),
      teacher: draft.teacher,
      week: draft.week,
      weekNumber: Number(draft.week.replace('Week ', '')) || plan.weekNumber,
      duration: Number(draft.duration) || plan.duration,
      status: draft.status as LessonPlan['status'],
      statusBadge:
        draft.status === 'Published'
          ? 'badge-soft-success'
          : draft.status === 'In Review'
            ? 'badge-soft-info'
            : 'badge-soft-warning',
      category,
      typeLabel: draft.lessonType,
      summary: draft.summary,
      search: `${draft.title} ${draft.subject} ${draft.grade} ${draft.teacher} ${draft.week} ${draft.status} ${draft.summary}`.toLowerCase(),
    };
  };

  const handleAdd = useCallback(
    (draft: LessonDraft) => {
      const base = lessonPlans[0];
      const created = applyDraft(
        {
          ...base,
          id: `lp_${Date.now()}`,
          code: `LP-2025-${String(plans.length + 32).padStart(4, '0')}`,
          percent: 0,
          objectives: 0,
          activities: 0,
          resourceCount: 0,
          timeline: [],
          resources: [],
        },
        draft,
      );
      setPlans((current) => [created, ...current]);
      setSelectedId(created.id);
      setActiveModal(null);
      push(actionToasts.created);
    },
    [plans.length, push],
  );

  const handleSave = useCallback(
    (id: string, draft: LessonDraft) => {
      setPlans((current) =>
        current.map((plan) => (plan.id === id ? applyDraft(plan, draft) : plan)),
      );
      setActiveModal(null);
      push(actionToasts.updated);
    },
    [push],
  );

  const handleAddActivity = useCallback(
    (draft: ActivityDraft) => {
      if (activePlan) {
        setPlans((current) =>
          current.map((plan) =>
            plan.id === activePlan.id
              ? {
                  ...plan,
                  activities: plan.activities + 1,
                  timeline: [
                    ...plan.timeline,
                    {
                      stage: draft.stage,
                      minutes: Number(draft.duration) || 0,
                      note: draft.title || draft.instructions,
                    },
                  ],
                }
              : plan,
          ),
        );
      }
      setActiveModal(null);
      push(actionToasts.activity_added);
    },
    [activePlan, push],
  );

  const handleAddResource = useCallback(
    (draft: ResourceDraft) => {
      if (activePlan) {
        const isLink = draft.type === 'External Link';
        setPlans((current) =>
          current.map((plan) =>
            plan.id === activePlan.id
              ? {
                  ...plan,
                  resourceCount: plan.resourceCount + 1,
                  resources: [
                    ...plan.resources,
                    {
                      name: draft.name || 'Untitled resource',
                      meta: isLink ? 'External · Link' : `Added · ${draft.type}`,
                      icon: isLink ? 'ti ti-link' : 'ti ti-file',
                      tone: isLink ? 'success' : 'primary',
                      openIcon: isLink ? 'ti ti-external-link' : 'ti ti-eye',
                      openLabel: isLink ? 'Open' : 'Preview',
                      downloadable: !isLink,
                    },
                  ],
                }
              : plan,
          ),
        );
      }
      setActiveModal(null);
      push(actionToasts.resource_added);
    },
    [activePlan, push],
  );

  const handleAssign = useCallback(
    (draft: AssignDraft) => {
      setPlans((current) =>
        current.map((plan) =>
          plan.id === draft.planId
            ? {
                ...plan,
                teacher: draft.teacher,
                grade: draft.grade,
                className: draft.className,
                classLetter: draft.className.replace('Section ', ''),
                sectionLabel: draft.className.replace('Section ', 'Sec '),
              }
            : plan,
        ),
      );
      setActiveModal(null);
      push(actionToasts.assigned);
    },
    [push],
  );

  const handlePublish = useCallback(
    (note: string) => {
      if (activePlan) {
        setPlans((current) =>
          current.map((plan) =>
            plan.id === activePlan.id
              ? {
                  ...plan,
                  status: 'Published',
                  statusBadge: 'badge-soft-success',
                  notes: note || plan.notes,
                }
              : plan,
          ),
        );
      }
      setActiveModal(null);
      push(actionToasts.publish);
    },
    [activePlan, push],
  );

  const handleConfirmDelete = useCallback(() => {
    if (activePlan) {
      setPlans((current) => current.filter((plan) => plan.id !== activePlan.id));
      if (selectedId === activePlan.id) setSelectedId(null);
    }
    setActiveModal(null);
    setActivePlan(null);
    push(actionToasts.deleted);
  }, [activePlan, selectedId, push]);

  /* -------------------------------- Shortcuts ------------------------------- */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setCardMenu(null);
      setOpenMenu(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* --------------------------------- Render --------------------------------- */

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Lesson Planning</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Lesson Planning
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center d-xl-none"
                aria-controls="lp_left"
                onClick={() => setRailOpen(true)}
              >
                <i className="ti ti-filter me-1" />
                Filters
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => openModal('add', null)}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                New Lesson Plan
              </button>
            </div>
          </div>
          {/* /Page Header */}

          {loading ? (
            <LessonSkeleton />
          ) : (
            <div className="card data-workspace classes-workspace is-loaded" id="lp_card">
              <LessonToolbar
                search={search}
                onSearch={setSearch}
                filters={filters}
                onFilter={handleFilter}
                onResetFilters={() => {
                  setFilters({});
                  push(actionToasts.clear_filters);
                }}
                onApplyFilters={() => push(actionToasts.apply_filters)}
                sort={sort}
                onSort={handleSort}
                view={view}
                onView={setView}
                viewCounts={viewCounts}
                onSaveView={() => push(actionToasts.save_view)}
                layout={layout}
                onLayout={setLayout}
                openMenu={openMenu}
                onOpenMenu={setOpenMenu}
                chips={chips}
                onClearChip={handleClearChip}
                onClearChips={() => {
                  setFilters({});
                  push(actionToasts.clear_filters);
                }}
                onOpenFilterRail={() => setRailOpen(true)}
                onOpenDetails={() => setDetailsOpen(true)}
                onRefresh={runRefresh}
                onImport={() => openModal('import', null)}
                onExport={(action: ExportAction) => push(actionToasts[action.id] ?? 'Preparing export…')}
                onPrint={() => {
                  push(actionToasts.print);
                  window.setTimeout(() => window.print(), 60);
                }}
                onNew={() => openModal('add', null)}
              />

              <div className="card-body">
                <div className="row g-3">
                  {/* Filter rail — `offcanvas-xl`, so a column at xl and an overlay below it */}
                  <div className="col-12 col-xl-3 col-xxl-3">
                    <div
                      className={`offcanvas-xl offcanvas-start${railOpen ? ' show' : ''}`}
                      tabIndex={-1}
                      id="lp_left"
                      aria-labelledby="lp_left_lbl"
                      role="region"
                    >
                      <div className="offcanvas-header border-bottom d-xl-none">
                        <h4 className="offcanvas-title fs-16 fw-medium" id="lp_left_lbl">
                          Filters
                        </h4>
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                          onClick={() => setRailOpen(false)}
                        />
                      </div>
                      <div className="offcanvas-body p-0 d-block">
                        <div className="card mb-0 h-100">
                          <div className="card-body">
                            <LessonSidebar
                              rail={rail}
                              onSelect={handleRailSelect}
                              counts={railCounts}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lesson plans */}
                  <div className="col-12 col-xl-9 col-xxl-6">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6 className="mb-0">
                        Lesson Plans
                        <span className="badge badge-soft-primary ms-1">{visible.length}</span>
                      </h6>
                      <span className="fs-12 text-muted d-none d-sm-inline">
                        {rail.term ?? 'Term 1'} · {rail.year ?? '2024 / 2025'}
                      </span>
                    </div>

                    {visible.length === 0 ? (
                      <div className="card">
                        <div className="card-body text-center py-5">
                          <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mb-3">
                            <i className="ti ti-notebook fs-36" />
                          </span>
                          <h5 className="mb-1">No Lesson Plans Found</h5>
                          <p className="text-muted mb-3">
                            No lesson plans match the selected filters. Adjust the filters or create
                            a new lesson plan to get started.
                          </p>
                          <button
                            type="button"
                            className="btn btn-primary d-inline-flex align-items-center"
                            onClick={() => openModal('add', null)}
                          >
                            <i className="ti ti-square-rounded-plus me-1" />
                            Create Lesson Plan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="tab-content">
                        {layout === 'grid' ? (
                          <div className="tab-pane fade show active" id="lp_grid" role="tabpanel">
                            <div className="row g-3">
                              {visible.map((plan) => (
                                <div
                                  className="col-12 col-xxl-6 col-md-6"
                                  data-lp-cat={plan.category}
                                  key={plan.id}
                                >
                                  <LessonPlanCard
                                    plan={plan}
                                    active={plan.id === selectedId}
                                    revealed={revealed}
                                    expanded={plan.id === expandedId}
                                    menuOpen={plan.id === cardMenu}
                                    onSelect={(id) => {
                                      setSelectedId(id);
                                      setDetailsOpen(true);
                                    }}
                                    onToggleDetails={(id) =>
                                      setExpandedId((current) => (current === id ? null : id))
                                    }
                                    onOpenMenu={setCardMenu}
                                    onMenuAction={handleAction}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="tab-pane fade show active" id="lp_list" role="tabpanel">
                            {visible.map((plan) => (
                              <LessonPlanRow
                                key={plan.id}
                                plan={plan}
                                active={plan.id === selectedId}
                                revealed={revealed}
                                menuOpen={plan.id === cardMenu}
                                onSelect={(id) => {
                                  setSelectedId(id);
                                  setDetailsOpen(true);
                                }}
                                onOpenMenu={setCardMenu}
                                onMenuAction={handleAction}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Detail panel — also `offcanvas-xl` */}
                  <div className="col-12 col-xxl-3">
                    <div
                      className={`offcanvas-xl offcanvas-end${detailsOpen ? ' show' : ''}`}
                      tabIndex={-1}
                      id="lp_details"
                      aria-labelledby="lp_details_lbl"
                      role="region"
                    >
                      <div className="offcanvas-header border-bottom d-xl-none">
                        <h5 className="offcanvas-title" id="lp_details_lbl">
                          Lesson Details
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                          onClick={() => setDetailsOpen(false)}
                        />
                      </div>
                      <div className="offcanvas-body p-0 d-block">
                        <div className="card mb-0 h-100">
                          <div className="card-body">
                            <LessonDetailPanel
                              plan={selected}
                              revealed={revealed}
                              tab={detailTab}
                              onTab={setDetailTab}
                              openSection={openSection}
                              onToggleSection={(key) =>
                                setOpenSection((current) => (current === key ? null : key))
                              }
                              onAction={handleAction}
                              onResourceAction={handleResourceAction}
                              onAddResource={() => selected && openModal('addResource', selected)}
                              onAddActivity={() => selected && openModal('addActivity', selected)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <LessonModals
        active={activeModal}
        plan={activePlan}
        plans={plans}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onAdd={handleAdd}
        onSave={handleSave}
        onAddActivity={handleAddActivity}
        onAddResource={handleAddResource}
        onAssign={handleAssign}
        onPublish={handlePublish}
        onImport={() => {
          setActiveModal(null);
          push(actionToasts.imported);
        }}
        onConfirmDelete={handleConfirmDelete}
        onEditFromDetails={() => setActiveModal('edit')}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export default LessonPlanning;
