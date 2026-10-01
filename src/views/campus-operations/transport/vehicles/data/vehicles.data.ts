export type VehicleStatus =
  | 'Active'
  | 'Available'
  | 'On Route'
  | 'Maintenance'
  | 'Insurance Expiring'
  | 'Out of Service'
  | 'Archived';

export type VehicleType = 'School Bus' | 'Mini Bus' | 'Van';

export type FuelType = 'Diesel' | 'CNG' | 'Electric';

export interface Vehicle {
  id: string;
  /** The template's `dt-name`, e.g. "KA-01-AB-1234". */
  number: string;
  /** The template's `dt-vname`, e.g. "Ashok Leyland Lynx". */
  model: string;
  type: VehicleType;
  /**
   * The `badge-soft-*` tint the template hands each row's type badge. It cycles
   * through ten colours and does not track the type — two School Buses carry
   * `primary`, a third carries `teal` — so it is stored, not derived.
   */
  typeTint: string;
  registration: string;
  /** Template path, rendered through `ImageWithBasePath`. */
  photo: string;
  /** Empty when the template prints "No route". */
  route: string;
  /** Empty when the template prints "No driver". */
  driver: string;
  driverPhoto: string;
  fuel: FuelType;
  seats: number;
  mfgYear: number;
  insuranceExpiry: string;
  registrationExpiry: string;
  fitnessExpiry: string;
  lastService: string;
  /** "—" when the vehicle has no next service booked. */
  nextService: string;
  status: VehicleStatus;
}

export const statusPill: Record<VehicleStatus, string> = {
  Active: 'is-active',
  Available: 'is-new',
  'On Route': 'is-exam',
  Maintenance: 'is-pending',
  'Insurance Expiring': 'is-emergency',
  'Out of Service': 'is-inactive',
  Archived: 'is-archived',
};

/**
 * Only Active draws the plain dot; every other status leads its pill with an
 * icon instead. Null means "render the dot".
 */
export const statusIcon: Record<VehicleStatus, string | null> = {
  Active: null,
  Available: 'ti ti-circle-check',
  'On Route': 'ti ti-route',
  Maintenance: 'ti ti-tool',
  'Insurance Expiring': 'ti ti-alert-triangle',
  'Out of Service': 'ti ti-circle-off',
  Archived: 'ti ti-archive',
};

export const statusBadge: Record<VehicleStatus, string> = {
  Active: 'badge badge-soft-success',
  Available: 'badge badge-soft-primary',
  'On Route': 'badge badge-soft-info',
  Maintenance: 'badge badge-soft-warning',
  'Insurance Expiring': 'badge badge-soft-danger',
  'Out of Service': 'badge badge-soft-secondary',
  Archived: 'badge badge-soft-secondary',
};

/* ------------------------------ Filter options ------------------------------ */

export const typeOptions: VehicleType[] = ['School Bus', 'Mini Bus', 'Van'];

export const numberOptions = [
  'KA-01-AB-1234', 'KA-01-CD-5678', 'KA-01-EF-9012', 'KA-01-GH-3456', 'KA-01-IJ-7890',
  'KA-01-KL-2345', 'KA-01-MN-6789', 'KA-01-OP-1122', 'KA-01-QR-4567', 'KA-01-ST-8899',
];

export const routeOptions = [
  'North Line Express', 'South Valley Route', 'East Meadows Line', 'West Hills Shuttle',
  'Central Loop', 'Lakeside Connector', 'Hilltop Feeder',
];

export const driverOptions = [
  'Marcus Reid', 'Aariv Kumar', 'Ramsey Fox', 'Joseph Ray',
  'Teresa Vale', 'Hendrita Ray', 'Erickson Poe', 'Andrew Fischer',
];

export const fuelOptions: FuelType[] = ['Diesel', 'CNG', 'Electric'];

/** The template's four bands; the en dashes are its own. */
export const seatingOptions = ['Up to 15', '16 – 30', '31 – 45', '46+'];

