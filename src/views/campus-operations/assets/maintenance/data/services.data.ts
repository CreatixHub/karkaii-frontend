export type ServiceStatus =
  | 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue' | 'Out of Service';

export type MaintenanceType =
  | 'Preventive Maintenance' | 'Inspection' | 'Calibration'
  | 'Repair' | 'Emergency Repair' | 'AMC Service';

export type Category =
  | 'IT Equipment' | 'Lab Equipment' | 'Furniture' | 'Vehicle'
  | 'Office Equipment' | 'Kitchen Equipment' | 'Sports Equipment';

export interface SparePart {
  name: string;
  qty: number;
  price: number;
}

export interface Technician {
  name: string;
  role: string;
  id: string;
  contact: string;
}

/** One service already on the asset's record. */
export interface PastService {
  id: string;
  /** The line the expander's Service History prints. */
  title: string;
  date: string;
  type: string;
  vendor: string;
  /** Null when the work carried no charge — in-house or under warranty. */
  cost: number | null;
  outcome: string;
  /** Extra clause the expander shows, e.g. "optics cleared". */
  note?: string;
}

export interface ServiceRecord {
  id: string;
  assetId: string;
  assetName: string;
  /** Tabler icon for the asset cell, with its own tint. */
  icon: string;
  tint: string;
  model: string;
  category: Category;
  location: string;
  spot: string;
  custodian: string;

  type: MaintenanceType;
  /** "Quarterly road service · safety check". */
  summary: string;
  scheduled: string;
  lastService: string;
  /** Empty when nothing is booked, which is what "Not scheduled" means. */
  nextService: string;

  vendor: string;
  /** "AMC-2024-011 · regional workshop" or "Pay per call · no contract". */
  contract: string;
  technician: Technician;
  specialisation: string;

  labour: number;
  consumables: number;
  callOut: number;
  parts: SparePart[];
  /** Recorded once the invoice lands; drives the variance. */
  actualCost: number | null;

  /** Set once the work is done, which is what makes the record Completed. */
  completedOn: string;
  /** Set while a technician is on site. */
  startedOn: string;
  /** Held open for a decision — this outranks the dates on the status pill. */
  onHold: boolean;
  /** Printed instead of the cycle when nothing is booked. */
  holdReason: string;

  /** The asset's own purchase and cover, for the warranty card. */
  purchasedOn: string;
  purchaseValue: number;
  warrantyUntil: string;
  warrantyTerm: string;
  warrantyNote: string;

  costCentre: string;
  priority: string;
  pastServices: PastService[];
  /** Figures spanning the asset's whole life, not just the listed services. */
  lifetimeServices: number;
  lifetimeSpend: number;
  uptime: string;
  /** Only the bus carries one in the template; the warranty note is derived. */
  observations: { title: string; meta: string }[];
  notes: string;
}

/* --------------------------------- Tints ----------------------------------- */

export const typeBadge: Record<MaintenanceType, string> = {
  'Preventive Maintenance': 'badge badge-soft-success',
  Inspection: 'badge badge-soft-info',
  Calibration: 'badge badge-soft-purple',
  Repair: 'badge badge-soft-warning',
  'Emergency Repair': 'badge badge-soft-danger',
  'AMC Service': 'badge badge-soft-primary',
};

export const statusPill: Record<ServiceStatus, string> = {
  Scheduled: 'is-pending',
  'In Progress': 'is-review',
  Completed: 'is-completed',
  Overdue: 'is-blocked',
  'Out of Service': 'is-suspended',
};

export const statusBadge: Record<ServiceStatus, string> = {
  Scheduled: 'badge badge-soft-warning',
  'In Progress': 'badge badge-soft-info',
  Completed: 'badge badge-soft-success',
  Overdue: 'badge badge-soft-danger',
  'Out of Service': 'badge badge-soft-secondary',
};

/* ------------------------------ Filter options ------------------------------ */

export const categoryOptions: Category[] = [
  'IT Equipment', 'Lab Equipment', 'Furniture', 'Vehicle',
  'Office Equipment', 'Kitchen Equipment', 'Sports Equipment',
];

export const typeOptions: MaintenanceType[] = [
  'Preventive Maintenance', 'Inspection', 'Calibration', 'Repair', 'Emergency Repair', 'AMC Service',
];

export const vendorOptions = [
  'Volvo Commercial Services', 'ColdMax Refrigeration', 'ViewPro Systems Ltd',
  'CanonPro Office Solutions', 'OptiLab Instruments', 'HP Inc · education channel',
  'SteelRest Furnishings', 'Dell Technologies',
];

export const statusOptions: ServiceStatus[] = [
  'Scheduled', 'In Progress', 'Completed', 'Overdue', 'Out of Service',
];

export const warrantyOptions = ['In warranty', 'Expired', 'Expiring within 90 days'];

export const costOptions = ['Under $100', '$100 – $250', '$250 – $500', 'Above $500'];

/* --------------------------- Dialog option lists ----------------------------- */

