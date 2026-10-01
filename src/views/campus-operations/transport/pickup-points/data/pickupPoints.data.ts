export type PickupStatus =
  | 'Active'
  | 'Available'
  | 'Temporarily Closed'
  | 'Maintenance'
  | 'Inactive'
  | 'Archived';

export interface PickupPoint {
  id: string;
  /** The template's `dt-code`, e.g. "PP-N101". */
  code: string;
  name: string;
  route: string;
  area: string;
  zone: string;
  address: string;
  landmark: string;
  /** "07:00 AM", or "—" where the stop is not running. */
  boarding: string;
  drop: string;
  /** Kilometres from school; the template prints "14 km". */
  distance: number;
  /** Registration plate, or "—" where no vehicle is assigned. */
  vehicle: string;
  /** Empty where the template prints "No driver". */
  driver: string;
  driverPhone: string;
  driverAvatar: string;
  students: number;
  /** Monthly fee in dollars; printed as "$60/mo". */
  fee: number;
  updated: string;
  status: PickupStatus;
}

export const statusPill: Record<PickupStatus, string> = {
  Active: 'is-active',
  Available: 'is-new',
  'Temporarily Closed': 'is-emergency',
  Maintenance: 'is-exam',
  Inactive: 'is-inactive',
  Archived: 'is-archived',
};

/**
 * Active and Inactive lead their pill with the plain dot; the other four lead
 * with an icon. Null means "render the dot".
 */
export const statusIcon: Record<PickupStatus, string | null> = {
  Active: null,
  Available: 'ti ti-circle-check',
  'Temporarily Closed': 'ti ti-ban',
  Maintenance: 'ti ti-tool',
  Inactive: null,
  Archived: 'ti ti-archive',
};

export const statusBadge: Record<PickupStatus, string> = {
  Active: 'badge badge-soft-success',
  Available: 'badge badge-soft-primary',
  'Temporarily Closed': 'badge badge-soft-danger',
  Maintenance: 'badge badge-soft-warning',
  Inactive: 'badge badge-soft-secondary',
  Archived: 'badge badge-soft-dark',
};

/* ------------------------------ Filter options ------------------------------ */

export const routeOptions = [
  'North Line Express', 'South Valley Route', 'East Meadows Line', 'West Hills Shuttle',
  'Central Loop', 'Lakeside Connector', 'Hilltop Feeder', 'Old Town Circular', 'Legacy Village Run',
];

export const pointOptions = [
  'Riverside Colony Gate', 'Market Square Stop', 'Green Park Junction', 'Sunrise Enclave Stop',
  'Maple Heights Corner', 'City Center Plaza', 'Lakeview Township Stop', 'Hillcrest Villas Gate',
  'Heritage Quarter Stop', 'Old Village Crossing',
];

export const areaOptions = [
  'Riverside', 'Downtown', 'Green Park', 'Sunrise', 'Maple Heights',
  'City Center', 'Lakeview', 'Hillcrest', 'Heritage', 'Old Village',
];

export const zoneOptions = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F', 'Zone G'];

export const vehicleOptions = [
  'KA-01-AB-1234', 'KA-01-CD-5678', 'KA-01-EF-9012', 'KA-01-GH-3456',
  'KA-01-IJ-7890', 'KA-01-KL-2345', 'KA-01-MN-6789', 'KA-01-QR-4567',
];

export const driverOptions = [
  'Marcus Reid', 'Aariv Kumar', 'Ramsey Fox', 'Joseph Ray',
  'Teresa Vale', 'Hendrita Ray', 'Erickson Poe', 'Mori Sato',
];

/** The template's `<option value>`s are "06", "07" and "12"; these are its labels. */
export const boardingOptions = ['Before 07:00 AM', '07:00 – 08:00 AM', 'Afternoon'];

export const statusOptions: PickupStatus[] = [
  'Active', 'Available', 'Temporarily Closed', 'Maintenance', 'Inactive', 'Archived',
];

export const academicYearOptions = ['2024/2025', '2023/2024'];

/* ------------------------------- Derivations -------------------------------- */

