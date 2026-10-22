export type RouteStatus = 'Active' | 'In Service' | 'Scheduled' | 'Maintenance' | 'Suspended' | 'Archived';

export interface TransportRoute {
  id: string;
  /** The template's `dt-code`, e.g. "RT-N01". */
  code: string;
  name: string;
  /** Printed as "14 km" in the row badge and in the panel's first sentence. */
  distanceKm: number;
  /** The template's `dt-start` — the route's first boarding point. */
  boardingPoint: string;
  /** The template's `dt-dest`; every route runs to the same school. */
  destination: string;
  /** Registration plate, or "" when no vehicle is assigned. */
  vehicle: string;
  /** "Bus (54)" / "Mini Bus (24)", or "" when unassigned. */
  vehicleType: string;
  /** Driver name, or "" when unassigned. */
  driver: string;
  driverAvatar: string;
  driverPhone: string;
  shift: 'Morning' | 'Afternoon';
  /** "45 min", "1 hr 05 min" — or the template's em dash when unscheduled. */
  duration: string;
  pickup: string;
  drop: string;
  stops: number;
  students: number;
  /** Monthly fee in dollars; printed as "$60"/mo. */
  fee: number;
  academicYear: string;
  updated: string;
  status: RouteStatus;
}

export const statusPill: Record<RouteStatus, string> = {
  Active: 'is-active',
  'In Service': 'is-pending',
  Scheduled: 'is-new',
  Maintenance: 'is-exam',
  Suspended: 'is-emergency',
  Archived: 'is-archived',
};

/**
 * Only Active draws the plain dot; every other status leads its pill with an
 * icon instead. Null means "render the dot".
 */
export const statusIcon: Record<RouteStatus, string | null> = {
  Active: null,
  'In Service': 'ti ti-bus',
  Scheduled: 'ti ti-calendar-event',
  Maintenance: 'ti ti-tool',
  Suspended: 'ti ti-player-pause',
  Archived: 'ti ti-archive',
};

export const statusBadge: Record<RouteStatus, string> = {
  Active: 'badge badge-soft-success',
  'In Service': 'badge badge-soft-warning',
  Scheduled: 'badge badge-soft-primary',
  Maintenance: 'badge badge-soft-info',
  Suspended: 'badge badge-soft-danger',
  Archived: 'badge badge-soft-secondary',
};

/* ------------------------------ Filter options ------------------------------ */

export const routeOptions = [
  'North Line Express', 'South Valley Route', 'East Meadows Line', 'West Hills Shuttle', 'Central Loop',
  'Lakeside Connector', 'Hilltop Feeder', 'Airport Road Line', 'Old Town Circular', 'Legacy Village Run',
];

export const vehicleOptions = [
  'KA-01-AB-1234', 'KA-01-CD-5678', 'KA-01-EF-9012', 'KA-01-GH-3456', 'KA-01-IJ-7890',
  'KA-01-KL-2345', 'KA-01-MN-6789', 'KA-01-OP-0123', 'KA-01-QR-4567',
];

export const driverOptions = [
  'Marcus Reid', 'Aariv Kumar', 'Ramsey Fox', 'Joseph Ray', 'Teresa Vale',
  'Hendrita Ray', 'Erickson Poe', 'Morgan Hale', 'Mori Sato',
];

export const boardingPointOptions = [
  'Riverside Colony', 'Green Park', 'Sunrise Enclave', 'Maple Heights', 'City Center',
  'Lakeview Township', 'Hillcrest Villas', 'Skyline Residency', 'Heritage Quarter', 'Old Village',
];

export const destinationOptions = ['Global International School'];

export const shiftOptions: TransportRoute['shift'][] = ['Morning', 'Afternoon'];

export const statusOptions: RouteStatus[] = [
  'Active', 'Scheduled', 'In Service', 'Maintenance', 'Suspended', 'Archived',
];

export const academicYearOptions = ['2024/2025', '2023/2024'];

/**
 * The Assign Vehicle dialog's own list, plate and type in one string — the
 * template writes them as "KA-01-AB-1234 — Bus (54)".
 */
