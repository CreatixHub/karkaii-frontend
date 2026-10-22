export type VehicleState = 'On Trip' | 'Active' | 'Idle' | 'Offline';
export type GpsState = 'Online' | 'Offline';
export type TripKind = 'Morning Pickup' | 'Afternoon Drop';

export interface UpcomingStop {
  name: string;
  eta: string;
}

export interface Vehicle {
  id: string;
  /** "BUS-12". */
  name: string;
  registration: string;
  tint: string;
  state: VehicleState;
  stateTint: string;
  gps: GpsState;
  speed: number;
  students: number;
  route: string;
  driver: string;
  assistant: string;
  location: string;
  nextStop: string;
  nextStopEta: string;
  fuel: number;
  trip: TripKind;
  branch: string;

  /* Right pane — Vehicle tab. */
  address: string;
  lastUpdate: string;
  odometer: string;
  todayDistance: string;
  engine: string;
  ac: string;

  /* Right pane — Route tab. */
  totalStops: number;
  stopsCovered: number;
  routeDistance: string;
  estDuration: string;
  upcoming: UpcomingStop[];

  /* Right pane — Driver tab. */
  driverExperience: string;
  driverPhone: string;
  driverLicence: string;
  driverLicenceYear: string;
  driverRating: string;

  /* Right pane — Students tab. */
  pickedUp: number;
  remaining: number;
  nextStudent: string;
  arrivalTime: string;
  parentNotification: string;

  /* Trip panel. */
  tripStart: string;
  estArrival: string;
  delay: string;
  totalDistance: string;
  avgSpeed: string;
}

export type AlertLevel = 'Critical' | 'Warning' | 'Info';

export interface FleetAlert {
  id: string;
  title: string;
  detail: string;
  level: AlertLevel;
  icon: string;
  /** Which vehicle the alert is about, so clicking it selects that bus. */
  vehicle: string;
}

export const alertTint: Record<AlertLevel, string> = {
  Critical: 'danger',
  Warning: 'warning',
  Info: 'info',
};

export const stateBadge: Record<VehicleState, string> = {
  'On Trip': 'badge badge-soft-success',
  Active: 'badge badge-soft-success',
  Idle: 'badge badge-soft-secondary',
  Offline: 'badge badge-soft-danger',
};

/* -------------------------------- Derivations ------------------------------- */

/** The template ships four bars: 100 and 75 success, 50 warning, 25 danger. */
export const fuelTint = (level: number): string => {
  if (level <= 25) return 'danger';
  return level <= 50 ? 'warning' : 'success';
};

export const isOnTrip = (vehicle: Vehicle): boolean =>
  vehicle.state === 'On Trip' || vehicle.state === 'Active';

export const stopsRemaining = (vehicle: Vehicle): number =>
  Math.max(0, vehicle.totalStops - vehicle.stopsCovered);

export const completionPct = (vehicle: Vehicle): number =>
  vehicle.totalStops === 0 ? 0 : Math.round((vehicle.stopsCovered / vehicle.totalStops) * 100);

export const searchIndexOf = (vehicle: Vehicle): string =>
  `${vehicle.name} ${vehicle.route} ${vehicle.driver} ${vehicle.registration}`.toLowerCase();

/* ------------------------------- Filter options ----------------------------- */

export const routeOptions = ['Route 5 · North Loop', 'Route 8 · Hill View', 'Route 3 · Lake Side'];
export const driverOptions = ['Ramesh Kumar', 'Anil Mehta', 'Vijay Rao'];
export const vehicleStatusOptions = ['On Trip', 'Idle', 'Offline'];
export const gpsStatusOptions = ['Online', 'Offline'];
export const tripOptions: TripKind[] = ['Morning Pickup', 'Afternoon Drop'];
export const branchOptions = ['Main Campus', 'North Branch', 'West Branch'];

/* ---------------------------------- Fleet ----------------------------------- */

