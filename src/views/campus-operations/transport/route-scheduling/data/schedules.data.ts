export type ScheduleStatus = 'Active' | 'Scheduled' | 'Draft' | 'Closing' | 'Suspended';

export type RouteType = 'Morning & Evening' | 'Morning Only' | 'Evening Only' | 'Activity / Special';

export interface Schedule {
  id: string;
  /** The template's "RT-01". */
  code: string;
  name: string;
  /** Tint the template hands the row avatar and the code badge; it cycles. */
  tint: string;
  routeType: RouteType;
  /** Empty where the template prints "Awaiting allocation". */
  vehicle: string;
  /** "42-seater", or "" alongside an empty vehicle. */
  vehicleKind: string;
  /** Empty where the template prints "Unassigned". */
  driver: string;
  driverCode: string;
  /** "07:10 AM", or "" on an evening-only route. */
  morningTime: string;
  morningStop: string;
  /** "04:25 PM", or "" on a morning-only route. */
  eveningTime: string;
  eveningStop: string;
  stops: number;
  /** Seats on the paired vehicle; 0 where none is assigned. */
  capacity: number;
  students: number;
  /** The corridor the route runs, for the Corridor filter. */
  corridor: string;
  academicYear: string;
  updated: string;
  /** The label the pill prints — "Closing 01 Aug" carries its date. */
  statusLabel: string;
  status: ScheduleStatus;
  notes: string;
}

export const statusPill: Record<ScheduleStatus, string> = {
  Active: 'is-active',
  Scheduled: 'is-review',
  Draft: 'is-pending',
  Closing: 'is-suspended',
  Suspended: 'is-blocked',
};

/** Every pill on this page leads with the plain dot; none carries an icon. */
export const statusIcon: Record<ScheduleStatus, string | null> = {
  Active: null,
  Scheduled: null,
  Draft: null,
  Closing: null,
  Suspended: null,
};

export const statusBadge: Record<ScheduleStatus, string> = {
  Active: 'badge badge-soft-success',
  Scheduled: 'badge badge-soft-info',
  Draft: 'badge badge-soft-warning',
  Closing: 'badge badge-soft-warning',
  Suspended: 'badge badge-soft-danger',
};

/* ------------------------------ Filter options ------------------------------ */

export const NOT_ASSIGNED = 'Not assigned';

export const statusOptions: ScheduleStatus[] = [
  'Active', 'Scheduled', 'Draft', 'Closing', 'Suspended',
];

export const routeTypeOptions: RouteType[] = [
  'Morning & Evening', 'Morning Only', 'Evening Only', 'Activity / Special',
];

export const vehicleOptions = [
  'TN-09-BC-4471', 'TN-09-BC-1145', 'TN-09-BC-2218', 'TN-09-BC-8890',
  'TN-09-BC-6602', 'TN-09-BC-3390', 'TN-09-BC-7724', NOT_ASSIGNED,
];

export const driverOptions = [
  'James Miller', 'Daniel Cruz', 'Peter Hall', 'Anthony Reed',
  'Victor Adams', 'Marcus Bell', 'Owen Fisher', NOT_ASSIGNED,
];

export const academicYearOptions = ['2026 / 2027', '2025 / 2026'];

export const occupancyOptions = [
  'Full — no seats free', 'Nearly full — under 5 free', 'Under 50% occupied', 'Empty',
];

export const stopsOptions = ['Under 6 stops', '6 – 9 stops', 'Over 9 stops'];

export const corridorOptions = [
  'North Corridor', 'South Corridor', 'East Corridor', 'West Corridor',
  'Outer Ring', 'Central Loop', 'Riverside', 'Hill Route',
];

export const shiftOptions = ['Morning', 'Afternoon', 'Both'];

/* -------------------------------- Derivations ------------------------------- */

export const hasVehicle = (row: Schedule): boolean => row.vehicle !== '';
export const hasDriver = (row: Schedule): boolean => row.driver !== '';

export const missingVehicle = (row: Schedule): boolean => !hasVehicle(row);
export const missingDriver = (row: Schedule): boolean => !hasDriver(row);