/**
 * One tint per route. The template colours the Area badge and the Vehicle badge
 * with the same value on any given row, and both North Line Express rows land
 * on `primary`, so the rotation is a property of the route.
 */
const routeTints: Record<string, string> = {
  'North Line Express': 'primary',
  'South Valley Route': 'info',
  'East Meadows Line': 'success',
  'West Hills Shuttle': 'warning',
  'Central Loop': 'purple',
  'Lakeside Connector': 'teal',
  'Hilltop Feeder': 'pink',
  'Old Town Circular': 'secondary',
  'Legacy Village Run': 'danger',
};

export const routeTint = (row: PickupPoint): string => routeTints[row.route] ?? 'primary';

/** A stop with no vehicle greys its badge out, whatever its route's colour is. */
export const vehicleTint = (row: PickupPoint): string =>
  row.vehicle === '—' ? 'secondary' : routeTint(row);

export const hasVehicle = (row: PickupPoint): boolean => row.vehicle !== '—' && row.vehicle !== '';

export const hasDriver = (row: PickupPoint): boolean => row.driver !== '';

/** "14 km", exactly as the template prints it. */
export const distanceLabel = (row: PickupPoint): string => `${row.distance} km`;

/** "$60", the badge's own text. */
export const feeLabel = (row: PickupPoint): string => `$${row.fee}`;

/** The Boarding Time filter's three buckets, from the boarding hour. */
export const boardingBucket = (row: PickupPoint): string | null => {
  const match = /^(\d{2}):\d{2}\s(AM|PM)$/.exec(row.boarding);
  if (!match) return null;
  const hour = Number(match[1]);
  const isPm = match[2] === 'PM';
  if (isPm) return 'Afternoon';
  return hour < 7 ? 'Before 07:00 AM' : '07:00 – 08:00 AM';
};

/** The Academic Year filter has no column; the update year is the only date. */
export const academicYearOf = (row: PickupPoint): string =>
  row.updated.endsWith('2023') ? '2023/2024' : '2024/2025';

export const descriptionOf = (row: PickupPoint): string =>
  `${row.name} (${row.code}) on ${row.route}, ${row.area} · ${row.zone}, ${row.distance} km from school.`;

export const fullAddressOf = (row: PickupPoint): string =>
  `${row.address}. Landmark: ${row.landmark}.`;

export const assignedStudentsOf = (row: PickupPoint): string =>
  row.students === 0
    ? 'No students assigned to this pickup point yet.'
    : `${row.students} students board here at ${row.boarding}.`;

export const vehicleInfoOf = (row: PickupPoint): string =>
  hasVehicle(row) ? `${row.vehicle} · ${row.route}.` : 'No vehicle assigned.';

/** One remark per status, exactly as the template writes them. */
export const remarksOf = (row: PickupPoint): string => {
  switch (row.status) {
    case 'Inactive':
      return 'Inactive — not operating this term.';
    case 'Available':
      return 'Available — accepting new boarding requests.';
    case 'Maintenance':
      return 'Under maintenance — vehicle substitution in place.';
    case 'Temporarily Closed':
      return 'Temporarily closed — students rerouted to the nearest stop.';
    case 'Archived':
      return 'Archived — pickup point retired, retained for records.';
    case 'Active':
    default:
      return 'Active and operating on schedule.';
  }
};

/** The template's Transport Desk number is the same on every row. */
export const transportDeskPhone = '+1 546 8548 610';

/**
 * Which driver comes with which vehicle, read off the roster below. Assigning a
 * vehicle in the dialog moves its driver across too, so the Assignment Details
 * cell never shows a plate paired with somebody else's photo.
 */
