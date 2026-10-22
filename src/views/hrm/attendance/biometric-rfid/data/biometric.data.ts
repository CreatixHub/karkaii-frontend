export type DeviceStatus = 'Online' | 'Offline';
export type DeviceHealth = 'Healthy' | 'Warning' | 'Offline';

export interface Device {
  id: string;
  name: string;
  /** Serial + kind, e.g. "BIO-2201 · Fingerprint". */
  serial: string;
  kind: string;
  tint: string;
  icon: string;
  status: DeviceStatus;
  health: DeviceHealth;
  campus: string;
  location: string;
  signal: string;
  power: string;
  powerIcon: string;
  firmware: string;
  lastSync: string;
  scans: number;
}

export const healthTone: Record<DeviceHealth, string> = {
  Healthy: 'success',
  Warning: 'warning',
  Offline: 'danger',
};

export const devices: Device[] = [
  {
    id: 'BIO-2201',
    name: 'Main Gate Bio-01',
    serial: 'BIO-2201 · Fingerprint',
    kind: 'Fingerprint',
    tint: 'primary',
    icon: 'ti ti-fingerprint',
    status: 'Online',
    health: 'Healthy',
    campus: 'Main Campus',
    location: 'Main Entrance',
    signal: 'Strong',
    power: 'AC Power',
    powerIcon: 'ti ti-plug',
    firmware: 'v3.2.1',
    lastSync: '12s ago',
    scans: 842,
  },
  {
    id: 'RFID-4410',
    name: 'Library RFID-04',
    serial: 'RFID-4410 · RFID Reader',
    kind: 'RFID Reader',
    tint: 'info',
    icon: 'ti ti-nfc',
    status: 'Online',
    health: 'Healthy',
    campus: 'Main Campus',
    location: 'Library Block',
    signal: 'Good',
    power: '76%',
    powerIcon: 'ti ti-battery-3',
    firmware: 'v2.8.0',
    lastSync: '40s ago',
    scans: 318,
  },
  {
    id: 'FACE-3302',
    name: 'Science Face-02',
    serial: 'FACE-3302 · Face Recognition',
    kind: 'Face Recognition',
    tint: 'teal',
    icon: 'ti ti-face-id',
    status: 'Online',
    health: 'Warning',
    campus: 'North Campus',
    location: 'Science Wing',
    signal: 'Fair',
    power: 'AC Power',
    powerIcon: 'ti ti-plug',
    firmware: 'v4.1.0',
    lastSync: '5m ago',
    scans: 205,
  },
  {
    id: 'BIO-2207',
    name: 'East Gate Bio-07',
    serial: 'BIO-2207 · Fingerprint',
    kind: 'Fingerprint',
    tint: 'danger',
    icon: 'ti ti-fingerprint',
    status: 'Offline',
    health: 'Offline',
    campus: 'East Campus',
    location: 'East Entrance',
    signal: 'None',
    power: '12%',
    powerIcon: 'ti ti-battery-1',
    firmware: 'v3.1.5',
    lastSync: '22m ago',
    scans: 96,
  },
];

/* ---------------------------------- Logs ----------------------------------- */

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';
export type SyncStatus = 'Synced' | 'Pending' | 'Failed';
export type EntryResult = 'Success' | 'Failed';

export interface AttendanceLog {
  id: string;
  person: string;
  personId: string;
  avatar: string;
  userType: 'Student' | 'Staff';
  card: string;
  device: string;
  campus: string;
  entry: EntryResult;
  date: string;
  time: string;
  method: { label: string; icon: string };
  verification: 'Check-In' | 'Check-Out';
  status: AttendanceStatus;
  sync: SyncStatus;
}

export const statusPill: Record<AttendanceStatus, string> = {
  Present: 'is-active',
  Late: 'is-pending',
  Absent: 'is-inactive',
};

export const syncPill: Record<SyncStatus, string> = {
  Synced: 'is-active',
  Pending: 'is-pending',
  Failed: 'is-inactive',
};

const BIOMETRIC = { label: 'Biometric', icon: 'ti ti-fingerprint' };
const RFID = { label: 'RFID', icon: 'ti ti-nfc' };
const FACE = { label: 'Face', icon: 'ti ti-face-id' };

