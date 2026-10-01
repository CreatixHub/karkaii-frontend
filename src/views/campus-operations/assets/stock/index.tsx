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
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import StockModals from './modals/StockModals';
import type {
  AdjustPayload, ReceivePayload, StockDraft, StockModalId, TransferPayload,
} from './modals/StockModals';
import type { Movement, StockCategory, StockItem, StockStatus } from './data/stock.data';
import {
  SUMMARY_TOTALS, UPDATED_FROM, UPDATED_TO, VIEW_TOTALS, auditOf, availableLabelOf,
  availableOf, batchRowsOf, categoryBadge, categoryOptions, coverLabelOf, dateKey,
  daysAgoLabelOf, daysOfCoverOf, itemPairsOf, matchesMovement, money, movementIcon,
  movementOptions, panelItemPairsOf, purchaseSummaryOf, purchaseTotalOf, qty,
  recentMovementsOf, reorderLabelOf, reorderPairsOf, searchIndexOf, statusBadge, statusOf,
  statusOptions, statusPill, stock as initialRows, stockPairsOf, stockValueOf,
  storagePairsOf, supplierLineOf, supplierOptions, supplierPairsOf, transfersOf, unitLabel,
  valueBandOf, valueOptions, warehouseOptions,
} from './data/stock.data';

const routes = all_routes;

/**
 * Ids and options are the template's own; the two date fields open committed,
 * which is what puts chips on the rail at load.
 */
const filterFields: FilterField[] = [
  { id: 'category', label: 'Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'warehouse-store', label: 'Warehouse / Store', kind: 'select', chipLabel: 'Store', options: warehouseOptions },
  { id: 'supplier', label: 'Supplier', kind: 'select', chipLabel: 'Supplier', options: supplierOptions },
  { id: 'stock-status', label: 'Stock Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  {
    id: 'updated-from', label: 'Updated From', kind: 'date', chipLabel: 'From',
    dateFormat: 'd-m-Y', initialValue: UPDATED_FROM,
  },
  {
    id: 'updated-to', label: 'Updated To', kind: 'date', chipLabel: 'To',
    dateFormat: 'd-m-Y', initialValue: UPDATED_TO,
  },
  { id: 'stock-value', label: 'Stock Value', kind: 'select', chipLabel: 'Value', allLabel: 'Any', options: valueOptions },
  { id: 'movement', label: 'Movement', kind: 'select', chipLabel: 'Movement', allLabel: 'Any', options: movementOptions },
];

const sortOptions: SortOption[] = [
  { id: 'code', label: 'Item code', icon: 'ti ti-hash' },
  { id: 'name', label: 'Item name (A–Z)', icon: 'ti ti-abc' },
  { id: 'available', label: 'Available quantity', icon: 'ti ti-stack-2' },
  { id: 'value', label: 'Stock value', icon: 'ti ti-currency-dollar' },
  { id: 'updated', label: 'Last updated', icon: 'ti ti-calendar-event' },
];

const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-').map(Number);
  return Number.isFinite(year) ? year * 10000 + month * 100 + day : 0;
};

/** "03-08-2026" → "3 Aug 2026", the way a row prints a date. */
const toRowDate = (value: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [day, month, year] = value.split('-');
  return months[Number(month) - 1] ? `${Number(day)} ${months[Number(month) - 1]} ${year}` : value;
};

/** A predicate for one derived status, used by the views, rail and strip. */
const isStatus = (status: StockStatus) => (row: StockItem) => statusOf(row) === status;

const toNumber = (value: string, fallback = 0): number => {
  const parsed = Number(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) && String(value).trim() !== '' ? parsed : fallback;
};