export const insuranceStatusOptions = ['Valid', 'Expiring', 'Expired'];

export const maintenanceStatusOptions = ['Up to date', 'Due soon', 'Overdue'];

export const registrationExpiryOptions = ['2024', '2025', '2026', '2027 & later'];

export const statusOptions: VehicleStatus[] = [
  'Active', 'Available', 'On Route', 'Maintenance', 'Insurance Expiring', 'Out of Service', 'Archived',
];

export const shiftOptions = ['Morning', 'Afternoon', 'Both'];

export const serviceTypeOptions = [
  'Routine Service', 'Oil Change', 'Tyre Replacement', 'Brake Inspection', 'Full Inspection',
];

export const coverageOptions = ['Comprehensive', 'Third Party'];

export const importModes = ['Create new vehicles', 'Update existing by vehicle number', 'Create and update'];

/**
 * Driver photographs and contact numbers. The grid prints the photo but never
 * the number — the Add/Edit form collects it and the Live Tracking dialog
 * prints it, so it is kept here rather than invented at render time.
 */
export const driverPhotos: Record<string, string> = {
  'Marcus Reid': 'assets/img/teachers/teacher-06.jpg',
  'Aariv Kumar': 'assets/img/teachers/teacher-09.jpg',
  'Ramsey Fox': 'assets/img/teachers/teacher-08.jpg',
  'Joseph Ray': 'assets/img/teachers/teacher-03.jpg',
  'Teresa Vale': 'assets/img/teachers/teacher-05.jpg',
  'Hendrita Ray': 'assets/img/teachers/teacher-06.jpg',
  'Erickson Poe': 'assets/img/teachers/teacher-01.jpg',
  'Andrew Fischer': 'assets/img/teachers/teacher-08.jpg',
};

export const driverContacts: Record<string, string> = {
  'Marcus Reid': '+1 45644 54784',
  'Aariv Kumar': '+1 45644 54785',
  'Ramsey Fox': '+1 45644 54786',
  'Joseph Ray': '+1 45644 54787',
  'Teresa Vale': '+1 45644 54788',
  'Hendrita Ray': '+1 45644 54789',
  'Erickson Poe': '+1 45644 54790',
  'Andrew Fischer': '+1 45644 54791',
};

/* -------------------------------- Date keys --------------------------------- */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "18 Sep 2026" dates; "—" sorts last. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/** Rough day count between two "18 Sep 2026" dates; only its sign and size matter. */
const daysBetween = (from: string, to: string): number => {
  const parse = (value: string): number | null => {
    const [day, month, year] = value.split(' ');
    const index = months.indexOf(month);
    if (index === -1) return null;
    return Date.UTC(Number(year), index, Number(day));
  };
  const start = parse(from);
  const end = parse(to);
  if (start === null || end === null) return Number.NaN;
  return Math.round((end - start) / 86_400_000);
};

/** See the file header — the compliance block runs on a 2026 calendar. */
export const COMPLIANCE_TODAY = '01 Jul 2026';
const COMPLIANCE_WINDOW = 60;

/** …and the service block on the fleet's own newest service date, in 2024. */
export const SERVICE_TODAY = '12 May 2024';
const SERVICE_WINDOW = 75;

export const yearOf = (value: string): number => Number(value.split(' ')[2] ?? 0);

/* ------------------------------- Derivations -------------------------------- */

export type ComplianceState = 'Valid' | 'Expiring' | 'Expired';

/** One rule for insurance, registration, fitness and the permit alike. */
export const complianceStateOf = (expiry: string): ComplianceState => {
  const days = daysBetween(COMPLIANCE_TODAY, expiry);
  if (!Number.isFinite(days)) return 'Expired';
  if (days < 0) return 'Expired';
  return days <= COMPLIANCE_WINDOW ? 'Expiring' : 'Valid';
};

export const complianceBadge: Record<ComplianceState, string> = {
  Valid: 'badge badge-soft-success',
  Expiring: 'badge badge-soft-warning',
  Expired: 'badge badge-soft-danger',
};

