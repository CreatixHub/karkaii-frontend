export type StockStatus = 'In Stock' | 'Low Stock' | 'Reorder Raised' | 'Out of Stock';

export type StockCategory =
  | 'Stationery' | 'Academic Supplies' | 'Lab Consumables'
  | 'IT Consumables' | 'Housekeeping' | 'Cafeteria' | 'Medical';

export type MovementKind = 'receipt' | 'issue' | 'transfer-in' | 'transfer-out' | 'adjustment';

export interface Movement {
  /** "28 Jul 2026". */
  date: string;
  /** "ISS-2026-0421", "GRN-2026-0233", "TRF-2026-0091". */
  reference: string;
  title: string;
  kind: MovementKind;
  /** Signed: receipts and transfers in are positive, everything else negative. */
  qty: number;
}

export interface PurchaseOrder {
  id: string;
  date: string;
  qty: number;
  price: number;
}

export interface Batch {
  code: string;
  receivedOn: string;
}

export interface StockItem {
  id: string;
  name: string;
  /** Tabler icon for the item cell, with its own tint. */
  icon: string;
  tint: string;
  /** "Ream of 500 sheets". */
  packSize: string;
  /** Singular noun the quantities count in: ream, box, set, can, kit. */
  unit: string;
  category: StockCategory;

  warehouse: string;
  /** "Admin Block · Rack A2 · Bin 07". */
  location: string;

  supplier: string;
  supplierCode: string;
  supplierContact: string;
  leadTime: number;
  supplierRating: string;

  /** The six movement figures the panel prints; the balance follows from them. */
  openingBalance: number;
  received: number;
  issued: number;
  transferredIn: number;
  transferredOut: number;
  /** Negative on every row in the template — write-offs, not gains. */
  adjustments: number;

  reorderLevel: number;
  reorderQty: number;
  /** Set while an order is open, which outranks the level on the status pill. */
  openOrder: string;
  unitPrice: number;
  lastUpdated: string;

  movements: Movement[];
  purchases: PurchaseOrder[];
  batches: Batch[];
  /** The line the storage card prints under the levels. */
  adjustmentNote: string;
  notes: string;

  /** The panel's audit trail. */
  createdOn: string;
  previousReorderLevel: number;
  reorderChangedOn: string;
  /** Only the A4 paper carries one in the template; the reorder line is derived. */
  observations: { title: string; meta: string }[];
}

/* --------------------------------- Tints ----------------------------------- */

export const categoryBadge: Record<StockCategory, string> = {
  Stationery: 'badge badge-soft-primary',
  'Academic Supplies': 'badge badge-soft-success',
  'Lab Consumables': 'badge badge-soft-info',
  'IT Consumables': 'badge badge-soft-purple',
  Housekeeping: 'badge badge-soft-secondary',
  Cafeteria: 'badge badge-soft-warning',
  Medical: 'badge badge-soft-danger',
};

export const statusPill: Record<StockStatus, string> = {
  'In Stock': 'is-active',
  'Low Stock': 'is-pending',
  'Reorder Raised': 'is-review',
  'Out of Stock': 'is-blocked',
};

export const statusBadge: Record<StockStatus, string> = {
  'In Stock': 'badge badge-soft-success',
  'Low Stock': 'badge badge-soft-warning',
  'Reorder Raised': 'badge badge-soft-info',
  'Out of Stock': 'badge badge-soft-danger',
};

/* ------------------------------ Filter options ------------------------------ */

export const categoryOptions: StockCategory[] = [
  'Stationery', 'Academic Supplies', 'Lab Consumables',
  'IT Consumables', 'Housekeeping', 'Cafeteria', 'Medical',
];

export const warehouseOptions = [
  'Main Store', 'Science Store', 'IT Store', 'Hostel Store', 'Kitchen Store', 'Medical Store',
];

export const supplierOptions = [
  'Global Paper Mills', 'ClassEdge Supplies', 'OptiLab Instruments',
  'CanonPro Office Solutions', 'LinenCare Textiles', 'FreshLine Foods', 'MediServe Supplies',
];

export const statusOptions: StockStatus[] = [
  'In Stock', 'Low Stock', 'Reorder Raised', 'Out of Stock',
];

export const valueOptions = [
  'Under $500', '$500 – $1,000', '$1,000 – $2,500', 'Above $2,500',
];

