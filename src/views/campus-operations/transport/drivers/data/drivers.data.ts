export type DriverStatus =
  | 'Active' | 'Available' | 'On Duty' | 'On Leave'
  | 'License Expiring' | 'Suspended' | 'Inactive';

/** The licence badge the template prints under the expiry date. */
export type Verification = 'Verified' | 'Pending' | 'Suspended' | 'Expired';

export type LicenseType = 'Heavy (HMV)' | 'Light (LMV)';

export interface Driver {
  id: string;
  /** The template's `dt-code`, e.g. "DRV-1001". */
  code: string;
  name: string;
  /** `assets/img/teachers/teacher-06.jpg`, straight off the template. */
  avatar: string;
  phone: string;
  email: string;
  licenseNo: string;
  licenseType: LicenseType;
  issued: string;
  expires: string;
  verification: Verification;
  /** Palette tint on the licence-number badge; the template cycles them. */
  licTone: string;
  /** Blank when the template prints "No vehicle". */
  vehicle: string;
  /** Blank when the template prints "No route". */
  route: string;
  /** Years of service — stored, because the joining dates do not imply it. */
  experience: number;
  joined: string;
  emergency: string;
  status: DriverStatus;
}

export const statusPill: Record<DriverStatus, string> = {
  Active: 'is-active',
  Available: 'is-new',
  'On Duty': 'is-exam',
  'On Leave': 'is-pending',
  'License Expiring': 'is-emergency',
  Suspended: 'is-archived',
  Inactive: 'is-inactive',
};

/**
 * Active and Inactive draw the plain dot; every other status leads its pill
 * with an icon instead. Null means "render the dot".
 */
export const statusIcon: Record<DriverStatus, string | null> = {
  Active: null,
  Available: 'ti ti-circle-check',
  'On Duty': 'ti ti-steering-wheel',
  'On Leave': 'ti ti-plane-departure',
  'License Expiring': 'ti ti-alert-triangle',
  Suspended: 'ti ti-ban',
  Inactive: null,
};

export const statusBadge: Record<DriverStatus, string> = {
  Active: 'badge badge-soft-success',
  Available: 'badge badge-soft-primary',
  'On Duty': 'badge badge-soft-info',
  'On Leave': 'badge badge-soft-warning',
  'License Expiring': 'badge badge-soft-danger',
  Suspended: 'badge badge-soft-purple',
  Inactive: 'badge badge-soft-secondary',
};

/** The tint on the "Verified / Pending / Suspended / Expired" licence badge. */
export const verificationBadge: Record<Verification, string> = {
  Verified: 'badge badge-soft-success',
  Pending: 'badge badge-soft-warning',
  Suspended: 'badge badge-soft-purple',
  Expired: 'badge badge-soft-danger',
};

/* ------------------------------ Filter options ------------------------------ */

export const driverOptions = [
  'Marcus Reid', 'Aariv Kumar', 'Ramsey Fox', 'Joseph Ray', 'Teresa Vale',
  'Hendrita Ray', 'Erickson Poe', 'Joann Michael', 'Mori Sato', 'Andrew Fischer',
];

export const vehicleOptions = [
  'KA-01-AB-1234', 'KA-01-CD-5678', 'KA-01-EF-9012', 'KA-01-GH-3456',
  'KA-01-IJ-7890', 'KA-01-KL-2345', 'KA-01-MN-6789', 'KA-01-OP-1122',
];

export const routeOptions = [
  'North Line Express', 'South Valley Route', 'East Meadows Line',
  'West Hills Shuttle', 'Central Loop', 'Lakeside Connector', 'Hilltop Feeder',
];

export const licenseTypeOptions: LicenseType[] = ['Heavy (HMV)', 'Light (LMV)'];

export const expiryOptions = ['Expired / 2025', 'Expiring 2026', '2027 & later'];

export const employmentOptions: Verification[] = ['Verified', 'Pending', 'Suspended'];

export const availabilityOptions = ['Available', 'On Duty', 'On Leave'];

export const statusOptions: DriverStatus[] = [
  'Active', 'Available', 'On Duty', 'On Leave', 'License Expiring', 'Suspended', 'Inactive',
];

export const academicYearOptions = ['2024/2025', '2023/2024'];

export const shiftOptions = ['Morning', 'Afternoon', 'Both'];

export const verificationOptions: Verification[] = ['Verified', 'Pending', 'Suspended', 'Expired'];

/* ------------------------------- Derivations -------------------------------- */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "20 Aug 2026" dates. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

export const yearOf = (value: string): number => Number(value.split(' ')[2] ?? 0);

/** The three bands behind the License Expiry select. */
export const expiryBand = (row: Driver): string => {
  const year = yearOf(row.expires);
  if (year <= 2025) return 'Expired / 2025';
  if (year === 2026) return 'Expiring 2026';
  return '2027 & later';
};