export const assetChoices = [
  'School Bus BUS-03 · AST-2019-0007',
  'Commercial Refrigerator · AST-2026-0170',
  'Interactive Smart Board 75" · AST-2026-0142',
  'Library Photocopier · AST-2023-0019',
  'Science Lab Microscope Set · AST-2025-0088',
  'Desktop Computer Lot · AST-2024-0031',
  'Hostel Bunk Bed Set · AST-2026-0161',
  'Dell Latitude 5540 Laptop · AST-2026-0155',
];

export const windowOptions = [
  'Full day', 'Morning · before 12:00', 'Afternoon · after 14:00', 'Outside teaching hours',
];

export const cycleOptions = ['Quarterly', 'Half yearly', 'Annual', 'One off'];

export const technicianChoices = [
  'Mr. Rajesh Kumar · TECH-VC-114',
  'Mr. Samuel Ortiz · TECH-CM-032',
  'Ms. Hannah Lee · TECH-VP-078',
  'Mr. Daniel Pierce · TECH-CP-021',
  'Dr. Meera Nair · TECH-OL-009',
  'Mr. Kevin Shaw · TECH-HP-140',
  'Mr. Arun Das · TECH-SR-055',
  'Ms. Nadia Fern · TECH-DL-093',
];

export const specialisationOptions = [
  'Vehicle mechanical', 'Refrigeration', 'Display and AV', 'Print and copy',
  'Optical calibration', 'Computer hardware', 'Metal fabrication',
];

export const costCentreOptions = [
  'Estates & Maintenance', 'Transport', 'Science Consumables', 'IT Services', 'Hostel Maintenance',
];

export const priorityOptions = ['Normal', 'High', 'Critical'];

export const outcomeOptions = ['Passed', 'Partial', 'Follow-up', 'Failed'];

export const conditionOptions = ['Excellent', 'Good', 'Fair', 'Poor'];

export const siteContactOptions = ['Transport Supervisor', 'Estates Office', 'Department Head'];

export const paymentStatusOptions = ['Pending approval', 'Approved for payment', 'Paid'];

export const natureOptions = ['Preventive', 'Repair', 'Inspection', 'Emergency'];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

/** The day the template was captured; every "days" figure counts to it. */
export const REGISTER_DATE = '31 Jul 2026';

export const money = (value: number): string =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Whole dollars, the way the warranty card prints a purchase value. */
export const money0 = (value: number): string => `$${value.toLocaleString('en-US')}`;

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

/** Shifts one of the template's dates by a number of days, keeping its format. */
export const shiftDate = (value: string, days: number): string => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return value;
  const moved = new Date(Date.UTC(Number(year), index, Number(day) + days));
  return `${String(moved.getUTCDate()).padStart(2, '0')} ${months[moved.getUTCMonth()]} ${moved.getUTCFullYear()}`;
};

/* ------------------------------- The money ---------------------------------- */

export const partsTotalOf = (row: ServiceRecord): number =>
  Number(row.parts.reduce((total, part) => total + part.qty * part.price, 0).toFixed(2));

/** Labour, parts, consumables and the call-out charge added together. */
export const estimateOf = (row: ServiceRecord): number =>
  Number((row.labour + partsTotalOf(row) + row.consumables + row.callOut).toFixed(2));

export const varianceOf = (row: ServiceRecord): number =>
  row.actualCost === null ? 0 : Number((row.actualCost - estimateOf(row)).toFixed(2));

/** "+$15.00" / "$0.00" — the sign the Record Cost dialog prints. */
export const varianceLabelOf = (row: ServiceRecord): string => {
  const variance = varianceOf(row);
  return `${variance > 0 ? '+' : ''}${money(variance)}`;
};

export const lineTotalOf = (part: SparePart): number => Number((part.qty * part.price).toFixed(2));

/** "Qty 2 · $80.00 each". */
export const partLabelOf = (part: SparePart): string => `Qty ${part.qty} · ${money(part.price)} each`;

/* -------------------------------- The dates --------------------------------- */

export const daysSinceLastOf = (row: ServiceRecord): number =>
  Math.max(0, daysBetween(row.lastService, REGISTER_DATE));

export const daysUntilScheduledOf = (row: ServiceRecord): number =>
  daysBetween(REGISTER_DATE, row.scheduled);

export const daysOverdueOf = (row: ServiceRecord): number =>
  row.completedOn || row.startedOn ? 0 : Math.max(0, -daysUntilScheduledOf(row));

/**
 * The status the pill prints. A held record outranks its dates — the
 * photocopier's repair sat past its date but reads Out of Service, not Overdue.
 */
export const statusOf = (row: ServiceRecord): ServiceStatus => {
  if (row.completedOn) return 'Completed';
  if (row.onHold) return 'Out of Service';
  if (row.startedOn) return 'In Progress';
  return daysUntilScheduledOf(row) < 0 ? 'Overdue' : 'Scheduled';
};