export const movementOptions = [
  'Fast moving', 'Slow moving', 'No movement this session', 'Transferred this session',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const stockTypeOptions = ['Consumable', 'Durable', 'Perishable', 'Serialised'];

export const unitOptions = ['Piece', 'Ream', 'Box', 'Set', 'Can', 'Pack'];

export const adjustmentReasonOptions = [
  'Damaged in storage', 'Expired', 'Breakage', 'Lost or unaccounted',
  'Physical count correction', 'Returned to supplier',
];

export const approverOptions = ['Store Manager', 'Estates Manager', 'Department Head'];

export const requestedByOptions = [
  'Hostel Director', 'Head of Science', 'IT Department', 'Cafeteria Manager',
];

export const receivedByOptions = ['Store Manager', 'Store Assistant', 'Estates Office'];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const money = (value: number): string =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const qty = (value: number): string => value.toLocaleString('en-US');

/** The day the template was captured; every "days" figure counts to it. */
export const REGISTER_DATE = '31 Jul 2026';

/** 01 Apr to 31 Jul 2026 — the window the days-of-cover figure burns over. */
export const SESSION_DAYS = 121;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

const dayNumber = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Math.round(Date.UTC(Number(year), index, Number(day)) / 86_400_000);
};

export const daysBetween = (from: string, to: string): number => dayNumber(to) - dayNumber(from);

/** Everything in, less everything out. */
export const availableOf = (row: StockItem): number =>
  row.openingBalance + row.received + row.transferredIn
  - row.issued - row.transferredOut - Math.abs(row.adjustments);

export const stockValueOf = (row: StockItem): number =>
  Number((availableOf(row) * row.unitPrice).toFixed(2));

/**
 * An open order outranks the level: the A4 paper sits under its reorder level
 * but reads Reorder Raised, not Low Stock.
 */
export const statusOf = (row: StockItem): StockStatus => {
  const available = availableOf(row);
  if (available <= 0) return 'Out of Stock';
  if (row.openOrder) return 'Reorder Raised';
  return available <= row.reorderLevel ? 'Low Stock' : 'In Stock';
};

/** The balance divided by the daily burn over the session. */
export const daysOfCoverOf = (row: StockItem): number => {
  const available = availableOf(row);
  if (available <= 0 || row.issued <= 0) return 0;
  return Math.floor((available * SESSION_DAYS) / row.issued);
};

export const daysAgoOf = (row: StockItem): number =>
  Math.max(0, daysBetween(row.lastUpdated, REGISTER_DATE));

/** "3 days ago" / "1 day ago". */
export const daysAgoLabelOf = (row: StockItem): string => {
  const days = daysAgoOf(row);
  return days === 1 ? '1 day ago' : `${days} days ago`;
};

/** "145 reams" / "1 ream". */
export const unitLabel = (count: number, unit: string): string =>
  `${qty(count)} ${unit}${count === 1 ? '' : 's'}`;

export const availableLabelOf = (row: StockItem): string =>
  unitLabel(availableOf(row), row.unit);

/** "18 days cover". */
export const coverLabelOf = (row: StockItem): string => `${daysOfCoverOf(row)} days cover`;

/** "order 600" — the second line under the reorder level. */
export const reorderLabelOf = (row: StockItem): string => `order ${qty(row.reorderQty)}`;

/** "SUP-2019-004 · 7 days lead". */
export const supplierLineOf = (row: StockItem): string =>
  `${row.supplierCode} · ${row.leadTime} days lead`;

export const signed = (value: number): string => `${value > 0 ? '+' : ''}${qty(value)}`;

export interface Pair {
  label: string;
  value: string;
}

export const itemPairsOf = (row: StockItem): Pair[] => [
  { label: 'Item Code', value: row.id },
  { label: 'Pack Size', value: row.packSize },
  { label: 'Category', value: row.category },
  { label: 'Unit Price', value: money(row.unitPrice) },
  { label: 'Batch', value: row.batches[0]?.code ?? 'Not tracked' },
];