export const seatsFree = (row: Schedule): number => Math.max(0, row.capacity - row.students);

export const occupancyPct = (row: Schedule): number =>
  row.capacity === 0 ? 0 : Math.round((row.students / row.capacity) * 100);

/** The template's four Occupancy bands. */
export const occupancyBand = (row: Schedule): string => {
  if (row.students === 0) return 'Empty';
  if (seatsFree(row) === 0) return 'Full — no seats free';
  if (seatsFree(row) < 5) return 'Nearly full — under 5 free';
  return occupancyPct(row) < 50 ? 'Under 50% occupied' : 'Nearly full — under 5 free';
};

/** The template's three Total Stops bands. */
export const stopsBand = (row: Schedule): string => {
  if (row.stops < 6) return 'Under 6 stops';
  return row.stops <= 9 ? '6 – 9 stops' : 'Over 9 stops';
};

export const vehicleLabel = (row: Schedule): string =>
  hasVehicle(row) ? row.vehicle : 'Awaiting allocation';

export const driverLabel = (row: Schedule): string => (hasDriver(row) ? row.driver : 'Unassigned');

export const capacityLabel = (row: Schedule): string =>
  row.capacity === 0 ? '—' : `${row.capacity} seats`;

export const studentsLabel = (row: Schedule): string =>
  row.capacity === 0 ? String(row.students) : `${row.students} of ${row.capacity}`;

export const stopsLabel = (row: Schedule): string => `${row.stops} stops`;

/** The read-only Route field every dialog opens with. */
export const routeLabel = (row: Schedule): string => `${row.code} · ${row.name}`;

export const searchIndexOf = (row: Schedule): string =>
  `${row.code} ${row.name} ${row.routeType} ${row.vehicle} ${row.driver} ${row.corridor} ${row.statusLabel}`
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/** Sortable key for "07:10 AM" / "04:25 PM"; blank sorts last. */
export const timeKey = (value: string): number => {
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hour += 12;
  return hour * 60 + Number(match[2]);
};

/* ----------------------------------- Rows ----------------------------------- */