export const vehicleCrew: Record<string, { driver: string; avatar: string }> = {
  'KA-01-AB-1234': { driver: 'Marcus Reid', avatar: 'assets/img/teachers/teacher-06.jpg' },
  'KA-01-CD-5678': { driver: 'Aariv Kumar', avatar: 'assets/img/teachers/teacher-09.jpg' },
  'KA-01-EF-9012': { driver: 'Ramsey Fox', avatar: 'assets/img/teachers/teacher-08.jpg' },
  'KA-01-GH-3456': { driver: 'Joseph Ray', avatar: 'assets/img/teachers/teacher-03.jpg' },
  'KA-01-IJ-7890': { driver: 'Teresa Vale', avatar: 'assets/img/teachers/teacher-05.jpg' },
  'KA-01-KL-2345': { driver: 'Hendrita Ray', avatar: 'assets/img/teachers/teacher-06.jpg' },
  'KA-01-MN-6789': { driver: 'Erickson Poe', avatar: 'assets/img/teachers/teacher-01.jpg' },
  'KA-01-QR-4567': { driver: 'Mori Sato', avatar: 'assets/img/teachers/teacher-02.jpg' },
};

/** The same roster read the other way, for the Add/Edit form's Driver select. */
export const driverAvatars: Record<string, string> = Object.fromEntries(
  Object.values(vehicleCrew).map((crew) => [crew.driver, crew.avatar]),
);

/** The four students the template's Assign Students select offers. */
export const studentOptions = [
  'Janet Daniel — AD202401',
  'Joann Michael — AD202402',
  'Andrew Fischer — AD202409',
  'Ralph Claudia — AD202406',
];

export const importModes = ['Create new pickup points', 'Update existing by code', 'Create and update'];