export const fleet: Vehicle[] = [
  {
    id: 'BUS-12', name: 'BUS-12', registration: 'KA-01-F-2340', tint: 'primary',
    state: 'On Trip', stateTint: 'success', gps: 'Online', speed: 32, students: 28,
    route: 'Route 5 · North Loop', driver: 'Ramesh Kumar', assistant: 'Latha Menon',
    location: 'Near Oak Street', nextStop: 'Maple Avenue', nextStopEta: '4 min',
    fuel: 75, trip: 'Morning Pickup', branch: 'Main Campus',
    address: 'Oak Street, Sector 12', lastUpdate: '12 sec ago', odometer: '84,210 km',
    todayDistance: '18.4 km', engine: 'Running', ac: 'On',
    totalStops: 10, stopsCovered: 5, routeDistance: '22.6 km', estDuration: '55 min',
    upcoming: [
      { name: 'Maple Avenue', eta: '4 min' },
      { name: 'Cedar Cross', eta: '9 min' },
      { name: 'Garden Gate', eta: '15 min' },
    ],
    driverExperience: '8 yrs experience', driverPhone: '+1 46548 84400',
    driverLicence: 'DL-0420', driverLicenceYear: '2019', driverRating: '4.8 / 5',
    pickedUp: 18, remaining: 10, nextStudent: 'Meera Iyer', arrivalTime: '07:46 AM',
    parentNotification: 'Sent',
    tripStart: '07:10 AM', estArrival: '08:05 AM', delay: '+6 min',
    totalDistance: '18.4 km', avgSpeed: '29 km/h',
  },
  {
    id: 'BUS-21', name: 'BUS-21', registration: 'KA-01-F-2341', tint: 'info',
    state: 'Active', stateTint: 'success', gps: 'Online', speed: 41, students: 31,
    route: 'Route 8 · Hill View', driver: 'Anil Mehta', assistant: 'Priya Nair',
    location: 'Pine Road', nextStop: 'Cedar Cross', nextStopEta: '7 min',
    fuel: 50, trip: 'Morning Pickup', branch: 'Main Campus',
    address: 'Pine Road, Sector 4', lastUpdate: '20 sec ago', odometer: '76,540 km',
    todayDistance: '15.2 km', engine: 'Running', ac: 'On',
    totalStops: 12, stopsCovered: 6, routeDistance: '25.1 km', estDuration: '62 min',
    upcoming: [
      { name: 'Cedar Cross', eta: '7 min' },
      { name: 'Hill Top', eta: '13 min' },
      { name: 'Summit Road', eta: '21 min' },
    ],
    driverExperience: '6 yrs experience', driverPhone: '+1 46548 84401',
    driverLicence: 'DL-0518', driverLicenceYear: '2020', driverRating: '4.6 / 5',
    pickedUp: 20, remaining: 11, nextStudent: 'Arjun Rao', arrivalTime: '07:52 AM',
    parentNotification: 'Sent',
    tripStart: '07:05 AM', estArrival: '08:12 AM', delay: 'On time',
    totalDistance: '15.2 km', avgSpeed: '34 km/h',
  },
  {
    id: 'BUS-14', name: 'BUS-14', registration: 'KA-01-F-2342', tint: 'teal',
    state: 'Active', stateTint: 'success', gps: 'Online', speed: 18, students: 19,
    route: 'Route 3 · Lake Side', driver: 'Vijay Rao', assistant: 'Sunita Das',
    location: 'Bridge Road', nextStop: 'Riverside', nextStopEta: '3 min',
    fuel: 50, trip: 'Morning Pickup', branch: 'Main Campus',
    address: 'Bridge Road, Lake Side', lastUpdate: '8 sec ago', odometer: '69,880 km',
    todayDistance: '11.9 km', engine: 'Running', ac: 'On',
    totalStops: 9, stopsCovered: 4, routeDistance: '18.7 km', estDuration: '48 min',
    upcoming: [
      { name: 'Riverside', eta: '3 min' },
      { name: 'Lake View', eta: '8 min' },
      { name: 'Marina Gate', eta: '14 min' },
    ],
    driverExperience: '5 yrs experience', driverPhone: '+1 46548 84402',
    driverLicence: 'DL-0611', driverLicenceYear: '2021', driverRating: '4.5 / 5',
    pickedUp: 12, remaining: 7, nextStudent: 'Kavya Nair', arrivalTime: '07:41 AM',
    parentNotification: 'Sent',
    tripStart: '07:15 AM', estArrival: '08:03 AM', delay: 'On time',
    totalDistance: '11.9 km', avgSpeed: '24 km/h',
  },
  {
    id: 'BUS-19', name: 'BUS-19', registration: 'KA-01-F-2343', tint: 'success',
    state: 'Active', stateTint: 'success', gps: 'Online', speed: 27, students: 25,
    route: 'Route 6 · Green Park', driver: 'Kiran Shah', assistant: 'Rekha Joshi',
    location: 'Park Avenue', nextStop: 'Garden Gate', nextStopEta: '9 min',
    fuel: 75, trip: 'Morning Pickup', branch: 'North Branch',
    address: 'Park Avenue, Green Park', lastUpdate: '15 sec ago', odometer: '58,120 km',
    todayDistance: '13.6 km', engine: 'Running', ac: 'On',
    totalStops: 11, stopsCovered: 5, routeDistance: '20.4 km', estDuration: '52 min',
    upcoming: [
      { name: 'Garden Gate', eta: '9 min' },
      { name: 'Rose Lane', eta: '16 min' },
      { name: 'Green Square', eta: '23 min' },
    ],
    driverExperience: '7 yrs experience', driverPhone: '+1 46548 84403',
    driverLicence: 'DL-0344', driverLicenceYear: '2018', driverRating: '4.7 / 5',
    pickedUp: 16, remaining: 9, nextStudent: 'Rohan Das', arrivalTime: '07:58 AM',
    parentNotification: 'Sent',
    tripStart: '07:08 AM', estArrival: '08:00 AM', delay: 'On time',
    totalDistance: '13.6 km', avgSpeed: '31 km/h',
  },
  {
    id: 'BUS-07', name: 'BUS-07', registration: 'KA-01-F-2344', tint: 'warning',
    state: 'Idle', stateTint: 'secondary', gps: 'Online', speed: 0, students: 22,
    route: 'Route 2 · East Line', driver: 'Suresh Patil', assistant: 'Anita Kale',
    location: 'Central Depot', nextStop: '—', nextStopEta: '—',
    fuel: 100, trip: 'Afternoon Drop', branch: 'Main Campus',
    address: 'Central Depot, Yard 2', lastUpdate: '2 min ago', odometer: '91,440 km',
    todayDistance: '0.0 km', engine: 'Off', ac: 'Off',
    totalStops: 8, stopsCovered: 0, routeDistance: '16.2 km', estDuration: '44 min',
    upcoming: [],
    driverExperience: '9 yrs experience', driverPhone: '+1 46548 84404',
    driverLicence: 'DL-0287', driverLicenceYear: '2017', driverRating: '4.9 / 5',
    pickedUp: 0, remaining: 22, nextStudent: '—', arrivalTime: '—',
    parentNotification: 'Not sent',
    tripStart: '—', estArrival: '—', delay: '—',
    totalDistance: '0.0 km', avgSpeed: '0 km/h',
  },
  {
    id: 'BUS-03', name: 'BUS-03', registration: 'KA-01-F-2345', tint: 'danger',
    state: 'Offline', stateTint: 'danger', gps: 'Offline', speed: 0, students: 0,
    route: 'Route 1 · City Center', driver: 'Manoj Tiwari', assistant: 'Deepa Shah',
    location: 'Last seen · Elm Street', nextStop: '—', nextStopEta: '—',
    fuel: 25, trip: 'Morning Pickup', branch: 'West Branch',
    address: 'Elm Street, City Center', lastUpdate: '4 min ago', odometer: '102,760 km',
    todayDistance: '6.8 km', engine: 'Unknown', ac: 'Unknown',
    totalStops: 10, stopsCovered: 3, routeDistance: '19.5 km', estDuration: '50 min',
    upcoming: [],
    driverExperience: '4 yrs experience', driverPhone: '+1 46548 84405',
    driverLicence: 'DL-0733', driverLicenceYear: '2022', driverRating: '4.3 / 5',
    pickedUp: 9, remaining: 0, nextStudent: '—', arrivalTime: '—',
    parentNotification: 'Failed',
    tripStart: '07:00 AM', estArrival: '—', delay: '—',
    totalDistance: '6.8 km', avgSpeed: '18 km/h',
  },
];