/** The Insurance Status filter reads the insurance certificate only. */
export const insuranceStatusOf = (row: Vehicle): ComplianceState =>
  complianceStateOf(row.insuranceExpiry);

export type MaintenanceState = 'Up to date' | 'Due soon' | 'Overdue';

export const maintenanceStatusOf = (row: Vehicle): MaintenanceState => {
  if (row.nextService === '—') return 'Overdue';
  const days = daysBetween(SERVICE_TODAY, row.nextService);
  if (!Number.isFinite(days) || days < 0) return 'Overdue';
  return days <= SERVICE_WINDOW ? 'Due soon' : 'Up to date';
};

/** The Seating Capacity filter's four bands. */
export const seatBandOf = (row: Vehicle): string => {
  if (row.seats <= 15) return 'Up to 15';
  if (row.seats <= 30) return '16 – 30';
  if (row.seats <= 45) return '31 – 45';
  return '46+';
};

/** The Registration Expiry filter's four bands. */
export const registrationBandOf = (row: Vehicle): string => {
  const year = yearOf(row.registrationExpiry);
  return year >= 2027 ? '2027 & later' : String(year);
};

export const routeLabelOf = (row: Vehicle): string => row.route || 'No route';

export const driverLabelOf = (row: Vehicle): string => row.driver || 'No driver';

/** The dialogs' read-only "Vehicle" field. */
export const vehicleLabelOf = (row: Vehicle): string => `${row.number} — ${row.model}`;

/** The last four digits of the plate, used by every document reference. */
const plateTail = (row: Vehicle): string => row.number.slice(-4);

/**
 * The template hard-codes one GPS id, one policy number and one set of
 * document references on every row. All four are derived from the vehicle here
 * so the dialogs and the grid can never disagree.
 */
export const gpsIdOf = (row: Vehicle): string => `GPS${row.mfgYear}${plateTail(row)}`;

export const policyNumberOf = (row: Vehicle): string => `INS-KA-${row.mfgYear}${plateTail(row)}`;

export const fitnessRefOf = (row: Vehicle): string =>
  `FIT-${yearOf(row.fitnessExpiry)}-${plateTail(row)}`;

export const permitRefOf = (row: Vehicle): string =>
  `PRM-${yearOf(row.lastService)}-${plateTail(row)}`;

/** The template's permit runs to the end of the fitness certificate's year. */
export const permitExpiryOf = (row: Vehicle): string => `31 Dec ${yearOf(row.fitnessExpiry)}`;

export const routeSummaryOf = (row: Vehicle): string =>
  row.route
    ? `${row.route} — morning and afternoon shifts, ${row.number}.`
    : 'No route currently assigned.';

export const serviceRecordOf = (row: Vehicle): string =>
  `Last serviced ${row.lastService}. Odometer within schedule, next due ${row.nextService}.`;

/** One remark per status, exactly as the template writes them. */
export const remarksOf = (row: Vehicle): string => {
  switch (row.status) {
    case 'Maintenance':
      return 'Under maintenance — substitute vehicle assigned to the route.';
    case 'Insurance Expiring':
      return 'Insurance expiring soon — renew before the expiry date.';
    case 'Out of Service':
      return 'Out of service — grounded pending registration renewal.';
    case 'Archived':
      return 'Archived — vehicle retired from the fleet, retained for records.';
    default:
      return 'Roadworthy and operating on schedule.';
  }
};

/** Mirrors the template's `data-search` attribute, "—" fallbacks included. */
export const searchIndexOf = (row: Vehicle): string =>
  [
    row.number, row.model, row.type, row.registration,
    row.route || '—', row.driver || '—', row.fuel, row.status, String(row.mfgYear),
  ]
    .join(' ')
    .toLowerCase();

/** The Documents dialog's four rows, all built from the vehicle. */
export interface VehicleDocument {
  label: string;
  icon: string;
  tint: string;
  reference: string;
  expiry: string;
}

