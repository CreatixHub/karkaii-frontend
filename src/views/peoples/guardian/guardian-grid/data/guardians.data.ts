/* -------------------------------------------------------------------------- */
/*                                Overview cards                              */
/* -------------------------------------------------------------------------- */

export interface OverviewCard {
  id: string;
  variant: string;
  icon: string;
  value: string;
  label: string;
  trend: string;
  trendUp: boolean;
}

export const overviewCards: OverviewCard[] = [
  {
    id: 'total',
    variant: 'stats-primary',
    icon: 'ti ti-users',
    value: '1,248',
    label: 'Total Guardians',
    trend: '+8% this month',
    trendUp: true,
  },
  {
    id: 'active',
    variant: 'stats-success',
    icon: 'ti ti-user-check',
    value: '1,120',
    label: 'Active Guardians',
    trend: '90% engagement',
    trendUp: true,
  },
  {
    id: 'verified',
    variant: 'stats-info',
    icon: 'ti ti-discount',
    value: '1,058',
    label: 'Verified Guardians',
    trend: '85% verified',
    trendUp: true,
  },
  {
    id: 'pending',
    variant: 'stats-warning',
    icon: 'ti ti-clock-hour-4',
    value: '128',
    label: 'Pending Verification',
    trend: '-4% this week',
    trendUp: false,
  },
];

/* -------------------------------------------------------------------------- */
/*                                  Guardians                                 */
/* -------------------------------------------------------------------------- */

/** One row of the card's Performance block — label, readout and progress bar. */
export interface PerformanceMetric {
  id: string;
  label: string;
  icon: string;
  /** Right-hand readout: a percentage for most rows, a word for Fee Payment. */
  readout: string;
  /** Text colour utility for the readout. */
  readoutClass: string;
  percent: number;
  barClass: string;
}

export interface LinkedStudents {
  avatar: string;
  /** Display names, already collapsed by the template (e.g. `Kathleen, +2`). */
  names: string;
  /** Class/section labels, e.g. `III A, IV B`. */
  classes: string;
}

export type GuardianStatus = 'Verified' | 'Active' | 'Pending' | 'Inactive';

export interface GuardianRecord {
  id: string;
  name: string;
  avatar: string;
  /** Renders the green presence dot on the avatar. */
  online: boolean;
  vip: boolean;
  status: GuardianStatus;
  statusBadgeClass: string;
  relationship: string;
  relationshipBadgeClass: string;
  occupation: string;
  phone: string;
  email: string;
  /** Template copy for the Students tile, e.g. `2 Assigned`. */
  studentsLabel: string;
  /** Numeric form of the same value, used by the "Student count" sort. */
  studentsCount: number;
  branch: string;
  students: LinkedStudents;
  address: string;
  emergencyPhone: string;
  lastLogin: string;
  createdDate: string;
  performance: PerformanceMetric[];
}

/** Builds the four Performance rows; only the values differ between cards. */
const performance = (
  fee: { readout: string; readoutClass: string; percent: number; barClass: string },
  ptm: { percent: number; barClass: string },
  communication: { percent: number; barClass: string },
  mobile: { percent: number; barClass: string },
): PerformanceMetric[] => [
  {
    id: 'fee',
    label: 'Fee Payment',
    icon: 'ti ti-report-money',
    readout: fee.readout,
    readoutClass: fee.readoutClass,
    percent: fee.percent,
    barClass: fee.barClass,
  },
  {
    id: 'ptm',
    label: 'PTM Attendance',
    icon: 'ti ti-users-group',
    readout: `${ptm.percent}%`,
    readoutClass: 'text-dark',
    percent: ptm.percent,
    barClass: ptm.barClass,
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: 'ti ti-message-2',
    readout: `${communication.percent}%`,
    readoutClass: 'text-dark',
    percent: communication.percent,
    barClass: communication.barClass,
  },
  {
    id: 'mobile',
    label: 'Mobile App Usage',
    icon: 'ti ti-device-mobile',
    readout: `${mobile.percent}%`,
    readoutClass: 'text-dark',
    percent: mobile.percent,
    barClass: mobile.barClass,
  },
];