export const schedules: Schedule[] = [
  {
    id: 'RT-01', code: 'RT-01', name: 'North Corridor', tint: 'primary',
    routeType: 'Morning & Evening',
    vehicle: 'TN-09-BC-4471', vehicleKind: '42-seater',
    driver: 'James Miller', driverCode: 'DRV-1004',
    morningTime: '07:10 AM', morningStop: 'Green Park Gate',
    eveningTime: '04:25 PM', eveningStop: 'School Main Gate',
    stops: 9, capacity: 42, students: 42, corridor: 'North Corridor',
    academicYear: '2026 / 2027', updated: '30 Jul 2026',
    statusLabel: 'Active', status: 'Active',
    notes: 'Running at full capacity. Any new intake needs a second unit on this corridor.',
  },
  {
    id: 'RT-02', code: 'RT-02', name: 'South Corridor', tint: 'success',
    routeType: 'Morning & Evening',
    vehicle: 'TN-09-BC-1145', vehicleKind: '42-seater',
    driver: 'Daniel Cruz', driverCode: 'DRV-1007',
    morningTime: '07:05 AM', morningStop: 'Market Road Stop',
    eveningTime: '04:22 PM', eveningStop: 'School Main Gate',
    stops: 8, capacity: 42, students: 38, corridor: 'South Corridor',
    academicYear: '2026 / 2027', updated: '30 Jul 2026',
    statusLabel: 'Active', status: 'Active',
    notes: 'Absorbing the East Corridor students from 01 Aug. Four seats free today.',
  },
  {
    id: 'RT-04', code: 'RT-04', name: 'East Corridor', tint: 'warning',
    routeType: 'Morning & Evening',
    vehicle: 'TN-09-BC-2218', vehicleKind: '36-seater',
    driver: 'Peter Hall', driverCode: 'DRV-1009',
    morningTime: '07:25 AM', morningStop: 'Lakeview Junction',
    eveningTime: '04:15 PM', eveningStop: 'School Main Gate',
    stops: 7, capacity: 36, students: 18, corridor: 'East Corridor',
    academicYear: '2026 / 2027', updated: '29 Jul 2026',
    statusLabel: 'Closing 01 Aug', status: 'Closing',
    notes: 'Closing on 01 Aug. Students move to South Corridor; vehicle and driver free up.',
  },
  {
    id: 'RT-07', code: 'RT-07', name: 'West Corridor', tint: 'info',
    routeType: 'Morning & Evening',
    vehicle: 'TN-09-BC-8890', vehicleKind: '28-seater',
    driver: 'Anthony Reed', driverCode: 'DRV-1012',
    morningTime: '07:32 AM', morningStop: 'Hillside Cross',
    eveningTime: '04:20 PM', eveningStop: 'School Side Gate',
    stops: 6, capacity: 28, students: 24, corridor: 'West Corridor',
    academicYear: '2026 / 2027', updated: '28 Jul 2026',
    statusLabel: 'Active', status: 'Active',
    notes: 'Shortest corridor at six stops. Uses the side gate to avoid the main-gate queue.',
  },
  {
    id: 'RT-09', code: 'RT-09', name: 'Outer Ring', tint: 'danger',
    routeType: 'Morning & Evening',
    vehicle: 'TN-09-BC-6602', vehicleKind: '28-seater',
    driver: 'Victor Adams', driverCode: 'DRV-1015',
    morningTime: '06:52 AM', morningStop: 'Fern Hill Gate',
    eveningTime: '04:48 PM', eveningStop: 'School Side Gate',
    stops: 11, capacity: 28, students: 26, corridor: 'Outer Ring',
    academicYear: '2026 / 2027', updated: '30 Jul 2026',
    statusLabel: 'Active', status: 'Active',
    notes: 'Longest schedule in the fleet. Monitor driver duty hours against the 8-hour limit.',
  },
  {
    id: 'RT-03', code: 'RT-03', name: 'Central Loop', tint: 'purple',
    routeType: 'Morning Only',
    vehicle: 'TN-09-BC-3390', vehicleKind: '36-seater',
    driver: '', driverCode: '',
    morningTime: '07:20 AM', morningStop: 'Central Square',
    eveningTime: '', eveningStop: '',
    stops: 7, capacity: 36, students: 0, corridor: 'Central Loop',
    academicYear: '2026 / 2027', updated: '31 Jul 2026',
    statusLabel: 'Draft', status: 'Draft',
    notes: 'Draft schedule — assign a driver before it can be published. Peter Hall frees up on 01 Aug.',
  },
  {
    id: 'RT-05', code: 'RT-05', name: 'Hill Route', tint: 'secondary',
    routeType: 'Evening Only',
    vehicle: '', vehicleKind: '',
    driver: 'Marcus Bell', driverCode: 'DRV-1018',
    morningTime: '', morningStop: '',
    eveningTime: '04:35 PM', eveningStop: 'School Main Gate',
    stops: 5, capacity: 0, students: 14, corridor: 'Hill Route',
    academicYear: '2026 / 2027', updated: '27 Jul 2026',
    statusLabel: 'Scheduled', status: 'Scheduled',
    notes: 'Evening-only run for the late activity clubs. A 28-seater covers the 14 booked students.',
  },
  {
    id: 'RT-06', code: 'RT-06', name: 'Riverside Express', tint: 'primary',
    routeType: 'Morning & Evening',
    vehicle: 'TN-09-BC-7724', vehicleKind: '42-seater',
    driver: 'Owen Fisher', driverCode: 'DRV-1021',
    morningTime: '07:00 AM', morningStop: 'Riverside Depot',
    eveningTime: '04:10 PM', eveningStop: 'School Main Gate',
    stops: 8, capacity: 42, students: 34, corridor: 'Riverside',
    academicYear: '2026 / 2027', updated: '24 Jul 2026',
    statusLabel: 'Suspended', status: 'Suspended',
    notes: 'Suspended pending the vehicle fitness renewal. Driver on relief duty until cleared.',
  },
];