/** The line under the Scheduled Date column. */
export const scheduleLabelOf = (row: ServiceRecord): string => {
  if (row.completedOn) return `Completed ${row.completedOn}`;
  if (row.onHold) return row.holdReason;
  if (row.startedOn) return `Started ${row.startedOn}`;
  const days = daysUntilScheduledOf(row);
  if (days < 0) return `${-days} days overdue`;
  if (days === 0) return 'Due today';
  return `Due in ${days} days`;
};

export const scheduleTintOf = (row: ServiceRecord): string => {
  if (row.completedOn) return 'text-success';
  if (row.onHold) return 'text-warning';
  if (row.startedOn) return 'text-info';
  const days = daysUntilScheduledOf(row);
  if (days < 0) return 'text-danger';
  return days <= 7 ? 'text-warning' : 'text-muted';
};

/** Months between the scheduled and next dates name the cycle. */
export const cycleLabelOf = (row: ServiceRecord): string => {
  if (!row.nextService) return 'Awaiting decision';
  const gap = Math.round(daysBetween(row.scheduled, row.nextService) / 30.44);
  if (gap <= 1) return 'Monthly cycle';
  if (gap <= 4) return 'Quarterly cycle';
  if (gap <= 7) return 'Half yearly cycle';
  return 'Annual cycle';
};

/** The Service Cycle the dialogs offer, without the trailing word. */
export const cycleOf = (row: ServiceRecord): string =>
  row.nextService ? cycleLabelOf(row).replace(' cycle', '') : 'One off';

export const nextServiceLabelOf = (row: ServiceRecord): string => row.nextService || 'Not scheduled';

/* ------------------------------ The warranty -------------------------------- */

export type WarrantyState = 'In warranty' | 'Expiring within 90 days' | 'Expired';

export const warrantyYearsOf = (row: ServiceRecord): number =>
  Math.max(0, Number(row.warrantyUntil.split(' ')[2]) - Number(row.purchasedOn.split(' ')[2]));

/** "5 years powertrain". */
export const warrantyCoverOf = (row: ServiceRecord): string =>
  `${warrantyYearsOf(row)} years ${row.warrantyTerm}`;

export const warrantyStateOf = (row: ServiceRecord): WarrantyState => {
  const expiry = dateKey(row.warrantyUntil);
  if (expiry < dateKey(REGISTER_DATE)) return 'Expired';
  return expiry <= dateKey('29 Oct 2026') ? 'Expiring within 90 days' : 'In warranty';
};

/** "Warranty Expired" / "In Warranty" — the badge the card prints. */
export const warrantyBadgeOf = (row: ServiceRecord): { label: string; tint: string } =>
  warrantyStateOf(row) === 'Expired'
    ? { label: 'Warranty Expired', tint: 'danger' }
    : { label: 'In Warranty', tint: 'success' };

/** "Ended 31 Mar 2025" / "Until 31 Mar 2030". */
export const warrantyDateLabelOf = (row: ServiceRecord): string =>
  `${warrantyStateOf(row) === 'Expired' ? 'Ended' : 'Until'} ${row.warrantyUntil}`;

/* ------------------------------ Panel timings -------------------------------- */

/** The service was raised the day after the one before it closed. */
export const raisedOnOf = (row: ServiceRecord): string => shiftDate(row.lastService, 1);

/** The technician is booked three weeks before the visit. */
export const assignedOnOf = (row: ServiceRecord): string => shiftDate(row.scheduled, -21);

/** The visit is confirmed a fortnight before it. */
export const confirmedOnOf = (row: ServiceRecord): string => shiftDate(row.scheduled, -15);

export const approvedOnOf = (row: ServiceRecord): string => shiftDate(row.scheduled, -18);

/* --------------------------------- Labels ----------------------------------- */

export const placeOf = (row: ServiceRecord): string => `${row.location} · ${row.spot}`;

export const compactOf = (row: ServiceRecord): string => `${row.id} · ${row.assetId}`;

export interface Pair {
  label: string;
  value: string;
}

export const assetPairsOf = (row: ServiceRecord): Pair[] => [
  { label: 'Asset ID', value: row.assetId },
  { label: 'Model', value: row.model },
  { label: 'Category', value: row.category },
  { label: 'Location', value: placeOf(row) },
  { label: 'Custodian', value: row.custodian },
];

export const schedulePairsOf = (row: ServiceRecord): Pair[] => [
  { label: 'Service ID', value: row.id },
  { label: 'Maintenance Type', value: row.type },
  { label: 'Scheduled Date', value: row.scheduled },
  { label: 'Last Service', value: row.lastService },
  { label: 'Next Service', value: nextServiceLabelOf(row) },
];

export const technicianPairsOf = (row: ServiceRecord): Pair[] => [
  { label: 'Technician', value: row.technician.name },
  { label: 'Role', value: row.technician.role },
  { label: 'Technician ID', value: row.technician.id },
  { label: 'Service Vendor', value: row.vendor },
  { label: 'Contact', value: row.technician.contact },
];