export const attendanceLogs: AttendanceLog[] = [
  {
    id: 'LOG-01',
    person: 'Grace Lee',
    personId: 'EMP-1001',
    avatar: 'assets/img/profiles/avatar-27.jpg',
    userType: 'Staff',
    card: '0042-8891',
    device: 'Main Gate Bio-01',
    campus: 'Main Campus',
    entry: 'Success',
    date: '26 Jul 2026',
    time: '07:48 AM',
    method: BIOMETRIC,
    verification: 'Check-In',
    status: 'Present',
    sync: 'Synced',
  },
  {
    id: 'LOG-02',
    person: 'Aarav Sharma',
    personId: 'STU-2043',
    avatar: 'assets/img/profiles/avatar-23.jpg',
    userType: 'Student',
    card: '0051-2277',
    device: 'Library RFID-04',
    campus: 'Main Campus',
    entry: 'Success',
    date: '26 Jul 2026',
    time: '08:02 AM',
    method: RFID,
    verification: 'Check-In',
    status: 'Present',
    sync: 'Synced',
  },
  {
    id: 'LOG-03',
    person: 'Hassan Ali',
    personId: 'EMP-1002',
    avatar: 'assets/img/profiles/avatar-25.jpg',
    userType: 'Staff',
    card: '0042-8845',
    device: 'Science Face-02',
    campus: 'North Campus',
    entry: 'Success',
    date: '26 Jul 2026',
    time: '07:55 AM',
    method: FACE,
    verification: 'Check-In',
    status: 'Present',
    sync: 'Pending',
  },
  {
    id: 'LOG-04',
    person: 'Diya Nair',
    personId: 'STU-2044',
    avatar: 'assets/img/profiles/avatar-01.jpg',
    userType: 'Student',
    card: '0051-3390',
    device: 'Main Gate Bio-01',
    campus: 'Main Campus',
    entry: 'Success',
    date: '26 Jul 2026',
    time: '03:30 PM',
    method: BIOMETRIC,
    verification: 'Check-Out',
    status: 'Present',
    sync: 'Synced',
  },
  {
    id: 'LOG-05',
    person: 'Rohan Das',
    personId: 'EMP-1004',
    avatar: 'assets/img/profiles/avatar-02.jpg',
    userType: 'Staff',
    card: '0042-8863',
    device: 'East Gate Bio-07',
    campus: 'East Campus',
    entry: 'Failed',
    date: '26 Jul 2026',
    time: '09:12 AM',
    method: BIOMETRIC,
    verification: 'Check-In',
    status: 'Absent',
    sync: 'Failed',
  },
  {
    id: 'LOG-06',
    person: 'Kabir Rao',
    personId: 'STU-2045',
    avatar: 'assets/img/profiles/avatar-05.jpg',
    userType: 'Student',
    card: '0051-4412',
    device: 'Library RFID-04',
    campus: 'Main Campus',
    entry: 'Success',
    date: '26 Jul 2026',
    time: '08:20 AM',
    method: RFID,
    verification: 'Check-In',
    status: 'Late',
    sync: 'Synced',
  },
  {
    id: 'LOG-07',
    person: 'Olivia Park',
    personId: 'EMP-1003',
    avatar: 'assets/img/profiles/avatar-11.jpg',
    userType: 'Staff',
    card: '0042-8850',
    device: 'Science Face-02',
    campus: 'North Campus',
    entry: 'Success',
    date: '26 Jul 2026',
    time: '07:59 AM',
    method: FACE,
    verification: 'Check-In',
    status: 'Present',
    sync: 'Pending',
  },
  {
    id: 'LOG-08',
    person: 'Sara Khan',
    personId: 'STU-2046',
    avatar: 'assets/img/profiles/avatar-16.jpg',
    userType: 'Student',
    card: '0051-5501',
    device: 'East Gate Bio-07',
    campus: 'East Campus',
    entry: 'Failed',
    date: '26 Jul 2026',
    time: '08:45 AM',
    method: RFID,
    verification: 'Check-In',
    status: 'Absent',
    sync: 'Failed',
  },
];

/* --------------------------------- Alerts ---------------------------------- */

export interface SystemAlert {
  id: string;
  icon: string;
  tint: string;
  title: string;
  detail: string;
  severity: 'Critical' | 'Warning' | 'Info';
}

export const systemAlerts: SystemAlert[] = [
  { id: 'AL-1', icon: 'ti ti-device-desktop-off', tint: 'danger', title: 'Device Offline', detail: 'East Gate Bio-07 · 22 min ago', severity: 'Critical' },
  { id: 'AL-2', icon: 'ti ti-refresh-alert', tint: 'danger', title: 'Synchronization Failed', detail: '2 records failed to sync', severity: 'Critical' },
  { id: 'AL-3', icon: 'ti ti-id-off', tint: 'warning', title: 'Invalid RFID Card', detail: 'Card 0051-5501 not recognised', severity: 'Warning' },
  { id: 'AL-4', icon: 'ti ti-copy', tint: 'warning', title: 'Duplicate Scan', detail: 'STU-2043 scanned twice in 30s', severity: 'Warning' },
  { id: 'AL-5', icon: 'ti ti-tool', tint: 'info', title: 'Maintenance Due', detail: 'Science Face-02 · service in 3 days', severity: 'Info' },
  { id: 'AL-6', icon: 'ti ti-shield-x', tint: 'danger', title: 'Authentication Failure', detail: 'EMP-1004 biometric mismatch', severity: 'Critical' },
];