export const hasVehicle = (row: Driver): boolean => row.vehicle !== '';

export const hasRoute = (row: Driver): boolean => row.route !== '';

/** The template prints an em dash in `data-search` for an unassigned slot. */
const dash = (value: string): string => (value === '' ? '—' : value);

/**
 * No row carries an academic year, so the roster supplies one: a driver still
 * in service belongs to the current year, a suspended or inactive one to the
 * year they were last rostered.
 */
export const academicYearOf = (row: Driver): string =>
  row.status === 'Suspended' || row.status === 'Inactive' ? '2023/2024' : '2024/2025';

/** "KA-01-AB-1234 · operating on North Line Express." */
export const vehicleSentenceOf = (row: Driver): string => {
  if (!hasVehicle(row)) return 'No vehicle currently assigned.';
  return hasRoute(row)
    ? `${row.vehicle} · operating on ${row.route}.`
    : `${row.vehicle} · awaiting a route assignment.`;
};

/** "North Line Express — morning and afternoon shifts." */
export const routeSentenceOf = (row: Driver): string =>
  hasRoute(row) ? `${row.route} — morning and afternoon shifts.` : 'No route currently assigned.';

/** The panel caption under the avatar: "DRV-1001 · 9 yrs". */
export const captionOf = (row: Driver): string => `${row.code} · ${row.experience} yrs`;

/** The preview's subtitle: "DRV-1001 · Heavy (HMV) · 9 yrs experience". */
export const subtitleOf = (row: Driver): string =>
  `${row.code} · ${row.licenseType} · ${row.experience} yrs experience`;

export const contactLineOf = (row: Driver): string => `${row.phone} · ${row.email}`;

export const licenseLineOf = (row: Driver): string =>
  `${row.licenseNo} · Expires ${row.expires} · ${row.verification}.`;

export const assignmentLineOf = (row: Driver): string =>
  hasVehicle(row) ? `${row.vehicle} · ${row.route || 'no route'}.` : 'No vehicle currently assigned.';

/** One remark per status, exactly as the template writes them. */
export const remarksOf = (row: Driver): string => {
  switch (row.status) {
    case 'On Leave':
      return 'On approved leave; substitute driver assigned.';
    case 'License Expiring':
      return 'License expiring soon — schedule renewal before the expiry date.';
    case 'Suspended':
      return 'Suspended — pending license review; not on active duty.';
    case 'Inactive':
      return 'Inactive — license expired, awaiting renewal.';
    default:
      return 'In good standing and operating on schedule.';
  }
};

/** The three certification chips the template repeats on every panel. */
export const certifications: { label: string; badge: string }[] = [
  { label: 'Defensive Driving', badge: 'badge badge-soft-success' },
  { label: 'First Aid', badge: 'badge badge-soft-info' },
  { label: 'Child Safety', badge: 'badge badge-soft-warning' },
];

/** The transport desk line is the same on every panel. */
export const transportDesk = '+1 546 8548 610';

/** Mirrors the template's `data-search` attribute, em dashes included. */
export const searchIndexOf = (row: Driver): string =>
  [
    row.name, row.code, row.phone, row.email, row.licenseNo, row.licenseType,
    dash(row.vehicle), dash(row.route), row.status, row.verification,
  ]
    .join(' ')
    .toLowerCase();

/* ---------------------------------- Rows ------------------------------------ */

