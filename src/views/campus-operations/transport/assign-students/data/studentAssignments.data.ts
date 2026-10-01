export type AssignmentStatus =
  | 'Assigned'
  | 'Awaiting Assignment'
  | 'Stop Change Requested'
  | 'Route Closing'
  | 'Suspended';

export type FeeState =
  | 'Paid in full'
  | 'Partially paid'
  | 'Overdue'
  | 'Concession applied'
  | 'Not billed';

export interface StudentAssignment {
  id: string;
  name: string;
  /** Template path, rendered through `ImageWithBasePath`. */
  photo: string;
  /** "Roll 35011". */
  roll: string;
  admissionNo: string;
  /** "III A" — class and section together, as the template prints it. */
  className: string;
  /** Empty on a student still awaiting a route. */
  routeCode: string;
  routeName: string;
  /** Tint the template hands each route badge; it cycles and is not derived. */
  routeTint: string;
  vehicle: string;
  /** "42 seats", or "" alongside an empty vehicle. */
  vehicleSeats: string;
  driver: string;
  driverCode: string;
  pickupPoint: string;
  /** "—" until a route is assigned. */
  dropPoint: string;
  /** "A-12", or "—" until a seat is allocated. */
  seatNo: string;
  /** "$320", or "—" where nothing has been billed. */
  fee: string;
  /** The note under the amount; drives `feeState`. */
  feeNote: string;
  academicYear: string;
  status: AssignmentStatus;
  notes: string;
}

export const statusPill: Record<AssignmentStatus, string> = {
  Assigned: 'is-active',
  'Awaiting Assignment': 'is-pending',
  'Stop Change Requested': 'is-review',
  'Route Closing': 'is-suspended',
  Suspended: 'is-blocked',
};

/** Every pill on this page leads with the plain dot; none carries an icon. */
export const statusIcon: Record<AssignmentStatus, string | null> = {
  Assigned: null,
  'Awaiting Assignment': null,
  'Stop Change Requested': null,
  'Route Closing': null,
  Suspended: null,
};

export const statusBadge: Record<AssignmentStatus, string> = {
  Assigned: 'badge badge-soft-success',
  'Awaiting Assignment': 'badge badge-soft-warning',
  'Stop Change Requested': 'badge badge-soft-info',
  'Route Closing': 'badge badge-soft-warning',
  Suspended: 'badge badge-soft-danger',
};

export const feeBadge: Record<FeeState, string> = {
  'Paid in full': 'badge badge-soft-success',
  'Partially paid': 'badge badge-soft-warning',
  Overdue: 'badge badge-soft-danger',
  'Concession applied': 'badge badge-soft-info',
  'Not billed': 'badge badge-soft-secondary',
};

/* ------------------------------ Filter options ------------------------------ */

export const NOT_ASSIGNED = 'Not assigned';

export const academicYearOptions = ['2026 / 2027', '2025 / 2026'];

export const statusOptions: AssignmentStatus[] = [
  'Assigned', 'Awaiting Assignment', 'Stop Change Requested', 'Route Closing', 'Suspended',
];

export const classOptions = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export const sectionOptions = ['A', 'B', 'C', 'D'];

export const routeOptions = [
  'Route 01 · North Corridor', 'Route 02 · South Corridor', 'Route 04 · East Corridor',
  'Route 07 · West Corridor', 'Route 09 · Outer Ring', NOT_ASSIGNED,
];

export const vehicleOptions = [
  'TN-09-BC-4471', 'TN-09-BC-1145', 'TN-09-BC-2218', 'TN-09-BC-8890', 'TN-09-BC-6602',
];

export const pickupPointOptions = [
  'Green Park Gate', 'Riverside Stop', 'Lakeview Junction', 'Market Road Stop',
  'Old Mill Stop', 'Hillside Cross', 'Fern Hill Gate', 'Central Square',
];

export const dropPointOptions = ['School Main Gate', 'School Side Gate'];

