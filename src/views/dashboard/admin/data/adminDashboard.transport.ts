export interface FleetTile {
  id: string;
  value: string;
  suffix?: string;
  label: string;
}

export const fleetTiles: FleetTile[] = [
  { id: 'active', value: '42', suffix: '/48', label: 'Active' },
  { id: 'trips', value: '186', label: 'Trips' },
  { id: 'distance', value: '2,340', suffix: ' km', label: 'Distance' },
];

export interface FleetStatusSegment {
  id: string;
  label: string;
  count: string;
  colorClass: string;
  width: string;
}

export const fleetStatus: FleetStatusSegment[] = [
  { id: 'active', label: 'Active', count: '36', colorClass: 'bg-success', width: '75%' },
  { id: 'idle', label: 'Idle', count: '5', colorClass: 'bg-warning', width: '10%' },
  { id: 'service', label: 'Service', count: '5', colorClass: 'bg-info', width: '10%' },
  { id: 'offline', label: 'Offline', count: '2', colorClass: 'bg-gray-500', width: '5%' },
];

export interface FleetGauge {
  id: string;
  value: string;
  label: string;
  gaugeClass: string;
}

export const fleetGauges: FleetGauge[] = [
  { id: 'active', value: '93%', label: 'Active', gaugeClass: 'gauge-success' },
  { id: 'occupancy', value: '87%', label: 'Occupancy', gaugeClass: 'gauge-primary' },
  { id: 'ontime', value: '95%', label: 'On-Time', gaugeClass: 'gauge-info' },
];

export interface RouteStatus {
  id: string;
  route: string;
  icon: string;
  accentClass: string;
  state: string;
  stateClass: string;
  driver: string;
  driverRole: string;
  driverAvatar: string;
  tag: { label: string; icon: string; className: string };
  stats: { value: string; label: string }[];
}

export const liveRoutes: RouteStatus[] = [
  {
    id: 'r1',
    route: 'Route 01 — North',
    icon: 'ti ti-bus',
    accentClass: 'accent-success',
    state: 'LIVE',
    stateClass: 'text-success',
    driver: 'James Cooper',
    driverRole: 'Driver',
    driverAvatar: 'assets/img/profiles/avatar-14.jpg',
    tag: { label: 'GPS OK', icon: 'ti ti-gps', className: 'chip chip-muted' },
    stats: [
      { value: '42', label: 'Onboard' },
      { value: '8 min', label: 'ETA' },
      { value: '34 km/h', label: 'Speed' },
    ],
  },
  {
    id: 'r2',
    route: 'Route 07 — South',
    icon: 'ti ti-bus',
    accentClass: 'accent-danger',
    state: 'DELAYED',
    stateClass: 'text-danger',
    driver: 'Owen Blake',
    driverRole: 'Driver',
    driverAvatar: 'assets/img/profiles/avatar-16.jpg',
    tag: { label: 'Traffic', icon: 'ti ti-traffic-cone', className: 'chip chip-muted text-warning' },
    stats: [
      { value: '29', label: 'Onboard' },
      { value: '+12 min', label: 'ETA' },
      { value: '12 km/h', label: 'Speed' },
    ],
  },
  {
    id: 'r3',
    route: 'Route 09 — West',
    icon: 'ti ti-bus-stop',
    accentClass: 'accent-warning',
    state: 'IDLE',
    stateClass: 'text-warning',
    driver: 'Nathan Hill',
    driverRole: 'Depot',
    driverAvatar: 'assets/img/profiles/avatar-11.jpg',
    tag: { label: 'Service', icon: 'ti ti-tools', className: 'chip chip-muted text-muted' },
    stats: [
      { value: '0', label: 'Onboard' },
      { value: '—', label: 'ETA' },
      { value: '0 km/h', label: 'Speed' },
    ],
  },
];

export interface MaintenanceItem {
  id: string;
  title: string;
  icon: string;
  iconClass: string;
  accentClass: string;
  status: string;
  statusClass: string;
  technician: string;
  technicianAvatar: string;
  date: string;
  time: string;
}

export const maintenanceSummary: FleetTile[] = [
  { id: 'upcoming', value: '5', label: 'Upcoming' },
  { id: 'critical', value: '1', label: 'Critical' },
  { id: 'health', value: '94%', label: 'Health' },
];