/** The cost card, which omits the lines a service does not carry. */
export const costPairsOf = (row: ServiceRecord): Pair[] => {
  const pairs: Pair[] = [{ label: 'Labour', value: money(row.labour) }];
  if (partsTotalOf(row) > 0) pairs.push({ label: 'Spare Parts', value: money(partsTotalOf(row)) });
  if (row.consumables > 0) pairs.push({ label: 'Consumables', value: money(row.consumables) });
  if (row.callOut > 0) pairs.push({ label: 'Call-out Charge', value: money(row.callOut) });
  pairs.push({ label: 'Estimated Cost', value: money(estimateOf(row)) });
  if (row.actualCost !== null) {
    pairs.push({ label: 'Actual Cost', value: money(row.actualCost) });
    pairs.push({ label: 'Variance', value: varianceLabelOf(row) });
  }
  return pairs;
};

export const warrantyPairsOf = (row: ServiceRecord): Pair[] => [
  { label: 'Purchased On', value: row.purchasedOn },
  { label: 'Cover', value: warrantyCoverOf(row) },
  { label: 'Purchase Value', value: money0(row.purchaseValue) },
];

/** The panel's maintenance card. */
export const maintenancePairsOf = (row: ServiceRecord): Pair[] => [
  { label: 'Type', value: row.type },
  { label: 'Scheduled Date', value: row.scheduled },
  { label: 'Service Cycle', value: cycleOf(row) },
  { label: 'Next Service', value: nextServiceLabelOf(row) },
];

export const panelCostPairsOf = (row: ServiceRecord): Pair[] => [
  ...costPairsOf(row),
  { label: 'Warranty', value: warrantyStateOf(row) === 'Expired' ? 'Expired' : 'In warranty' },
  { label: 'Cost Centre', value: row.costCentre },
  { label: 'Priority', value: row.priority },
];

export interface TimelineEntry {
  icon: string;
  tint: string;
  title: string;
  meta: string;
}

/** The panel's service timeline, dated off the record's own three dates. */
export const timelineOf = (row: ServiceRecord): TimelineEntry[] => {
  const entries: TimelineEntry[] = [
    {
      icon: 'ti ti-square-rounded-plus', tint: 'primary',
      title: 'Service raised', meta: `${raisedOnOf(row)} · Estates Office`,
    },
    {
      icon: 'ti ti-user-cog', tint: 'info',
      title: 'Technician assigned', meta: `${assignedOnOf(row)} · ${row.vendor}`,
    },
    {
      icon: 'ti ti-calendar-event', tint: 'warning',
      title: `Visit confirmed for ${row.scheduled}`,
      meta: `${confirmedOnOf(row)} · ${row.technician.role}`,
    },
  ];
  if (row.startedOn) {
    entries.push({
      icon: 'ti ti-progress', tint: 'info',
      title: 'Technician on site', meta: `${row.startedOn} · ${row.technician.name}`,
    });
  }
  if (row.completedOn) {
    entries.push({
      icon: 'ti ti-circle-check', tint: 'success',
      title: 'Service completed', meta: `${row.completedOn} · ${money(row.actualCost ?? estimateOf(row))}`,
    });
  }
  return entries;
};

/** The panel's audit trail, dated the same way. */
export const auditOf = (row: ServiceRecord): TimelineEntry[] => [
  {
    icon: 'ti ti-plus', tint: 'primary',
    title: 'Service record created', meta: `${raisedOnOf(row)} · Estates Office`,
  },
  {
    icon: 'ti ti-edit', tint: 'info',
    title: `Estimated cost revised to ${money(estimateOf(row))}`,
    meta: `${assignedOnOf(row)} · Estates Office`,
  },
  {
    icon: 'ti ti-checks', tint: 'success',
    title: 'Budget approved by the Estates Manager',
    meta: `${approvedOnOf(row)} · ${row.costCentre} cost centre`,
  },
];

export interface ServiceDocument {
  name: string;
  meta: string;
}

/** The panel's three documents, each dated by the step that produced it. */
export const documentsOf = (row: ServiceRecord): ServiceDocument[] => [
  { name: 'Job Sheet.pdf', meta: `${confirmedOnOf(row)} · 74 KB` },
  { name: 'Vendor Quotation.pdf', meta: `${assignedOnOf(row)} · 96 KB` },
  { name: 'Last Service Report.pdf', meta: `${row.lastService} · 128 KB` },
];

/** The observation every row carries, read off its own warranty. */
export const warrantyObservationOf = (row: ServiceRecord): { title: string; meta: string } =>
  warrantyStateOf(row) === 'Expired'
    ? {
      title: `Cover ended ${row.warrantyUntil}`,
      meta: `Every service since then has been billed to ${row.costCentre}`,
    }
    : {
      title: `Cover runs to ${row.warrantyUntil}`,
      meta: `${warrantyCoverOf(row)} · chargeable work still falls on ${row.costCentre}`,
    };

/** The Service History dialog's table — this service, then the record. */
export const historyRowsOf = (row: ServiceRecord): PastService[] => [
  {
    id: row.id, title: row.summary, date: row.scheduled, type: row.type,
    vendor: row.vendor, cost: estimateOf(row), outcome: statusOf(row),
  },
  ...row.pastServices,
];

