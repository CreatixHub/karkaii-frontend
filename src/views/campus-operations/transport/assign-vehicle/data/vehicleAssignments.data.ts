export type AssignmentStatus =
  | 'Active'
  | 'Ending Soon'
  | 'Driver Pending'
  | 'Vehicle Pending'
  | 'Suspended';

export type RouteType = 'Morning & Evening' | 'Morning Only' | 'Evening Only' | 'Activity / Special';

export interface Pair {
  label: string;
  value: string;
}

export interface VehicleAssignment {
  id: string;
  /** The template's "ASG-2026-001". */
  code: string;
  /** Empty on a unit still waiting for a vehicle. */
  vehicle: string;
  /** "42-seater bus"; empty alongside an empty vehicle. */
  vehicleKind: string;
  vehicleModel: string;
  fitnessValid: string;
  gpsDevice: string;
  /** Empty on a unit still waiting for a driver. */
  driver: string;
  driverCode: string;
  routeCode: string;
  routeName: string;
  /** Tint the template hands each route badge; it cycles and is not derived. */
  routeTint: string;
  routeType: RouteType;
  /** Seats on the vehicle, or 0 where no vehicle is paired. */
  capacity: number;
  students: number;
  /** "07:00 – 07:55 AM", or "" on an evening-only unit. */
  morning: string;
  /** "03:40 – 04:25 PM", or "" on a morning-only unit. */
  evening: string;
  academicYear: string;
  /** The label the pill prints — "Ending 01 Aug" carries its date. */
  statusLabel: string;
  status: AssignmentStatus;
  notes: string;
}

export const statusPill: Record<AssignmentStatus, string> = {
  Active: 'is-active',
  'Ending Soon': 'is-suspended',
  'Driver Pending': 'is-pending',
  'Vehicle Pending': 'is-review',
  Suspended: 'is-blocked',
};

/** Every pill on this page leads with the plain dot; none carries an icon. */
export const statusIcon: Record<AssignmentStatus, string | null> = {
  Active: null,
  'Ending Soon': null,
  'Driver Pending': null,
  'Vehicle Pending': null,
  Suspended: null,
};

export const statusBadge: Record<AssignmentStatus, string> = {
  Active: 'badge badge-soft-success',
  'Ending Soon': 'badge badge-soft-warning',
  'Driver Pending': 'badge badge-soft-warning',
  'Vehicle Pending': 'badge badge-soft-info',
  Suspended: 'badge badge-soft-danger',
};

/* ------------------------------ Filter options ------------------------------ */

export const NOT_ASSIGNED = 'Not assigned';

export const vehicleOptions = [
  'TN-09-BC-4471', 'TN-09-BC-1145', 'TN-09-BC-2218', 'TN-09-BC-8890',
  'TN-09-BC-6602', 'TN-09-BC-3390', 'TN-09-BC-7724', NOT_ASSIGNED,
];

export const driverOptions = [
  'James Miller', 'Daniel Cruz', 'Peter Hall', 'Anthony Reed',
  'Victor Adams', 'Marcus Bell', 'Owen Fisher', NOT_ASSIGNED,
];

export const routeOptions = [
  'RT-01 · North Corridor', 'RT-02 · South Corridor', 'RT-03 · Central Loop',
  'RT-04 · East Corridor', 'RT-05 · Hill Route', 'RT-06 · Riverside',
  'RT-07 · West Corridor', 'RT-09 · Outer Ring',
];

export const statusOptions: AssignmentStatus[] = [
  'Active', 'Driver Pending', 'Vehicle Pending', 'Ending Soon', 'Suspended',
];

export const academicYearOptions = ['2026 / 2027', '2025 / 2026'];

export const routeTypeOptions: RouteType[] = [
  'Morning & Evening', 'Morning Only', 'Evening Only', 'Activity / Special',
];

export const occupancyOptions = [
  'Full — no seats free', 'Nearly full — under 5 free', 'Under 50% occupied', 'Empty',
];

export const completenessOptions = [
  'Complete — vehicle, driver & route', 'Missing driver', 'Missing vehicle', 'Missing route',
];

/* -------------------------------- Derivations ------------------------------- */

export const hasVehicle = (row: VehicleAssignment): boolean => row.vehicle !== '';
export const hasDriver = (row: VehicleAssignment): boolean => row.driver !== '';
export const hasRoute = (row: VehicleAssignment): boolean => row.routeCode !== '';

export const seatsFree = (row: VehicleAssignment): number =>
  Math.max(0, row.capacity - row.students);