export const alerts: FleetAlert[] = [
  { id: 'a1', title: 'Vehicle Offline', detail: 'BUS-03 · Route 1 · 4 min ago', level: 'Critical', icon: 'ti ti-plug-connected-x', vehicle: 'BUS-03' },
  { id: 'a2', title: 'Route Delay', detail: 'BUS-12 · running +6 min behind', level: 'Warning', icon: 'ti ti-alarm', vehicle: 'BUS-12' },
  { id: 'a3', title: 'Overspeed Alert', detail: 'BUS-21 · 68 km/h in 40 zone', level: 'Critical', icon: 'ti ti-gauge', vehicle: 'BUS-21' },
  { id: 'a4', title: 'Geofence Exit', detail: 'BUS-14 · left Lake Side zone', level: 'Warning', icon: 'ti ti-map-pin-off', vehicle: 'BUS-14' },
  { id: 'a5', title: 'Emergency SOS', detail: 'BUS-19 · driver pressed panic', level: 'Critical', icon: 'ti ti-urgent', vehicle: 'BUS-19' },
  { id: 'a6', title: 'Low Fuel', detail: 'BUS-03 · 25% remaining · refuel before next trip', level: 'Warning', icon: 'ti ti-gas-station', vehicle: 'BUS-03' },
  { id: 'a7', title: 'Maintenance Due', detail: 'BUS-07 · service in 2 days', level: 'Info', icon: 'ti ti-tool', vehicle: 'BUS-07' },
];

/** The map's layer toggles, in the template's order. */
export const mapLayers = [
  { id: 'routes', label: 'Route Lines', tint: 'primary' },
  { id: 'stops', label: 'Bus Stops', tint: 'info' },
  { id: 'pickups', label: 'Pickup Points', tint: 'success' },
  { id: 'geofencing', label: 'Geofencing', tint: 'warning' },
];

/** The legend pinned to the bottom-left of the map, in the template's order. */
export const mapLegend = [
  { label: 'School', tint: 'primary' },
  { label: 'Bus', tint: 'success' },
  { label: 'Pickup', tint: 'warning' },
  { label: 'Drop', tint: 'info' },
  { label: 'Offline', tint: 'danger' },
];