export const maintenanceTimeline: MaintenanceItem[] = [
  {
    id: 'm1',
    title: 'Bus TX-1204 — Brake inspection',
    icon: 'ti ti-tools',
    iconClass: 'bg-danger-transparent',
    accentClass: 'accent-danger',
    status: 'Critical',
    statusClass: 'badge-soft-danger',
    technician: 'D. Owens',
    technicianAvatar: 'assets/img/profiles/avatar-05.jpg',
    date: 'Tomorrow',
    time: '09:00 AM',
  },
  {
    id: 'm2',
    title: 'Bus TX-1188 — Engine service',
    icon: 'ti ti-engine',
    iconClass: 'bg-primary-transparent',
    accentClass: 'accent-primary',
    status: 'Scheduled',
    statusClass: 'badge-soft-primary',
    technician: 'R. Patel',
    technicianAvatar: 'assets/img/profiles/avatar-07.jpg',
    date: '24 Jul',
    time: '11:00 AM',
  },
  {
    id: 'm3',
    title: 'Bus TX-1092 — Tyre replacement',
    icon: 'ti ti-wheel',
    iconClass: 'bg-info-transparent',
    accentClass: 'accent-info',
    status: 'Routine',
    statusClass: 'badge-soft-info',
    technician: 'S. Lee',
    technicianAvatar: 'assets/img/profiles/avatar-12.jpg',
    date: '26 Jul',
    time: '10:00 AM',
  },
  {
    id: 'm4',
    title: 'Bus TX-1150 — Service completed',
    icon: 'ti ti-circle-check',
    iconClass: 'bg-success-transparent',
    accentClass: 'accent-success',
    status: 'Done',
    statusClass: 'badge-soft-success',
    technician: 'M. Cole',
    technicianAvatar: 'assets/img/profiles/avatar-03.jpg',
    date: '18 Jul',
    time: 'Health 98%',
  },
  {
    id: 'm5',
    title: 'Bus TX-1176 — AC servicing',
    icon: 'ti ti-snowflake',
    iconClass: 'bg-warning-transparent',
    accentClass: 'accent-warning',
    status: 'Upcoming',
    statusClass: 'badge-soft-warning',
    technician: 'K. Novak',
    technicianAvatar: 'assets/img/profiles/avatar-08.jpg',
    date: '28 Jul',
    time: '02:00 PM',
  },
];

export interface TrackedVehicle {
  id: string;
  route: string;
  icon: string;
  iconClass: string;
  location: string;
  locationIcon: string;
  status: string;
  statusClass: string;
}

export const trackedVehicles: TrackedVehicle[] = [
  {
    id: 'v1',
    route: 'Route 01 · North',
    icon: 'ti ti-bus',
    iconClass: 'bg-success-transparent',
    location: 'Downtown Ave · 34 km/h',
    locationIcon: 'ti ti-map-pin',
    status: 'On route',
    statusClass: 'badge-soft-success',
  },
  {
    id: 'v2',
    route: 'Route 04 · East',
    icon: 'ti ti-bus',
    iconClass: 'bg-primary-transparent',
    location: 'Elm Street · 41 km/h',
    locationIcon: 'ti ti-map-pin',
    status: 'On route',
    statusClass: 'badge-soft-success',
  },
  {
    id: 'v3',
    route: 'Route 07 · South',
    icon: 'ti ti-bus',
    iconClass: 'bg-danger-transparent',
    location: '5th Junction · 12 km/h',
    locationIcon: 'ti ti-map-pin',
    status: 'Traffic',
    statusClass: 'badge-soft-danger',
  },
  {
    id: 'v4',
    route: 'Route 09 · West',
    icon: 'ti ti-bus-stop',
    iconClass: 'bg-warning-transparent',
    location: 'Depot · Maintenance',
    locationIcon: 'ti ti-tools',
    status: 'Idle',
    statusClass: 'badge-soft-warning',
  },
];

/** Google Maps embed used by the Live Fleet Map card. */
export const FLEET_MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d52860.78161555546!2d-118.41173249999999!3d34.0205562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x80c2bb023a105c3f%3A0x10373dfcefb9b87!2sSanta%20Monica%2C%20CA!3m2!1d34.0194543!2d-118.4911912!4m5!1s0x80c2b29ea78b877f%3A0x6b43293883a8b438!2sCulver%20City%2C%20CA!3m2!1d34.0211224!2d-118.3964665!5e0!3m2!1sen!2sus!4v1689622953284!5m2!1sen!2sus';
