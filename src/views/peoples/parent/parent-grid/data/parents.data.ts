export interface ParentChild {
  name: string;
  classLabel: string;
  avatar: string;
}

export interface ParentPerformance {
  feeStatus: 'Paid' | 'Partial' | 'Overdue';
  feePercent: number;
  ptmAttendance: number;
  communication: number;
  mobileUsage: number;
}

export interface ParentRecord {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  vip: boolean;
  relation: 'Father' | 'Mother' | 'Guardian';
  relationBadgeClass: string;
  occupation: string;
  organization: string;
  status: 'Verified' | 'Active' | 'Pending' | 'Inactive';
  statusBadgeClass: string;
  phone: string;
  email: string;
  branch: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  lastLogin: string;
  joined: string;
  children: ParentChild[];
  performance: ParentPerformance;
}

export const parents: ParentRecord[] = [
  {
    id: 'P124556',
    name: 'Thomas Herrera',
    avatar: 'assets/img/parents/parent-01.jpg',
    online: true,
    vip: true,
    relation: 'Father',
    relationBadgeClass: 'badge-soft-primary',
    occupation: 'Civil Engineer',
    organization: 'Springfield Infra Ltd.',
    status: 'Verified',
    statusBadgeClass: 'badge-soft-info',
    phone: '+1 65738 58937',
    email: 'thomas@example.com',
    branch: 'Primary Campus',
    address: '1250 Elm Street, Springfield, IL 62704, United States',
    emergencyContact: 'Maria Herrera (Spouse)',
    emergencyPhone: '+1 65738 10001',
    lastLogin: '10 mins ago',
    joined: '25 Mar 2024',
    children: [
      { name: 'Janet', classLabel: 'III A', avatar: 'assets/img/students/student-01.jpg' },
      { name: 'Joann', classLabel: 'IV B', avatar: 'assets/img/students/student-02.jpg' },
    ],
    performance: { feeStatus: 'Paid', feePercent: 100, ptmAttendance: 92, communication: 92, mobileUsage: 78 },
  },
  {
    id: 'P124555',
    name: 'Marquita Ross',
    avatar: 'assets/img/parents/parent-02.jpg',
    online: true,
    vip: false,
    relation: 'Mother',
    relationBadgeClass: 'badge-soft-purple',
    occupation: 'Doctor',
    organization: 'Riverside Medical Center',
    status: 'Active',
    statusBadgeClass: 'badge-soft-success',
    phone: '+1 65738 58938',
    email: 'marquita@example.com',
    branch: 'North Branch',
    address: '89 Oak Avenue, Riverside, IL 62705, United States',
    emergencyContact: 'David Ross (Spouse)',
    emergencyPhone: '+1 65738 10002',
    lastLogin: '1 hr ago',
    joined: '18 Mar 2024',
    children: [{ name: 'Joann Ross', classLabel: 'IV B', avatar: 'assets/img/students/student-02.jpg' }],
    performance: { feeStatus: 'Paid', feePercent: 100, ptmAttendance: 85, communication: 85, mobileUsage: 64 },
  },
  {
    id: 'P124554',
    name: 'Johnson Pratt',
    avatar: 'assets/img/parents/parent-03.jpg',
    online: false,
    vip: true,
    relation: 'Guardian',
    relationBadgeClass: 'badge-soft-secondary',
    occupation: 'Business Owner',
    organization: 'Pratt Retail Group',
    status: 'Verified',
    statusBadgeClass: 'badge-soft-info',
    phone: '+1 65738 58939',
    email: 'johnson@example.com',
    branch: 'Primary Campus',
    address: '42 Pine Road, Lakeview, IL 62706, United States',
    emergencyContact: 'Nora Pratt (Spouse)',
    emergencyPhone: '+1 65738 10003',
    lastLogin: 'Yesterday',
    joined: '14 Mar 2024',
    children: [
      { name: 'Kathleen', classLabel: 'V A', avatar: 'assets/img/students/student-03.jpg' },
      { name: '+2 more', classLabel: 'III C', avatar: 'assets/img/students/student-03.jpg' },
    ],
    performance: { feeStatus: 'Partial', feePercent: 60, ptmAttendance: 70, communication: 70, mobileUsage: 48 },
  },
  {
    id: 'P124552',
    name: 'Arthur Nichols',
    avatar: 'assets/img/parents/parent-05.jpg',
    online: false,
    vip: false,
    relation: 'Father',
    relationBadgeClass: 'badge-soft-primary',
    occupation: 'Accountant',
    organization: 'Fairview Finance Co.',
    status: 'Pending',
    statusBadgeClass: 'badge-soft-warning',
    phone: '+1 65738 58940',
    email: 'arthur@example.com',
    branch: 'West Branch',
    address: '7 Maple Lane, Fairview, IL 62707, United States',
    emergencyContact: 'Ellen Nichols (Spouse)',
    emergencyPhone: '+1 65738 10004',
    lastLogin: '3 days ago',
    joined: '11 Feb 2024',
    children: [{ name: 'Gifford Nichols', classLabel: 'III A', avatar: 'assets/img/students/student-04.jpg' }],
    performance: { feeStatus: 'Overdue', feePercent: 25, ptmAttendance: 40, communication: 40, mobileUsage: 22 },
  },
  {
    id: 'P124551',
    name: 'Colleen Diaz',
    avatar: 'assets/img/parents/parent-06.jpg',
    online: true,
    vip: false,
    relation: 'Mother',
    relationBadgeClass: 'badge-soft-purple',
    occupation: 'Teacher',
    organization: 'Midtown High School',
    status: 'Active',
    statusBadgeClass: 'badge-soft-success',
    phone: '+1 65738 58941',
    email: 'colleen@example.com',
    branch: 'North Branch',
    address: '305 Cedar Blvd, Midtown, IL 62708, United States',
    emergencyContact: 'Frank Diaz (Spouse)',
    emergencyPhone: '+1 65738 10005',
    lastLogin: '20 mins ago',
    joined: '24 Jan 2024',
    children: [
      { name: 'Lisa', classLabel: 'V B', avatar: 'assets/img/students/student-05.jpg' },
      { name: 'Mark', classLabel: 'II A', avatar: 'assets/img/students/student-05.jpg' },
    ],
    performance: { feeStatus: 'Paid', feePercent: 100, ptmAttendance: 88, communication: 88, mobileUsage: 91 },
  },
  {
    id: 'P124550',
    name: 'Robert Fox',
    avatar: 'assets/img/parents/parent-07.jpg',
    online: false,
    vip: false,
    relation: 'Guardian',
    relationBadgeClass: 'badge-soft-secondary',
    occupation: 'Consultant',
    organization: 'Hillcrest Advisory',
    status: 'Inactive',
    statusBadgeClass: 'badge-soft-danger',
    phone: '+1 65738 58942',
    email: 'robert@example.com',
    branch: 'Primary Campus',
    address: '18 Birch Street, Hillcrest, IL 62709, United States',
    emergencyContact: 'Grace Fox (Spouse)',
    emergencyPhone: '+1 65738 10006',
    lastLogin: '2 weeks ago',
    joined: '19 Jan 2024',
    children: [{ name: 'Ralph Fox', classLabel: 'IV A', avatar: 'assets/img/students/student-06.jpg' }],
    performance: { feeStatus: 'Overdue', feePercent: 10, ptmAttendance: 20, communication: 20, mobileUsage: 12 },
  },
];

export const overviewCards = [
  { id: 'total', icon: 'ti ti-users', value: '1,248', label: 'Total Parents', trend: '+8% this month', trendUp: true, variant: 'stats-primary' },
  { id: 'active', icon: 'ti ti-user-check', value: '1,120', label: 'Active Parents', trend: '90% engagement', trendUp: true, variant: 'stats-success' },
  { id: 'verified', icon: 'ti ti-discount', value: '1,058', label: 'Verified Accounts', trend: '85% verified', trendUp: true, variant: 'stats-info' },
  { id: 'pending', icon: 'ti ti-clock-hour-4', value: '128', label: 'Pending Verification', trend: '-4% this week', trendUp: false, variant: 'stats-warning' },
];
