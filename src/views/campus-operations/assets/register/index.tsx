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
  SummaryItem,
  WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import AssetModals from './modals/AssetModals';
import type {
  AssetDraft, AssetModalId, AssignPayload, MaintenancePayload, RetirePayload, TransferPayload,
} from './modals/AssetModals';
import type { Asset, Category, Condition, Department } from './data/assets.data';
import {
  DASH, PURCHASED_FROM, SUMMARY_TOTALS, VIEW_TOTALS, accumulatedOf, assets as initialRows,
  auditOf, bookValueOf, categoryOptions, categoryTint, conditionOptions, conditionTint,
  dateKey, departmentOptions, departmentTint, depreciationPairsOf, holderNameOf,
  informationPairsOf, locationOptions, modelLineOf, money, panelWarrantyPairsOf, placeOf,
  purchasePairsOf, searchIndexOf, statusBadge, statusOptions, statusPill, tagOf, valueBandOf,
  valueOptions, vendorPairsOf, warrantyOptions, warrantyPairsOf, warrantyStateOf,
} from './data/assets.data';

const routes = all_routes;

/**
 * Ids and options are the template's own; Purchased From opens committed, which
 * is what puts the single chip on the rail at load.
 */
const filterFields: FilterField[] = [
  { id: 'asset-category', label: 'Asset Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'department', label: 'Department', kind: 'select', chipLabel: 'Dept', options: departmentOptions },
  { id: 'location', label: 'Location', kind: 'select', chipLabel: 'Location', options: locationOptions },
  { id: 'asset-status', label: 'Asset Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'condition', label: 'Condition', kind: 'select', chipLabel: 'Condition', options: conditionOptions },
  { id: 'warranty', label: 'Warranty', kind: 'select', chipLabel: 'Warranty', options: warrantyOptions },
  {
    id: 'purchased-from', label: 'Purchased From', kind: 'date', chipLabel: 'Purchased from',
    dateFormat: 'd-m-Y', initialValue: PURCHASED_FROM,
  },
  { id: 'asset-value', label: 'Asset Value', kind: 'select', chipLabel: 'Value', allLabel: 'Any', options: valueOptions },
];

const sortOptions: SortOption[] = [
  { id: 'asset', label: 'Asset ID', icon: 'ti ti-hash' },
  { id: 'name', label: 'Asset name (A–Z)', icon: 'ti ti-abc' },
  { id: 'value', label: 'Asset value (high to low)', icon: 'ti ti-coin' },
  { id: 'purchase', label: 'Purchase date', icon: 'ti ti-calendar-event' },
  { id: 'warranty', label: 'Warranty expiry', icon: 'ti ti-shield-check' },
];

/** "01-04-2020" → the sortable key the rows use. */
const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-').map(Number);
  return Number.isFinite(year) ? year * 10000 + month * 100 + day : 0;
};

/** "01-08-2026" → "01 Aug 2026", the way a row prints a date. */
const toRowDate = (value: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [day, month, year] = value.split('-');
  return months[Number(month) - 1] ? `${day} ${months[Number(month) - 1]} ${year}` : value;
};

const toNumber = (value: string, fallback = 0): number => {
  const parsed = Number(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) && String(value).trim() !== '' ? parsed : fallback;
};

const AssetRegister = () => {
  const [rows, setRows] = useState<Asset[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<AssetModalId | null>(null);
  const [modalRow, setModalRow] = useState<Asset | null>(null);
  const [panelRow, setPanelRow] = useState<Asset | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Asset | null, modal: AssetModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: Asset) => Asset, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Asset>[]>(
    () => [
      {
        id: 'asset',
        label: 'Asset ID',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.id}</ActionLink>
        ),
      },
      {
        id: 'name',
        label: 'Asset Name',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span
              className={`avatar avatar-md bg-${categoryTint[row.category]}-transparent text-${categoryTint[row.category]} rounded flex-shrink-0 me-2`}
            >
              <i className={row.icon} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">{modelLineOf(row)}</div>
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
        id: 'department',
        label: 'Department',
        sortable: true,
        render: (row) => (
          <span className={`badge badge-soft-${departmentTint[row.department]}`}>{row.department}</span>
        ),
      },
      {
        id: 'holder',
        label: 'Assigned To',
        render: (row) =>
          row.holder ? (
            <div className="dt-user">
              <span className="dt-avatar">
                <ImageWithBasePath src={row.holder.avatar} alt={row.holder.name} />
              </span>
              <div>
                <span className="dt-name">{row.holder.name}</span>
                <div className="dt-sub flex-nowrap text-nowrap">{row.holder.meta}</div>
              </div>
            </div>
          ) : (
            <span className="fs-13 text-muted text-nowrap">{row.holderLabel}</span>
          ),
      },
      {
        id: 'location',
        label: 'Location',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.location}</span>
            <span className="fs-12 text-muted text-nowrap">{row.spot}</span>
          </>
        ),
      },
      {
        id: 'purchase',
        label: 'Purchase Date',
        sortable: true,
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => row.purchaseDate,
      },
      {
        id: 'value',
        label: 'Asset Value',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-semibold text-nowrap">{money(row.purchaseValue)}</span>
            {/* The purchase value less what has been written off. */}
            <span className="fs-12 text-muted text-nowrap">book {money(bookValueOf(row))}</span>
          </>
        ),
      },
      {
        id: 'condition',
        label: 'Condition',
        render: (row) => (
          <span className={`badge badge-soft-${conditionTint[row.condition]}`}>{row.condition}</span>
        ),
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
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Asset>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['asset-category'] && row.category !== filters['asset-category']) return false;
      if (filters.department && row.department !== filters.department) return false;
      if (filters.location && row.location !== filters.location) return false;
      if (filters['asset-status'] && row.status !== filters['asset-status']) return false;
      if (filters.condition && row.condition !== filters.condition) return false;
      if (filters.warranty && warrantyStateOf(row) !== filters.warranty) return false;
      if (filters['purchased-from']
        && dateKey(row.purchaseDate) < inputDateKey(filters['purchased-from'])) return false;
      if (filters['asset-value'] && valueBandOf(row) !== filters['asset-value']) return false;
      return true;
    },
    /** The rail opens on All Assets, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Maintenance') return row.status === 'Under Maintenance';
      return row.status === quick;
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'maintenance': return row.status === 'Under Maintenance';
        case 'expired': return warrantyStateOf(row) === 'Expired';
        case 'available': return row.status === 'Available';
        case 'depreciated': return bookValueOf(row) === 0;
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'value':
          return b.purchaseValue - a.purchaseValue || a.name.localeCompare(b.name);
        case 'purchase':
          return dateKey(b.purchaseDate) - dateKey(a.purchaseDate) || a.id.localeCompare(b.id);
        case 'warranty':
          return dateKey(a.warrantyUntil) - dateKey(b.warrantyUntil) || a.id.localeCompare(b.id);
        // The `<th>`s sort on columns the menu does not offer.
        case 'category':
          return a.category.localeCompare(b.category);
        case 'department':
          return a.department.localeCompare(b.department);
        case 'location':
          return a.location.localeCompare(b.location) || a.spot.localeCompare(b.spot);
        case 'asset':
        default:
          return a.id.localeCompare(b.id);
      }
    },
    defaultSort: 'asset',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: Asset) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded − what the roster holds now. */
  const shift = useCallback(
    (base: number, test: (row: Asset) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      {
        id: 'all', label: 'Full Asset Register', icon: 'ti ti-layout-list',
        count: shift(VIEW_TOTALS.register, () => true),
      },
      {
        id: 'maintenance', label: 'Under Maintenance', icon: 'ti ti-tools',
        count: shift(VIEW_TOTALS.maintenance, (row) => row.status === 'Under Maintenance'),
      },
      {
        id: 'expired', label: 'Warranty Expired', icon: 'ti ti-shield-x',
        count: shift(VIEW_TOTALS.warrantyExpired, (row) => warrantyStateOf(row) === 'Expired'),
      },
      {
        id: 'available', label: 'Available to Allocate', icon: 'ti ti-archive',
        count: shift(VIEW_TOTALS.available, (row) => row.status === 'Available'),
      },
      {
        id: 'depreciated', label: 'Fully Depreciated', icon: 'ti ti-trending-down',
        count: shift(VIEW_TOTALS.fullyDepreciated, (row) => bookValueOf(row) === 0),
      },
    ],
    [shift],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All Assets', icon: 'ti ti-layout-list', count: shift(SUMMARY_TOTALS.total, () => true) },
      {
        id: 'In Use', label: 'In Use', icon: 'ti ti-circle-check',
        count: shift(SUMMARY_TOTALS.inUse, (row) => row.status === 'In Use'),
      },
      {
        id: 'Maintenance', label: 'Maintenance', icon: 'ti ti-tools',
        count: shift(SUMMARY_TOTALS.maintenance, (row) => row.status === 'Under Maintenance'),
      },
      {
        id: 'Available', label: 'Available', icon: 'ti ti-archive',
        count: shift(SUMMARY_TOTALS.available, (row) => row.status === 'Available'),
      },
      {
        id: 'Retired', label: 'Retired', icon: 'ti ti-ban',
        count: shift(SUMMARY_TOTALS.retired, (row) => row.status === 'Retired'),
      },
    ],
    [shift],
  );

  /**
   * The strip counts the whole register — 486 assets against the eight this page
   * lists — so the template's figures stand and the roster moves them.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const total = shift(SUMMARY_TOTALS.total, () => true);
    const inUse = shift(SUMMARY_TOTALS.inUse, (row) => row.status === 'In Use');
    return [
      {
        id: 'total', tint: 'primary', icon: 'ti ti-package', label: 'Total Assets',
        value: String(total), hint: SUMMARY_TOTALS.bookValue,
      },
      {
        id: 'in-use', tint: 'success', icon: 'ti ti-circle-check', label: 'In Use',
        value: String(inUse),
        // The share moves with the roster rather than staying at the printed 70%.
        hint: `${total === 0 ? 0 : Math.round((inUse / total) * 100)}% of the register`,
      },
      {
        id: 'maintenance', tint: 'warning', icon: 'ti ti-tools', label: 'Under Maintenance',
        value: String(shift(SUMMARY_TOTALS.maintenance, (row) => row.status === 'Under Maintenance')),
        hint: `${SUMMARY_TOTALS.awaitingParts} awaiting parts`,
      },
      {
        id: 'available', tint: 'info', icon: 'ti ti-archive', label: 'Available',
        value: String(shift(SUMMARY_TOTALS.available, (row) => row.status === 'Available')),
        hint: 'ready to allocate',
      },
      {
        id: 'retired', tint: 'danger', icon: 'ti ti-ban', label: 'Retired',
        value: String(shift(SUMMARY_TOTALS.retired, (row) => row.status === 'Retired')),
        hint: 'fully depreciated',
      },
    ];
  }, [shift]);

  /* -------------------------------- Mutations ------------------------------- */

  const addAsset = useCallback(
    (draft: AssetDraft) => {
      if (!draft.name.trim()) {
        push('Give the asset a name', 'warning');
        return;
      }
      const purchaseDate = toRowDate(draft.purchaseDate);
      const id = `AST-2026-0${170 + rows.length}`;
      setRows((current) => [
        {
          id,
          name: draft.name.trim(),
          icon: 'ti ti-package',
          model: draft.name.trim(), units: 1, serial: draft.serial.trim() || 'Not recorded',
          category: draft.category as Category, department: draft.department as Department,
          holder: null, holderLabel: 'Not allocated',
          location: draft.location, spot: draft.spot.trim() || 'Store',
          purchaseDate,
          purchaseValue: toNumber(draft.purchaseValue),
          usefulLife: Math.max(1, toNumber(draft.usefulLife, 1)),
          condition: draft.condition as Condition,
          status: 'Available',
          warrantyUntil: toRowDate(draft.warrantyUntil), warrantyTerm: 'as quoted',
          warrantyCover: 'Per the purchase order', warrantyClaims: 'None',
          vendor: draft.vendor.trim() || 'Not recorded', vendorContact: 'Not recorded',
          vendorMobile: DASH, poNumber: draft.poNumber.trim() || 'Not recorded',
          paymentTerms: 'Net 30',
          assignments: [{ title: 'Received into store', meta: `${purchaseDate} · Estates` }],
          maintenance: [],
          documents: [],
          notes: draft.notes.trim() || 'Registered from the asset register.',
          tagPrinted: draft.tag ? purchaseDate : 'Not printed',
          lastScanned: 'Not scanned',
          nextService: 'No service scheduled',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} added to the register`);
    },
    [push, rows.length],
  );

  const updateAsset = useCallback(
    (draft: AssetDraft) =>
      patchRow(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          serial: draft.serial.trim() || row.serial,
          category: draft.category as Category,
          department: draft.department as Department,
          condition: draft.condition as Condition,
          location: draft.location,
          spot: draft.spot.trim() || row.spot,
          purchaseDate: toRowDate(draft.purchaseDate),
          purchaseValue: toNumber(draft.purchaseValue, row.purchaseValue),
          usefulLife: Math.max(1, toNumber(draft.usefulLife, row.usefulLife)),
          vendor: draft.vendor.trim() || row.vendor,
          poNumber: draft.poNumber.trim() || row.poNumber,
          warrantyUntil: toRowDate(draft.warrantyUntil),
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Asset'} updated`,
      ),
    [modalRow, patchRow],
  );

  /** An assignment names a holder and puts the asset In Use. */
  const assignAsset = useCallback(
    (payload: AssignPayload) => {
      const [name, role] = payload.assignee.split('·').map((part) => part.trim());
      const issued = toRowDate(payload.issueDate);
      patchRow(
        (row) => ({
          ...row,
          status: 'In Use',
          holder: payload.target === 'Staff'
            ? { name, avatar: row.holder?.avatar ?? 'assets/img/teachers/teacher-01.jpg', meta: role ?? '' }
            : null,
          holderLabel: payload.target === 'Staff' ? name : payload.destination,
          assignments: [
            { title: `${payload.units} of ${row.units} issued to ${payload.target === 'Staff' ? name : payload.destination}`, meta: `${issued} · Estates` },
            ...row.assignments,
          ],
        }),
        `${modalRow?.id ?? 'Asset'} assigned to ${payload.target === 'Staff' ? name : payload.destination}`,
      );
    },
    [modalRow, patchRow],
  );

  /** A transfer moves the department, the holder and the location together. */
  const transferAsset = useCallback(
    (payload: TransferPayload) => {
      const [name] = payload.holder.split('·').map((part) => part.trim());
      const [location, spot] = payload.location.split('·').map((part) => part.trim());
      const effective = toRowDate(payload.effective);
      patchRow(
        (row) => ({
          ...row,
          department: payload.department as Department,
          holder: name === 'Unassigned' ? null : { name, avatar: row.holder?.avatar ?? 'assets/img/teachers/teacher-01.jpg', meta: payload.holder.split('·')[1]?.trim() ?? '' },
          holderLabel: name === 'Unassigned' ? 'Not allocated' : name,
          location: location ?? row.location,
          spot: spot ?? row.spot,
          assignments: [
            { title: `Transferred to ${payload.department}`, meta: `${effective} · ${payload.reason}` },
            ...row.assignments,
          ],
        }),
        `${modalRow?.id ?? 'Asset'} transferred to ${payload.department}`,
      );
    },
    [modalRow, patchRow],
  );

  const scheduleMaintenance = useCallback(
    (payload: MaintenancePayload) => {
      const scheduled = toRowDate(payload.scheduled);
      patchRow(
        (row) => ({
          ...row,
          status: payload.setStatus ? 'Under Maintenance' : row.status,
          maintenance: [
            {
              title: payload.type,
              meta: `${scheduled} · ${payload.provider}${toNumber(payload.cost) > 0 ? ` · ${money(toNumber(payload.cost))}` : ''}`,
            },
            ...row.maintenance,
          ],
          nextService: `${payload.type} scheduled ${scheduled} · ${payload.priority.toLowerCase()} priority`,
        }),
        `${payload.type} scheduled for ${modalRow?.id ?? 'the asset'} on ${scheduled}`,
      );
    },
    [modalRow, patchRow],
  );

  /** Retiring closes the schedule: the asset stops being held by anyone. */
  const retireAsset = useCallback(
    (payload: RetirePayload) => {
      const retired = toRowDate(payload.date);
      const writeOff = modalRow ? bookValueOf(modalRow) : 0;
      patchRow(
        (row) => ({
          ...row,
          status: 'Retired',
          holder: null,
          holderLabel: 'Withdrawn from service',
          spot: `${row.spot} · awaiting disposal`,
          assignments: [
            { title: 'Withdrawn from service', meta: `${retired} · ${payload.reason}` },
            ...row.assignments,
          ],
          notes: `${payload.disposal} · approved by ${payload.approver}. ${row.notes}`,
          nextService: 'No service scheduled · awaiting disposal',
        }),
        `${modalRow?.id ?? 'Asset'} retired · ${money(writeOff)} written off`,
      );
    },
    [modalRow, patchRow],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} assets exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Asset) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View asset" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit asset" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Assign asset" onClick={() => openModal(row, 'assign')}>
        <i className="ti ti-user-check" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Schedule maintenance" onClick={() => openModal(row, 'maintenance')}>
        <i className="ti ti-tools" />
      </ActionLink>
      <ActionLink className="dt-ib danger" ariaLabel="Retire asset" onClick={() => openModal(row, 'retire')}>
        <i className="ti ti-ban" />
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

  const entryList = (entries: { title: string; meta: string }[], icon: string, tint: string, empty: string) =>
    entries.length === 0 ? (
      <p className="fs-13 text-muted mb-0">{empty}</p>
    ) : (
      entries.map((entry) => (
        <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
          <span className={`avatar avatar-sm bg-${tint}-transparent text-${tint} rounded flex-shrink-0`}>
            <i className={icon} />
          </span>
          <div className="flex-fill overflow-hidden">
            <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
            <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
          </div>
        </div>
      ))
    );

  /** The expander's last card offers whatever the row's status calls for. */
  const primaryAction = (row: Asset) => {
    if (row.status === 'Available') {
      return { modal: 'assign' as AssetModalId, icon: 'ti ti-user-check', label: 'Assign Asset' };
    }
    if (row.status === 'Retired') return null;
    if (row.condition === 'Poor' && bookValueOf(row) < accumulatedOf(row) / 4) {
      return { modal: 'retire' as AssetModalId, icon: 'ti ti-ban', label: 'Retire Asset' };
    }
    if (row.category === 'IT Equipment' && row.holder) {
      return { modal: 'transfer' as AssetModalId, icon: 'ti ti-transfer', label: 'Transfer' };
    }
    return { modal: 'maintenance' as AssetModalId, icon: 'ti ti-tools', label: 'Schedule Maintenance' };
  };

  const renderDetail = (row: Asset) => {
    const primary = primaryAction(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-package text-primary me-1" />Asset Information</h6>
          {pairList(informationPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-user-check text-success me-1" />Assignment History</h6>
          {entryList(row.assignments, 'ti ti-user-check', 'success', 'Never allocated.')}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-tools text-warning me-1" />Maintenance History</h6>
          {entryList(row.maintenance, 'ti ti-tools', 'warning', 'No maintenance recorded.')}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-shield-check text-info me-1" />Warranty Details</h6>
          {pairList(warrantyPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-building-store text-purple me-1" />Vendor Information</h6>
          {pairList(vendorPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-trending-down text-danger me-1" />Depreciation Details</h6>
          {pairList(depreciationPairsOf(row))}
          <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
            <span className="fs-13 fw-medium">Book Value</span>
            <span className="fs-13 fw-semibold">{money(bookValueOf(row))}</span>
          </div>
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-files text-secondary me-1" />Documents</h6>
          {row.documents.length === 0 ? (
            <p className="fs-13 text-muted mb-0">No documents filed.</p>
          ) : (
            row.documents.map((document) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={document.name}>
                <span className="avatar avatar-sm bg-danger-transparent text-danger rounded flex-shrink-0">
                  <i className={/xlsx?$/i.test(document.name) ? 'ti ti-file-type-xls' : 'ti ti-file-type-pdf'} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{document.name}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">{document.meta}</span>
                </div>
                <ActionLink
                  className="dt-ib" ariaLabel="Download document"
                  onClick={() => push(`${document.name} downloaded`, 'info')}
                >
                  <i className="ti ti-download" />
                </ActionLink>
              </div>
            ))
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Notes</h6>
          <p className="fs-13 text-muted mb-3">{row.notes}</p>
          <div className="d-flex align-items-center flex-wrap gap-2">
            {primary ? (
              <button
                type="button" className="btn btn-primary btn-sm"
                onClick={() => openModal(row, primary.modal)}
              >
                <i className={`${primary.icon} me-1`} />{primary.label}
              </button>
            ) : null}
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-eye me-1" />View Asset
            </button>
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => setPanelRow(row)}
            >
              <i className="ti ti-package me-1" />Asset Panel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Asset Register"
            section="Assets"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(rows[0] ?? null, 'transfer')}
                  >
                    <i className="ti ti-transfer me-2" />Transfer Asset
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Asset Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'add')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Asset
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={SUMMARY_TOTALS.total - initialRows.length + rows.length}
            summary={summary}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            workspaceId="asWorkspace"
            searchPlaceholder="Search asset, serial no. or tag…"
            searchLabel="Search assets"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="assets"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Asset register refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-package-off"
            emptyTitle="No assets match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Asset Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Asset Details"
            labelledById="as_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Asset Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <span
                    className={`avatar avatar-lg bg-${categoryTint[panelRow.category]}-transparent text-${categoryTint[panelRow.category]} rounded flex-shrink-0`}
                  >
                    <i className={`${panelRow.icon} fs-20`} />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <h6 className="mb-0 text-truncate">{panelRow.name}</h6>
                    <span className="fs-12 text-muted">{panelRow.id} · {panelRow.serial}</span>
                  </div>
                  <span className={`${statusBadge[panelRow.status]} ms-auto`}>{panelRow.status}</span>
                </div>

                <h6 className="fs-14 mb-2">Purchase Details</h6>
                <div className="border rounded p-3 mb-3">{pairList(purchasePairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Current Assignment</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  {panelRow.holder ? (
                    <span className="avatar avatar-md rounded flex-shrink-0">
                      <ImageWithBasePath src={panelRow.holder.avatar} className="rounded" alt={panelRow.holder.name} />
                    </span>
                  ) : (
                    <span className="avatar avatar-md bg-light text-muted rounded flex-shrink-0">
                      <i className="ti ti-user-off" />
                    </span>
                  )}
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{holderNameOf(panelRow)}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">
                      {panelRow.department} · {placeOf(panelRow)}
                    </span>
                  </div>
                  <span className={`badge badge-soft-${conditionTint[panelRow.condition]}`}>
                    {panelRow.condition}
                  </span>
                </div>

                <h6 className="fs-14 mb-2">Maintenance Schedule</h6>
                {panelRow.maintenance[0] ? (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
                    <span className="avatar avatar-sm bg-success-transparent text-success rounded flex-shrink-0">
                      <i className="ti ti-check" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">{panelRow.maintenance[0].title}</h6>
                      <span className="fs-12 text-muted text-truncate d-block">{panelRow.maintenance[0].meta}</span>
                    </div>
                  </div>
                ) : null}
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                    <i className="ti ti-calendar-event" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">Next service</h6>
                    <span className="fs-12 text-muted text-truncate d-block">{panelRow.nextService}</span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Warranty Information</h6>
                <div className="border rounded p-3 mb-3">{pairList(panelWarrantyPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">QR / Barcode Information</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span className="avatar avatar-md bg-primary-transparent text-primary rounded flex-shrink-0">
                    <i className="ti ti-qrcode fs-20" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{tagOf(panelRow).code}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">{tagOf(panelRow).meta}</span>
                    <span className="fs-12 text-muted text-truncate d-block">{tagOf(panelRow).scanned}</span>
                  </div>
                  <ActionLink
                    className="dt-ib" ariaLabel="Print asset tag"
                    onClick={() => push(`${tagOf(panelRow).code} sent to the label printer`, 'info')}
                  >
                    <i className="ti ti-printer" />
                  </ActionLink>
                </div>

                <h6 className="fs-14 mb-2">Audit History</h6>
                {auditOf(panelRow).map((entry) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
                    <span className={`avatar avatar-sm bg-${entry.tint}-transparent text-${entry.tint} rounded flex-shrink-0`}>
                      <i className={entry.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                      <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
                    </div>
                  </div>
                ))}

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'maintenance'); }}
                  >
                    <i className="ti ti-tools me-1" />Schedule Maintenance
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'transfer'); }}
                  >
                    <i className="ti ti-transfer me-1" />Transfer
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <AssetModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onAdd={addAsset}
        onUpdate={updateAsset}
        onAssign={assignAsset}
        onTransfer={transferAsset}
        onSchedule={scheduleMaintenance}
        onRetire={retireAsset}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="asToasts" />
    </>
  );
};

export default AssetRegister;