/* --------------------------------- Filters ---------------------------------- */

export const costBandOf = (row: ServiceRecord): string => {
  const cost = estimateOf(row);
  if (cost < 100) return 'Under $100';
  if (cost <= 250) return '$100 – $250';
  if (cost <= 500) return '$250 – $500';
  return 'Above $500';
};

export const searchIndexOf = (row: ServiceRecord): string =>
  [
    row.id, row.assetId, row.assetName, row.model, row.category, row.type, row.summary,
    row.vendor, row.contract, row.technician.name, row.technician.id, row.location, row.spot,
    row.custodian, statusOf(row), row.costCentre,
  ]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole service register — 239 records against the eight
 * this page lists — so the template's figures stand and the roster moves them.
 */
export const SUMMARY_TOTALS = {
  scheduled: 34,
  inProgress: 9,
  completed: 186,
  overdue: 6,
  outOfService: 4,
};

export const VIEW_TOTALS = {
  all: 239,
  thisMonth: 34,
  overdue: 6,
  preventive: 148,
  outOfService: 4,
};

/**
 * The template renders one committed chip, "Academic Year: 2026 / 2027", but the
 * filter panel has no Academic Year field. The two fields it does pre-fill are
 * the schedule window — 01 Apr to 31 Aug 2026 — so those open committed here,
 * and Reset clears them.
 */
export const SCHEDULED_FROM = '01-04-2026';
export const SCHEDULED_TO = '31-08-2026';

/* ---------------------------------- Rows ------------------------------------ */