export const documentsOf = (row: Vehicle): VehicleDocument[] => [
  {
    label: 'Registration Certificate', icon: 'ti ti-file-certificate', tint: 'text-primary',
    reference: row.registration, expiry: row.registrationExpiry,
  },
  {
    label: 'Insurance Policy', icon: 'ti ti-shield-check', tint: 'text-info',
    reference: policyNumberOf(row), expiry: row.insuranceExpiry,
  },
  {
    label: 'Fitness Certificate', icon: 'ti ti-discount', tint: 'text-warning',
    reference: fitnessRefOf(row), expiry: row.fitnessExpiry,
  },
  {
    label: 'Route Permit', icon: 'ti ti-route', tint: 'text-success',
    reference: permitRefOf(row), expiry: permitExpiryOf(row),
  },
];

/* ---------------------------------- Rows ------------------------------------ */

export const vehicles: Vehicle[] = [
  {
    id: 'KA-01-AB-1234', number: 'KA-01-AB-1234', model: 'Ashok Leyland Lynx',
    type: 'School Bus', typeTint: 'primary', registration: 'REG-KA-2019-1234',
    photo: 'assets/img/coach/coach-01.jpg',
    route: 'North Line Express', driver: 'Marcus Reid', driverPhoto: 'assets/img/teachers/teacher-06.jpg',
    fuel: 'Diesel', seats: 42, mfgYear: 2019,
    insuranceExpiry: '18 Sep 2026', registrationExpiry: '20 Aug 2027', fitnessExpiry: '12 Jul 2026',
    lastService: '02 May 2024', nextService: '02 Aug 2024', status: 'On Route',
  },
  {
    id: 'KA-01-CD-5678', number: 'KA-01-CD-5678', model: 'Tata Starbus Ultra',
    type: 'School Bus', typeTint: 'info', registration: 'REG-KA-2020-5678',
    photo: 'assets/img/coach/coach-02.jpg',
    route: 'South Valley Route', driver: 'Aariv Kumar', driverPhoto: 'assets/img/teachers/teacher-09.jpg',
    fuel: 'Diesel', seats: 40, mfgYear: 2020,
    insuranceExpiry: '05 Nov 2026', registrationExpiry: '11 Feb 2028', fitnessExpiry: '20 Aug 2026',
    lastService: '18 Apr 2024', nextService: '18 Jul 2024', status: 'Active',
  },
  {
    id: 'KA-01-EF-9012', number: 'KA-01-EF-9012', model: 'Force Traveller 26',
    type: 'Mini Bus', typeTint: 'success', registration: 'REG-KA-2018-9012',
    photo: 'assets/img/coach/coach-03.jpg',
    route: 'East Meadows Line', driver: 'Ramsey Fox', driverPhoto: 'assets/img/teachers/teacher-08.jpg',
    fuel: 'Diesel', seats: 26, mfgYear: 2018,
    insuranceExpiry: '30 Sep 2026', registrationExpiry: '30 Sep 2026', fitnessExpiry: '15 Sep 2026',
    lastService: '09 May 2024', nextService: '09 Aug 2024', status: 'Available',
  },
  {
    id: 'KA-01-GH-3456', number: 'KA-01-GH-3456', model: 'Mahindra Cruzio',
    type: 'Mini Bus', typeTint: 'warning', registration: 'REG-KA-2021-3456',
    photo: 'assets/img/coach/coach-04.jpg',
    route: 'West Hills Shuttle', driver: 'Joseph Ray', driverPhoto: 'assets/img/teachers/teacher-03.jpg',
    fuel: 'CNG', seats: 24, mfgYear: 2021,
    insuranceExpiry: '12 Aug 2026', registrationExpiry: '12 Sep 2027', fitnessExpiry: '10 Aug 2026',
    lastService: '10 May 2024', nextService: '25 Jul 2024', status: 'Maintenance',
  },
  {
    id: 'KA-01-IJ-7890', number: 'KA-01-IJ-7890', model: 'Tata Winger',
    type: 'Van', typeTint: 'purple', registration: 'REG-KA-2022-7890',
    photo: 'assets/img/coach/coach-05.jpg',
    route: 'Central Loop', driver: 'Teresa Vale', driverPhoto: 'assets/img/teachers/teacher-05.jpg',
    fuel: 'Diesel', seats: 15, mfgYear: 2022,
    insuranceExpiry: '25 Aug 2026', registrationExpiry: '25 Aug 2028', fitnessExpiry: '22 Aug 2026',
    lastService: '08 May 2024', nextService: '08 Aug 2024', status: 'On Route',
  },
  {
    id: 'KA-01-KL-2345', number: 'KA-01-KL-2345', model: 'Eicher Skyline Pro',
    type: 'School Bus', typeTint: 'teal', registration: 'REG-KA-2017-2345',
    photo: 'assets/img/coach/coach-06.jpg',
    route: 'Lakeside Connector', driver: 'Hendrita Ray', driverPhoto: 'assets/img/teachers/teacher-06.jpg',
    fuel: 'Diesel', seats: 45, mfgYear: 2017,
    insuranceExpiry: '05 Sep 2026', registrationExpiry: '05 Sep 2027', fitnessExpiry: '05 Sep 2026',
    lastService: '06 May 2024', nextService: '06 Aug 2024', status: 'Active',
  },
  {
    id: 'KA-01-MN-6789', number: 'KA-01-MN-6789', model: 'Mahindra Supro',
    type: 'Van', typeTint: 'pink', registration: 'REG-KA-2023-6789',
    photo: 'assets/img/coach/coach-07.jpg',
    route: 'Hilltop Feeder', driver: 'Erickson Poe', driverPhoto: 'assets/img/teachers/teacher-01.jpg',
    fuel: 'Electric', seats: 12, mfgYear: 2023,
    insuranceExpiry: '14 Aug 2026', registrationExpiry: '18 Aug 2028', fitnessExpiry: '18 Aug 2026',
    lastService: '04 May 2024', nextService: '04 Aug 2024', status: 'Insurance Expiring',
  },
  {
    id: 'KA-01-OP-1122', number: 'KA-01-OP-1122', model: 'Ashok Leyland Sunshine',
    type: 'School Bus', typeTint: 'primary', registration: 'REG-KA-2020-1122',
    photo: 'assets/img/coach/coach-08.jpg',
    route: 'North Line Express', driver: 'Andrew Fischer', driverPhoto: 'assets/img/teachers/teacher-08.jpg',
    fuel: 'Diesel', seats: 42, mfgYear: 2020,
    insuranceExpiry: '28 Aug 2026', registrationExpiry: '28 Aug 2027', fitnessExpiry: '28 Aug 2026',
    lastService: '12 May 2024', nextService: '12 Aug 2024', status: 'Available',
  },
  {
    id: 'KA-01-QR-4567', number: 'KA-01-QR-4567', model: 'Tata Magic Express',
    type: 'Van', typeTint: 'secondary', registration: 'REG-KA-2016-4567',
    photo: 'assets/img/coach/coach-09.jpg',
    route: '', driver: '', driverPhoto: '',
    fuel: 'Diesel', seats: 8, mfgYear: 2016,
    insuranceExpiry: '10 Jul 2026', registrationExpiry: '22 May 2025', fitnessExpiry: '10 May 2025',
    lastService: '20 Mar 2024', nextService: '—', status: 'Out of Service',
  },
  {
    id: 'KA-01-ST-8899', number: 'KA-01-ST-8899', model: 'Bharat Benz 1624',
    type: 'School Bus', typeTint: 'danger', registration: 'REG-KA-2015-8899',
    photo: 'assets/img/coach/coach-10.jpg',
    route: '', driver: '', driverPhoto: '',
    fuel: 'Diesel', seats: 52, mfgYear: 2015,
    insuranceExpiry: '18 Nov 2024', registrationExpiry: '18 Nov 2024', fitnessExpiry: '18 Nov 2024',
    lastService: '18 Nov 2023', nextService: '—', status: 'Archived',
  },
];
