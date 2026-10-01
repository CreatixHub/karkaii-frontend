import { useCallback, useMemo, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ExportMenu,
  PageHeader,
  WorkspaceShell,
  useWorkspace,
} from '@components/workspace';
import type {
  ColumnDef,
  ExportFormat,
  FilterField,
  QuickFilter,
  SavedView,
  SortOption,
  WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import PlanModals from './modals/PlanModals';
import type { PlanDraft, PlanModalId } from './modals/PlanModals';
import type { Audience, Duration, MealName, MealPlan, PlanStatus } from './data/mealPlans.data';
import {
  ACADEMIC_YEAR, audienceOptions, audienceTint, auditOf, cafeteriaOptions, cafeteriaPairsOf,
  dailyMenuOf, dateKey, daysOf, dietaryOptions, durationOptions, durationStyle, hasDietary,
  matchesMealFilter, mealFilterOptions, mealNames, mealPlans as initialRows,
  mealsLabel, nutritionPairsOf, overviewCards, schedulePairsOf, searchIndexOf, servesFrom,
  statusBadge, statusOptions, statusPill, summaryOf,
} from './data/mealPlans.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'plan-duration', label: 'Plan Duration', kind: 'select', chipLabel: 'Duration', options: durationOptions },
  { id: 'applicable-for', label: 'Applicable For', kind: 'select', chipLabel: 'For', options: audienceOptions },
  { id: 'meal-type', label: 'Meal Type', kind: 'select', chipLabel: 'Meals', options: mealFilterOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'effective-from', label: 'Effective From', kind: 'date', chipLabel: 'From', dateFormat: 'd M Y' },
  { id: 'effective-to', label: 'Effective To', kind: 'date', chipLabel: 'To', dateFormat: 'd M Y' },
  { id: 'dietary-preference', label: 'Dietary Preference', kind: 'select', chipLabel: 'Diet', options: dietaryOptions },
  { id: 'cafeteria', label: 'Cafeteria', kind: 'select', chipLabel: 'Cafeteria', options: cafeteriaOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Plan name (A–Z)', icon: 'ti ti-abc' },
  { id: 'duration', label: 'Plan duration', icon: 'ti ti-calendar-repeat' },
  { id: 'audience', label: 'Applicable for', icon: 'ti ti-users' },
  { id: 'from', label: 'Effective from', icon: 'ti ti-calendar-event' },
  { id: 'updated', label: 'Last updated', icon: 'ti ti-clock-hour-4' },
];

const MealPlans = () => {
  const [rows, setRows] = useState<MealPlan[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<PlanModalId | null>(null);
  const [modalRow, setModalRow] = useState<MealPlan | null>(null);
  const [panelRow, setPanelRow] = useState<MealPlan | null>(null);
  /** The overview card the grid is narrowed to, if any. */
  const [card, setCard] = useState<string | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: MealPlan | null, modal: PlanModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /** Applies a change to the row a dialog was opened on. */
  const patchRow = useCallback(
    (change: (row: MealPlan) => MealPlan, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  /** The four meal columns are one cell shape, printed four times. */
  const mealColumn = useCallback(
    (meal: MealName): ColumnDef<MealPlan> => ({
      id: meal.toLowerCase(),
      label: meal,
      render: (row) => {
        const slot = row.meals[meal];
        return (
          <div className="text-center">
            {slot.included ? (
              <i className="ti ti-circle-check text-success" />
            ) : (
              <i className="ti ti-circle-minus text-muted opacity-50" />
            )}
            <span className="d-block fs-12 text-muted">{slot.included ? slot.note : 'Not included'}</span>
          </div>
        );
      },
    }),
    [],
  );

  const columns = useMemo<ColumnDef<MealPlan>[]>(
    () => [
      {
        id: 'plan',
        label: 'Plan Name',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span
              className={`avatar avatar-md bg-${durationStyle[row.duration].tint}-transparent text-${durationStyle[row.duration].tint} rounded flex-shrink-0 me-2`}
            >
              <i className={durationStyle[row.duration].icon} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">{row.code}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'duration',
        label: 'Plan Type',
        sortable: true,
        render: (row) => (
          <span className={`badge badge-soft-${durationStyle[row.duration].tint}`}>{row.duration}</span>
        ),
      },
      {
        id: 'audience',
        label: 'Applicable For',
        sortable: true,
        render: (row) => (
          <>
            <span className={`badge badge-soft-${audienceTint[row.audience]}`}>{row.audience}</span>
            <span className="d-block fs-12 text-muted mt-1">{row.audienceNote}</span>
          </>
        ),
      },
      ...mealNames.map(mealColumn),
      {
        id: 'from',
        label: 'Effective From',
        sortable: true,
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => row.effectiveFrom,
      },
      {
        id: 'status',
        label: 'Status',
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            <span className="dt-pill-dot" />{row.status}
          </span>
        ),
      },
      {
        id: 'updated',
        label: 'Last Updated',
        sortable: true,
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => row.updated,
      },
    ],
    [mealColumn, openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const cardMatcher = useMemo(
    () => overviewCards.find((entry) => entry.id === card)?.matches,
    [card],
  );

  const workspace = useWorkspace<MealPlan>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (cardMatcher && !cardMatcher(row)) return false;
      if (filters['plan-duration'] && row.duration !== filters['plan-duration']) return false;
      if (filters['applicable-for'] && row.audience !== filters['applicable-for']) return false;
      if (filters['meal-type'] && !matchesMealFilter(row, filters['meal-type'])) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters['effective-from'] && dateKey(row.effectiveFrom) < dateKey(filters['effective-from'])) {
        return false;
      }
      if (filters['effective-to'] && dateKey(row.effectiveTo) > dateKey(filters['effective-to'])) {
        return false;
      }
      if (filters['dietary-preference'] && !hasDietary(row, filters['dietary-preference'])) return false;
      if (filters.cafeteria && !servesFrom(row, filters.cafeteria)) return false;
      return true;
    },
    /** The rail opens on All Plans, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Special') {
        return row.dietary.some((tag) => /jain|vegan|gluten|low oil|no root/i.test(tag.label));
      }
      return row.status === quick;
    },
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'duration':
          return durationOptions.indexOf(a.duration) - durationOptions.indexOf(b.duration)
            || a.name.localeCompare(b.name);
        case 'audience':
          return a.audience.localeCompare(b.audience) || a.name.localeCompare(b.name);
        case 'from':
          return dateKey(b.effectiveFrom) - dateKey(a.effectiveFrom);
        case 'updated':
          return dateKey(b.updated) - dateKey(a.updated);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    },
    defaultSort: 'name',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: MealPlan) => boolean) => rows.filter(test).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Meal Plans', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Active', label: 'Active Plans', icon: 'ti ti-circle-check', count: countBy((row) => row.status === 'Active') },
      { id: 'Scheduled', label: 'Scheduled', icon: 'ti ti-clock', count: countBy((row) => row.status === 'Scheduled') },
      { id: 'Draft', label: 'Drafts', icon: 'ti ti-pencil', count: countBy((row) => row.status === 'Draft') },
      { id: 'Archived', label: 'Archived', icon: 'ti ti-archive', count: countBy((row) => row.status === 'Archived') },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All Plans', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Active', label: 'Active', icon: 'ti ti-circle-check', count: countBy((row) => row.status === 'Active') },
      { id: 'Scheduled', label: 'Scheduled', icon: 'ti ti-clock', count: countBy((row) => row.status === 'Scheduled') },
      { id: 'Draft', label: 'Drafts', icon: 'ti ti-pencil', count: countBy((row) => row.status === 'Draft') },
      {
        id: 'Special', label: 'Special Diet', icon: 'ti ti-leaf',
        count: countBy((row) => row.dietary.some((tag) => /jain|vegan|gluten|low oil|no root/i.test(tag.label))),
      },
    ],
    [countBy, rows.length],
  );

  /**
   * The six cards count the whole catalogue — this page lists eight plans of the
   * twenty-two they add up to — so the template's figures stand and the roster
   * moves them.
   */
  const cards = useMemo(
    () =>
      overviewCards.map((entry) => {
        const here = rows.filter(entry.matches).length;
        const seeded = initialRows.filter(entry.matches).length;
        return { ...entry, active: entry.active - seeded + here };
      }),
    [rows],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const toNumber = (value: string, fallback = 0): number => {
    const parsed = Number(value.replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) && value.trim() !== '' ? parsed : fallback;
  };

  /** "03-08-2026" → "03 Aug 2026", the way the row prints dates. */
  const toRowDate = (value: string): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [day, month, year] = value.split('-');
    return months[Number(month) - 1] ? `${day} ${months[Number(month) - 1]} ${year}` : value;
  };

  /** "07:30" → "07:30 – 09:00 AM"; a meal window runs 90 minutes. */
  const toWindow = (time: string): string => {
    const [hourText, minute] = time.split(':');
    const start = Number(hourText);
    const endTotal = start * 60 + Number(minute) + 90;
    const label = (hour: number, min: number) => {
      const suffix = hour >= 12 ? 'PM' : 'AM';
      const twelve = hour % 12 === 0 ? 12 : hour % 12;
      return { text: `${String(twelve).padStart(2, '0')}:${String(min).padStart(2, '0')}`, suffix };
    };
    const from = label(start, Number(minute));
    const to = label(Math.floor(endTotal / 60) % 24, endTotal % 60);
    return from.suffix === to.suffix
      ? `${from.text} – ${to.text} ${to.suffix}`
      : `${from.text} ${from.suffix} – ${to.text} ${to.suffix}`;
  };

  const mealsFrom = (draft: PlanDraft, row?: MealPlan): MealPlan['meals'] =>
    mealNames.reduce(
      (meals, meal) => ({
        ...meals,
        [meal]: draft.meals.includes(meal)
          ? {
            included: true,
            window: toWindow(draft.windows[meal]),
            dish: row?.meals[meal].dish || 'To be assigned',
            note: row?.meals[meal].note && row.meals[meal].included ? row.meals[meal].note : '0 kcal',
          }
          : { included: false, window: '', dish: '', note: 'Not included' },
      }),
      {} as MealPlan['meals'],
    );

  const rateFrom = (draft: PlanDraft): string => {
    const day = toNumber(draft.ratePerDay);
    const month = toNumber(draft.ratePerMonth);
    if (!day && !month) return 'Rate to be set';
    if (!month) return `$${day.toFixed(2)} / day`;
    return `$${day.toFixed(2)} / day · $${month} / month`;
  };

  const createPlan = useCallback(
    (draft: PlanDraft) => {
      if (!draft.name.trim()) {
        push('Give the meal plan a name', 'warning');
        return;
      }
      const code = draft.code.trim() || `MP-2026-0${40 + rows.length}`;
      setRows((current) => [
        {
          id: code,
          code,
          name: draft.name.trim(),
          duration: draft.duration as Duration,
          audience: draft.audience as Audience,
          audienceNote: `${draft.audience} · new plan`,
          enrolled: null,
          meals: mealsFrom(draft),
          daysCovered: draft.daysCovered,
          effectiveFrom: toRowDate(draft.effectiveFrom),
          effectiveTo: toRowDate(draft.effectiveTo),
          updated: '31 Jul 2026',
          status: draft.publish ? 'Scheduled' : 'Draft',
          energy: '0 kcal', protein: '0 g', carbs: '0 g', fat: '0 g',
          rate: rateFrom(draft),
          dietary: [{ label: draft.dietary, tint: draft.dietary === 'Non-Veg' ? 'danger' : 'success' }],
          contains: 'To be declared', freeFrom: 'To be declared',
          cafeteria: draft.cafeteria, counters: 'To be assigned', capacity: '—',
          servingMode: 'Counter service',
          billing: draft.billing ? rateFrom(draft) : 'Not billed',
          billingDays: '20 per month', nextReview: 'On launch',
          notes: draft.notes.trim() || 'New plan awaiting sign-off.',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${draft.name.trim()} created`);
    },
    [push, rows.length],
  );

  const updatePlan = useCallback(
    (draft: PlanDraft) =>
      patchRow(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          code: draft.code.trim() || row.code,
          duration: draft.duration as Duration,
          audience: draft.audience as Audience,
          meals: mealsFrom(draft, row),
          daysCovered: draft.daysCovered,
          effectiveFrom: toRowDate(draft.effectiveFrom),
          effectiveTo: toRowDate(draft.effectiveTo),
          rate: draft.ratePerDay || draft.ratePerMonth ? rateFrom(draft) : row.rate,
          cafeteria: draft.cafeteria,
          notes: draft.notes.trim() || row.notes,
          status: draft.publish ? (row.status === 'Draft' ? 'Scheduled' : row.status) : 'Draft',
          updated: '31 Jul 2026',
        }),
        `${modalRow?.name ?? 'Meal plan'} updated`,
      ),
    [modalRow, patchRow],
  );

  const assignPlan = useCallback(
    (group: string, from: string, billingMode: string) => {
      const count = toNumber(group.split('·').pop() ?? '', 0);
      patchRow(
        (row) => ({
          ...row,
          enrolled: count || row.enrolled,
          audienceNote: group,
          status: row.status === 'Draft' ? 'Scheduled' : row.status,
          effectiveFrom: toRowDate(from),
          billing: billingMode,
          updated: '31 Jul 2026',
        }),
        `${modalRow?.name ?? 'Plan'} assigned to ${group.split('·')[0].trim()}`,
      );
    },
    [modalRow, patchRow],
  );

  const duplicatePlan = useCallback(
    (name: string, duration: string, audience: string, status: string) => {
      if (!modalRow) return;
      const code = `MP-2026-0${50 + rows.length}`;
      setRows((current) => [
        {
          ...modalRow,
          id: code,
          code,
          name: name.trim() || `${modalRow.name} (Copy)`,
          duration: duration as Duration,
          audience: audience as Audience,
          status: status as PlanStatus,
          enrolled: null,
          audienceNote: `${audience} · copied plan`,
          updated: '31 Jul 2026',
          notes: `Duplicated from ${modalRow.name}.`,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${name.trim() || modalRow.name} duplicated`);
    },
    [modalRow, push, rows.length],
  );

  /** Archiving closes the plan and hands its members to the chosen one. */
  const archivePlan = useCallback(
    (reason: string, from: string, moveTo: string) => {
      const target = rows.find((row) => moveTo.startsWith(row.name));
      const moving = modalRow?.enrolled ?? 0;
      setRows((current) =>
        current.map((row) => {
          if (row.id === modalRow?.id) {
            return {
              ...row,
              status: 'Archived',
              enrolled: null,
              effectiveTo: toRowDate(from),
              updated: '31 Jul 2026',
              notes: `Archived from ${toRowDate(from)} — ${reason.toLowerCase()}.`
                + (target ? ` Members moved to ${target.name}.` : ''),
            };
          }
          if (target && row.id === target.id && moving > 0) {
            return { ...row, enrolled: (row.enrolled ?? 0) + moving };
          }
          return row;
        }),
      );
      setActiveModal(null);
      push(`${modalRow?.name ?? 'Plan'} archived`);
    },
    [modalRow, push, rows],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} meal plans exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: MealPlan) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View meal plan" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit meal plan" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Assign meal plan" onClick={() => openModal(row, 'assign')}>
        <i className="ti ti-users" />
      </ActionLink>
      <ActionLink className="dt-ib danger" ariaLabel="Archive meal plan" onClick={() => openModal(row, 'archive')}>
        <i className="ti ti-archive" />
      </ActionLink>
    </div>
  );

  const pairList = (pairs: { label: string; value: string }[]) =>
    pairs.map((pair, index) => (
      <div
        className={`d-flex align-items-center justify-content-between ${index === pairs.length - 1 ? 'mb-0' : 'mb-2'}`}
        key={pair.label}
      >
        <span className="fs-13 text-muted">{pair.label}</span>
        <span className="fs-13 fw-medium text-end">{pair.value}</span>
      </div>
    ));

  const renderDetail = (row: MealPlan) => (
    <div className="row g-4">
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-clock-hour-4 text-primary me-1" />Complete Meal Schedule</h6>
        {pairList(schedulePairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-tools-kitchen-2 text-warning me-1" />Daily Menu</h6>
        {dailyMenuOf(row).map((line) => (
          <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={line.meal}>
            <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
              <i className="ti ti-tools-kitchen-2" />
            </span>
            <div className="flex-fill overflow-hidden">
              <h6 className="fs-13 mb-0 text-truncate">{line.meal}</h6>
              <span className="fs-12 text-muted text-truncate d-block">{line.dish} · {line.note}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-heartbeat text-danger me-1" />Nutrition Summary</h6>
        {pairList(nutritionPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-leaf text-success me-1" />Dietary Preferences</h6>
        <div className="d-flex flex-wrap gap-1">
          {row.dietary.map((tag) => (
            <span className={`badge badge-soft-${tag.tint}`} key={tag.label}>{tag.label}</span>
          ))}
        </div>
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-alert-circle text-warning me-1" />Allergen Information</h6>
        {pairList([
          { label: 'Contains', value: row.contains },
          { label: 'Free From', value: row.freeFrom },
        ])}
        <div className="d-flex flex-wrap gap-1 mt-2">
          {daysOf(row).map((day) => (
            <span className="badge badge-soft-success" key={day}>{day}</span>
          ))}
        </div>
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-building-store text-info me-1" />Assigned Cafeteria</h6>
        {pairList(cafeteriaPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-calendar-event text-purple me-1" />Effective Period</h6>
        {pairList([
          { label: 'Effective From', value: row.effectiveFrom },
          { label: 'Effective To', value: row.effectiveTo },
          { label: 'Billing', value: row.billing },
          { label: 'Meals', value: mealsLabel(row) },
        ])}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Notes</h6>
        <p className="fs-13 text-muted mb-3">{row.notes}</p>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => openModal(row, 'view')}
          >
            <i className="ti ti-eye me-1" />View Plan
          </button>
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => setPanelRow(row)}
          >
            <i className="ti ti-salad me-1" />Plan Panel
          </button>
        </div>
      </div>
    </div>
  );

  /** The six overview cards, which double as a filter on the grid. */
  const overview = (
    <div className="row g-3 mb-3">
      {cards.map((entry) => {
        const active = card === entry.id;
        return (
          <div className="col-6 col-md-4 col-xl-2" key={entry.id}>
            <div className={`card h-100 mb-0${active ? ' border-primary' : ''}`}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center mb-2">
                  <span className={`avatar avatar-md bg-${entry.tint}-transparent text-${entry.tint} rounded flex-shrink-0`}>
                    <i className={entry.icon} />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <ActionLink
                      className="fs-14 mb-0 text-truncate fw-medium d-block text-dark"
                      onClick={() => setCard(active ? null : entry.id)}
                    >
                      {entry.label}
                    </ActionLink>
                    <span className="fs-12 text-muted text-truncate d-block">{entry.meals} meals total</span>
                  </div>
                </div>
                <span className={`fs-12 fw-medium text-${entry.tint} d-block text-truncate`}>
                  {entry.active} active
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Meal Plans"
            section="Cafeteria"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(rows[0] ?? null, 'assign')}
                  >
                    <i className="ti ti-users me-2" />Assign Plan
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Plan Schedule" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'create')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Create Meal Plan
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            beforeWorkspace={overview}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            footerInfoSuffix={`academic year ${ACADEMIC_YEAR}`}
            workspaceId="mpWorkspace"
            searchPlaceholder="Search plan name or code…"
            searchLabel="Search meal plans"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="meal plans"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Meal plans refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            onResetExtra={() => setCard(null)}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-salad"
            emptyTitle="No meal plans match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Meal Plan Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Meal Plan Details"
            labelledById="mp_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Meal Plan Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <span
                    className={`avatar avatar-lg bg-${durationStyle[panelRow.duration].tint}-transparent text-${durationStyle[panelRow.duration].tint} rounded flex-shrink-0`}
                  >
                    <i className={`${durationStyle[panelRow.duration].icon} fs-20`} />
                  </span>
                  <div className="ms-2">
                    <h6 className="mb-0">{panelRow.name}</h6>
                    <span className="fs-12 text-muted">{summaryOf(panelRow)}</span>
                  </div>
                  <span className={`${statusBadge[panelRow.status]} ms-auto`}>{panelRow.status}</span>
                </div>
                <div className="border rounded p-3 mb-3">{pairList(cafeteriaPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Weekly Schedule</h6>
                {dailyMenuOf(panelRow).map((line) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={line.meal}>
                    <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                      <i className="ti ti-clock-hour-4" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0">{line.meal}</h6>
                      <span className="fs-12 text-muted">{line.dish} · {line.note}</span>
                    </div>
                  </div>
                ))}
                <div className="d-flex flex-wrap gap-1 mb-3 mt-2">
                  {daysOf(panelRow).map((day) => (
                    <span className="badge badge-soft-success" key={day}>{day}</span>
                  ))}
                </div>

                <h6 className="fs-14 mb-2">Target Audience</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Group', value: panelRow.audience },
                    { label: 'Detail', value: panelRow.audienceNote },
                    { label: 'Enrolled', value: panelRow.enrolled === null ? 'Walk-in' : String(panelRow.enrolled) },
                    { label: 'Billing', value: panelRow.billing },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Nutrition Overview</h6>
                <div className="border rounded p-3 mb-3">{pairList(nutritionPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Effective Period</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Effective From', value: panelRow.effectiveFrom },
                    { label: 'Effective To', value: panelRow.effectiveTo },
                    { label: 'Billing Days', value: panelRow.billingDays },
                    { label: 'Next Review', value: panelRow.nextReview },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Audit Information</h6>
                {auditOf(panelRow).map((entry) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
                    <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                      <i className="ti ti-history" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0">{entry.title}</h6>
                      <span className="fs-12 text-muted">{entry.meta}</span>
                    </div>
                  </div>
                ))}

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'edit'); }}
                  >
                    <i className="ti ti-edit me-1" />Edit Plan
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'assign'); }}
                  >
                    <i className="ti ti-users me-1" />Assign
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <PlanModals
        active={activeModal}
        row={modalRow}
        otherPlans={rows
          .filter((row) => row.id !== modalRow?.id && row.status !== 'Archived')
          .map((row) => `${row.name} · ${row.code}`)}
        onClose={() => setActiveModal(null)}
        onCreate={createPlan}
        onUpdate={updatePlan}
        onAssign={assignPlan}
        onDuplicate={duplicatePlan}
        onArchive={archivePlan}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="mpToasts" />
    </>
  );
};

export default MealPlans;