export const occupancyPct = (row: VehicleAssignment): number =>
  row.capacity === 0 ? 0 : Math.round((row.students / row.capacity) * 100);

/** The template's four Occupancy bands. */
export const occupancyBand = (row: VehicleAssignment): string => {
  if (row.students === 0) return 'Empty';
  if (seatsFree(row) === 0) return 'Full — no seats free';
  if (seatsFree(row) < 5) return 'Nearly full — under 5 free';
  return occupancyPct(row) < 50 ? 'Under 50% occupied' : 'Nearly full — under 5 free';
};

/** What the unit is missing; the whole page turns on this. */
export const completeness = (row: VehicleAssignment): string => {
  if (!hasVehicle(row)) return 'Missing vehicle';
  if (!hasDriver(row)) return 'Missing driver';
  if (!hasRoute(row)) return 'Missing route';
  return 'Complete — vehicle, driver & route';
};

export const isComplete = (row: VehicleAssignment): boolean =>
  completeness(row) === 'Complete — vehicle, driver & route';

export const capacityLabel = (row: VehicleAssignment): string =>
  row.capacity === 0 ? '—' : `${row.capacity} seats`;

export const studentsLabel = (row: VehicleAssignment): string =>
  row.capacity === 0 ? String(row.students) : `${row.students} of ${row.capacity}`;

export const routeLabel = (row: VehicleAssignment): string =>
  hasRoute(row) ? `${row.routeCode} · ${row.routeName}` : 'No route';

export const vehicleLabel = (row: VehicleAssignment): string =>
  hasVehicle(row) ? row.vehicle : 'Not assigned';

export const driverLabel = (row: VehicleAssignment): string =>
  hasDriver(row) ? row.driver : 'Not assigned';

/** The read-only Assignment field every dialog opens with. */
export const assignmentLabel = (row: VehicleAssignment): string =>
  `${row.code} · ${routeLabel(row)}`;

export const searchIndexOf = (row: VehicleAssignment): string =>
  `${row.code} ${row.vehicle} ${row.driver} ${row.routeCode} ${row.routeName} ${row.routeType} ${row.statusLabel}`
    .toLowerCase();

/** Sortable key for the template's "ASG-2026-001" ids. */
export const codeKey = (value: string): number => Number(value.replace(/\D/g, '')) || 0;

/* ----------------------------------- Rows ----------------------------------- */