export const fleetOptions: { plate: string; type: string }[] = [
  { plate: 'KA-01-AB-1234', type: 'Bus (54)' },
  { plate: 'KA-01-CD-5678', type: 'Bus (40)' },
  { plate: 'KA-01-EF-9012', type: 'Bus (54)' },
  { plate: 'KA-01-GH-3456', type: 'Mini Bus (24)' },
  { plate: 'KA-01-IJ-7890', type: 'Bus (40)' },
  { plate: 'KA-01-KL-2345', type: 'Bus (54)' },
  { plate: 'KA-01-MN-6789', type: 'Mini Bus (24)' },
  { plate: 'KA-01-OP-0123', type: 'Bus (54)' },
  { plate: 'KA-01-QR-4567', type: 'Bus (40)' },
];

export const fleetLabel = (entry: { plate: string; type: string }): string =>
  `${entry.plate} — ${entry.type}`;

/* ------------------------------- Derivations -------------------------------- */

/** The template's em dash, used wherever a route has no assignment yet. */
export const DASH = '—';

export const vehicleLabel = (row: TransportRoute): string => row.vehicle || DASH;

/** The second badge reads the seat class, or "Unassigned" when there is none. */
export const vehicleTypeLabel = (row: TransportRoute): string => row.vehicleType || 'Unassigned';

export const driverLabel = (row: TransportRoute): string => row.driver || DASH;

/** "Bus (54)" → 54. The Assign Vehicle dialog prints this as a read-only field. */
export const seatsOf = (vehicleType: string): number => {
  const match = /\((\d+)\)/.exec(vehicleType);
  return match ? Number(match[1]) : 0;
};

export const distanceLabel = (row: TransportRoute): string => `${row.distanceKm} km`;

export const feeLabel = (row: TransportRoute): string => `$${row.fee}`;

export const routeInfoOf = (row: TransportRoute): string =>
  `${row.name} (${row.code}) — ${row.boardingPoint} to ${row.destination}, ${row.distanceKm} km across `
  + `${row.stops} stops. ${row.shift} shift, ${row.duration}.`;

export const stopsInfoOf = (row: TransportRoute): string =>
  `${row.stops} stops · pickup ${row.pickup} · drop ${row.drop}.`;

export const studentsInfoOf = (row: TransportRoute): string =>
  row.students === 0
    ? 'No students assigned to this route yet.'
    : `${row.students} students boarding across ${row.stops} stops.`;

export const vehicleInfoOf = (row: TransportRoute): string =>
  row.vehicle ? `${row.vehicle} · ${row.vehicleType}.` : 'No vehicle assigned.';

/** The Remarks paragraph is a function of the status alone in all ten rows. */
export const remarksOf = (row: TransportRoute): string => {
  switch (row.status) {
    case 'In Service':
      return 'Currently in service — tracking live.';
    case 'Scheduled':
      return 'Scheduled — starts on the next working day.';
    case 'Maintenance':
      return 'Vehicle under maintenance — temporary substitution in place.';
    case 'Suspended':
      return 'Suspended — awaiting vehicle and driver reassignment.';
    case 'Archived':
      return 'Archived — route retired, retained for records.';
    case 'Active':
    default:
      return 'Active and running on schedule.';
  }
};

/** The View Route dialog's sub-line. */
export const routeSummaryOf = (row: TransportRoute): string =>
  `${row.code} · ${row.boardingPoint} → ${row.destination} · ${row.distanceKm} km · ${row.shift}`;

/** The read-only Route field every assignment dialog opens with. */
export const routeFieldOf = (row: TransportRoute): string => `${row.name} — ${row.code}`;

/**
 * The template's Manage Route Stops table hard-codes five stops for a route it
 * calls a nine-stop route. The list is generated from the row instead, so the
 * dialog can never contradict the grid: the first stop is the boarding point,
 * the last is the destination, and the students spread evenly across them.
 */
export interface RouteStop {
  order: number;
  name: string;
  pickup: string;
  students: number;
}

const intermediateStopNames = [
  'Market Square', 'Rose Garden', 'Central Library', 'Hill View', 'Temple Road',
  'Sports Complex', 'Civic Centre', 'Garden Cross', 'Bus Depot', 'Town Hall',
  'Riverbank Road', 'Cross Junction',
];