export const services: ServiceRecord[] = [
  {
    id: 'SRV-2026-0412', assetId: 'AST-2019-0007', assetName: 'School Bus BUS-03',
    icon: 'ti ti-bus', tint: 'danger', model: 'Volvo 9400 · 52 seats', category: 'Vehicle',
    location: 'Transport Yard', spot: 'Bay 3', custodian: 'Transport Department',
    type: 'Preventive Maintenance', summary: 'Quarterly road service · safety check',
    scheduled: '8 Aug 2026', lastService: '8 May 2026', nextService: '8 Nov 2026',
    vendor: 'Volvo Commercial Services', contract: 'AMC-2024-011 · regional workshop',
    technician: {
      name: 'Mr. Rajesh Kumar', role: 'Senior Vehicle Technician',
      id: 'TECH-VC-114', contact: '+1 55 4176 2280',
    },
    specialisation: 'Vehicle mechanical',
    labour: 320, consumables: 90, callOut: 70,
    parts: [
      { name: 'Brake pad set (front)', qty: 1, price: 180 },
      { name: 'Oil filter', qty: 1, price: 40 },
      { name: 'Air filter', qty: 2, price: 80 },
    ],
    actualCost: null,
    completedOn: '', startedOn: '', onHold: false, holdReason: '',
    purchasedOn: '1 Apr 2020', purchaseValue: 58000,
    warrantyUntil: '31 Mar 2025', warrantyTerm: 'powertrain',
    warrantyNote: 'Powertrain cover lapsed on 31 Mar 2025. All work is now billed to the transport budget.',
    costCentre: 'Transport', priority: 'High',
    pastServices: [
      {
        id: 'SRV-2026-0389', title: 'Quarterly service completed', date: '08 May 2026',
        type: 'Preventive Maintenance', vendor: 'Volvo Commercial Services', cost: 840, outcome: 'Passed',
      },
      {
        id: 'SRV-2026-0341', title: 'Tyre rotation and alignment', date: '06 Feb 2026',
        type: 'Repair', vendor: 'Volvo Commercial Services', cost: 310, outcome: 'Passed',
      },
      {
        id: 'SRV-2025-0298', title: 'Quarterly service completed', date: '08 Nov 2025',
        type: 'Preventive Maintenance', vendor: 'Volvo Commercial Services', cost: 795, outcome: 'Passed',
      },
      {
        id: 'SRV-2025-0244', title: 'Annual fitness inspection', date: '08 Aug 2025',
        type: 'Inspection', vendor: 'Regional Transport Office', cost: 120, outcome: 'Certified',
      },
      {
        id: 'SRV-2025-0187', title: 'Gearbox emergency repair', date: '08 May 2025',
        type: 'Emergency Repair', vendor: 'Volvo Commercial Services', cost: 1240, outcome: 'Passed',
      },
    ],
    lifetimeServices: 24, lifetimeSpend: 14820, uptime: '97.4%',
    observations: [
      {
        title: 'Front brake pads replaced on 3 of the last 5 services',
        meta: 'Route gradient noted by the workshop as the likely cause',
      },
    ],
    notes: 'Service must fall in the mid-term break. The bus is off the route for a full day.',
  },
  {
    id: 'SRV-2026-0418', assetId: 'AST-2026-0170', assetName: 'Commercial Refrigerator',
    icon: 'ti ti-fridge', tint: 'success', model: 'ColdMax CR-800 · 1 unit',
    category: 'Kitchen Equipment',
    location: 'Main Block', spot: 'Kitchen', custodian: 'Cafeteria Department',
    type: 'Preventive Maintenance', summary: 'Compressor service · gas and seal check',
    scheduled: '5 Aug 2026', lastService: '5 Feb 2026', nextService: '5 Feb 2027',
    vendor: 'ColdMax Refrigeration', contract: 'AMC-2025-046 · kitchen contract',
    technician: {
      name: 'Mr. Samuel Ortiz', role: 'Refrigeration Engineer',
      id: 'TECH-CM-032', contact: '+1 55 3390 7714',
    },
    specialisation: 'Refrigeration',
    labour: 120, consumables: 30, callOut: 30,
    parts: [
      { name: 'Compressor gasket', qty: 1, price: 35 },
      { name: 'Door seal strip', qty: 1, price: 25 },
    ],
    actualCost: null,
    completedOn: '', startedOn: '', onHold: false, holdReason: '',
    purchasedOn: '1 Apr 2025', purchaseValue: 2800,
    warrantyUntil: '31 Mar 2030', warrantyTerm: 'compressor',
    warrantyNote: 'Compressor is covered to 31 Mar 2030. Seals, gaskets and labour fall outside the cover.',
    costCentre: 'Estates & Maintenance', priority: 'Normal',
    pastServices: [
      {
        id: 'SRV-2026-0356', title: 'Half-yearly service completed', date: '05 Feb 2026',
        type: 'Preventive Maintenance', vendor: 'ColdMax Refrigeration', cost: 225, outcome: 'Passed',
      },
      {
        id: 'SRV-2026-0398', title: 'Temperature audit passed', date: '01 Jul 2026',
        type: 'Inspection', vendor: 'In house', cost: null, outcome: 'Passed', note: 'no cost',
      },
    ],
    lifetimeServices: 4, lifetimeSpend: 690, uptime: '99.6%',
    observations: [],
    notes: 'Book before 06:30 so the unit is back in service ahead of breakfast prep.',
  },
  {
    id: 'SRV-2026-0424', assetId: 'AST-2026-0142', assetName: 'Interactive Smart Board 75"',
    icon: 'ti ti-device-desktop', tint: 'primary', model: 'ViewPro VB-750 · 1 unit',
    category: 'IT Equipment',
    location: 'Main Block', spot: 'Room 204', custodian: 'Ms. Priya Raman',
    type: 'Calibration', summary: 'Touch layer calibration · half yearly',
    scheduled: '28 Jul 2026', lastService: '28 Jan 2026', nextService: '28 Jan 2027',
    vendor: 'ViewPro Systems Ltd', contract: 'AMC-2023-004 · on-site cover',
    technician: {
      name: 'Ms. Hannah Lee', role: 'Display Calibration Specialist',
      id: 'TECH-VP-078', contact: '+1 55 2214 8890',
    },
    specialisation: 'Display and AV',
    labour: 100, consumables: 0, callOut: 20,
    parts: [{ name: 'Stylus tip set', qty: 2, price: 15 }],
    actualCost: null,
    completedOn: '', startedOn: '28 Jul 2026', onHold: false, holdReason: '',
    purchasedOn: '1 Apr 2023', purchaseValue: 4800,
    warrantyUntil: '31 Mar 2028', warrantyTerm: 'on-site',
    warrantyNote: 'On-site cover runs to 31 Mar 2028. Routine calibration is a chargeable service, not a defect.',
    costCentre: 'IT Services', priority: 'Normal',
    pastServices: [
      {
        id: 'SRV-2026-0333', title: 'Calibration completed', date: '28 Jan 2026',
        type: 'Calibration', vendor: 'ViewPro Systems', cost: 145, outcome: 'Passed',
      },
      {
        id: 'SRV-2024-0211', title: 'Touch layer replaced under warranty', date: '14 Sep 2024',
        type: 'Repair', vendor: 'ViewPro Systems', cost: null, outcome: 'Passed', note: 'no cost',
      },
    ],
    lifetimeServices: 7, lifetimeSpend: 1090, uptime: '99.1%',
    observations: [],
    notes: 'Room 204 is free after period 4. Technician signed in at the estates desk at 09:10.',
  },
  {
    id: 'SRV-2026-0431', assetId: 'AST-2023-0019', assetName: 'Library Photocopier',
    icon: 'ti ti-printer', tint: 'secondary', model: 'CanonPro IR-2625 · 1 unit',
    category: 'Office Equipment',
    location: 'Library', spot: 'Ground Floor', custodian: 'Ms. Carla Mendes',
    type: 'Emergency Repair', summary: 'Drum unit failure · DMG-2026-0044',
    scheduled: '30 Jul 2026', lastService: '12 Mar 2026', nextService: '',
    vendor: 'CanonPro Office Solutions', contract: 'Pay per call · no contract',
    technician: {
      name: 'Mr. Daniel Pierce', role: 'Field Service Engineer',
      id: 'TECH-CP-021', contact: '+1 55 6642 1109',
    },
    specialisation: 'Print and copy',
    labour: 80, consumables: 30, callOut: 0,
    parts: [{ name: 'Drum unit IR-2625', qty: 1, price: 150 }],
    actualCost: null,
    completedOn: '', startedOn: '', onHold: true, holdReason: 'Repair on hold',
    purchasedOn: '1 Apr 2021', purchaseValue: 2400,
    warrantyUntil: '31 Mar 2023', warrantyTerm: 'comprehensive',
    warrantyNote: 'Warranty expired on 31 Mar 2023. The full repair cost falls on the school.',
    costCentre: 'Estates & Maintenance', priority: 'Critical',
    pastServices: [
      {
        id: 'SRV-2026-0348', title: 'Routine toner and roller service', date: '12 Mar 2026',
        type: 'Preventive Maintenance', vendor: 'CanonPro Office', cost: 95, outcome: 'Passed',
      },
      {
        id: 'DMG-2026-0044', title: 'Damage reported by the custodian', date: '29 Jul 2026',
        type: 'Emergency Repair', vendor: 'Reported in house', cost: null, outcome: 'Open',
      },
    ],
    lifetimeServices: 11, lifetimeSpend: 1385, uptime: '92.8%',
    observations: [],
    notes: 'Repair quote sits close to the book value. Estates has asked for a retirement review first.',
  },
  {
    id: 'SRV-2026-0436', assetId: 'AST-2025-0088', assetName: 'Science Lab Microscope Set',
    icon: 'ti ti-microscope', tint: 'info', model: 'OptiLab M200 · 20 units',
    category: 'Lab Equipment',
    location: 'Science Block', spot: 'Lab 1', custodian: 'Head of Science',
    type: 'Inspection', summary: 'Optical inspection · half yearly',
    scheduled: '20 Jul 2026', lastService: '20 Jan 2026', nextService: '20 Jan 2027',
    vendor: 'OptiLab Instruments', contract: 'Pay per call · science budget',
    technician: {
      name: 'Dr. Meera Nair', role: 'Calibration Engineer',
      id: 'TECH-OL-009', contact: '+1 55 7708 3325',
    },
    specialisation: 'Optical calibration',
    labour: 100, consumables: 30, callOut: 0,
    parts: [{ name: 'Calibration slide set', qty: 1, price: 50 }],
    actualCost: null,
    completedOn: '', startedOn: '', onHold: false, holdReason: '',
    purchasedOn: '1 Apr 2022', purchaseValue: 3600,
    warrantyUntil: '31 Mar 2025', warrantyTerm: 'parts only',
    warrantyNote: 'Parts cover lapsed on 31 Mar 2025. Repairs are billed to the science consumables budget.',
    costCentre: 'Science Consumables', priority: 'High',
    pastServices: [
      {
        id: 'SRV-2026-0322', title: 'Optical inspection completed', date: '20 Jan 2026',
        type: 'Inspection', vendor: 'OptiLab Instruments', cost: 175, outcome: 'Passed',
      },
      {
        id: 'SRV-2026-0340', title: '4 units returned from a Class VI A loan', date: '27 Feb 2026',
        type: 'Inspection', vendor: 'In house', cost: null, outcome: 'Passed', note: 'optics cleared',
      },
    ],
    lifetimeServices: 9, lifetimeSpend: 1240, uptime: '98.2%',
    observations: [
      {
        title: 'Vendor rescheduled this visit twice',
        meta: 'Second reminder issued to OptiLab on 28 Jul 2026',
      },
    ],
    notes: 'Vendor rescheduled twice. Second reminder issued to OptiLab on 28 Jul 2026.',
  },
  {
    id: 'SRV-2026-0441', assetId: 'AST-2024-0031', assetName: 'Desktop Computer Lot',
    icon: 'ti ti-device-desktop', tint: 'primary', model: 'HP ProDesk 400 · 15 units',
    category: 'IT Equipment',
    location: 'Main Block', spot: 'Computer Lab', custodian: 'IT Department',
    type: 'AMC Service', summary: 'Annual contract service · 15 units',
    scheduled: '15 Jul 2026', lastService: '15 Jul 2026', nextService: '15 Jan 2027',
    vendor: 'HP Inc · education channel', contract: 'AMC-2020-018 · lab contract',
    technician: {
      name: 'Mr. Kevin Shaw', role: 'Hardware Service Technician',
      id: 'TECH-HP-140', contact: '+1 55 9012 4460',
    },
    specialisation: 'Computer hardware',
    labour: 240, consumables: 60, callOut: 0,
    parts: [
      { name: 'SSD 256 GB', qty: 3, price: 40 },
      { name: 'Thermal paste sachet', qty: 15, price: 2 },
    ],
    actualCost: 450,
    completedOn: '15 Jul 2026', startedOn: '15 Jul 2026', onHold: false, holdReason: '',
    purchasedOn: '1 Apr 2020', purchaseValue: 9000,
    warrantyUntil: '31 Mar 2023', warrantyTerm: 'on-site',
    warrantyNote: 'On-site cover expired on 31 Mar 2023. The lot now runs on a paid annual contract.',
    costCentre: 'IT Services', priority: 'Normal',
    pastServices: [
      {
        id: 'SRV-2026-0441', title: 'AMC service completed', date: '15 Jul 2026',
        type: 'AMC Service', vendor: 'HP Inc', cost: 450, outcome: 'Passed',
      },
      {
        id: 'SRV-2026-0311', title: 'AMC service completed', date: '15 Jan 2026',
        type: 'AMC Service', vendor: 'HP Inc', cost: 415, outcome: 'Passed',
      },
    ],
    lifetimeServices: 14, lifetimeSpend: 5240, uptime: '96.5%',
    observations: [],
    notes: 'Three failing drives replaced. All 15 units imaged and returned to the lab the same day.',
  },
  {
    id: 'SRV-2026-0447', assetId: 'AST-2026-0161', assetName: 'Hostel Bunk Bed Set',
    icon: 'ti ti-bed', tint: 'purple', model: 'SteelRest BR-2 · 12 units', category: 'Furniture',
    location: 'Everest Hostel', spot: 'Block B', custodian: 'Hostel Department',
    type: 'Repair', summary: 'Frame re-tightening · 3 of 12 units',
    scheduled: '2 Jul 2026', lastService: '3 Jul 2026', nextService: '3 Jul 2027',
    vendor: 'SteelRest Furnishings', contract: 'Pay per call · hostel budget',
    technician: {
      name: 'Mr. Arun Das', role: 'Fabrication Technician',
      id: 'TECH-SR-055', contact: '+1 55 4453 6621',
    },
    specialisation: 'Metal fabrication',
    labour: 80, consumables: 10, callOut: 0,
    parts: [{ name: 'Frame bolt kit', qty: 3, price: 10 }],
    actualCost: 135,
    completedOn: '3 Jul 2026', startedOn: '2 Jul 2026', onHold: false, holdReason: '',
    purchasedOn: '1 Apr 2024', purchaseValue: 3000,
    warrantyUntil: '31 Mar 2034', warrantyTerm: 'frame',
    warrantyNote: 'Frame warranty runs to 31 Mar 2034, but bolt wear is excluded and was billed to the hostel.',
    costCentre: 'Hostel Maintenance', priority: 'Normal',
    pastServices: [
      {
        id: 'SRV-2025-0261', title: 'Annual frame check completed', date: '02 Jul 2025',
        type: 'Repair', vendor: 'SteelRest Furnishings', cost: 110, outcome: 'Passed',
      },
      {
        id: 'SRV-2026-0402', title: '8 units returned to store', date: '30 Jun 2026',
        type: 'Inspection', vendor: 'In house', cost: null, outcome: 'Passed', note: 'frames re-tightened',
      },
    ],
    lifetimeServices: 3, lifetimeSpend: 245, uptime: '99.8%',
    observations: [],
    notes: 'Work ran into a second day. One extra hour of labour was approved by the hostel director.',
  },
  {
    id: 'SRV-2026-0453', assetId: 'AST-2026-0155', assetName: 'Dell Latitude 5540 Laptop',
    icon: 'ti ti-device-laptop', tint: 'primary', model: 'Latitude 5540 · 1 unit',
    category: 'IT Equipment',
    location: 'Main Block', spot: 'Admin Office', custodian: 'Mrs. Alice Ray',
    type: 'Preventive Maintenance', summary: 'Battery and thermal service',
    scheduled: '12 Aug 2026', lastService: '12 Feb 2026', nextService: '12 Feb 2027',
    vendor: 'Dell Technologies', contract: 'AMC-2025-029 · next business day',
    technician: {
      name: 'Ms. Nadia Fern', role: 'Field Service Technician',
      id: 'TECH-DL-093', contact: '+1 55 8830 2145',
    },
    specialisation: 'Computer hardware',
    labour: 45, consumables: 10, callOut: 0,
    parts: [{ name: 'Replacement battery', qty: 1, price: 40 }],
    actualCost: null,
    completedOn: '', startedOn: '', onHold: false, holdReason: '',
    purchasedOn: '1 Apr 2025', purchaseValue: 1200,
    warrantyUntil: '31 Mar 2028', warrantyTerm: 'next business day',
    warrantyNote: 'Next business day cover runs to 31 Mar 2028. Batteries are a consumable and sit outside it.',
    costCentre: 'IT Services', priority: 'Normal',
    pastServices: [
      {
        id: 'SRV-2026-0326', title: 'Thermal service completed', date: '12 Feb 2026',
        type: 'Preventive Maintenance', vendor: 'Dell Technologies', cost: 80, outcome: 'Passed',
      },
      {
        id: 'SRV-2026-0361', title: 'Battery health check — 94%', date: '18 Mar 2026',
        type: 'Inspection', vendor: 'In house', cost: null, outcome: 'Passed', note: 'no cost',
      },
    ],
    lifetimeServices: 2, lifetimeSpend: 80, uptime: '99.9%',
    observations: [],
    notes: 'Holds hostel allocation records. A data wipe is not required for an on-site battery swap.',
  },
];