export const feeOptions: FeeState[] = [
  'Paid in full', 'Partially paid', 'Overdue', 'Concession applied', 'Not billed',
];

/* -------------------------------- Derivations ------------------------------- */

export const isAssigned = (row: StudentAssignment): boolean => row.routeCode !== '';

export const routeLabel = (row: StudentAssignment): string =>
  isAssigned(row) ? `${row.routeCode} · ${row.routeName}` : NOT_ASSIGNED;

export const vehicleLabel = (row: StudentAssignment): string => row.vehicle || NOT_ASSIGNED;

export const driverLabel = (row: StudentAssignment): string => row.driver || NOT_ASSIGNED;

/** The class letter alone, for the Class filter ("III A" -> "III"). */
export const classOf = (row: StudentAssignment): string => row.className.split(' ')[0] ?? '';

/** The section letter alone, for the Section filter ("III A" -> "A"). */
export const sectionOf = (row: StudentAssignment): string => row.className.split(' ')[1] ?? '';

/** Read off the note the template prints under the amount. */
export const feeState = (row: StudentAssignment): FeeState => {
  const note = row.feeNote.toLowerCase();
  if (note.includes('concession')) return 'Concession applied';
  if (note.includes('overdue')) return 'Overdue';
  if (note.includes('outstanding')) return 'Partially paid';
  if (note.includes('paid')) return 'Paid in full';
  return 'Not billed';
};

/** Seats on the paired vehicle; 0 where none is assigned. */
export const vehicleCapacity = (row: StudentAssignment): number =>
  Number(row.vehicleSeats.replace(/\D/g, '')) || 0;

export const searchIndexOf = (row: StudentAssignment): string =>
  `${row.name} ${row.roll} ${row.admissionNo} ${row.className} ${row.routeCode} ${row.routeName} `
  + `${row.vehicle} ${row.driver} ${row.pickupPoint} ${row.seatNo}`.toLowerCase();

/* ----------------------------------- Rows ----------------------------------- */

