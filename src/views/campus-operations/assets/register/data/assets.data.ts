export type AssetStatus = 'In Use' | 'Under Maintenance' | 'Available' | 'Retired';

export type Condition = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export type Category =
  | 'IT Equipment' | 'Lab Equipment' | 'Furniture' | 'Vehicle'
  | 'Office Equipment' | 'Kitchen Equipment' | 'Sports Equipment';

export type Department =
  | 'Academic' | 'Science' | 'Administration' | 'Library' | 'Hostel' | 'Transport' | 'Cafeteria';

/** Whoever holds the asset: a named person, or a plain line when nobody does. */
export interface Holder {
  name: string;
  avatar: string;
  meta: string;
}

export interface HistoryEntry {
  title: string;
  meta: string;
}

export interface AssetDocument {
  name: string;
  meta: string;
}

export interface Asset {
  id: string;
  name: string;
  /** Tabler icon for the name cell; the tint follows the category. */
  icon: string;
  model: string;
  /** How many physical items the row covers — "20 units" on a lot. */
  units: number;
  serial: string;
  category: Category;
  department: Department;
  /** Named holder, or `null` when the row prints a plain line instead. */
  holder: Holder | null;
  /** "Transport Department", "Not allocated", "Withdrawn from service". */
  holderLabel: string;
  location: string;
  /** "Room 204", "Bay 3", "Block A · Store". */
  spot: string;
  /** "01 Apr 2023" — every asset in the register is bought on 01 April. */
  purchaseDate: string;
  purchaseValue: number;
  /** Years of useful life; the depreciation schedule follows from it. */
  usefulLife: number;
  condition: Condition;
  status: AssetStatus;

  /** "31 Mar 2028" — the warranty's own expiry. */
  warrantyUntil: string;
  /** What the warranty covers, without the year count: "on-site". */
  warrantyTerm: string;
  warrantyCover: string;
  warrantyClaims: string;

  vendor: string;
  vendorContact: string;
  vendorMobile: string;
  poNumber: string;
  paymentTerms: string;

  assignments: HistoryEntry[];
  maintenance: HistoryEntry[];
  documents: AssetDocument[];
  notes: string;

  /** The panel's tag block. */
  tagPrinted: string;
  lastScanned: string;
  /** What the panel calls the next service. */
  nextService: string;
}

/* --------------------------------- Tints ----------------------------------- */

export const categoryTint: Record<Category, string> = {
  'IT Equipment': 'primary',
  'Lab Equipment': 'info',
  Furniture: 'purple',
  Vehicle: 'warning',
  'Office Equipment': 'secondary',
  'Kitchen Equipment': 'success',
  // No row carries one; the filter panel offers it, so it needs a tint.
  'Sports Equipment': 'danger',
};

export const departmentTint: Record<Department, string> = {
  Academic: 'primary',
  Science: 'info',
  Administration: 'secondary',
  Library: 'info',
  Hostel: 'purple',
  Transport: 'warning',
  Cafeteria: 'success',
};

export const conditionTint: Record<Condition, string> = {
  Excellent: 'success',
  Good: 'primary',
  Fair: 'warning',
  Poor: 'danger',
};

export const statusPill: Record<AssetStatus, string> = {
  'In Use': 'is-active',
  'Under Maintenance': 'is-review',
  Available: 'is-pending',
  Retired: 'is-archived',
};

export const statusBadge: Record<AssetStatus, string> = {
  'In Use': 'badge badge-soft-success',
  'Under Maintenance': 'badge badge-soft-warning',
  Available: 'badge badge-soft-info',
  Retired: 'badge badge-soft-secondary',
};

/* ------------------------------ Filter options ------------------------------ */

export const categoryOptions: Category[] = [
  'IT Equipment', 'Lab Equipment', 'Furniture', 'Vehicle',
  'Office Equipment', 'Kitchen Equipment', 'Sports Equipment',
];