export const drivers: Driver[] = [
  {
    id: 'DRV-1001', code: 'DRV-1001', name: 'Marcus Reid',
    avatar: 'assets/img/teachers/teacher-06.jpg',
    phone: '+1 546 8548 601', email: 'marcus.reid@example.com',
    licenseNo: 'LC-KA-778901', licenseType: 'Heavy (HMV)',
    issued: '14 Mar 2019', expires: '20 Aug 2026', verification: 'Verified', licTone: 'primary',
    vehicle: 'KA-01-AB-1234', route: 'North Line Express',
    experience: 9, joined: '12 Jun 2019', emergency: '+1 546 8548 610', status: 'On Duty',
  },
  {
    id: 'DRV-1002', code: 'DRV-1002', name: 'Aariv Kumar',
    avatar: 'assets/img/teachers/teacher-09.jpg',
    phone: '+1 546 8548 602', email: 'aariv.kumar@example.com',
    licenseNo: 'LC-KA-661245', licenseType: 'Heavy (HMV)',
    issued: '02 Jan 2020', expires: '11 Feb 2027', verification: 'Verified', licTone: 'info',
    vehicle: 'KA-01-CD-5678', route: 'South Valley Route',
    experience: 7, joined: '18 Feb 2020', emergency: '+1 546 8548 611', status: 'Active',
  },
  {
    id: 'DRV-1003', code: 'DRV-1003', name: 'Ramsey Fox',
    avatar: 'assets/img/teachers/teacher-08.jpg',
    phone: '+1 546 8548 603', email: 'ramsey.fox@example.com',
    licenseNo: 'LC-KA-559832', licenseType: 'Heavy (HMV)',
    issued: '22 Sep 2018', expires: '30 Sep 2026', verification: 'Verified', licTone: 'success',
    vehicle: 'KA-01-EF-9012', route: 'East Meadows Line',
    experience: 11, joined: '05 Oct 2018', emergency: '+1 546 8548 612', status: 'Available',
  },
  {
    id: 'DRV-1004', code: 'DRV-1004', name: 'Joseph Ray',
    avatar: 'assets/img/teachers/teacher-03.jpg',
    phone: '+1 546 8548 604', email: 'joseph.ray@example.com',
    licenseNo: 'LC-KA-443210', licenseType: 'Light (LMV)',
    issued: '19 May 2021', expires: '12 Sep 2026', verification: 'Pending', licTone: 'warning',
    vehicle: 'KA-01-GH-3456', route: 'West Hills Shuttle',
    experience: 5, joined: '20 May 2021', emergency: '+1 546 8548 613', status: 'On Leave',
  },
  {
    id: 'DRV-1005', code: 'DRV-1005', name: 'Teresa Vale',
    avatar: 'assets/img/teachers/teacher-05.jpg',
    phone: '+1 546 8548 605', email: 'teresa.vale@example.com',
    licenseNo: 'LC-KA-330091', licenseType: 'Heavy (HMV)',
    issued: '08 Aug 2017', expires: '25 Aug 2026', verification: 'Verified', licTone: 'purple',
    vehicle: 'KA-01-IJ-7890', route: 'Central Loop',
    experience: 12, joined: '14 Sep 2017', emergency: '+1 546 8548 614', status: 'On Duty',
  },
  {
    id: 'DRV-1006', code: 'DRV-1006', name: 'Hendrita Ray',
    avatar: 'assets/img/teachers/teacher-06.jpg',
    phone: '+1 546 8548 606', email: 'hendrita.ray@example.com',
    licenseNo: 'LC-KA-220456', licenseType: 'Heavy (HMV)',
    issued: '11 Nov 2016', expires: '05 Sep 2026', verification: 'Verified', licTone: 'teal',
    vehicle: 'KA-01-KL-2345', route: 'Lakeside Connector',
    experience: 14, joined: '03 Jan 2017', emergency: '+1 546 8548 615', status: 'Active',
  },
  {
    id: 'DRV-1007', code: 'DRV-1007', name: 'Erickson Poe',
    avatar: 'assets/img/teachers/teacher-01.jpg',
    phone: '+1 546 8548 607', email: 'erickson.poe@example.com',
    licenseNo: 'LC-KA-118273', licenseType: 'Light (LMV)',
    issued: '27 Feb 2022', expires: '18 Aug 2026', verification: 'Verified', licTone: 'pink',
    vehicle: 'KA-01-MN-6789', route: 'Hilltop Feeder',
    experience: 4, joined: '01 Mar 2022', emergency: '+1 546 8548 616', status: 'License Expiring',
  },
  {
    id: 'DRV-1008', code: 'DRV-1008', name: 'Joann Michael',
    avatar: 'assets/img/teachers/teacher-04.jpg',
    phone: '+1 546 8548 608', email: 'joann.michael@example.com',
    licenseNo: 'LC-KA-090512', licenseType: 'Heavy (HMV)',
    issued: '30 Jun 2015', expires: '10 Jul 2026', verification: 'Suspended', licTone: 'secondary',
    vehicle: '', route: '',
    experience: 15, joined: '12 Jul 2015', emergency: '+1 546 8548 617', status: 'Suspended',
  },
  {
    id: 'DRV-1009', code: 'DRV-1009', name: 'Mori Sato',
    avatar: 'assets/img/teachers/teacher-02.jpg',
    phone: '+1 546 8548 609', email: 'mori.sato@example.com',
    licenseNo: 'LC-KA-071634', licenseType: 'Light (LMV)',
    issued: '05 Apr 2014', expires: '22 May 2025', verification: 'Expired', licTone: 'danger',
    vehicle: '', route: '',
    experience: 16, joined: '19 Apr 2014', emergency: '+1 546 8548 618', status: 'Inactive',
  },
  {
    id: 'DRV-1010', code: 'DRV-1010', name: 'Andrew Fischer',
    avatar: 'assets/img/teachers/teacher-08.jpg',
    phone: '+1 546 8548 620', email: 'andrew.fischer@example.com',
    licenseNo: 'LC-KA-063847', licenseType: 'Heavy (HMV)',
    issued: '16 Dec 2020', expires: '28 Aug 2026', verification: 'Verified', licTone: 'primary',
    vehicle: 'KA-01-OP-1122', route: 'North Line Express',
    experience: 6, joined: '09 Jan 2021', emergency: '+1 546 8548 621', status: 'Available',
  },
];