/** The movement card, ending on the balance those movements produce. */
export const stockPairsOf = (row: StockItem): Pair[] => [
  { label: 'Opening Balance', value: qty(row.openingBalance) },
  { label: 'Received', value: signed(row.received) },
  { label: 'Issued', value: `-${qty(row.issued)}` },
  { label: 'Transferred In', value: signed(row.transferredIn) },
  { label: 'Transferred Out', value: `-${qty(row.transferredOut)}` },
  { label: 'Adjustments', value: `-${qty(Math.abs(row.adjustments))}` },
  { label: 'Available Quantity', value: qty(availableOf(row)) },
  { label: 'Stock Value', value: money(stockValueOf(row)) },
];

export const supplierPairsOf = (row: StockItem): Pair[] => [
  { label: 'Supplier', value: row.supplier },
  { label: 'Supplier Code', value: row.supplierCode },
  { label: 'Contact', value: row.supplierContact },
  { label: 'Lead Time', value: `${row.leadTime} days` },
  { label: 'Rating', value: row.supplierRating },
];

export const storagePairsOf = (row: StockItem): Pair[] => [
  { label: 'Warehouse', value: row.warehouse },
  { label: 'Location', value: row.location },
  { label: 'Reorder Level', value: qty(row.reorderLevel) },
  { label: 'Reorder Quantity', value: qty(row.reorderQty) },
  { label: 'Days of Cover', value: `${daysOfCoverOf(row)} days` },
];

/** The panel's reorder card. */
export const reorderPairsOf = (row: StockItem): Pair[] => [
  { label: 'Reorder Level', value: unitLabel(row.reorderLevel, row.unit) },
  { label: 'Reorder Quantity', value: unitLabel(row.reorderQty, row.unit) },
  { label: 'Days of Cover', value: `${daysOfCoverOf(row)} days` },
  { label: 'Open Order', value: row.openOrder || 'None' },
];

export const panelItemPairsOf = (row: StockItem): Pair[] => [
  { label: 'Category', value: row.category },
  { label: 'Unit Price', value: money(row.unitPrice) },
  { label: 'Available', value: availableLabelOf(row) },
  { label: 'Stock Value', value: money(stockValueOf(row)) },
];

export const purchaseTotalOf = (order: PurchaseOrder): number =>
  Number((order.qty * order.price).toFixed(2));

/** "Purchased · 500 units $1,600.00" — the line under the order list. */
export const purchaseSummaryOf = (row: StockItem): { units: number; total: number } => ({
  units: row.purchases.reduce((total, order) => total + order.qty, 0),
  total: Number(row.purchases.reduce((total, order) => total + purchaseTotalOf(order), 0).toFixed(2)),
});

/** The batch table: the current batch holds the balance, older ones are spent. */
export const batchRowsOf = (row: StockItem): { code: string; qty: number; receivedOn: string }[] =>
  row.batches.map((batch, index) => ({
    code: batch.code,
    qty: index === 0 ? availableOf(row) : 0,
    receivedOn: batch.receivedOn,
  }));

export const transfersOf = (row: StockItem): Movement[] =>
  row.movements.filter((entry) => entry.kind === 'transfer-in' || entry.kind === 'transfer-out');

/** Most recent first — the three the expander and the panel print. */
export const recentMovementsOf = (row: StockItem): Movement[] =>
  [...row.movements].sort((a, b) => dateKey(b.date) - dateKey(a.date)).slice(0, 3);

export const movementIcon: Record<MovementKind, string> = {
  receipt: 'ti ti-package-import',
  issue: 'ti ti-package-export',
  'transfer-in': 'ti ti-arrow-down-left',
  'transfer-out': 'ti ti-arrow-up-right',
  adjustment: 'ti ti-adjustments',
};

export interface LedgerRow {
  date: string;
  reference: string;
  movement: string;
  qty: number | null;
  balance: number;
}

/**
 * The Stock History dialog's ledger: the opening balance run through every
 * recorded movement, oldest first. Where the recorded movements do not account
 * for the whole session — the template only spells them all out for the A4
 * paper — one balancing line closes the gap so the ledger ends on the balance
 * the grid shows.
 */