const StockManagement = () => {
  const [rows, setRows] = useState<StockItem[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<StockModalId | null>(null);
  const [modalRow, setModalRow] = useState<StockItem | null>(null);
  const [panelRow, setPanelRow] = useState<StockItem | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: StockItem | null, modal: StockModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: StockItem) => StockItem, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<StockItem>[]>(
    () => [
      {
        id: 'code',
        label: 'Item Code',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'history')}>{row.id}</ActionLink>
        ),
      },
      {
        id: 'name',
        label: 'Item Name',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className={`avatar avatar-md bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0 me-2`}>
              <i className={row.icon} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'history')}>{row.name}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">{row.packSize}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'category',
        label: 'Category',
        sortable: true,
        render: (row) => <span className={categoryBadge[row.category]}>{row.category}</span>,
      },
      {
        id: 'warehouse',
        label: 'Warehouse',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded flex-shrink-0 me-2">
              <i className="ti ti-building-warehouse" />
            </span>
            <div>
              <span className="dt-name">{row.warehouse}</span>
              <div className="dt-sub flex-nowrap text-nowrap">{row.location}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'supplier',
        label: 'Supplier',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.supplier}</span>
            <span className="fs-12 text-muted text-nowrap">{supplierLineOf(row)}</span>
          </>
        ),
      },
      {
        id: 'available',
        label: 'Available Qty',
        sortable: true,
        render: (row) => (
          <>
            {/* Opening plus receipts and transfers in, less everything out. */}
            <span className="d-block fs-13 fw-semibold text-nowrap">{qty(availableOf(row))}</span>
            <span className="fs-12 text-muted text-nowrap">{coverLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'reorder',
        label: 'Reorder Level',
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{qty(row.reorderLevel)}</span>
            <span className="fs-12 text-muted text-nowrap">{reorderLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'price',
        label: 'Unit Price',
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => money(row.unitPrice),
      },
      {
        id: 'value',
        label: 'Stock Value',
        sortable: true,
        cellClassName: 'fs-13 fw-semibold text-nowrap',
        render: (row) => money(stockValueOf(row)),
      },
      {
        id: 'updated',
        label: 'Last Updated',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.lastUpdated}</span>
            <span className="fs-12 text-muted text-nowrap">{daysAgoLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        render: (row) => (
          <span className={`dt-pill ${statusPill[statusOf(row)]}`}>
            <span className="dt-pill-dot" />{statusOf(row)}
          </span>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<StockItem>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.category && row.category !== filters.category) return false;
      if (filters['warehouse-store'] && row.warehouse !== filters['warehouse-store']) return false;
      if (filters.supplier && row.supplier !== filters.supplier) return false;
      if (filters['stock-status'] && statusOf(row) !== filters['stock-status']) return false;
      if (filters['updated-from']
        && dateKey(row.lastUpdated) < inputDateKey(filters['updated-from'])) return false;
      if (filters['updated-to']
        && dateKey(row.lastUpdated) > inputDateKey(filters['updated-to'])) return false;
      if (filters['stock-value'] && valueBandOf(row) !== filters['stock-value']) return false;
      if (filters.movement && !matchesMovement(row, filters.movement)) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Reorder') return statusOf(row) === 'Reorder Raised';
      return statusOf(row) === quick;
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'low': return statusOf(row) === 'Low Stock';
        case 'out': return statusOf(row) === 'Out of Stock';
        case 'reorder': return statusOf(row) === 'Reorder Raised';
        case 'main': return row.warehouse === 'Main Store';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'available':
          return availableOf(b) - availableOf(a) || a.name.localeCompare(b.name);
        case 'value':
          return stockValueOf(b) - stockValueOf(a) || a.name.localeCompare(b.name);
        case 'updated':
          return dateKey(b.lastUpdated) - dateKey(a.lastUpdated) || a.id.localeCompare(b.id);
        // The `<th>`s sort on columns the menu does not offer.
        case 'category':
          return a.category.localeCompare(b.category);
        case 'warehouse':
          return a.warehouse.localeCompare(b.warehouse);
        case 'supplier':
          return a.supplier.localeCompare(b.supplier);
        case 'code':
        default:
          return a.id.localeCompare(b.id);
      }
    },
    defaultSort: 'code',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: StockItem) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the roster holds now. */
  const shift = useCallback(
    (base: number, test: (row: StockItem) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Items', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      { id: 'low', label: 'Low Stock', icon: 'ti ti-alert-triangle', count: shift(VIEW_TOTALS.lowStock, isStatus('Low Stock')) },
      { id: 'out', label: 'Out of Stock', icon: 'ti ti-package-off', count: shift(VIEW_TOTALS.outOfStock, isStatus('Out of Stock')) },
      { id: 'reorder', label: 'Reorder Required', icon: 'ti ti-shopping-cart', count: shift(VIEW_TOTALS.reorder, isStatus('Reorder Raised')) },
      {
        id: 'main', label: 'Main Store Only', icon: 'ti ti-building-warehouse',
        count: shift(VIEW_TOTALS.mainStore, (row) => row.warehouse === 'Main Store'),
      },
    ],
    [shift],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: shift(SUMMARY_TOTALS.total, () => true) },
      { id: 'In Stock', label: 'In Stock', icon: 'ti ti-circle-check', count: shift(SUMMARY_TOTALS.inStock, isStatus('In Stock')) },
      { id: 'Low Stock', label: 'Low Stock', icon: 'ti ti-alert-triangle', count: shift(SUMMARY_TOTALS.lowStock, isStatus('Low Stock')) },
      { id: 'Out of Stock', label: 'Out of Stock', icon: 'ti ti-package-off', count: shift(SUMMARY_TOTALS.outOfStock, isStatus('Out of Stock')) },
      { id: 'Reorder', label: 'Reorder', icon: 'ti ti-shopping-cart', count: shift(SUMMARY_TOTALS.reorder, isStatus('Reorder Raised')) },
    ],
    [shift],
  );

  /**
   * The strip counts the whole register — 486 items against the eight this page
   * lists — so the template's figures stand and the roster moves them. The open
   * orders hint is the one figure the page can count honestly.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const openOrders = countBy((row) => Boolean(row.openOrder));
    return [
      {
        id: 'total', tint: 'primary', icon: 'ti ti-packages', label: 'Total Items',
        value: String(shift(SUMMARY_TOTALS.total, () => true)), hint: SUMMARY_TOTALS.stores,
      },
      {
        id: 'in-stock', tint: 'success', icon: 'ti ti-circle-check', label: 'In Stock',
        value: String(shift(SUMMARY_TOTALS.inStock, isStatus('In Stock'))), hint: 'above reorder level',
      },
      {
        id: 'low', tint: 'warning', icon: 'ti ti-alert-triangle', label: 'Low Stock',
        value: String(shift(SUMMARY_TOTALS.lowStock, isStatus('Low Stock'))), hint: 'at or below minimum',
      },
      {
        id: 'out', tint: 'danger', icon: 'ti ti-package-off', label: 'Out of Stock',
        value: String(shift(SUMMARY_TOTALS.outOfStock, isStatus('Out of Stock'))), hint: 'nil balance',
      },
      {
        id: 'reorder', tint: 'info', icon: 'ti ti-shopping-cart', label: 'Reorder Required',
        value: String(shift(SUMMARY_TOTALS.reorder, isStatus('Reorder Raised'))),
        hint: `${SUMMARY_TOTALS.openOrders - initialRows.filter((row) => row.openOrder).length + openOrders} orders already open`,
      },
    ];
  }, [countBy, shift]);

  /** The footer's "$6,865.00 on this page" — the page's own rows added up. */
  const pageValue = useMemo(
    () => workspace.shown.reduce((total, row) => total + stockValueOf(row), 0),
    [workspace.shown],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const addItem = useCallback(
    (draft: StockDraft) => {
      if (!draft.name.trim()) {
        push('Give the item a name', 'warning');
        return;
      }
      const id = draft.code.trim() || `STK-10${79 + rows.length}`;
      setRows((current) => [
        {
          id,
          name: draft.name.trim(),
          icon: 'ti ti-package', tint: 'primary',
          packSize: draft.unit, unit: draft.unit.toLowerCase(),
          category: draft.category as StockCategory,
          warehouse: draft.warehouse, location: draft.bin.trim() || `${draft.warehouse} · unallocated`,
          supplier: draft.supplier, supplierCode: 'Not recorded',
          supplierContact: 'Not recorded', leadTime: toNumber(draft.leadTime, 7),
          supplierRating: 'Not rated',
          openingBalance: 0, received: 0, issued: 0,
          transferredIn: 0, transferredOut: 0, adjustments: 0,
          reorderLevel: toNumber(draft.reorderLevel), reorderQty: toNumber(draft.reorderQty),
          openOrder: '', unitPrice: toNumber(draft.unitPrice), lastUpdated: '31 Jul 2026',
          movements: [], purchases: [],
          batches: draft.batchTracked ? [{ code: 'Awaiting first receipt', receivedOn: '—' }] : [],
          adjustmentNote: 'No adjustment posted.',
          notes: draft.notes.trim() || 'Created on the stock register.',
          createdOn: '31 Jul 2026',
          previousReorderLevel: toNumber(draft.reorderLevel),
          reorderChangedOn: '31 Jul 2026',
          observations: [],
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} added to the stock register`);
    },
    [push, rows.length],
  );

  const updateItem = useCallback(
    (draft: StockDraft) =>
      patchRow(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          category: draft.category as StockCategory,
          warehouse: draft.warehouse,
          location: draft.bin.trim() || row.location,
          supplier: draft.supplier,
          leadTime: toNumber(draft.leadTime, row.leadTime),
          // The level moves; the audit trail records where it came from.
          previousReorderLevel: row.reorderLevel,
          reorderChangedOn: '31 Jul 2026',
          reorderLevel: toNumber(draft.reorderLevel, row.reorderLevel),
          reorderQty: toNumber(draft.reorderQty, row.reorderQty),
          unitPrice: toNumber(draft.unitPrice, row.unitPrice),
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Item'} updated`,
      ),
    [modalRow, patchRow],
  );

  /** An adjustment writes to the ledger, so the balance moves with it. */
  const postAdjustment = useCallback(
    (payload: AdjustPayload) => {
      const amount = toNumber(payload.quantity);
      if (amount <= 0 && payload.mode !== 'Set Count') {
        push('Enter the quantity to adjust', 'warning');
        return;
      }
      const posted = toRowDate(payload.date);
      patchRow(
        (row) => {
          const before = availableOf(row);
          const after = payload.mode === 'Increase' ? before + amount
            : payload.mode === 'Decrease' ? Math.max(0, before - amount)
              : Math.max(0, amount);
          const delta = after - before;
          const entry: Movement = {
            date: posted,
            reference: `ADJ-2026-00${70 + row.movements.filter((m) => m.kind === 'adjustment').length}`,
            title: payload.reason,
            kind: 'adjustment',
            qty: delta,
          };
          return {
            ...row,
            // Adjustments are stored as a positive write-off total.
            adjustments: row.adjustments - delta,
            movements: [...row.movements, entry],
            adjustmentNote: payload.remarks.trim() || row.adjustmentNote,
            lastUpdated: posted,
          };
        },
        `${payload.mode} of ${qty(amount)} posted against ${modalRow?.id ?? 'the item'}`,
      );
    },
    [modalRow, patchRow, push],
  );

  /** A transfer leaves the home store, so the balance drops by the quantity. */
  const transferStock = useCallback(
    (payload: TransferPayload) => {
      const amount = toNumber(payload.quantity);
      if (!modalRow) return;
      if (amount <= 0 || amount > availableOf(modalRow)) {
        push(`Only ${availableLabelOf(modalRow)} on the shelf`, 'warning');
        return;
      }
      const moved = toRowDate(payload.date);
      patchRow(
        (row) => ({
          ...row,
          transferredOut: row.transferredOut + amount,
          movements: [
            ...row.movements,
            {
              date: moved, reference: payload.reference,
              title: `Transfer to ${payload.toStore}`, kind: 'transfer-out', qty: -amount,
            },
          ],
          lastUpdated: moved,
        }),
        `${qty(amount)} transferred to ${payload.toStore} on ${payload.reference}`,
      );
    },
    [modalRow, patchRow, push],
  );

  /** Goods inward adds the accepted quantity and closes any open order. */
  const receiveStock = useCallback(
    (payload: ReceivePayload) => {
      const accepted = Math.max(0, toNumber(payload.received) - toNumber(payload.rejected));
      if (accepted <= 0) {
        push('Nothing accepted on this receipt', 'warning');
        return;
      }
      const received = toRowDate(payload.date);
      patchRow(
        (row) => ({
          ...row,
          received: row.received + accepted,
          // The receipt satisfies the order, so the reorder flag clears.
          openOrder: '',
          unitPrice: toNumber(payload.rate, row.unitPrice),
          location: payload.bin.trim() || row.location,
          batches: payload.batch.trim()
            ? [{ code: payload.batch.trim(), receivedOn: received }, ...row.batches]
            : row.batches,
          purchases: [
            {
              id: payload.purchaseOrder.split('·')[0].trim(),
              date: received, qty: accepted, price: toNumber(payload.rate, row.unitPrice),
            },
            ...row.purchases,
          ],
          movements: [
            ...row.movements,
            {
              date: received, reference: payload.invoiceNo.trim() || 'GRN-2026-NEW',
              title: `Goods received · ${payload.purchaseOrder.split('·')[0].trim()}`,
              kind: 'receipt', qty: accepted,
            },
          ],
          lastUpdated: received,
        }),
        `${qty(accepted)} received into ${payload.store} on ${received}`,
      );
    },
    [patchRow, push],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} stock items exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: StockItem) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="Stock history" onClick={() => openModal(row, 'history')}>
        <i className="ti ti-history" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit stock item" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Receive stock" onClick={() => openModal(row, 'receive')}>
        <i className="ti ti-package-import" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Transfer stock" onClick={() => openModal(row, 'transfer')}>
        <i className="ti ti-arrows-exchange" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Stock adjustment" onClick={() => openModal(row, 'adjust')}>
        <i className="ti ti-adjustments" />
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

  /** The expander's last card offers whatever this item's position calls for. */
  const primaryAction = (row: StockItem) => {
    const status = statusOf(row);
    if (status === 'Out of Stock' || status === 'Reorder Raised' || status === 'Low Stock') {
      return { modal: 'receive' as StockModalId, icon: 'ti ti-package-import', label: 'Receive Stock' };
    }
    if (availableOf(row) > row.reorderLevel * 3) {
      return { modal: 'transfer' as StockModalId, icon: 'ti ti-arrows-exchange', label: 'Transfer Stock' };
    }
    return { modal: 'adjust' as StockModalId, icon: 'ti ti-adjustments', label: 'Stock Adjustment' };
  };

  const renderDetail = (row: StockItem) => {
    const primary = primaryAction(row);
    const purchases = purchaseSummaryOf(row);
    const transfers = transfersOf(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-packages text-primary me-1" />Item Information</h6>
          {pairList(itemPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-stack-2 text-success me-1" />Current Stock</h6>
          {pairList(stockPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-arrows-exchange text-info me-1" />Stock Movement History</h6>
          {row.movements.length === 0 ? (
            <p className="fs-13 text-muted mb-0">No movement recorded this session.</p>
          ) : (
            recentMovementsOf(row).map((entry) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.reference}>
                <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                  <i className={movementIcon[entry.kind]} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">
                    {entry.date} · {unitLabel(Math.abs(entry.qty), row.unit)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-shopping-cart text-warning me-1" />Purchase History</h6>
          {row.purchases.length === 0 ? (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
              <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                <i className="ti ti-shopping-cart-off" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">No purchase raised this session</h6>
                <span className="fs-12 text-muted text-truncate d-block">
                  Balance carried forward from 2025 / 2026
                </span>
              </div>
            </div>
          ) : (
            <>
              {row.purchases.map((order) => (
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={order.id}>
                  <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                    <i className="ti ti-shopping-cart" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{order.id}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">
                      {order.date} · {qty(order.qty)} × {money(order.price)}
                    </span>
                  </div>
                  {/* Quantity at the rate — never a second stored figure. */}
                  <span className="fs-13 fw-medium text-nowrap">{money(purchaseTotalOf(order))}</span>
                </div>
              ))}
              <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
                <span className="fs-13 fw-medium">Purchased · {qty(purchases.units)} units</span>
                <span className="fs-13 fw-semibold">{money(purchases.total)}</span>
              </div>
            </>
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-arrows-exchange-2 text-purple me-1" />Transfer History</h6>
          {transfers.length === 0 ? (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
              <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                <i className="ti ti-arrows-exchange" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">No transfers recorded</h6>
                <span className="fs-12 text-muted text-truncate d-block">
                  Item has stayed in its home store
                </span>
              </div>
            </div>
          ) : (
            transfers.map((entry) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.reference}-${entry.date}`}>
                <span
                  className={`avatar avatar-sm bg-${entry.kind === 'transfer-in' ? 'success' : 'purple'}-transparent text-${entry.kind === 'transfer-in' ? 'success' : 'purple'} rounded flex-shrink-0`}
                >
                  <i className={movementIcon[entry.kind]} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">
                    {entry.date} · {entry.reference}
                  </span>
                </div>
                <span className={`fs-13 fw-medium text-nowrap ${entry.qty > 0 ? 'text-success' : 'text-danger'}`}>
                  {entry.qty > 0 ? `+${qty(entry.qty)}` : qty(entry.qty)}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-building-store text-secondary me-1" />Supplier Details</h6>
          {pairList(supplierPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-building-warehouse text-danger me-1" />Storage Location</h6>
          {pairList(storagePairsOf(row))}
          <p className="fs-13 text-muted mb-0 mt-2">{row.adjustmentNote}</p>
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Notes</h6>
          <p className="fs-13 text-muted mb-3">{row.notes}</p>
          <div className="d-flex align-items-center flex-wrap gap-2">
            <button
              type="button" className="btn btn-primary btn-sm"
              onClick={() => openModal(row, primary.modal)}
            >
              <i className={`${primary.icon} me-1`} />{primary.label}
            </button>
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => openModal(row, 'history')}
            >
              <i className="ti ti-history me-1" />Stock History
            </button>
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => setPanelRow(row)}
            >
              <i className="ti ti-packages me-1" />Stock Panel
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
            title="Stock Management"
            section="Assets"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(rows.find((row) => row.openOrder) ?? rows[0] ?? null, 'receive')}
                  >
                    <i className="ti ti-package-import me-2" />Receive Stock
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Stock Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'add')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Stock
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
            /* The template puts the page's own stock value on the footer line. */
            footerInfoSuffix={`${money(pageValue)} on this page`}
            workspaceId="stkWorkspace"
            searchPlaceholder="Search item, code or supplier…"
            searchLabel="Search stock items"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="items"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Stock register refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-package-off"
            emptyTitle="No stock items match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Stock Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Stock Details"
            labelledById="stk_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Item Details</h6>
                <div className="d-flex align-items-center mb-3">
                  <span
                    className={`avatar avatar-lg bg-${panelRow.tint}-transparent text-${panelRow.tint} rounded flex-shrink-0`}
                  >
                    <i className={`${panelRow.icon} fs-20`} />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <h6 className="mb-0 text-truncate">{panelRow.name}</h6>
                    <span className="fs-12 text-muted">{panelRow.id} · {panelRow.packSize}</span>
                  </div>
                  <span className={`${statusBadge[statusOf(panelRow)]} ms-auto`}>{statusOf(panelRow)}</span>
                </div>
                <div className="border rounded p-3 mb-3">{pairList(panelItemPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Warehouse Information</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
                  <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                    <i className="ti ti-building-warehouse" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{panelRow.warehouse}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">{panelRow.location}</span>
                  </div>
                  <span className="badge badge-soft-primary">Home</span>
                </div>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                    <i className="ti ti-building-store" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{panelRow.supplier}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">
                      {panelRow.supplierCode} · {panelRow.leadTime} days lead time
                    </span>
                  </div>
                  <span className="badge badge-soft-success">
                    Rated {panelRow.supplierRating.split('·')[0].trim()}
                  </span>
                </div>

                <h6 className="fs-14 mb-2">Batch / Serial Numbers</h6>
                <div className="table-responsive mb-3">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th className="fs-12">Batch</th>
                        <th className="fs-12 text-end">Qty</th>
                        <th className="fs-12">Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* The current batch holds the balance; older ones are spent. */}
                      {batchRowsOf(panelRow).map((batch) => (
                        <tr key={batch.code}>
                          <td className="fs-13">{batch.code}</td>
                          <td className="fs-13 text-end">{qty(batch.qty)}</td>
                          <td className="fs-13 text-nowrap">{batch.receivedOn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h6 className="fs-14 mb-2">Reorder Information</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList(reorderPairsOf(panelRow))}
                  <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
                    <span className="fs-13 fw-medium">Available</span>
                    <span className="fs-13 fw-semibold">{availableLabelOf(panelRow)}</span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Recent Transactions</h6>
                {recentMovementsOf(panelRow).length === 0 ? (
                  <p className="fs-13 text-muted mb-3">No movement recorded this session.</p>
                ) : (
                  recentMovementsOf(panelRow).map((entry) => (
                    <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.reference}>
                      <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                        <i className={movementIcon[entry.kind]} />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                        <span className="fs-12 text-muted text-truncate d-block">
                          {entry.date} · {entry.reference}
                        </span>
                      </div>
                      <span className={`fs-13 fw-medium text-nowrap ${entry.qty > 0 ? 'text-success' : 'text-danger'}`}>
                        {entry.qty > 0 ? `+${qty(entry.qty)}` : qty(entry.qty)}
                      </span>
                    </div>
                  ))
                )}

                <h6 className="fs-14 mb-2 mt-3">Audit History</h6>
                {auditOf(panelRow).map((entry) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
                    <span className={`avatar avatar-sm bg-${entry.tint}-transparent text-${entry.tint} rounded flex-shrink-0`}>
                      <i className={entry.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                      <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
                    </div>
                  </div>
                ))}

                <p className="fs-12 text-muted mb-0 mt-2">
                  {money(stockValueOf(panelRow))} on the shelf · {daysOfCoverOf(panelRow)} days of cover
                </p>

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'receive'); }}
                  >
                    <i className="ti ti-package-import me-1" />Receive Stock
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'edit'); }}
                  >
                    <i className="ti ti-edit me-1" />Edit
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <StockModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onAdd={addItem}
        onUpdate={updateItem}
        onAdjust={postAdjustment}
        onTransfer={transferStock}
        onReceive={receiveStock}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="stkToasts" />
    </>
  );
};

export default StockManagement;