export const departmentOptions: Department[] = [
  'Academic', 'Science', 'Administration', 'Library', 'Hostel', 'Transport', 'Cafeteria',
];

export const locationOptions = [
  'Main Block', 'Science Block', 'Library', 'Nightingale Hostel', 'Everest Hostel', 'Transport Yard',
];

export const statusOptions: AssetStatus[] = ['In Use', 'Under Maintenance', 'Available', 'Retired'];

export const conditionOptions: Condition[] = ['Excellent', 'Good', 'Fair', 'Poor'];

export const warrantyOptions = ['In warranty', 'Expiring within 90 days', 'Expired'];

export const valueOptions = [
  'Under $1,000', '$1,000 – $5,000', '$5,000 – $25,000', 'Over $25,000',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const methodOptions = ['Straight line', 'Reducing balance', 'No depreciation'];

export const assigneeOptions = [
  'Mrs. Alice Ray · Chief Warden',
  'Mr. David Kim · Warden',
  'Ms. Priya Raman · Assistant Warden',
  'Ms. Carla Mendes · Assistant Warden',
];

export const destinationOptions = [
  'Nightingale Hostel · Block C', 'Everest Hostel · Block A', 'Main Block · Store',
];

export const holderOptions = [
  'Mr. David Kim · Warden', 'Ms. Priya Raman · Assistant Warden', 'Unassigned · hold in store',
];

export const newLocationOptions = [
  'Everest Hostel · Warden Office', 'Nightingale Hostel · Warden Office', 'Main Block · Store',
];

export const transferReasonOptions = [
  'Role change', 'Department restructure', 'Equipment rebalancing', 'Replacement issued',
];

export const maintenanceTypeOptions = [
  'Scheduled service', 'Preventive inspection', 'Breakdown repair', 'Calibration', 'Safety audit',
];

export const priorityOptions = ['Normal', 'High', 'Critical'];

export const providerOptions = [
  'In-house estates team', 'Approved third party', 'Original vendor',
];

export const retireReasonOptions = [
  'Beyond economic repair', 'End of useful life', 'Replaced by a new asset', 'Lost or stolen', 'Damaged',
];

export const disposalOptions = [
  'Approved recycler', 'Sold as scrap', 'Returned to vendor', 'Donated', 'Held pending disposal',
];

export const approverOptions = ['Estates Manager', 'Finance Controller', 'School Principal'];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

/** Whole dollars, the way the register prints them. */
export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

export const money2 = (value: number): string =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** "ViewPro VB-750 · 1 unit" — the line under the asset name. */
export const modelLineOf = (row: Asset): string =>
  `${row.model} · ${row.units} ${row.units === 1 ? 'unit' : 'units'}`;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "01 Apr 2023" dates. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/** The register's own date — the day the template was captured. */
export const REGISTER_DATE = '31 Jul 2026';

/** The book year the depreciation schedule closes at. */
export const BOOK_YEAR_END = '31 Mar 2026';

/** Straight line: the purchase value spread over the useful life. */
export const annualChargeOf = (row: Asset): number =>
  Number((row.purchaseValue / row.usefulLife).toFixed(2));

/** Closed book years between the purchase and 31 Mar 2026. */
export const yearsHeldOf = (row: Asset): number => {
  const purchased = Number(row.purchaseDate.split(' ')[2]);
  return Math.max(0, Math.min(row.usefulLife, 2026 - purchased));
};

/** Never more than the asset cost, which is what caps a fully written-off lot. */
export const accumulatedOf = (row: Asset): number =>
  Number(Math.min(row.purchaseValue, annualChargeOf(row) * yearsHeldOf(row)).toFixed(2));

export const bookValueOf = (row: Asset): number =>
  Number((row.purchaseValue - accumulatedOf(row)).toFixed(2));

/** "3 years" / "1 year" — the accumulated line's own suffix. */
export const yearsLabelOf = (row: Asset): string => {
  const years = yearsHeldOf(row);
  return `${years} ${years === 1 ? 'year' : 'years'}`;
};

export const isFullyDepreciated = (row: Asset): boolean => bookValueOf(row) === 0;

/** The warranty's length, read off the purchase and expiry years. */
export const warrantyYearsOf = (row: Asset): number =>
  Math.max(0, Number(row.warrantyUntil.split(' ')[2]) - Number(row.purchaseDate.split(' ')[2]));

/** "5 years on-site" — the years plus the stored qualifier. */
export const warrantyLabelOf = (row: Asset): string =>
  `${warrantyYearsOf(row)} years ${row.warrantyTerm}`;

export type WarrantyState = 'In warranty' | 'Expiring within 90 days' | 'Expired';

/** Ninety days before 31 Jul 2026 is 02 May 2026; the bands follow from that. */
export const warrantyStateOf = (row: Asset): WarrantyState => {
  const expiry = dateKey(row.warrantyUntil);
  if (expiry < dateKey(REGISTER_DATE)) return 'Expired';
  return expiry <= dateKey('29 Oct 2026') ? 'Expiring within 90 days' : 'In warranty';
};

/** "31 Mar 2025 · expired" — the panel prints the state after the date. */
export const warrantyUntilLabelOf = (row: Asset): string =>
  warrantyStateOf(row) === 'Expired' ? `${row.warrantyUntil} · expired` : row.warrantyUntil;

/** "Main Block · Room 204" — the line the dialogs and the panel print. */
export const placeOf = (row: Asset): string => `${row.location} · ${row.spot}`;

/** Whoever the row shows in Assigned To, as one line. */
export const holderNameOf = (row: Asset): string => row.holder?.name ?? row.holderLabel;

/** "AST-2026-0142 · VB750-2023-0142". */
export const compactOf = (row: Asset): string => `${row.id} · ${row.serial}`;

export interface Pair {
  label: string;
  value: string;
}

export const informationPairsOf = (row: Asset): Pair[] => [
  { label: 'Asset ID', value: row.id },
  { label: 'Model', value: modelLineOf(row) },
  { label: 'Serial / Lot No', value: row.serial },
  { label: 'Category', value: row.category },
  { label: 'Useful Life', value: `${row.usefulLife} years` },
];

export const warrantyPairsOf = (row: Asset): Pair[] => [
  { label: 'Warranty', value: warrantyLabelOf(row) },
  { label: 'Valid Until', value: warrantyUntilLabelOf(row) },
  { label: 'Cover', value: row.warrantyCover },
  { label: 'Claims Raised', value: row.warrantyClaims },
];

export const vendorPairsOf = (row: Asset): Pair[] => [
  { label: 'Vendor', value: row.vendor },
  { label: 'Contact', value: row.vendorContact },
  { label: 'Mobile', value: row.vendorMobile },
  { label: 'PO Number', value: row.poNumber },
  { label: 'Payment Terms', value: row.paymentTerms },
];

/** The four lines above the panel's book-value rule. */
export const depreciationPairsOf = (row: Asset): Pair[] => [
  { label: 'Purchase Value', value: money(row.purchaseValue) },
  { label: 'Useful Life', value: `${row.usefulLife} years · straight line` },
  { label: 'Annual Depreciation', value: money(annualChargeOf(row)) },
  { label: 'Accumulated', value: `${money(accumulatedOf(row))} · ${yearsLabelOf(row)}` },
];

export const purchasePairsOf = (row: Asset): Pair[] => [
  { label: 'Purchase Date', value: row.purchaseDate },
  { label: 'Purchase Value', value: money(row.purchaseValue) },
  { label: 'Vendor', value: row.vendor },
  { label: 'PO Number', value: row.poNumber },
];

/** The View dialog's schedule block. */
export const schedulePairsOf = (row: Asset): Pair[] => [
  { label: 'Method', value: 'Straight line' },
  { label: 'Useful Life', value: `${row.usefulLife} years` },
  { label: 'Annual Charge', value: money(annualChargeOf(row)) },
  { label: `Book Value at ${BOOK_YEAR_END}`, value: money(bookValueOf(row)) },
];

export const assignmentPairsOf = (row: Asset): Pair[] => [
  { label: 'Serial No', value: row.serial },
  { label: 'Department', value: row.department },
  { label: 'Assigned To', value: holderNameOf(row) },
  { label: 'Condition', value: row.condition },
];

/** The panel's warranty block adds the derived state to the same four lines. */
export const panelWarrantyPairsOf = (row: Asset): Pair[] => [
  { label: 'Cover', value: warrantyLabelOf(row) },
  { label: 'Valid Until', value: row.warrantyUntil },
  { label: 'Claims Raised', value: row.warrantyClaims },
  { label: 'Status', value: warrantyStateOf(row) },
];

/** The panel's tag block, whose number is the asset's own id. */
export const tagOf = (row: Asset): { code: string; meta: string; scanned: string } => ({
  code: `TAG-${row.id}`,
  meta: `Barcode · Code 128 · printed ${row.tagPrinted}`,
  scanned: `Last scanned ${row.lastScanned}`,
});

export interface AuditEntry extends HistoryEntry {
  icon: string;
  tint: string;
}

/**
 * The panel's audit trail. The template opens it with the registration and then
 * repeats the assignment history under transfer icons, so it is built rather
 * than stored — a move reads as a transfer, everything else as an allocation.
 */
export const auditOf = (row: Asset): AuditEntry[] => [
  {
    icon: 'ti ti-plus', tint: 'primary',
    title: 'Asset registered', meta: `${row.purchaseDate} · Estates Office`,
  },
  ...row.assignments.map((entry) => ({
    ...entry,
    icon: /moved|relocat|transfer|withdraw|reassign|changed/i.test(entry.title)
      ? 'ti ti-transfer' : 'ti ti-user-check',
    tint: /withdraw/i.test(entry.title) ? 'danger' : 'success',
  })),
];

/* --------------------------------- Filters ---------------------------------- */

export const valueBandOf = (row: Asset): string => {
  const value = row.purchaseValue;
  if (value < 1000) return 'Under $1,000';
  if (value <= 5000) return '$1,000 – $5,000';
  if (value <= 25000) return '$5,000 – $25,000';
  return 'Over $25,000';
};

export const searchIndexOf = (row: Asset): string =>
  [
    row.id, row.name, row.model, row.serial, row.category, row.department,
    holderNameOf(row), row.location, row.spot, row.status, row.condition, row.vendor, row.poNumber,
  ]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole register — 486 assets against the eight this page
 * lists — so the template's figures stand and the roster moves them.
 */
export const SUMMARY_TOTALS = {
  total: 486,
  bookValue: '$1.24M at book value',
  inUse: 342,
  inUseShare: 70,
  maintenance: 28,
  awaitingParts: 6,
  available: 96,
  retired: 20,
};

/** Saved-view counts the page cannot derive from eight rows. */
export const VIEW_TOTALS = {
  register: 486,
  maintenance: 28,
  warrantyExpired: 63,
  available: 96,
  fullyDepreciated: 41,
};

/**
 * The template renders one committed chip, labelled "Financial Year: 2026 /
 * 2027" — but the filter panel has no Financial Year field, and its result
 * count of 1 matches the one field it does pre-fill: Purchased From, at
 * 01-04-2020. That date is the chip here, so removing it clears the filter it
 * actually stands for.
 */
export const PURCHASED_FROM = '01-04-2020';

/* ---------------------------------- Rows ------------------------------------ */

export const assets: Asset[] = [
  {
    id: 'AST-2026-0142',
    name: 'Interactive Smart Board 75"',
    icon: 'ti ti-device-desktop',
    model: 'ViewPro VB-750', units: 1, serial: 'VB750-2023-0142',
    category: 'IT Equipment', department: 'Academic',
    holder: {
      name: 'Ms. Priya Raman', avatar: 'assets/img/teachers/teacher-06.jpg',
      meta: 'Assistant Warden · EMP-2021-046',
    },
    holderLabel: 'Ms. Priya Raman',
    location: 'Main Block', spot: 'Room 204',
    purchaseDate: '01 Apr 2023', purchaseValue: 4800, usefulLife: 8,
    condition: 'Good', status: 'In Use',
    warrantyUntil: '31 Mar 2028', warrantyTerm: 'on-site',
    warrantyCover: 'Panel, controller and labour', warrantyClaims: '1 · closed',
    vendor: 'ViewPro Systems Ltd', vendorContact: 'Mr. Anand Rao',
    vendorMobile: '+1 546 8548 611', poNumber: 'PO-2023-0088', paymentTerms: 'Net 30',
    assignments: [
      { title: 'Allocated to Ms. Priya Raman', meta: '12 Apr 2023 · Room 204' },
      { title: 'Moved from Room 118 to 204', meta: '04 Jan 2025 · Estates' },
    ],
    maintenance: [
      { title: 'Annual calibration', meta: '18 Mar 2026 · passed' },
      { title: 'Touch layer replaced', meta: '22 Sep 2024 · under warranty' },
    ],
    documents: [
      { name: 'Purchase Invoice.pdf', meta: '01 Apr 2023 · 186 KB' },
      { name: 'Warranty Certificate.pdf', meta: '01 Apr 2023 · 94 KB' },
      { name: 'Calibration Report.pdf', meta: '18 Mar 2026 · 128 KB' },
    ],
    notes: 'Primary teaching display for Room 204. Next calibration due 18 Mar 2027.',
    tagPrinted: '12 Apr 2023', lastScanned: '18 Mar 2026 at Room 204',
    nextService: 'Next calibration due 18 Mar 2027 · annual cycle',
  },
  {
    id: 'AST-2025-0088',
    name: 'Science Lab Microscope Set',
    icon: 'ti ti-microscope',
    model: 'OptiLab M200', units: 20, serial: 'OPT-M200-LOT-0088',
    category: 'Lab Equipment', department: 'Science',
    holder: null, holderLabel: 'Science Department',
    location: 'Science Block', spot: 'Lab 2',
    purchaseDate: '01 Apr 2022', purchaseValue: 3600, usefulLife: 10,
    condition: 'Good', status: 'In Use',
    warrantyUntil: '31 Mar 2025', warrantyTerm: 'parts only',
    warrantyCover: 'Optics and stage', warrantyClaims: 'None',
    vendor: 'OptiLab Instruments', vendorContact: 'Ms. Sheila Menon',
    vendorMobile: '+1 546 8548 612', poNumber: 'PO-2022-0141', paymentTerms: 'Net 45',
    assignments: [
      { title: 'Allocated to the Science Department', meta: '20 Apr 2022 · Lab 2' },
      { title: '4 units loaned to Lab 1', meta: '11 Feb 2026 · returned 27 Feb' },
    ],
    maintenance: [
      { title: 'Lens cleaning and alignment', meta: '09 Jun 2026 · in-house' },
      { title: '2 units repaired', meta: '14 Nov 2025 · out of warranty · $180' },
    ],
    documents: [
      { name: 'Purchase Invoice.pdf', meta: '01 Apr 2022 · 172 KB' },
      { name: 'Lot Serial Register.xlsx', meta: '20 Apr 2022 · 46 KB' },
    ],
    notes: 'Warranty lapsed 31 Mar 2025. Repairs now billed to the science consumables budget.',
    tagPrinted: '20 Apr 2022', lastScanned: '09 Jun 2026 at Lab 2',
    nextService: 'Next lens service due 09 Jun 2027 · annual cycle',
  },
  {
    id: 'AST-2024-0031',
    name: 'School Bus BUS-03',
    icon: 'ti ti-bus',
    model: 'Volvo 9400', units: 52, serial: 'VOL9400-BUS03-2020',
    category: 'Vehicle', department: 'Transport',
    holder: null, holderLabel: 'Transport Department',
    location: 'Transport Yard', spot: 'Bay 3',
    purchaseDate: '01 Apr 2020', purchaseValue: 58000, usefulLife: 10,
    condition: 'Fair', status: 'Under Maintenance',
    warrantyUntil: '31 Mar 2025', warrantyTerm: 'powertrain',
    warrantyCover: 'Engine and gearbox', warrantyClaims: '2 · both settled',
    vendor: 'Volvo Commercial · regional', vendorContact: 'Mr. Kiran Das',
    vendorMobile: '+1 546 8548 613', poNumber: 'PO-2020-0022', paymentTerms: 'Net 60',
    assignments: [
      { title: 'Assigned to Route 3 · Hillside', meta: '15 Apr 2020 · Transport' },
      { title: 'Driver reassigned', meta: '02 Jun 2026 · Transport' },
    ],
    maintenance: [
      { title: 'Scheduled 60,000 km service', meta: '31 Jul 2026 · in progress' },
      { title: 'Brake pads replaced', meta: '18 Apr 2026 · $340' },
    ],
    documents: [
      { name: 'Purchase Invoice.pdf', meta: '01 Apr 2020 · 210 KB' },
      { name: 'Fitness Certificate.pdf', meta: 'Valid to 31 Mar 2027 · 88 KB' },
      { name: 'Insurance Policy.pdf', meta: 'Renewed 01 Apr 2026 · 156 KB' },
    ],
    notes: 'Off the road for the 60,000 km service. Low fuel alert cleared before it entered the workshop.',
    tagPrinted: '15 Apr 2020', lastScanned: '31 Jul 2026 at Transport Yard',
    nextService: '60,000 km service in progress · due back 05 Aug 2026',
  },
  {
    id: 'AST-2026-0155',
    name: 'Dell Latitude 5540 Laptop',
    icon: 'ti ti-device-laptop',
    model: 'Latitude 5540', units: 1, serial: 'DL5540-2025-0155',
    category: 'IT Equipment', department: 'Administration',
    holder: {
      name: 'Mrs. Alice Ray', avatar: 'assets/img/teachers/teacher-01.jpg',
      meta: 'Chief Warden · EMP-2019-014',
    },
    holderLabel: 'Mrs. Alice Ray',
    location: 'Main Block', spot: 'Admin Office',
    purchaseDate: '01 Apr 2025', purchaseValue: 1200, usefulLife: 4,
    condition: 'Excellent', status: 'In Use',
    warrantyUntil: '31 Mar 2028', warrantyTerm: 'next business day',
    warrantyCover: 'Parts, labour and battery', warrantyClaims: 'None',
    vendor: 'Dell Technologies', vendorContact: 'Corporate desk',
    vendorMobile: '+1 546 8548 614', poNumber: 'PO-2025-0204', paymentTerms: 'Net 30',
    assignments: [
      { title: 'Allocated to Mrs. Alice Ray', meta: '08 Apr 2025 · Admin Office' },
    ],
    maintenance: [
      { title: 'Operating system re-image', meta: '05 Jan 2026 · in-house' },
    ],
    documents: [
      { name: 'Purchase Invoice.pdf', meta: '01 Apr 2025 · 164 KB' },
      { name: 'Asset Handover Form.pdf', meta: '08 Apr 2025 · 72 KB' },
    ],
    notes: 'Holds the hostel allocation records. Full-disk encryption enabled at handover.',
    tagPrinted: '08 Apr 2025', lastScanned: '05 Jan 2026 at Admin Office',
    nextService: 'No service scheduled · warranty covers next business day',
  },
  {
    id: 'AST-2026-0161',
    name: 'Hostel Bunk Bed Set',
    icon: 'ti ti-bed',
    model: 'SteelRest BR-2', units: 12, serial: 'SR-BR2-LOT-0161',
    category: 'Furniture', department: 'Hostel',
    holder: null, holderLabel: 'Not allocated',
    location: 'Nightingale Hostel', spot: 'Block A · Store',
    purchaseDate: '01 Apr 2024', purchaseValue: 3000, usefulLife: 12,
    condition: 'Good', status: 'Available',
    warrantyUntil: '31 Mar 2034', warrantyTerm: 'frame',
    warrantyCover: 'Frame and welds · not mattresses', warrantyClaims: 'None',
    vendor: 'SteelRest Furnishings', vendorContact: 'Mr. Joseph Alva',
    vendorMobile: '+1 546 8548 615', poNumber: 'PO-2024-0117', paymentTerms: 'Net 30',
    assignments: [
      { title: 'Received into Block A store', meta: '14 Apr 2024 · Estates' },
      { title: '8 units issued to Block B', meta: '02 Jun 2025 · returned 30 Jun 2026' },
    ],
    maintenance: [
      { title: 'Frame inspection and re-tightening', meta: '28 Jun 2026 · in-house' },
    ],
    documents: [
      { name: 'Purchase Invoice.pdf', meta: '01 Apr 2024 · 158 KB' },
      { name: 'Stock Receipt Note.pdf', meta: '14 Apr 2024 · 64 KB' },
    ],
    notes: 'Spare stock held for the waiting list. Can cover 24 beds once the new wing opens.',
    tagPrinted: '14 Apr 2024', lastScanned: '28 Jun 2026 at Block A store',
    nextService: 'Next frame inspection due 28 Jun 2027 · annual cycle',
  },
  {
    id: 'AST-2023-0019',
    name: 'Library Photocopier',
    icon: 'ti ti-printer',
    model: 'CanonPro IR-2625', units: 1, serial: 'CIR2625-2021-0019',
    category: 'Office Equipment', department: 'Library',
    holder: {
      name: 'Ms. Carla Mendes', avatar: 'assets/img/teachers/teacher-10.jpg',
      meta: 'Assistant Warden · EMP-2024-088',
    },
    holderLabel: 'Ms. Carla Mendes',
    location: 'Library', spot: 'Ground Floor',
    purchaseDate: '01 Apr 2021', purchaseValue: 2400, usefulLife: 6,
    condition: 'Poor', status: 'Under Maintenance',
    warrantyUntil: '31 Mar 2023', warrantyTerm: 'comprehensive',
    warrantyCover: 'Expired · billed per call', warrantyClaims: '3 · all pre-expiry',
    vendor: 'CanonPro Office Solutions', vendorContact: 'Mr. Nitin Shah',
    vendorMobile: '+1 546 8548 616', poNumber: 'PO-2021-0064', paymentTerms: 'Net 30',
    assignments: [
      { title: 'Allocated to the Library', meta: '18 Apr 2021 · Ground Floor' },
      { title: 'Custodian changed', meta: '05 Jul 2026 · Ms. Carla Mendes' },
    ],
    maintenance: [
      { title: 'Drum unit failure', meta: '29 Jul 2026 · awaiting parts' },
      { title: 'Fuser replaced', meta: '17 Feb 2026 · $210' },
    ],
    documents: [
      { name: 'Purchase Invoice.pdf', meta: '01 Apr 2021 · 148 KB' },
      { name: 'Service Call Log.pdf', meta: '29 Jul 2026 · 102 KB' },
    ],
    notes: 'Book value is down to $400 and the drum quote is $260. Replacement recommended over repair.',
    tagPrinted: '18 Apr 2021', lastScanned: '29 Jul 2026 at Library',
    nextService: 'Drum unit on order · awaiting parts since 29 Jul 2026',
  },
  {
    id: 'AST-2026-0170',
    name: 'Commercial Refrigerator',
    icon: 'ti ti-fridge',
    model: 'ColdMax CR-800', units: 1, serial: 'CM-CR800-2025-0170',
    category: 'Kitchen Equipment', department: 'Cafeteria',
    holder: null, holderLabel: 'Cafeteria Department',
    location: 'Main Block', spot: 'Kitchen',
    purchaseDate: '01 Apr 2025', purchaseValue: 2800, usefulLife: 7,
    condition: 'Excellent', status: 'In Use',
    warrantyUntil: '31 Mar 2030', warrantyTerm: 'compressor',
    warrantyCover: 'Compressor and gas', warrantyClaims: 'None',
    vendor: 'ColdMax Refrigeration', vendorContact: 'Ms. Rekha Nair',
    vendorMobile: '+1 546 8548 617', poNumber: 'PO-2025-0219', paymentTerms: 'Net 30',
    assignments: [
      { title: 'Installed in the main kitchen', meta: '11 Apr 2025 · Cafeteria' },
    ],
    maintenance: [
      { title: 'Quarterly temperature audit', meta: '01 Jul 2026 · passed' },
      { title: 'Coil cleaning', meta: '02 Apr 2026 · in-house' },
    ],
    documents: [
      { name: 'Purchase Invoice.pdf', meta: '01 Apr 2025 · 170 KB' },
      { name: 'Temperature Audit.pdf', meta: '01 Jul 2026 · 86 KB' },
      { name: 'Food Safety Clearance.pdf', meta: 'Valid to 31 Mar 2027 · 78 KB' },
    ],
    notes: 'Holds the perishable stock for the daily menu. Temperature logged twice a day by the kitchen.',
    tagPrinted: '11 Apr 2025', lastScanned: '01 Jul 2026 at Main Kitchen',
    nextService: 'Next temperature audit due 01 Oct 2026 · quarterly cycle',
  },
  {
    id: 'AST-2019-0007',
    name: 'Desktop Computer Lot',
    icon: 'ti ti-device-desktop',
    model: 'HP ProDesk 400', units: 15, serial: 'HP-PD400-LOT-0007',
    category: 'IT Equipment', department: 'Academic',
    holder: null, holderLabel: 'Withdrawn from service',
    location: 'Main Block', spot: 'Store · awaiting disposal',
    purchaseDate: '01 Apr 2020', purchaseValue: 9000, usefulLife: 6,
    condition: 'Poor', status: 'Retired',
    warrantyUntil: '31 Mar 2023', warrantyTerm: 'on-site',
    warrantyCover: 'Expired', warrantyClaims: '5 · all pre-expiry',
    vendor: 'HP Inc · education channel', vendorContact: 'Channel partner desk',
    vendorMobile: '+1 546 8548 618', poNumber: 'PO-2020-0009', paymentTerms: 'Net 45',
    assignments: [
      { title: 'Allocated to Computer Lab 1', meta: '20 Apr 2020 · Academic' },
      { title: 'Withdrawn from service', meta: '30 Jun 2026 · Estates' },
    ],
    maintenance: [
      { title: 'Final data wipe certified', meta: '15 Jul 2026 · IT' },
      { title: 'RAM upgrade on 9 units', meta: '08 Aug 2023 · $450' },
    ],
    documents: [
      { name: 'Purchase Invoice.pdf', meta: '01 Apr 2020 · 194 KB' },
      { name: 'Data Wipe Certificate.pdf', meta: '15 Jul 2026 · 110 KB' },
      { name: 'Disposal Approval.pdf', meta: '20 Jul 2026 · 96 KB' },
    ],
    notes: 'Fully depreciated at 31 Mar 2026. E-waste collection scheduled with the approved recycler.',
    tagPrinted: '20 Apr 2020', lastScanned: '15 Jul 2026 at Main Block store',
    nextService: 'No service scheduled · awaiting e-waste collection',
  },
];