export const ledgerOf = (row: StockItem): LedgerRow[] => {
  const ordered = [...row.movements].sort((a, b) => dateKey(a.date) - dateKey(b.date));
  let balance = row.openingBalance;
  const entries: LedgerRow[] = [
    {
      date: '1 Apr 2026', reference: 'Opening balance', movement: 'Carried forward',
      qty: null, balance,
    },
  ];
  ordered.forEach((entry) => {
    balance += entry.qty;
    entries.push({
      date: entry.date, reference: entry.reference, movement: entry.title,
      qty: entry.qty, balance,
    });
  });
  const gap = availableOf(row) - balance;
  if (gap !== 0) {
    entries.push({
      date: REGISTER_DATE, reference: 'ISS-2026-SUM',
      movement: gap < 0 ? 'Other issues in the session' : 'Other receipts in the session',
      qty: gap, balance: availableOf(row),
    });
  }
  return entries;
};

/** The observation every row carries, read off its own reorder position. */
export const reorderObservationOf = (row: StockItem): { title: string; meta: string } => {
  const available = availableOf(row);
  if (row.openOrder) {
    return {
      title: `Reorder raised at ${unitLabel(available, row.unit)} against a level of ${qty(row.reorderLevel)}`,
      meta: `${unitLabel(row.reorderQty, row.unit)} on order with a ${row.leadTime} day lead time`,
    };
  }
  if (available <= row.reorderLevel) {
    return {
      title: `Balance at ${unitLabel(available, row.unit)} against a level of ${qty(row.reorderLevel)}`,
      meta: `No order open — the ${row.leadTime} day lead time starts once the indent goes out`,
    };
  }
  return {
    title: `${unitLabel(available, row.unit)} in hand · ${daysOfCoverOf(row)} days of cover`,
    meta: `Comfortably above the reorder level of ${qty(row.reorderLevel)}`,
  };
};

export interface AuditEntry {
  icon: string;
  tint: string;
  title: string;
  meta: string;
}

/** The panel's audit trail, built from the item's own history. */
export const auditOf = (row: StockItem): AuditEntry[] => [
  {
    icon: 'ti ti-plus', tint: 'primary',
    title: 'Item created on the stock register', meta: `${row.createdOn} · Store Office`,
  },
  {
    icon: 'ti ti-edit', tint: 'info',
    title: `Reorder level raised from ${qty(row.previousReorderLevel)} to ${qty(row.reorderLevel)}`,
    meta: `${row.reorderChangedOn} · Store Manager`,
  },
  {
    icon: 'ti ti-checks', tint: 'success',
    title: 'Physical count matched the ledger', meta: '31 Mar 2026 · annual stock take',
  },
];

/* --------------------------------- Filters ---------------------------------- */

export const valueBandOf = (row: StockItem): string => {
  const value = stockValueOf(row);
  if (value < 500) return 'Under $500';
  if (value <= 1000) return '$500 – $1,000';
  if (value <= 2500) return '$1,000 – $2,500';
  return 'Above $2,500';
};

/** Fast moving turns over more than its balance in the session. */
export const movementBandOf = (row: StockItem): string => {
  if (row.movements.length === 0) return 'No movement this session';
  if (transfersOf(row).length > 0) return 'Transferred this session';
  return row.issued > availableOf(row) ? 'Fast moving' : 'Slow moving';
};

/** Transferred and moving overlap, so this is a predicate rather than a band. */
export const matchesMovement = (row: StockItem, band: string): boolean => {
  switch (band) {
    case 'Fast moving': return row.issued > availableOf(row);
    case 'Slow moving': return row.issued > 0 && row.issued <= availableOf(row);
    case 'No movement this session': return row.movements.length === 0;
    case 'Transferred this session': return transfersOf(row).length > 0;
    default: return true;
  }
};

export const searchIndexOf = (row: StockItem): string =>
  [
    row.id, row.name, row.packSize, row.category, row.warehouse, row.location,
    row.supplier, row.supplierCode, statusOf(row), row.openOrder,
    row.batches.map((batch) => batch.code).join(' '),
  ]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole register — 486 items across six stores against the
 * eight this page lists — so the template's figures stand and the roster moves
 * them.
 */
export const SUMMARY_TOTALS = {
  total: 486,
  stores: 'across 6 stores',
  inStock: 402,
  lowStock: 57,
  outOfStock: 27,
  reorder: 71,
  openOrders: 13,
};

export const VIEW_TOTALS = {
  all: 486,
  lowStock: 57,
  outOfStock: 27,
  reorder: 71,
  mainStore: 218,
};