export const studentAssignments: StudentAssignment[] = [
  {
    id: 'AD9892434', name: 'Janet Daniel', photo: 'assets/img/students/student-01.jpg',
    roll: 'Roll 35011', admissionNo: 'AD9892434', className: 'III A',
    routeCode: 'Route 01', routeName: 'North Corridor', routeTint: 'primary',
    vehicle: 'TN-09-BC-4471', vehicleSeats: '42 seats', driver: 'James Miller', driverCode: 'DRV-1004',
    pickupPoint: 'Green Park Gate', dropPoint: 'School Main Gate', seatNo: 'A-12',
    fee: '$320', feeNote: 'Term I paid', academicYear: '2026 / 2027', status: 'Assigned',
    notes: 'Boards at the main gate stop. Parent contact confirmed for the term.',
  },
  {
    id: 'AD9892433', name: 'Joann Michael', photo: 'assets/img/students/student-02.jpg',
    roll: 'Roll 35102', admissionNo: 'AD9892433', className: 'IV B',
    routeCode: 'Route 04', routeName: 'East Corridor', routeTint: 'warning',
    vehicle: 'TN-09-BC-2218', vehicleSeats: '36 seats', driver: 'Peter Hall', driverCode: 'DRV-1009',
    pickupPoint: 'Lakeview Junction', dropPoint: 'School Main Gate', seatNo: 'B-08',
    fee: '$320', feeNote: '$320 outstanding', academicYear: '2026 / 2027', status: 'Route Closing',
    notes: 'Route 04 closes on 01 Aug. Re-seat onto Route 02 before the term starts.',
  },
  {
    id: 'AD9892432', name: 'Kathleen Dison', photo: 'assets/img/students/student-03.jpg',
    roll: 'Roll 35013', admissionNo: 'AD9892432', className: 'III A',
    routeCode: 'Route 01', routeName: 'North Corridor', routeTint: 'primary',
    vehicle: 'TN-09-BC-4471', vehicleSeats: '42 seats', driver: 'James Miller', driverCode: 'DRV-1004',
    pickupPoint: 'Riverside Stop', dropPoint: 'School Main Gate', seatNo: 'A-19',
    fee: '$120', feeNote: 'Concession applied', academicYear: '2026 / 2027', status: 'Assigned',
    notes: 'Staff-child concession applied for the full year.',
  },
  {
    id: 'AD9892431', name: 'Lisa Gourley', photo: 'assets/img/students/student-04.jpg',
    roll: 'Roll 35204', admissionNo: 'AD9892431', className: 'II B',
    routeCode: 'Route 07', routeName: 'West Corridor', routeTint: 'info',
    vehicle: 'TN-09-BC-8890', vehicleSeats: '28 seats', driver: 'Anthony Reed', driverCode: 'DRV-1012',
    pickupPoint: 'Hillside Cross', dropPoint: 'School Side Gate', seatNo: 'C-04',
    fee: '$360', feeNote: 'Term I paid', academicYear: '2026 / 2027', status: 'Assigned',
    notes: 'Uses the side gate; shortest corridor in the fleet.',
  },
  {
    id: 'AD9892430', name: 'Ralph Claudia', photo: 'assets/img/students/student-05.jpg',
    roll: 'Roll 35505', admissionNo: 'AD9892430', className: 'V A',
    routeCode: '', routeName: '', routeTint: 'secondary',
    vehicle: '', vehicleSeats: '', driver: '', driverCode: '',
    pickupPoint: 'Central Square', dropPoint: '—', seatNo: '—',
    fee: '—', feeNote: 'Not billed', academicYear: '2026 / 2027', status: 'Awaiting Assignment',
    notes: 'Requested Central Square. No route currently covers it — pending the Central Loop launch.',
  },
  {
    id: 'AD9892429', name: 'Julie Scott', photo: 'assets/img/students/student-06.jpg',
    roll: 'Roll 35606', admissionNo: 'AD9892429', className: 'VI A',
    routeCode: 'Route 02', routeName: 'South Corridor', routeTint: 'success',
    vehicle: 'TN-09-BC-1145', vehicleSeats: '42 seats', driver: 'Daniel Cruz', driverCode: 'DRV-1007',
    pickupPoint: 'Market Road Stop', dropPoint: 'School Main Gate', seatNo: 'D-21',
    fee: '$300', feeNote: 'Term I paid', academicYear: '2026 / 2027', status: 'Assigned',
    notes: 'Settled on Route 02 since the start of the year.',
  },
  {
    id: 'AD9892428', name: 'Susan Boswell', photo: 'assets/img/students/student-07.jpg',
    roll: 'Roll 35407', admissionNo: 'AD9892428', className: 'IV A',
    routeCode: 'Route 02', routeName: 'South Corridor', routeTint: 'success',
    vehicle: 'TN-09-BC-1145', vehicleSeats: '42 seats', driver: 'Daniel Cruz', driverCode: 'DRV-1007',
    pickupPoint: 'Old Mill Stop', dropPoint: 'School Main Gate', seatNo: 'D-26',
    fee: '$300', feeNote: 'Term I paid', academicYear: '2026 / 2027', status: 'Stop Change Requested',
    notes: 'Parent has asked to move to Market Road Stop from 01 Aug. Seat stays on the same unit.',
  },
  {
    id: 'AD9892427', name: 'Richard Soley', photo: 'assets/img/students/student-08.jpg',
    roll: 'Roll 35508', admissionNo: 'AD9892427', className: 'V B',
    routeCode: 'Route 09', routeName: 'Outer Ring', routeTint: 'danger',
    vehicle: 'TN-09-BC-6602', vehicleSeats: '28 seats', driver: 'Victor Adams', driverCode: 'DRV-1015',
    pickupPoint: 'Fern Hill Gate', dropPoint: 'School Side Gate', seatNo: 'E-07',
    fee: '$270', feeNote: '$560 overdue', academicYear: '2026 / 2027', status: 'Suspended',
    notes: 'Transport suspended pending fee clearance. Seat held until the end of the month.',
  },
];