export const vehicleAssignments: VehicleAssignment[] = [
  {
    id: 'ASG-2026-001', code: 'ASG-2026-001',
    vehicle: 'TN-09-BC-4471', vehicleKind: '42-seater bus', vehicleModel: 'Ashok Leyland Lynx',
    fitnessValid: '31 Mar 2027', gpsDevice: 'GPS-0041',
    driver: 'James Miller', driverCode: 'DRV-1004',
    routeCode: 'RT-01', routeName: 'North Corridor', routeTint: 'primary',
    routeType: 'Morning & Evening', capacity: 42, students: 38,
    morning: '07:00 – 07:55 AM', evening: '03:40 – 04:25 PM',
    academicYear: '2026 / 2027', statusLabel: 'Active', status: 'Active',
    notes: 'Busiest unit in the fleet. Hold two of the four free seats for the incoming Class I intake.',
  },
  {
    id: 'ASG-2026-002', code: 'ASG-2026-002',
    vehicle: 'TN-09-BC-1145', vehicleKind: '42-seater bus', vehicleModel: 'Ashok Leyland Lynx',
    fitnessValid: '31 Mar 2027', gpsDevice: 'GPS-0045',
    driver: 'Daniel Cruz', driverCode: 'DRV-1007',
    routeCode: 'RT-02', routeName: 'South Corridor', routeTint: 'success',
    routeType: 'Morning & Evening', capacity: 42, students: 38,
    morning: '06:55 – 07:50 AM', evening: '03:40 – 04:22 PM',
    academicYear: '2026 / 2027', statusLabel: 'Active', status: 'Active',
    notes: 'Receiving the 18 students from the Route 04 closure. Capacity will need review before 01 Aug.',
  },
  {
    id: 'ASG-2026-004', code: 'ASG-2026-004',
    vehicle: 'TN-09-BC-2218', vehicleKind: '36-seater bus', vehicleModel: 'Tata Starbus',
    fitnessValid: '31 Mar 2027', gpsDevice: 'GPS-0052',
    driver: 'Peter Hall', driverCode: 'DRV-1009',
    routeCode: 'RT-04', routeName: 'East Corridor', routeTint: 'warning',
    routeType: 'Morning & Evening', capacity: 36, students: 18,
    morning: '07:15 – 08:00 AM', evening: '03:40 – 04:15 PM',
    academicYear: '2026 / 2027', statusLabel: 'Ending 01 Aug', status: 'Ending Soon',
    notes: 'Unit dissolves on 01 Aug. Vehicle and driver both free to pair with the new Central Loop route.',
  },
  {
    id: 'ASG-2026-007', code: 'ASG-2026-007',
    vehicle: 'TN-09-BC-8890', vehicleKind: '28-seater mini bus', vehicleModel: 'Force Traveller',
    fitnessValid: '30 Jun 2027', gpsDevice: 'GPS-0061',
    driver: 'Anthony Reed', driverCode: 'DRV-1012',
    routeCode: 'RT-07', routeName: 'West Corridor', routeTint: 'info',
    routeType: 'Morning & Evening', capacity: 28, students: 24,
    morning: '07:25 – 08:05 AM', evening: '03:45 – 04:20 PM',
    academicYear: '2026 / 2027', statusLabel: 'Active', status: 'Active',
    notes: 'Uses the side gate to avoid the main-gate queue. Shortest corridor in the fleet.',
  },
  {
    id: 'ASG-2026-009', code: 'ASG-2026-009',
    vehicle: 'TN-09-BC-6602', vehicleKind: '28-seater mini bus', vehicleModel: 'Force Traveller',
    fitnessValid: '30 Jun 2027', gpsDevice: 'GPS-0066',
    driver: 'Victor Adams', driverCode: 'DRV-1015',
    routeCode: 'RT-09', routeName: 'Outer Ring', routeTint: 'danger',
    routeType: 'Morning & Evening', capacity: 28, students: 26,
    morning: '06:45 – 07:55 AM', evening: '03:40 – 04:48 PM',
    academicYear: '2026 / 2027', statusLabel: 'Active', status: 'Active',
    notes: 'Longest unit at 63 minutes each way. Monitor driver duty hours against the 8-hour limit.',
  },
  {
    id: 'ASG-2026-003', code: 'ASG-2026-003',
    vehicle: 'TN-09-BC-3390', vehicleKind: '36-seater bus', vehicleModel: 'Tata Starbus',
    fitnessValid: '31 Mar 2027', gpsDevice: 'GPS-0049',
    driver: '', driverCode: '',
    routeCode: 'RT-03', routeName: 'Central Loop', routeTint: 'purple',
    routeType: 'Morning Only', capacity: 36, students: 0,
    morning: '07:15 – 07:52 AM', evening: '',
    academicYear: '2026 / 2027', statusLabel: 'Driver Pending', status: 'Driver Pending',
    notes: 'Unit incomplete — assign a driver before the schedule can be published. Peter Hall frees up on 01 Aug.',
  },
  {
    id: 'ASG-2026-005', code: 'ASG-2026-005',
    vehicle: '', vehicleKind: '', vehicleModel: '',
    fitnessValid: '—', gpsDevice: '—',
    driver: 'Marcus Bell', driverCode: 'DRV-1018',
    routeCode: 'RT-05', routeName: 'Hill Route', routeTint: 'secondary',
    routeType: 'Evening Only', capacity: 0, students: 14,
    morning: '', evening: '03:50 – 04:35 PM',
    academicYear: '2026 / 2027', statusLabel: 'Vehicle Pending', status: 'Vehicle Pending',
    notes: 'Evening-only unit for the late activity clubs. A 28-seater is sufficient for the 14 booked students.',
  },
  {
    id: 'ASG-2026-006', code: 'ASG-2026-006',
    vehicle: 'TN-09-BC-7724', vehicleKind: '42-seater bus', vehicleModel: 'Ashok Leyland Lynx',
    fitnessValid: '31 Mar 2027', gpsDevice: 'GPS-0058',
    driver: 'Owen Fisher', driverCode: 'DRV-1021',
    routeCode: 'RT-06', routeName: 'Riverside', routeTint: 'primary',
    routeType: 'Morning & Evening', capacity: 42, students: 34,
    morning: '06:50 – 07:48 AM', evening: '03:35 – 04:10 PM',
    academicYear: '2026 / 2027', statusLabel: 'Suspended', status: 'Suspended',
    notes: 'Suspended pending the vehicle fitness renewal. Driver reassigned to relief duty until cleared.',
  },
];