export const severityTone: Record<SystemAlert['severity'], string> = {
  Critical: 'danger',
  Warning: 'warning',
  Info: 'info',
};

/* -------------------------------- Workspace -------------------------------- */

export interface FilterField {
  id: string;
  label: string;
  kind: 'date' | 'select';
  placeholder?: string;
  options?: string[];
  /** The Time Range select has no "All" lead option in the template. */
  noAllOption?: boolean;
}

export const filterFields: FilterField[] = [
  { id: 'date', label: 'Date', kind: 'date', placeholder: '26 Jul 2026' },
  { id: 'time-range', label: 'Time Range', kind: 'select', options: ['All Day', 'Morning', 'Afternoon'], noAllOption: true },
  { id: 'device', label: 'Device', kind: 'select', options: ['Main Gate Bio-01', 'Library RFID-04', 'Science Face-02'] },
  { id: 'device-type', label: 'Device Type', kind: 'select', options: ['Fingerprint', 'RFID Reader', 'Face Recognition'] },
  { id: 'campus', label: 'Campus', kind: 'select', options: ['Main Campus', 'North Campus', 'East Campus'] },
  { id: 'building', label: 'Building', kind: 'select', options: ['Main Block', 'Science Wing', 'Library Block'] },
  { id: 'department', label: 'Department', kind: 'select', options: ['Science', 'Mathematics', 'Administration'] },
  { id: 'class', label: 'Class', kind: 'select', options: ['Grade 10 · A', 'Grade 11 · B'] },
  { id: 'user-type', label: 'User Type', kind: 'select', options: ['Student', 'Staff'] },
  { id: 'attendance-status', label: 'Attendance Status', kind: 'select', options: ['Present', 'Absent', 'Late'] },
  { id: 'sync-status', label: 'Sync Status', kind: 'select', options: ['Synced', 'Pending', 'Failed'] },
];

export const filterChipLabels: Record<string, string> = {
  date: 'Date',
  'time-range': 'Time',
  device: 'Device',
  'device-type': 'Type',
  campus: 'Campus',
  building: 'Building',
  department: 'Dept',
  class: 'Class',
  'user-type': 'User',
  'attendance-status': 'Status',
  'sync-status': 'Sync',
};

export const filterChipTone: Record<string, string> = {
  date: 'primary',
  'time-range': 'primary',
  device: 'info',
  'device-type': 'info',
  campus: 'info',
  building: 'info',
  department: 'info',
  class: 'info',
  'user-type': 'info',
  'attendance-status': 'success',
  'sync-status': 'warning',
};

export type SavedViewId = 'all' | 'failed' | 'pending';

export const savedViews: { id: SavedViewId; label: string; icon: string }[] = [
  { id: 'all', label: 'All Logs', icon: 'ti ti-list' },
  { id: 'failed', label: 'Failed Auth', icon: 'ti ti-shield-x' },
  { id: 'pending', label: 'Pending Sync', icon: 'ti ti-refresh-alert' },
];

export const DEFAULT_DATE = '26 Jul 2026';

/** Panel figures the template hard-coded; derived so they track the data. */
export const deviceSummary = (deviceList: Device[], logs: AttendanceLog[]) => [
  {
    id: 'connected',
    tint: 'bg-success-transparent text-success',
    icon: 'ti ti-device-desktop',
    label: 'Connected',
    value: String(deviceList.filter((device) => device.status === 'Online').length),
  },
  {
    id: 'offline',
    tint: 'bg-danger-transparent text-danger',
    icon: 'ti ti-device-desktop-off',
    label: 'Offline Devices',
    value: String(deviceList.filter((device) => device.status === 'Offline').length),
  },
  {
    id: 'pending',
    tint: 'bg-warning-transparent text-warning',
    icon: 'ti ti-refresh-alert',
    label: 'Pending Sync',
    value: String(logs.filter((log) => log.sync === 'Pending').length),
  },
  {
    id: 'failed',
    tint: 'bg-danger-transparent text-danger',
    icon: 'ti ti-shield-x',
    label: 'Failed Auth',
    value: String(logs.filter((log) => log.entry === 'Failed').length),
  },
  {
    id: 'last',
    tint: 'bg-secondary-transparent text-secondary',
    icon: 'ti ti-clock-check',
    label: 'Last System',
    value: '2 min ago',
  },
];
