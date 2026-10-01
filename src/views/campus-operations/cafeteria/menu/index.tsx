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
import MenuModals from './modals/MenuModals';
import type { MenuDraft, MenuModalId } from './modals/MenuModals';
import type {
  Availability, MealType, MenuCategory, MenuItem,
} from './data/menuItems.data';
import {
  PLANNER_WEEK, allergenOptions, auditOf, availabilityOptions, calorieBandOf, calorieOptions,
  caloriesLabel, categoryOptions, categoryTint, dateKey, dayLabel, dayOptions, dietaryOptions,
  excludes, hasDietaryTag, mealPeriods, mealStyle, mealTypeOptions, menuItems as initialRows,
  money, nutritionPairsOf, priceBandOf, priceLabel, priceOptions, searchIndexOf, servesOn,
  servingLabel, shortDays, statusBadge, statusPill, summaryOf,
} from './data/menuItems.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'meal-type', label: 'Meal Type', kind: 'select', chipLabel: 'Meal', options: mealTypeOptions },
  { id: 'menu-category', label: 'Menu Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'day', label: 'Day', kind: 'select', chipLabel: 'Day', options: dayOptions },
  { id: 'availability', label: 'Availability', kind: 'select', chipLabel: 'Availability', options: availabilityOptions },
  { id: 'dietary-tag', label: 'Dietary Tag', kind: 'select', chipLabel: 'Diet', options: dietaryOptions },
  { id: 'allergen', label: 'Allergen', kind: 'select', chipLabel: 'Allergen', allLabel: 'Any', options: allergenOptions },
  { id: 'price-range', label: 'Price Range', kind: 'select', chipLabel: 'Price', allLabel: 'Any', options: priceOptions },
  { id: 'calories', label: 'Calories', kind: 'select', chipLabel: 'Calories', allLabel: 'Any', options: calorieOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Menu item (A–Z)', icon: 'ti ti-abc' },
  { id: 'meal', label: 'Meal type', icon: 'ti ti-tools-kitchen-2' },
  { id: 'price', label: 'Price (low to high)', icon: 'ti ti-coin' },
  { id: 'calories', label: 'Calories', icon: 'ti ti-heartbeat' },
  { id: 'updated', label: 'Last updated', icon: 'ti ti-clock-hour-4' },
];

const CafeteriaMenu = () => {
  const [rows, setRows] = useState<MenuItem[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<MenuModalId | null>(null);
  const [modalRow, setModalRow] = useState<MenuItem | null>(null);
  const [panelRow, setPanelRow] = useState<MenuItem | null>(null);
  /** The meal-period card the grid is narrowed to, if any. */
  const [period, setPeriod] = useState<MealType | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: MenuItem | null, modal: MenuModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /** Applies a change to the row a dialog was opened on. */
  const patchRow = useCallback(
    (change: (row: MenuItem) => MenuItem, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<MenuItem>[]>(
    () => [
      {
        id: 'item',
        label: 'Menu Item',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span
              className={`avatar avatar-md bg-${mealStyle[row.mealType].tint}-transparent text-${mealStyle[row.mealType].tint} rounded flex-shrink-0 me-2`}
            >
              <i className={mealStyle[row.mealType].icon} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">{row.subtitle}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'category',
        label: 'Category',
        sortable: true,
        render: (row) => (
          <span className={`badge badge-soft-${categoryTint[row.category]}`}>{row.category}</span>
        ),
      },
      {
        id: 'meal',
        label: 'Meal Type',
        sortable: true,
        render: (row) => (
          <span className={`badge badge-soft-${mealStyle[row.mealType].tint}`}>{row.mealType}</span>
        ),
      },
      {
        id: 'day',
        label: 'Day',
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => dayLabel(row),
      },
      {
        id: 'serving',
        label: 'Serving Time',
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => servingLabel(row),
      },
      {
        id: 'price',
        label: 'Price',
        sortable: true,
        cellClassName: 'fs-13 fw-semibold',
        render: (row) => priceLabel(row),
      },
      {
        id: 'calories',
        label: 'Calories',
        sortable: true,
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => caloriesLabel(row),
      },
      {
        id: 'availability',
        label: 'Availability',
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.availability]}`}>
            <span className="dt-pill-dot" />{row.availability}
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
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<MenuItem>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (period && row.mealType !== period) return false;
      if (filters['meal-type'] && row.mealType !== filters['meal-type']) return false;
      if (filters['menu-category'] && row.category !== filters['menu-category']) return false;
      if (filters.day && !servesOn(row, filters.day)) return false;
      if (filters.availability && row.availability !== filters.availability) return false;
      if (filters['dietary-tag'] && !hasDietaryTag(row, filters['dietary-tag'])) return false;
      if (filters.allergen && !excludes(row, filters.allergen)) return false;
      if (filters['price-range'] && priceBandOf(row) !== filters['price-range']) return false;
      if (filters.calories && calorieBandOf(row) !== filters.calories) return false;
      return true;
    },
    /** The rail opens on All Items, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Available') return row.availability === 'Available';
      if (quick === 'Low Stock') return row.availability === 'Limited Stock' || row.availability === 'Out of Stock';
      if (quick === 'Vegan') return hasDietaryTag(row, 'Vegan') || hasDietaryTag(row, 'Jain');
      return row.availability === 'Archived';
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'Available': return row.availability === 'Available';
        case 'Low': return row.availability === 'Limited Stock' || row.availability === 'Out of Stock';
        case 'Vegan': return hasDietaryTag(row, 'Vegan') || hasDietaryTag(row, 'Jain');
        case 'Archived': return row.availability === 'Archived';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'meal':
          return mealTypeOptions.indexOf(a.mealType) - mealTypeOptions.indexOf(b.mealType)
            || a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price || a.name.localeCompare(b.name);
        case 'calories':
          return b.nutrition.calories - a.nutrition.calories || a.name.localeCompare(b.name);
        case 'updated':
          return dateKey(b.updated) - dateKey(a.updated);
        // Not in the sort menu, but the Category `<th>` is sortable.
        case 'category':
          return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
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
    (test: (row: MenuItem) => boolean) => rows.filter(test).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Menu Items', icon: 'ti ti-layout-list', count: rows.length },
      {
        id: 'Available', label: 'Available Today', icon: 'ti ti-circle-check',
        count: countBy((row) => row.availability === 'Available'),
      },
      {
        id: 'Low', label: 'Low or Out of Stock', icon: 'ti ti-alert-triangle',
        count: countBy((row) => row.availability === 'Limited Stock' || row.availability === 'Out of Stock'),
      },
      {
        id: 'Vegan', label: 'Vegan & Jain', icon: 'ti ti-leaf',
        count: countBy((row) => hasDietaryTag(row, 'Vegan') || hasDietaryTag(row, 'Jain')),
      },
      {
        id: 'Archived', label: 'Archived Items', icon: 'ti ti-archive',
        count: countBy((row) => row.availability === 'Archived'),
      },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All Items', icon: 'ti ti-layout-list', count: rows.length },
      {
        id: 'Available', label: 'Available', icon: 'ti ti-circle-check',
        count: countBy((row) => row.availability === 'Available'),
      },
      {
        id: 'Low Stock', label: 'Low Stock', icon: 'ti ti-alert-triangle',
        count: countBy((row) => row.availability === 'Limited Stock' || row.availability === 'Out of Stock'),
      },
      {
        id: 'Vegan', label: 'Vegan & Jain', icon: 'ti ti-leaf',
        count: countBy((row) => hasDietaryTag(row, 'Vegan') || hasDietaryTag(row, 'Jain')),
      },
      {
        id: 'Archived', label: 'Archived', icon: 'ti ti-archive',
        count: countBy((row) => row.availability === 'Archived'),
      },
    ],
    [countBy, rows.length],
  );

  /**
   * The six period cards count the whole menu — the footer says this page holds
   * 8 of 74 items — so the template's figures stand and the roster moves them.
   */
  const periods = useMemo(
    () =>
      mealPeriods.map((card) => {
        const here = rows.filter((row) => row.mealType === card.meal);
        const seeded = initialRows.filter((row) => row.mealType === card.meal);
        const availableHere = here.filter((row) => row.availability === 'Available').length;
        const availableSeeded = seeded.filter((row) => row.availability === 'Available').length;
        return {
          ...card,
          items: card.items - seeded.length + here.length,
          available: card.available - availableSeeded + availableHere,
        };
      }),
    [rows],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const toNumber = (value: string, fallback = 0): number => {
    const parsed = Number(value.replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) && value.trim() !== '' ? parsed : fallback;
  };

  const tagsFrom = (dietary: string[]): MenuItem['tags'] =>
    dietary.map((label) => ({
      label,
      tint: label === 'Non-Veg' ? 'danger' : label === 'Gluten-Free' ? 'info' : label === 'Jain' ? 'purple' : 'success',
    }));

  const availabilityFrom = (draft: MenuDraft, fallback: Availability): Availability => {
    if (!draft.available) return 'Out of Stock';
    if (draft.days.length === 1 && (draft.days[0] === 'Sat' || draft.days[0] === 'Sun')) return 'Weekend Only';
    return fallback === 'Archived' || fallback === 'Out of Stock' ? 'Available' : fallback;
  };

  const createItem = useCallback(
    (draft: MenuDraft) => {
      if (!draft.name.trim()) {
        push('Give the menu item a name', 'warning');
        return;
      }
      const mealType = draft.mealType as MealType;
      const code = `MNU-${mealStyle[mealType].segment}-0${30 + rows.length}`;
      setRows((current) => [
        {
          id: code,
          code,
          name: draft.name.trim(),
          subtitle: `${draft.category} · new item`,
          category: draft.category as MenuCategory,
          mealType,
          days: draft.days.length > 0 ? draft.days : ['Mon'],
          from: draft.from,
          to: draft.to,
          price: toNumber(draft.price),
          staffPrice: toNumber(draft.staffPrice, toNumber(draft.price) + 0.3),
          portion: draft.portion.trim() || '250 g',
          availability: availabilityFrom(draft, 'Available'),
          updated: '31 Jul 2026',
          description: 'Description pending from the catering office.',
          ingredients: [],
          nutrition: {
            calories: toNumber(draft.calories),
            protein: toNumber(draft.protein),
            carbs: toNumber(draft.carbs),
            fat: toNumber(draft.fat),
            fibre: toNumber(draft.fibre),
          },
          contains: draft.allergens.includes('None') ? 'None declared' : draft.allergens.join(' · '),
          freeFrom: ['Dairy', 'Gluten', 'Nuts', 'Egg', 'Soy']
            .filter((allergen) => !draft.allergens.includes(allergen))
            .join(' · ')
            .toLowerCase(),
          tags: tagsFrom(draft.dietary),
          prep: 'Preparation notes pending from the kitchen.',
          remarks: draft.board ? 'Published to the menu board on creation.' : 'Not yet published to the board.',
          counter: 'Main Kitchen · Counter 1',
          capacity: 120,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${draft.name.trim()} added to the menu`);
    },
    [push, rows.length],
  );

  const updateItem = useCallback(
    (draft: MenuDraft) =>
      patchRow(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          category: draft.category as MenuCategory,
          mealType: draft.mealType as MealType,
          days: draft.days.length > 0 ? draft.days : row.days,
          from: draft.from,
          to: draft.to,
          price: toNumber(draft.price, row.price),
          staffPrice: toNumber(draft.staffPrice, row.staffPrice),
          portion: draft.portion.trim() || row.portion,
          availability: availabilityFrom(draft, row.availability),
          nutrition: {
            calories: toNumber(draft.calories, row.nutrition.calories),
            protein: toNumber(draft.protein, row.nutrition.protein),
            carbs: toNumber(draft.carbs, row.nutrition.carbs),
            fat: toNumber(draft.fat, row.nutrition.fat),
            fibre: toNumber(draft.fibre, row.nutrition.fibre),
          },
          tags: draft.dietary.length > 0 ? tagsFrom(draft.dietary) : row.tags,
          updated: '31 Jul 2026',
        }),
        `${modalRow?.name ?? 'Menu item'} updated`,
      ),
    [modalRow, patchRow],
  );

  const duplicateItem = useCallback(
    (name: string, mealType: string, day: string, price: string, availability: string) => {
      if (!modalRow) return;
      const meal = mealType as MealType;
      const code = `MNU-${mealStyle[meal].segment}-0${40 + rows.length}`;
      setRows((current) => [
        {
          ...modalRow,
          id: code,
          code,
          name: name.trim() || `${modalRow.name} (Copy)`,
          mealType: meal,
          days: [day],
          price: toNumber(price, modalRow.price),
          availability: availability as Availability,
          updated: '31 Jul 2026',
          remarks: `Duplicated from ${modalRow.name}.`,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${name.trim() || modalRow.name} duplicated`);
    },
    [modalRow, push, rows.length],
  );

  const archiveItem = useCallback(
    (reason: string, from: string, replacement: string) =>
      patchRow(
        (row) => ({
          ...row,
          availability: 'Archived',
          updated: '31 Jul 2026',
          remarks: `Archived from ${from} — ${reason.toLowerCase()}.`
            + (replacement === 'No replacement' ? '' : ` Replaced by ${replacement}.`),
        }),
        `${modalRow?.name ?? 'Menu item'} archived`,
      ),
    [modalRow, patchRow],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} menu items exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: MenuItem) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View menu item" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit menu item" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Duplicate menu item" onClick={() => openModal(row, 'duplicate')}>
        <i className="ti ti-copy" />
      </ActionLink>
      <ActionLink className="dt-ib danger" ariaLabel="Archive menu item" onClick={() => openModal(row, 'archive')}>
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

  const renderDetail = (row: MenuItem) => (
    <div className="row g-4">
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-file-description text-primary me-1" />Menu Description</h6>
        <p className="fs-13 text-muted mb-0">{row.description}</p>
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-basket text-success me-1" />Ingredients</h6>
        {row.ingredients.length === 0 ? (
          <p className="fs-13 text-muted mb-0">Ingredient list pending from the kitchen.</p>
        ) : (
          pairList(row.ingredients.map((item) => ({ label: item.name, value: item.amount })))
        )}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-heartbeat text-danger me-1" />Nutritional Information</h6>
        {pairList(nutritionPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-alert-circle text-warning me-1" />Allergen Information</h6>
        {pairList([
          { label: 'Contains', value: row.contains },
          { label: 'Free From', value: row.freeFrom },
        ])}
        <div className="d-flex flex-wrap gap-1 mt-2">
          {row.tags.map((tag) => (
            <span className={`badge badge-soft-${tag.tint}`} key={tag.label}>{tag.label}</span>
          ))}
        </div>
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-calendar-week text-info me-1" />Available Days</h6>
        <div className="d-flex flex-wrap gap-1">
          {shortDays.map((day) => (
            <span
              className={`badge badge-soft-${row.days.includes(day) ? 'success' : 'secondary'}`}
              key={day}
            >
              {day}
            </span>
          ))}
        </div>
        <p className="fs-12 text-muted mt-2 mb-0">{servingLabel(row)} · {row.counter}</p>
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-tools-kitchen-2 text-purple me-1" />Preparation Notes</h6>
        <p className="fs-13 text-muted mb-0">{row.prep}</p>
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-coin text-success me-1" />Pricing &amp; Capacity</h6>
        {pairList([
          { label: 'Student Price', value: priceLabel(row) },
          { label: 'Staff Price', value: money(row.staffPrice) },
          { label: 'Portion Size', value: row.portion },
          { label: 'Daily Capacity', value: `${row.capacity} portions` },
        ])}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Remarks</h6>
        <p className="fs-13 text-muted mb-3">{row.remarks}</p>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => openModal(row, 'view')}
          >
            <i className="ti ti-eye me-1" />View Item
          </button>
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => setPanelRow(row)}
          >
            <i className="ti ti-tools-kitchen-2 me-1" />Menu Panel
          </button>
        </div>
      </div>
    </div>
  );

  /** The six meal-period cards, which double as a filter on the grid. */
  const overview = (
    <div className="row g-3 mb-3">
      {periods.map((card) => {
        const style = mealStyle[card.meal];
        const active = period === card.meal;
        return (
          <div className="col-6 col-md-4 col-xl-2" key={card.meal}>
            <div className={`card h-100 mb-0${active ? ' border-primary' : ''}`}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center mb-2">
                  <span className={`avatar avatar-md bg-${style.tint}-transparent text-${style.tint} rounded flex-shrink-0`}>
                    <i className={style.icon} />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <ActionLink
                      className="fs-14 mb-0 text-truncate fw-medium d-block text-dark"
                      onClick={() => setPeriod(active ? null : card.meal)}
                    >
                      {card.meal}
                    </ActionLink>
                    <span className="fs-12 text-muted text-truncate d-block">{card.items} items</span>
                  </div>
                </div>
                <span className="fs-12 text-muted d-block text-truncate">{style.window}</span>
                <span className={`fs-12 fw-medium text-${style.tint} d-block text-truncate`}>
                  {card.available} available today
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
            title="Cafeteria Menu"
            section="Cafeteria"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'planner')}
                  >
                    <i className="ti ti-calendar-week me-2" />Weekly Planner
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Menu Board" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'add')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Menu Item
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
            footerInfoSuffix={`week of ${PLANNER_WEEK}`}
            workspaceId="cmWorkspace"
            searchPlaceholder="Search menu item or ingredient…"
            searchLabel="Search the menu"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="menu items"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Menu refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            onResetExtra={() => setPeriod(null)}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-tools-kitchen-off"
            emptyTitle="No menu items match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Menu Item Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Menu Item Details"
            labelledById="cm_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Complete Menu Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <span
                    className={`avatar avatar-lg bg-${mealStyle[panelRow.mealType].tint}-transparent text-${mealStyle[panelRow.mealType].tint} rounded flex-shrink-0`}
                  >
                    <i className={`${mealStyle[panelRow.mealType].icon} fs-20`} />
                  </span>
                  <div className="ms-2">
                    <h6 className="mb-0">{panelRow.name}</h6>
                    <span className="fs-12 text-muted">{summaryOf(panelRow)}</span>
                  </div>
                  <span className={`${statusBadge[panelRow.availability]} ms-auto`}>
                    {panelRow.availability}
                  </span>
                </div>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Menu Code', value: panelRow.code },
                    { label: 'Portion Size', value: panelRow.portion },
                    { label: 'Counter', value: panelRow.counter },
                    { label: 'Daily Capacity', value: `${panelRow.capacity} portions` },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Serving Schedule</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
                  <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                    <i className="ti ti-clock-hour-4" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0">{servingLabel(panelRow)}</h6>
                    <span className="fs-12 text-muted">{dayLabel(panelRow)}</span>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {shortDays.map((day) => (
                    <span
                      className={`badge badge-soft-${panelRow.days.includes(day) ? 'success' : 'secondary'}`}
                      key={day}
                    >
                      {day}
                    </span>
                  ))}
                </div>

                <h6 className="fs-14 mb-2">Pricing Details</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Student Price', value: priceLabel(panelRow) },
                    { label: 'Staff Price', value: money(panelRow.staffPrice) },
                    { label: 'Meal Plan Credit', value: mealStyle[panelRow.mealType].credit },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Nutrition Summary</h6>
                <div className="border rounded p-3 mb-3">{pairList(nutritionPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Dietary Tags</h6>
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {panelRow.tags.map((tag) => (
                    <span className={`badge badge-soft-${tag.tint}`} key={tag.label}>{tag.label}</span>
                  ))}
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
                    <i className="ti ti-edit me-1" />Edit Item
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white"
                    onClick={() => { setPanelRow(null); openModal(null, 'planner'); }}
                  >
                    <i className="ti ti-calendar-week me-1" />Planner
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <MenuModals
        active={activeModal}
        row={modalRow}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onCreate={createItem}
        onUpdate={updateItem}
        onDuplicate={duplicateItem}
        onSavePlanner={(planWeek, appliesTo) => {
          setActiveModal(null);
          push(`Week of ${planWeek} published for ${appliesTo.toLowerCase()}`);
        }}
        onArchive={archiveItem}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="cmToasts" />
    </>
  );
};

export default CafeteriaMenu;