/** The template's Operating Days row: Mon–Fri ticked, Sat clear. */
export const operatingDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Stamps `updated` the way the template writes it — "12 May 2024". */
export const todayLabel = (): string => {
  const now = new Date();
  return `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;
};

/** Mirrors the template's `data-search` attribute. */
export const searchIndexOf = (row: PickupPoint): string =>
  [
    row.name, row.code, row.route, row.area, row.zone, row.address, row.landmark,
    row.vehicle, row.driver || 'No driver', row.status, row.boarding,
  ]
    .join(' ')
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "12 May 2024" dates. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/* ---------------------------------- Rows ------------------------------------ */

export const pickupPoints: PickupPoint[] = [
  {
    id: 'PP-N101', code: 'PP-N101', name: 'Riverside Colony Gate', route: 'North Line Express',
    area: 'Riverside', zone: 'Zone A',
    address: '12 Riverside Main Rd, Riverside Colony', landmark: 'Near Riverside Park',
    boarding: '07:00 AM', drop: '03:30 PM', distance: 14,
    vehicle: 'KA-01-AB-1234', driver: 'Marcus Reid', driverPhone: '+1 546 8548 608',
    driverAvatar: 'assets/img/teachers/teacher-06.jpg',
    students: 8, fee: 60, updated: '12 May 2024', status: 'Active',
  },
  {
    id: 'PP-N102', code: 'PP-N102', name: 'Market Square Stop', route: 'North Line Express',
    area: 'Downtown', zone: 'Zone A',
    address: '5 Market Square, Downtown', landmark: 'Opposite Central Bank',
    boarding: '07:08 AM', drop: '03:22 PM', distance: 12,
    vehicle: 'KA-01-AB-1234', driver: 'Marcus Reid', driverPhone: '+1 546 8548 606',
    driverAvatar: 'assets/img/teachers/teacher-06.jpg',
    students: 6, fee: 58, updated: '28 Apr 2024', status: 'Inactive',
  },
  {
    id: 'PP-S201', code: 'PP-S201', name: 'Green Park Junction', route: 'South Valley Route',
    area: 'Green Park', zone: 'Zone B',
    address: '88 Green Park Ave, Green Park', landmark: 'Beside Community Hall',
    boarding: '07:10 AM', drop: '03:35 PM', distance: 11,
    vehicle: 'KA-01-CD-5678', driver: 'Aariv Kumar', driverPhone: '+1 546 8548 610',
    driverAvatar: 'assets/img/teachers/teacher-09.jpg',
    students: 10, fee: 55, updated: '11 May 2024', status: 'Available',
  },
  {
    id: 'PP-E301', code: 'PP-E301', name: 'Sunrise Enclave Stop', route: 'East Meadows Line',
    area: 'Sunrise', zone: 'Zone C',
    address: '22 Sunrise Blvd, Sunrise Enclave', landmark: 'Near Sunrise Mall',
    boarding: '06:50 AM', drop: '03:40 PM', distance: 18,
    vehicle: 'KA-01-EF-9012', driver: 'Ramsey Fox', driverPhone: '+1 546 8548 612',
    driverAvatar: 'assets/img/teachers/teacher-08.jpg',
    students: 12, fee: 70, updated: '09 May 2024', status: 'Active',
  },
  {
    id: 'PP-W401', code: 'PP-W401', name: 'Maple Heights Corner', route: 'West Hills Shuttle',
    area: 'Maple Heights', zone: 'Zone D',
    address: '3 Maple Rd, Maple Heights', landmark: 'Near Maple School Gate',
    boarding: '12:30 PM', drop: '05:30 PM', distance: 9,
    vehicle: 'KA-01-GH-3456', driver: 'Joseph Ray', driverPhone: '+1 546 8548 605',
    driverAvatar: 'assets/img/teachers/teacher-03.jpg',
    students: 5, fee: 50, updated: '10 May 2024', status: 'Available',
  },
  {
    id: 'PP-C501', code: 'PP-C501', name: 'City Center Plaza', route: 'Central Loop',
    area: 'City Center', zone: 'Zone A',
    address: '1 Plaza St, City Center', landmark: 'Near Metro Station',
    boarding: '07:20 AM', drop: '03:25 PM', distance: 7,
    vehicle: 'KA-01-IJ-7890', driver: 'Teresa Vale', driverPhone: '+1 546 8548 609',
    driverAvatar: 'assets/img/teachers/teacher-05.jpg',
    students: 9, fee: 45, updated: '08 May 2024', status: 'Active',
  },
  {
    id: 'PP-L601', code: 'PP-L601', name: 'Lakeview Township Stop', route: 'Lakeside Connector',
    area: 'Lakeview', zone: 'Zone E',
    address: '40 Lakeview Rd, Lakeview Township', landmark: 'Near Lakeview Temple',
    boarding: '06:40 AM', drop: '03:45 PM', distance: 22,
    vehicle: 'KA-01-KL-2345', driver: 'Hendrita Ray', driverPhone: '+1 546 8548 614',
    driverAvatar: 'assets/img/teachers/teacher-06.jpg',
    students: 14, fee: 80, updated: '06 May 2024', status: 'Active',
  },
  {
    id: 'PP-H701', code: 'PP-H701', name: 'Hillcrest Villas Gate', route: 'Hilltop Feeder',
    area: 'Hillcrest', zone: 'Zone D',
    address: '7 Hillcrest Villas, Hillcrest', landmark: 'Villa 7 Entrance',
    boarding: '12:15 PM', drop: '05:45 PM', distance: 16,
    vehicle: 'KA-01-MN-6789', driver: 'Erickson Poe', driverPhone: '+1 546 8548 600',
    driverAvatar: 'assets/img/teachers/teacher-01.jpg',
    students: 0, fee: 65, updated: '04 May 2024', status: 'Maintenance',
  },
  {
    id: 'PP-O901', code: 'PP-O901', name: 'Heritage Quarter Stop', route: 'Old Town Circular',
    area: 'Heritage', zone: 'Zone F',
    address: '9 Heritage Ln, Heritage Quarter', landmark: 'Near Old Clock Tower',
    boarding: '—', drop: '—', distance: 12,
    vehicle: '—', driver: '', driverPhone: '+1 546 8548 600',
    driverAvatar: '',
    students: 0, fee: 55, updated: '20 Mar 2024', status: 'Temporarily Closed',
  },
  {
    id: 'PP-V011', code: 'PP-V011', name: 'Old Village Crossing', route: 'Legacy Village Run',
    area: 'Old Village', zone: 'Zone G',
    address: '2 Village Rd, Old Village', landmark: 'Near Village Well',
    boarding: '06:45 AM', drop: '03:55 PM', distance: 20,
    vehicle: 'KA-01-QR-4567', driver: 'Mori Sato', driverPhone: '+1 546 8548 600',
    driverAvatar: 'assets/img/teachers/teacher-02.jpg',
    students: 0, fee: 75, updated: '18 Nov 2023', status: 'Archived',
  },
];