/**
 * The template renders one committed chip, "Academic Year: 2026 / 2027", but the
 * filter panel has no Academic Year field. The two fields it does pre-fill are
 * the update window — 01 Apr to 31 Jul 2026 — so those open committed here, and
 * Reset clears them.
 */
export const UPDATED_FROM = '01-04-2026';
export const UPDATED_TO = '31-07-2026';

/* ---------------------------------- Rows ------------------------------------ */

export const stock: StockItem[] = [
  {
    id: 'STK-1001', name: 'A4 Copier Paper', icon: 'ti ti-file-stack', tint: 'primary',
    packSize: 'Ream of 500 sheets', unit: 'ream', category: 'Stationery',
    warehouse: 'Main Store', location: 'Admin Block · Rack A2 · Bin 07',
    supplier: 'Global Paper Mills', supplierCode: 'SUP-2019-004',
    supplierContact: '+1 55 2240 6611', leadTime: 7, supplierRating: 'A · on time 96%',
    openingBalance: 620, received: 500, issued: 940,
    transferredIn: 0, transferredOut: 30, adjustments: -5,
    reorderLevel: 200, reorderQty: 600, openOrder: 'PO-2026-0188',
    unitPrice: 3.2, lastUpdated: '28 Jul 2026',
    // The one item whose ledger the template spells out in full.
    movements: [
      { date: '19 May 2026', reference: 'TRF-2026-0091', title: 'Transfer to Science Store', kind: 'transfer-out', qty: -30 },
      { date: '12 Jun 2026', reference: 'GRN-2026-0233', title: 'Goods received · PO-2026-0188', kind: 'receipt', qty: 500 },
      { date: '26 Jun 2026', reference: 'ISS-2026-0388', title: 'Issued to Class Departments', kind: 'issue', qty: -780 },
      { date: '9 Jul 2026', reference: 'ADJ-2026-0067', title: 'Damp damage written off', kind: 'adjustment', qty: -5 },
      { date: '14 Jul 2026', reference: 'ISS-2026-0404', title: 'Issued to Examination Cell', kind: 'issue', qty: -120 },
      { date: '28 Jul 2026', reference: 'ISS-2026-0421', title: 'Issued to Admin Office', kind: 'issue', qty: -40 },
    ],
    purchases: [{ id: 'PO-2026-0188', date: '12 Jun 2026', qty: 500, price: 3.2 }],
    batches: [
      { code: 'LOT-GP-2606', receivedOn: '12 Jun 2026' },
      { code: 'LOT-GP-2604', receivedOn: '20 Apr 2026' },
      { code: 'LOT-GP-2512', receivedOn: '03 Dec 2025' },
    ],
    adjustmentNote: '5 reams written off after damp damage in Rack A2 on 09 Jul 2026.',
    notes: 'Examination season pushes usage well above the yearly average. A follow-on order is open with the supplier.',
    createdOn: '14 Mar 2019', previousReorderLevel: 150, reorderChangedOn: '02 Jun 2026',
    observations: [
      {
        title: 'One session issue accounts for most of the movement',
        meta: '780 of the 940 reams went out to class departments on 26 Jun 2026',
      },
    ],
  },
  {
    id: 'STK-1014', name: 'Whiteboard Marker', icon: 'ti ti-pencil', tint: 'primary',
    packSize: 'Box of 10 markers', unit: 'box', category: 'Stationery',
    warehouse: 'Main Store', location: 'Admin Block · Rack A4 · Bin 02',
    supplier: 'ClassEdge Supplies', supplierCode: 'SUP-2021-017',
    supplierContact: '+1 55 6614 9082', leadTime: 10, supplierRating: 'A · on time 94%',
    openingBalance: 60, received: 120, issued: 82,
    transferredIn: 0, transferredOut: 0, adjustments: -2,
    reorderLevel: 40, reorderQty: 150, openOrder: '',
    unitPrice: 8.5, lastUpdated: '24 Jul 2026',
    movements: [
      { date: '18 Apr 2026', reference: 'ISS-2026-0212', title: 'Issued to Class Teachers · Term I', kind: 'issue', qty: -37 },
      { date: '2 Jul 2026', reference: 'GRN-2026-0248', title: 'Goods received · PO-2026-0201', kind: 'receipt', qty: 120 },
      { date: '2 Jul 2026', reference: 'ADJ-2026-0061', title: 'Dried out on receipt · supplier claim', kind: 'adjustment', qty: -2 },
      { date: '24 Jul 2026', reference: 'ISS-2026-0416', title: 'Issued to Class Teachers · Term II', kind: 'issue', qty: -45 },
    ],
    purchases: [{ id: 'PO-2026-0201', date: '2 Jul 2026', qty: 120, price: 8.5 }],
    batches: [
      { code: 'LOT-CE-2607', receivedOn: '02 Jul 2026' },
      { code: 'LOT-CE-2601', receivedOn: '15 Jan 2026' },
    ],
    adjustmentNote: '2 boxes found dried out on receipt and written off against the supplier claim.',
    notes: 'Stock is comfortable through Term II. The next indent is due with the November teaching plan.',
    createdOn: '09 Aug 2021', previousReorderLevel: 30, reorderChangedOn: '11 Apr 2026',
    observations: [],
  },
  {
    id: 'STK-1022', name: 'Laboratory Glassware Set', icon: 'ti ti-flask', tint: 'info',
    packSize: 'Set of 12 pieces', unit: 'set', category: 'Lab Consumables',
    warehouse: 'Science Store', location: 'Science Block · Cabinet S1 · Shelf 3',
    supplier: 'OptiLab Instruments', supplierCode: 'SUP-2020-009',
    supplierContact: '+1 55 7708 3325', leadTime: 21, supplierRating: 'B · on time 82%',
    openingBalance: 40, received: 0, issued: 24,
    transferredIn: 4, transferredOut: 0, adjustments: -2,
    reorderLevel: 25, reorderQty: 40, openOrder: '',
    unitPrice: 46, lastUpdated: '19 Jul 2026',
    movements: [
      { date: '19 May 2026', reference: 'TRF-2026-0091', title: 'Transferred in from Main Store', kind: 'transfer-in', qty: 4 },
      { date: '2 Jul 2026', reference: 'ADJ-2026-0064', title: 'Breakage written off after Term II', kind: 'adjustment', qty: -2 },
      { date: '19 Jul 2026', reference: 'ISS-2026-0412', title: 'Issued to Lab 1 · Class VI A practicals', kind: 'issue', qty: -9 },
    ],
    purchases: [],
    batches: [
      { code: 'LOT-OL-2504', receivedOn: '18 Apr 2025' },
      { code: 'LOT-OL-2401', receivedOn: '22 Jan 2024' },
    ],
    adjustmentNote: '2 sets written off after breakage during the Term II practical block.',
    notes: 'Below the minimum level. The 21 day lead time means the indent has to go out before the September practicals.',
    createdOn: '22 Jan 2020', previousReorderLevel: 20, reorderChangedOn: '05 May 2026',
    observations: [],
  },
  {
    id: 'STK-1035', name: 'Student Exercise Book', icon: 'ti ti-book', tint: 'success',
    packSize: '192 pages · ruled', unit: 'book', category: 'Academic Supplies',
    warehouse: 'Main Store', location: 'Admin Block · Rack B1 · Bin 01',
    supplier: 'Global Paper Mills', supplierCode: 'SUP-2019-004',
    supplierContact: '+1 55 2240 6611', leadTime: 14, supplierRating: 'A · on time 96%',
    openingBalance: 1150, received: 3000, issued: 1780,
    transferredIn: 0, transferredOut: 25, adjustments: -5,
    reorderLevel: 800, reorderQty: 3000, openOrder: '',
    unitPrice: 1.15, lastUpdated: '27 Jul 2026',
    movements: [
      { date: '20 Apr 2026', reference: 'GRN-2026-0201', title: 'Goods received · PO-2026-0164', kind: 'receipt', qty: 3000 },
      { date: '8 Jun 2026', reference: 'TRF-2026-0104', title: 'Transfer to Hostel Store', kind: 'transfer-out', qty: -25 },
      { date: '11 Jun 2026', reference: 'ISS-2026-0354', title: 'Issued at session opening', kind: 'issue', qty: -1160 },
      { date: '27 Jul 2026', reference: 'ISS-2026-0419', title: 'Issued to Class VI to VIII', kind: 'issue', qty: -620 },
    ],
    purchases: [{ id: 'PO-2026-0164', date: '20 Apr 2026', qty: 3000, price: 1.15 }],
    batches: [
      { code: 'LOT-GP-2604', receivedOn: '20 Apr 2026' },
      { code: 'LOT-GP-2510', receivedOn: '12 Oct 2025' },
    ],
    adjustmentNote: '5 books written off after water damage during the June delivery.',
    notes: 'Bulk buy covers the full session. The next indent is planned for March, ahead of the new academic year.',
    createdOn: '03 Apr 2018', previousReorderLevel: 600, reorderChangedOn: '18 Apr 2026',
    observations: [],
  },
  {
    id: 'STK-1041', name: 'Toner Cartridge IR-2625', icon: 'ti ti-printer', tint: 'purple',
    packSize: 'Single cartridge', unit: 'cartridge', category: 'IT Consumables',
    warehouse: 'IT Store', location: 'Main Block · Cabinet IT2 · Shelf 1',
    supplier: 'CanonPro Office Solutions', supplierCode: 'SUP-2021-022',
    supplierContact: '+1 55 6642 1109', leadTime: 5, supplierRating: 'B · on time 88%',
    openingBalance: 4, received: 6, issued: 9,
    transferredIn: 0, transferredOut: 0, adjustments: -1,
    reorderLevel: 6, reorderQty: 12, openOrder: '',
    unitPrice: 78, lastUpdated: '29 Jul 2026',
    movements: [
      { date: '6 Apr 2026', reference: 'GRN-2026-0188', title: 'Goods received · PO-2026-0143', kind: 'receipt', qty: 6 },
      { date: '16 Jun 2026', reference: 'ADJ-2026-0058', title: 'Faulty cartridge returned to the supplier', kind: 'adjustment', qty: -1 },
      { date: '29 Jul 2026', reference: 'ISS-2026-0423', title: 'Issued to the Library photocopier', kind: 'issue', qty: -1 },
    ],
    purchases: [{ id: 'PO-2026-0143', date: '6 Apr 2026', qty: 6, price: 78 }],
    batches: [{ code: 'LOT-CP-2604', receivedOn: '06 Apr 2026' }],
    adjustmentNote: '1 cartridge returned to CanonPro as faulty on receipt and credited in full.',
    notes: 'Nil balance. The library photocopier is out of service on DMG-2026-0044, so demand is on hold pending the repair decision.',
    createdOn: '17 Jun 2021', previousReorderLevel: 4, reorderChangedOn: '20 Mar 2026',
    observations: [],
  },
  {
    id: 'STK-1057', name: 'Hostel Bed Linen Set', icon: 'ti ti-bed', tint: 'secondary',
    packSize: 'Sheet, pillow cover, blanket', unit: 'set', category: 'Housekeeping',
    warehouse: 'Hostel Store', location: 'Everest Hostel · Block A · Store 1',
    supplier: 'LinenCare Textiles', supplierCode: 'SUP-2022-031',
    supplierContact: '+1 55 3318 7740', leadTime: 12, supplierRating: 'A · on time 92%',
    openingBalance: 40, received: 60, issued: 34,
    transferredIn: 0, transferredOut: 0, adjustments: -4,
    reorderLevel: 60, reorderQty: 80, openOrder: '',
    unitPrice: 22, lastUpdated: '22 Jul 2026',
    movements: [
      { date: '26 May 2026', reference: 'GRN-2026-0221', title: 'Goods received · PO-2026-0176', kind: 'receipt', qty: 60 },
      { date: '30 Jun 2026', reference: 'ADJ-2026-0059', title: 'Condemned after the annual linen audit', kind: 'adjustment', qty: -4 },
      { date: '22 Jul 2026', reference: 'ISS-2026-0414', title: 'Issued to Block B on new admissions', kind: 'issue', qty: -18 },
    ],
    purchases: [{ id: 'PO-2026-0176', date: '26 May 2026', qty: 60, price: 22 }],
    batches: [
      { code: 'LOT-LC-2605', receivedOn: '26 May 2026' },
      { code: 'LOT-LC-2411', receivedOn: '08 Nov 2024' },
    ],
    adjustmentNote: '4 sets condemned at the annual linen audit on 30 Jun 2026.',
    notes: 'Just above the minimum level. The hostel waiting list will pull this under before the October intake.',
    createdOn: '11 Nov 2022', previousReorderLevel: 50, reorderChangedOn: '26 May 2026',
    observations: [],
  },
  {
    id: 'STK-1063', name: 'Cafeteria Cooking Oil', icon: 'ti ti-bottle', tint: 'warning',
    packSize: '5 litre can', unit: 'can', category: 'Cafeteria',
    warehouse: 'Kitchen Store', location: 'Main Block · Dry Store · Rack K1',
    supplier: 'FreshLine Foods', supplierCode: 'SUP-2023-008',
    supplierContact: '+1 55 9925 4417', leadTime: 4, supplierRating: 'A · on time 98%',
    openingBalance: 36, received: 48, issued: 58,
    transferredIn: 0, transferredOut: 0, adjustments: -2,
    reorderLevel: 30, reorderQty: 60, openOrder: 'PO-2026-0212',
    unitPrice: 16.5, lastUpdated: '30 Jul 2026',
    movements: [
      { date: '2 Jun 2026', reference: 'ISS-2026-0341', title: 'Issued to the main kitchen', kind: 'issue', qty: -16 },
      { date: '24 Jun 2026', reference: 'GRN-2026-0239', title: 'Goods received · PO-2026-0195', kind: 'receipt', qty: 48 },
      { date: '17 Jul 2026', reference: 'ADJ-2026-0069', title: 'Leakage in the dry store written off', kind: 'adjustment', qty: -2 },
      { date: '30 Jul 2026', reference: 'ISS-2026-0424', title: 'Issued to the main kitchen', kind: 'issue', qty: -14 },
    ],
    purchases: [{ id: 'PO-2026-0195', date: '24 Jun 2026', qty: 48, price: 16.5 }],
    batches: [
      { code: 'LOT-FL-2606', receivedOn: '24 Jun 2026' },
      { code: 'LOT-FL-2604', receivedOn: '09 Apr 2026' },
    ],
    adjustmentNote: '2 cans written off after leakage in the dry store on 17 Jul 2026.',
    notes: 'Fast moving. The 4 day lead time keeps the buffer small, so the replenishment order runs weekly.',
    createdOn: '05 Feb 2023', previousReorderLevel: 24, reorderChangedOn: '12 Jun 2026',
    observations: [],
  },
  {
    id: 'STK-1078', name: 'First Aid Refill Kit', icon: 'ti ti-first-aid-kit', tint: 'danger',
    packSize: 'Standard refill pack', unit: 'kit', category: 'Medical',
    warehouse: 'Medical Store', location: 'Main Block · Medical Room · Cabinet M1',
    supplier: 'MediServe Supplies', supplierCode: 'SUP-2022-014',
    supplierContact: '+1 55 4471 2208', leadTime: 15, supplierRating: 'B · on time 86%',
    openingBalance: 12, received: 12, issued: 14,
    transferredIn: 0, transferredOut: 0, adjustments: -1,
    reorderLevel: 10, reorderQty: 24, openOrder: '',
    unitPrice: 34, lastUpdated: '26 Jul 2026',
    movements: [
      { date: '2 Jun 2026', reference: 'GRN-2026-0231', title: 'Goods received · PO-2026-0182', kind: 'receipt', qty: 12 },
      { date: '11 Jul 2026', reference: 'ADJ-2026-0068', title: 'Expired pack withdrawn from the medical room', kind: 'adjustment', qty: -1 },
      { date: '26 Jul 2026', reference: 'ISS-2026-0418', title: 'Issued to the Sports Ground first aid post', kind: 'issue', qty: -4 },
    ],
    purchases: [{ id: 'PO-2026-0182', date: '2 Jun 2026', qty: 12, price: 34 }],
    batches: [
      { code: 'LOT-MS-2606', receivedOn: '02 Jun 2026' },
      { code: 'LOT-MS-2512', receivedOn: '14 Dec 2025' },
    ],
    adjustmentNote: '1 pack withdrawn on 11 Jul 2026 after passing its expiry date.',
    notes: 'At the minimum level with a 15 day lead time. The indent has been raised with the school nurse for approval.',
    createdOn: '30 Jun 2022', previousReorderLevel: 8, reorderChangedOn: '02 Jun 2026',
    observations: [],
  },
];