/** "07:00 AM" plus n minutes, kept in the template's 12-hour format. */
export const addMinutes = (time: string, minutes: number): string => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return DASH;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hour += 12;
  const total = (hour * 60 + Number(match[2]) + minutes) % (24 * 60);
  const h24 = Math.floor(total / 60);
  const suffix = h24 < 12 ? 'AM' : 'PM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h12).padStart(2, '0')}:${String(total % 60).padStart(2, '0')} ${suffix}`;
};

export const stopsOf = (row: TransportRoute): RouteStop[] => {
  const base = Math.floor(row.students / row.stops);
  const spare = row.students - base * row.stops;
  return Array.from({ length: row.stops }, (_, index) => {
    const name =
      index === 0 ? row.boardingPoint
        : index === row.stops - 1 ? row.destination
          : intermediateStopNames[(index - 1) % intermediateStopNames.length];
    return {
      order: index + 1,
      name,
      pickup: row.pickup === DASH ? DASH : addMinutes(row.pickup, index * 8),
      students: base + (index < spare ? 1 : 0),
    };
  });
};

/** Mirrors the template's `data-search` attribute. */
export const searchIndexOf = (row: TransportRoute): string =>
  [
    row.name, row.code, row.boardingPoint, row.destination, vehicleLabel(row),
    driverLabel(row), row.shift, row.status, row.academicYear, `stops ${row.stops}`,
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

export const transportRoutes: TransportRoute[] = [
  {
    id: 'RT-N01', code: 'RT-N01', name: 'North Line Express', distanceKm: 14,
    boardingPoint: 'Riverside Colony', destination: 'Global International School',
    vehicle: 'KA-01-AB-1234', vehicleType: 'Bus (54)',
    driver: 'Marcus Reid', driverAvatar: 'assets/img/teachers/teacher-06.jpg',
    driverPhone: '+1 546 8548 609',
    shift: 'Morning', duration: '45 min', pickup: '07:00 AM', drop: '03:30 PM',
    stops: 9, students: 42, fee: 60, academicYear: '2024/2025', updated: '12 May 2024',
    status: 'Active',
  },
  {
    id: 'RT-S02', code: 'RT-S02', name: 'South Valley Route', distanceKm: 11,
    boardingPoint: 'Green Park', destination: 'Global International School',
    vehicle: 'KA-01-CD-5678', vehicleType: 'Bus (40)',
    driver: 'Aariv Kumar', driverAvatar: 'assets/img/teachers/teacher-09.jpg',
    driverPhone: '+1 546 8548 607',
    shift: 'Morning', duration: '35 min', pickup: '07:10 AM', drop: '03:35 PM',
    stops: 7, students: 34, fee: 55, academicYear: '2024/2025', updated: '11 May 2024',
    status: 'In Service',
  },
  {
    id: 'RT-E03', code: 'RT-E03', name: 'East Meadows Line', distanceKm: 18,
    boardingPoint: 'Sunrise Enclave', destination: 'Global International School',
    vehicle: 'KA-01-EF-9012', vehicleType: 'Bus (54)',
    driver: 'Ramsey Fox', driverAvatar: 'assets/img/teachers/teacher-08.jpg',
    driverPhone: '+1 546 8548 611',
    shift: 'Morning', duration: '55 min', pickup: '06:50 AM', drop: '03:40 PM',
    stops: 11, students: 48, fee: 70, academicYear: '2024/2025', updated: '09 May 2024',
    status: 'Active',
  },
  {
    id: 'RT-W04', code: 'RT-W04', name: 'West Hills Shuttle', distanceKm: 9,
    boardingPoint: 'Maple Heights', destination: 'Global International School',
    vehicle: 'KA-01-GH-3456', vehicleType: 'Mini Bus (24)',
    driver: 'Joseph Ray', driverAvatar: 'assets/img/teachers/teacher-03.jpg',
    driverPhone: '+1 546 8548 605',
    shift: 'Afternoon', duration: '28 min', pickup: '12:30 PM', drop: '05:30 PM',
    stops: 5, students: 20, fee: 50, academicYear: '2024/2025', updated: '10 May 2024',
    status: 'Scheduled',
  },
  {
    id: 'RT-C05', code: 'RT-C05', name: 'Central Loop', distanceKm: 7,
    boardingPoint: 'City Center', destination: 'Global International School',
    vehicle: 'KA-01-IJ-7890', vehicleType: 'Bus (40)',
    driver: 'Teresa Vale', driverAvatar: 'assets/img/teachers/teacher-05.jpg',
    driverPhone: '+1 546 8548 606',
    shift: 'Morning', duration: '25 min', pickup: '07:20 AM', drop: '03:25 PM',
    stops: 6, students: 30, fee: 45, academicYear: '2024/2025', updated: '08 May 2024',
    status: 'Active',
  },
  {
    id: 'RT-L06', code: 'RT-L06', name: 'Lakeside Connector', distanceKm: 22,
    boardingPoint: 'Lakeview Township', destination: 'Global International School',
    vehicle: 'KA-01-KL-2345', vehicleType: 'Bus (54)',
    driver: 'Hendrita Ray', driverAvatar: 'assets/img/teachers/teacher-06.jpg',
    driverPhone: '+1 546 8548 613',
    shift: 'Morning', duration: '1 hr 05 min', pickup: '06:40 AM', drop: '03:45 PM',
    stops: 13, students: 50, fee: 80, academicYear: '2024/2025', updated: '06 May 2024',
    status: 'In Service',
  },
  {
    id: 'RT-H07', code: 'RT-H07', name: 'Hilltop Feeder', distanceKm: 16,
    boardingPoint: 'Hillcrest Villas', destination: 'Global International School',
    vehicle: 'KA-01-MN-6789', vehicleType: 'Mini Bus (24)',
    driver: 'Erickson Poe', driverAvatar: 'assets/img/teachers/teacher-01.jpg',
    driverPhone: '+1 546 8548 608',
    shift: 'Afternoon', duration: '48 min', pickup: '12:15 PM', drop: '05:45 PM',
    stops: 8, students: 18, fee: 65, academicYear: '2024/2025', updated: '04 May 2024',
    status: 'Maintenance',
  },
  {
    id: 'RT-A08', code: 'RT-A08', name: 'Airport Road Line', distanceKm: 25,
    boardingPoint: 'Skyline Residency', destination: 'Global International School',
    vehicle: 'KA-01-OP-0123', vehicleType: 'Bus (54)',
    driver: 'Morgan Hale', driverAvatar: 'assets/img/teachers/teacher-10.jpg',
    driverPhone: '+1 546 8548 614',
    shift: 'Morning', duration: '1 hr 15 min', pickup: '06:30 AM', drop: '03:50 PM',
    stops: 14, students: 46, fee: 90, academicYear: '2024/2025', updated: '01 May 2024',
    status: 'Active',
  },
  {
    id: 'RT-O09', code: 'RT-O09', name: 'Old Town Circular', distanceKm: 12,
    boardingPoint: 'Heritage Quarter', destination: 'Global International School',
    vehicle: '', vehicleType: '',
    driver: '', driverAvatar: 'assets/img/teachers/teacher-04.jpg',
    driverPhone: '+1 546 8548 606',
    shift: 'Morning', duration: DASH, pickup: DASH, drop: DASH,
    stops: 6, students: 0, fee: 55, academicYear: '2024/2025', updated: '20 Mar 2024',
    status: 'Suspended',
  },
  {
    id: 'RT-V10', code: 'RT-V10', name: 'Legacy Village Run', distanceKm: 20,
    boardingPoint: 'Old Village', destination: 'Global International School',
    vehicle: 'KA-01-QR-4567', vehicleType: 'Bus (40)',
    driver: 'Mori Sato', driverAvatar: 'assets/img/teachers/teacher-02.jpg',
    driverPhone: '+1 546 8548 610',
    shift: 'Morning', duration: '58 min', pickup: '06:45 AM', drop: '03:55 PM',
    stops: 10, students: 0, fee: 75, academicYear: '2023/2024', updated: '18 Nov 2023',
    status: 'Archived',
  },
];

/** The transport desk line is the same on every row of the template. */
export const TRANSPORT_DESK_PHONE = '+1 546 8548 610';