export const guardians: GuardianRecord[] = [
  {
    id: 'G124556',
    name: 'Thomas Herrera',
    avatar: 'assets/img/guardians/guardian-01.jpg',
    online: true,
    vip: true,
    status: 'Verified',
    statusBadgeClass: 'badge-soft-info',
    relationship: 'Grandfather',
    relationshipBadgeClass: 'badge-soft-primary',
    occupation: 'Civil Engineer',
    phone: '+1 65738 58937',
    email: 'thomas@example.com',
    studentsLabel: '2 Assigned',
    studentsCount: 2,
    branch: 'Primary Campus',
    students: { avatar: 'assets/img/students/student-01.jpg', names: 'Janet, Joann', classes: 'III A, IV B' },
    address: '1250 Elm Street, Springfield',
    emergencyPhone: '+1 65738 10001',
    lastLogin: 'Last login 10 mins ago',
    createdDate: '25 Mar 2024',
    performance: performance(
      { readout: 'Paid', readoutClass: 'text-success', percent: 100, barClass: 'bg-success' },
      { percent: 92, barClass: 'bg-success' },
      { percent: 92, barClass: 'bg-info' },
      { percent: 78, barClass: 'bg-warning' },
    ),
  },
  {
    id: 'G124555',
    name: 'Marquita Ross',
    avatar: 'assets/img/guardians/guardian-02.jpg',
    online: true,
    vip: false,
    status: 'Active',
    statusBadgeClass: 'badge-soft-success',
    relationship: 'Grandmother',
    relationshipBadgeClass: 'badge-soft-purple',
    occupation: 'Doctor',
    phone: '+1 65738 58938',
    email: 'marquita@example.com',
    studentsLabel: '1 Assigned',
    studentsCount: 1,
    branch: 'North Branch',
    students: { avatar: 'assets/img/students/student-02.jpg', names: 'Joann Ross', classes: 'IV B' },
    address: '89 Oak Avenue, Riverside',
    emergencyPhone: '+1 65738 10002',
    lastLogin: 'Last login 1 hr ago',
    createdDate: '18 Mar 2024',
    performance: performance(
      { readout: 'Paid', readoutClass: 'text-success', percent: 100, barClass: 'bg-success' },
      { percent: 85, barClass: 'bg-success' },
      { percent: 85, barClass: 'bg-info' },
      { percent: 64, barClass: 'bg-warning' },
    ),
  },
  {
    id: 'G124554',
    name: 'Johnson Pratt',
    avatar: 'assets/img/guardians/guardian-03.jpg',
    online: false,
    vip: true,
    status: 'Verified',
    statusBadgeClass: 'badge-soft-info',
    relationship: 'Legal Guardian',
    relationshipBadgeClass: 'badge-soft-secondary',
    occupation: 'Business Owner',
    phone: '+1 65738 58939',
    email: 'johnson@example.com',
    studentsLabel: '3 Assigned',
    studentsCount: 3,
    branch: 'Primary Campus',
    students: { avatar: 'assets/img/students/student-03.jpg', names: 'Kathleen, +2', classes: 'V A, III C' },
    address: '42 Pine Road, Lakeview',
    emergencyPhone: '+1 65738 10003',
    lastLogin: 'Last login Yesterday',
    createdDate: '14 Mar 2024',
    performance: performance(
      { readout: 'Partial', readoutClass: 'text-warning', percent: 60, barClass: 'bg-warning' },
      { percent: 70, barClass: 'bg-warning' },
      { percent: 70, barClass: 'bg-info' },
      { percent: 48, barClass: 'bg-danger' },
    ),
  },
  {
    id: 'G124552',
    name: 'Arthur Nichols',
    avatar: 'assets/img/guardians/guardian-05.jpg',
    online: false,
    vip: false,
    status: 'Pending',
    statusBadgeClass: 'badge-soft-warning',
    relationship: 'Uncle',
    relationshipBadgeClass: 'badge-soft-primary',
    occupation: 'Accountant',
    phone: '+1 65738 58940',
    email: 'arthur@example.com',
    studentsLabel: '1 Assigned',
    studentsCount: 1,
    branch: 'West Branch',
    students: { avatar: 'assets/img/students/student-04.jpg', names: 'Gifford Nichols', classes: 'III A' },
    address: '7 Maple Lane, Fairview',
    emergencyPhone: '+1 65738 10004',
    lastLogin: 'Last login 3 days ago',
    createdDate: '11 Feb 2024',
    performance: performance(
      { readout: 'Overdue', readoutClass: 'text-danger', percent: 25, barClass: 'bg-danger' },
      { percent: 40, barClass: 'bg-danger' },
      { percent: 40, barClass: 'bg-info' },
      { percent: 22, barClass: 'bg-danger' },
    ),
  },
  {
    id: 'G124551',
    name: 'Colleen Diaz',
    avatar: 'assets/img/guardians/guardian-06.jpg',
    online: true,
    vip: false,
    status: 'Active',
    statusBadgeClass: 'badge-soft-success',
    relationship: 'Aunt',
    relationshipBadgeClass: 'badge-soft-purple',
    occupation: 'Teacher',
    phone: '+1 65738 58941',
    email: 'colleen@example.com',
    studentsLabel: '2 Assigned',
    studentsCount: 2,
    branch: 'North Branch',
    students: { avatar: 'assets/img/students/student-05.jpg', names: 'Lisa, Mark', classes: 'V B, II A' },
    address: '305 Cedar Blvd, Midtown',
    emergencyPhone: '+1 65738 10005',
    lastLogin: 'Last login 20 mins ago',
    createdDate: '24 Jan 2024',
    performance: performance(
      { readout: 'Paid', readoutClass: 'text-success', percent: 100, barClass: 'bg-success' },
      { percent: 88, barClass: 'bg-success' },
      { percent: 88, barClass: 'bg-info' },
      { percent: 91, barClass: 'bg-success' },
    ),
  },
  {
    id: 'G124550',
    name: 'Robert Fox',
    avatar: 'assets/img/guardians/guardian-07.jpg',
    online: false,
    vip: false,
    status: 'Inactive',
    statusBadgeClass: 'badge-soft-danger',
    relationship: 'Caretaker',
    relationshipBadgeClass: 'badge-soft-secondary',
    occupation: 'Consultant',
    phone: '+1 65738 58942',
    email: 'robert@example.com',
    studentsLabel: '1 Assigned',
    studentsCount: 1,
    branch: 'Primary Campus',
    students: { avatar: 'assets/img/students/student-06.jpg', names: 'Ralph Fox', classes: 'IV A' },
    address: '18 Birch Street, Hillcrest',
    emergencyPhone: '+1 65738 10006',
    lastLogin: 'Last login 2 weeks ago',
    createdDate: '19 Jan 2024',
    performance: performance(
      { readout: 'Overdue', readoutClass: 'text-danger', percent: 10, barClass: 'bg-danger' },
      { percent: 20, barClass: 'bg-danger' },
      { percent: 20, barClass: 'bg-info' },
      { percent: 12, barClass: 'bg-danger' },
    ),
  },
];

/** The template's "New This Month" view and quick filter both mean the newest record. */
export const NEWEST_GUARDIAN_ID = 'G124556';
