/* -------------------------------------------------------------------------- */
/*                                    Rows                                    */
/* -------------------------------------------------------------------------- */

export type GuardianStatus = 'Active' | 'Pending Verification' | 'Emergency Contact' | 'Inactive' | 'Archived';

export interface GuardianChild {
  name: string;
  avatar: string;
  admissionNo: string;
  /** `III, A` — the template's display form. */
  classLabel: string;
  status: string;
}

export interface EmergencyContact {
  label: string;
  phone: string;
}

export interface GuardianRow {
  id: string;
  name: string;
  avatar: string;
  relationship: string;
  occupation: string;
  /** Employer shown in the detail panel; blank for Homemaker and Retired. */
  organization: string;
  /** "Primary" and "Emergency" chips under the guardian name. */
  primaryContact: boolean;
  emergencyContact: boolean;
  phone: string;
  email: string;
  address: string;
  /** Preferred channel chip: Phone, Email, WhatsApp or SMS. */
  channel: string;
  channelIcon: string;
  /** Second contact chip, e.g. `2 days ago · Call`. */
  lastContact: string;
  /** The child shown in the Students column; `children` holds the full list. */
  child: GuardianChild;
  children: GuardianChild[];
  childrenCount: number;
  status: GuardianStatus;
  /** `is-active`, `is-pending`, … on the status pill. */
  pillClass: string;
  /** Pill icon; pending/emergency/archived use one, active/inactive use a dot. */
  pillIcon: string | null;
  pillLabel: string;
  transport: string;
  /** Filter value, e.g. `route 04` or `no transport`. */
  transportKey: string;
  year: string;
  registered: string;
  /** Filter values matching the template's `class iii` / `sec a` option values. */
  classKey: string;
  sectionKey: string;
  emergencyContacts: EmergencyContact[];
  feePaid: string;
  feeOutstanding: string;
  feeStatus: string;
  feeBadgeClass: string;
  communications: string[];
  meetingNote: string;
  /** The template's `data-search` attribute, verbatim. */
  search: string;
}

const child = (
  name: string,
  avatar: string,
  admissionNo: string,
  classLabel: string,
  status = 'Active',
): GuardianChild => ({ name, avatar, admissionNo, classLabel, status });

export const guardianRows: GuardianRow[] = [
  {
    id: 'G153735',
    name: 'William',
    avatar: 'assets/img/guardians/guardian-01.jpg',
    relationship: 'Father',
    occupation: 'Business Owner',
    organization: 'Larkin & Co.',
    primaryContact: true,
    emergencyContact: true,
    phone: '+1 82392 37359',
    email: 'william@example.com',
    address: '1247 Maple Avenue, Springfield, USA',
    channel: 'Phone',
    channelIcon: 'ti ti-device-mobile-message',
    lastContact: '2 days ago · Call',
    child: child('Janet', 'assets/img/students/student-01.jpg', 'AD9892434', 'III, A'),
    children: [
      child('Janet', 'assets/img/students/student-01.jpg', 'AD9892434', 'III, A'),
      child('Joann', 'assets/img/students/student-02.jpg', 'AD9892433', 'IV, B'),
    ],
    childrenCount: 2,
    status: 'Active',
    pillClass: 'is-active',
    pillIcon: null,
    pillLabel: 'Active',
    transport: 'Bus Route 04 · Maple Cross',
    transportKey: 'route 04',
    year: '2024/2025',
    registered: '2024',
    classKey: 'class iii',
    sectionKey: 'sec a',
    emergencyContacts: [
      { label: 'Father', phone: '+1 82392 37359' },
      { label: 'Alternate', phone: '+1 44120 90100' },
    ],
    feePaid: '$4,200',
    feeOutstanding: '$0',
    feeStatus: 'Paid',
    feeBadgeClass: 'badge-soft-success',
    communications: ['2 days ago · Call', 'Fee reminder sent · 12 May'],
    meetingNote: "PTM 25 Mar 2024 — discussed Janet's progress.",
    search:
      'william g153735 father business owner active janet ad9892434 class iii sec a william@example.com +18239237359 route 04 2024/2025',
  },
  {
    id: 'G153734',
    name: 'Stacey',
    avatar: 'assets/img/guardians/guardian-02.jpg',
    relationship: 'Mother',
    occupation: 'Doctor',
    organization: 'City Care Hospital',
    primaryContact: true,
    emergencyContact: false,
    phone: '+1 28249 13139',
    email: 'stacey@example.com',
    address: '88 Oak Street, Riverside, USA',
    channel: 'Email',
    channelIcon: 'ti ti-device-mobile-message',
    lastContact: '5 hours ago · Email',
    child: child('Joann', 'assets/img/students/student-02.jpg', 'AD9892433', 'IV, B'),
    children: [child('Joann', 'assets/img/students/student-02.jpg', 'AD9892433', 'IV, B')],
    childrenCount: 1,
    status: 'Active',
    pillClass: 'is-active',
    pillIcon: null,
    pillLabel: 'Active',
    transport: 'Bus Route 07 · Oak Junction',
    transportKey: 'route 07',
    year: '2024/2025',
    registered: '2024',
    classKey: 'class iv',
    sectionKey: 'sec b',
    emergencyContacts: [
      { label: 'Mother', phone: '+1 28249 13139' },
      { label: 'Alternate', phone: '+1 44120 90110' },
    ],
    feePaid: '$3,900',
    feeOutstanding: '$300',
    feeStatus: 'Partial',
    feeBadgeClass: 'badge-soft-warning',
    communications: ['5 hours ago · Email', 'Fee reminder sent · 12 May'],
    meetingNote: "PTM 18 Mar 2024 — discussed Joann's progress.",
    search:
      'stacey g153734 mother doctor active joann ad9892433 class iv sec b stacey@example.com +12824913139 route 07 2024/2025',
  },
  {
    id: 'G153733',
    name: 'George',
    avatar: 'assets/img/guardians/guardian-03.jpg',
    relationship: 'Father',
    occupation: 'Software Engineer',
    organization: 'Nexus Labs',
    primaryContact: false,
    emergencyContact: true,
    phone: '+1 74284 34849',
    email: 'george@example.com',
    address: '25 Pine Road, Fairview, USA',
    channel: 'WhatsApp',
    channelIcon: 'ti ti-device-mobile-message',
    lastContact: '1 day ago · SMS',
    child: child('Kathleen', 'assets/img/students/student-03.jpg', 'AD9892430', 'III, A'),
    children: [child('Kathleen', 'assets/img/students/student-03.jpg', 'AD9892430', 'III, A')],
    childrenCount: 1,
    status: 'Active',
    pillClass: 'is-active',
    pillIcon: null,
    pillLabel: 'Active',
    transport: 'Bus Route 04 · Pine Gate',
    transportKey: 'route 04',
    year: '2024/2025',
    registered: '2024',
    classKey: 'class iii',
    sectionKey: 'sec a',
    emergencyContacts: [
      { label: 'Father', phone: '+1 74284 34849' },
      { label: 'Alternate', phone: '+1 44120 90120' },
    ],
    feePaid: '$4,200',
    feeOutstanding: '$0',
    feeStatus: 'Paid',
    feeBadgeClass: 'badge-soft-success',
    communications: ['1 day ago · SMS', 'Fee reminder sent · 12 May'],
    meetingNote: "PTM 14 Mar 2024 — discussed Kathleen's progress.",
    search:
      'george g153733 father software engineer active kathleen ad9892430 class iii sec a george@example.com +17428434849 route 04 2024/2025',
  },
  {
    id: 'G153732',
    name: 'Sarah',
    avatar: 'assets/img/guardians/guardian-04.jpg',
    relationship: 'Mother',
    occupation: 'School Teacher',
    organization: 'Green Valley School',
    primaryContact: true,
    emergencyContact: false,
    phone: '+1 82239 42492',
    email: 'sarah@example.com',
    address: '402 Cedar Lane, Lakeside, USA',
    channel: 'Phone',
    channelIcon: 'ti ti-device-mobile-message',
    lastContact: 'Awaiting first contact',
    child: child('Gifford', 'assets/img/students/student-04.jpg', 'AD9892421', 'I, B'),
    children: [child('Gifford', 'assets/img/students/student-04.jpg', 'AD9892421', 'I, B')],
    childrenCount: 1,
    status: 'Pending Verification',
    pillClass: 'is-pending',
    pillIcon: 'ti ti-clock-hour-4',
    pillLabel: 'Pending',
    transport: 'Bus Route 02 · Cedar Point',
    transportKey: 'route 02',
    year: '2024/2025',
    registered: '2024',
    classKey: 'class i',
    sectionKey: 'sec b',
    emergencyContacts: [
      { label: 'Mother', phone: '+1 82239 42492' },
      { label: 'Alternate', phone: '+1 44120 90130' },
    ],
    feePaid: '$1,800',
    feeOutstanding: '$900',
    feeStatus: 'Partial',
    feeBadgeClass: 'badge-soft-warning',
    communications: ['Awaiting first contact', 'Fee reminder sent · 12 May'],
    meetingNote: "PTM 27 Feb 2024 — discussed Gifford's progress.",
    search:
      'sarah g153732 mother school teacher pending verification gifford ad9892421 class i sec b sarah@example.com +18223942492 route 02 2024/2025',
  },
  {
    id: 'G153731',
    name: 'Gary',
    avatar: 'assets/img/guardians/guardian-05.jpg',
    relationship: 'Father',
    occupation: 'Accountant',
    organization: 'Sterling Finance',
    primaryContact: true,
    emergencyContact: true,
    phone: '+1 82239 42492',
    email: 'gary@example.com',
    address: '402 Cedar Lane, Lakeside, USA',
    channel: 'Email',
    channelIcon: 'ti ti-device-mobile-message',
    lastContact: '3 days ago · Meeting',
    child: child('Lisa', 'assets/img/students/student-05.jpg', 'AD9892419', 'II, B'),
    children: [
      child('Lisa', 'assets/img/students/student-05.jpg', 'AD9892419', 'II, B'),
      child('Mark', 'assets/img/students/student-06.jpg', 'AD9892418', 'V, A'),
    ],
    childrenCount: 2,
    status: 'Active',
    pillClass: 'is-active',
    pillIcon: null,
    pillLabel: 'Active',
    transport: 'Bus Route 02 · Cedar Point',
    transportKey: 'route 02',
    year: '2024/2025',
    registered: '2024',
    classKey: 'class ii',
    sectionKey: 'sec b',
    emergencyContacts: [
      { label: 'Father', phone: '+1 82239 42492' },
      { label: 'Alternate', phone: '+1 44120 90140' },
    ],
    feePaid: '$3,600',
    feeOutstanding: '$0',
    feeStatus: 'Paid',
    feeBadgeClass: 'badge-soft-success',
    communications: ['3 days ago · Meeting', 'Fee reminder sent · 12 May'],
    meetingNote: "PTM 11 Feb 2024 — discussed Lisa's progress.",
    search:
      'gary g153731 father accountant active lisa ad9892419 class ii sec b gary@example.com +18223942492 route 02 2024/2025',
  },
  {
    id: 'G153730',
    name: 'Linda',
    avatar: 'assets/img/guardians/guardian-06.jpg',
    relationship: 'Legal Guardian',
    occupation: 'Homemaker',
    organization: '',
    primaryContact: false,
    emergencyContact: false,
    phone: '+1 90139 45835',
    email: 'linda@example.com',
    address: '13 Birch Court, Hilltop, USA',
    channel: 'Phone',
    channelIcon: 'ti ti-device-mobile-message',
    lastContact: '3 weeks ago · Call',
    child: child('Ralph', 'assets/img/students/student-07.jpg', 'AD9892410', 'III, B'),
    children: [child('Ralph', 'assets/img/students/student-07.jpg', 'AD9892410', 'III, B')],
    childrenCount: 1,
    status: 'Inactive',
    pillClass: 'is-inactive',
    pillIcon: null,
    pillLabel: 'Inactive',
    transport: 'No transport',
    transportKey: 'no transport',
    year: '2023/2024',
    registered: '2023',
    classKey: 'class iii',
    sectionKey: 'sec b',
    emergencyContacts: [
      { label: 'Legal Guardian', phone: '+1 90139 45835' },
      { label: 'Alternate', phone: '+1 44120 90150' },
    ],
    feePaid: '$2,100',
    feeOutstanding: '$1,200',
    feeStatus: 'Overdue',
    feeBadgeClass: 'badge-soft-danger',
    communications: ['3 weeks ago · Call', 'Fee reminder sent · 12 May'],
    meetingNote: "PTM 24 Jan 2024 — discussed Ralph's progress.",
    search:
      'linda g153730 legal guardian homemaker inactive ralph ad9892410 class iii sec b linda@example.com +19013945835 no transport 2023/2024',
  },
  {
    id: 'G153729',
    name: 'Jeffrey',
    avatar: 'assets/img/guardians/guardian-07.jpg',
    relationship: 'Father',
    occupation: 'Architect',
    organization: 'Vantage Design',
    primaryContact: false,
    emergencyContact: true,
    phone: '+1 23230 37402',
    email: 'jeffrey@example.com',
    address: '76 Elm Street, Brookside, USA',
    channel: 'Phone',
    channelIcon: 'ti ti-device-mobile-message',
    lastContact: '6 days ago · Email',
    child: child('Julie', 'assets/img/students/student-08.jpg', 'AD9892405', 'V, A'),
    children: [child('Julie', 'assets/img/students/student-08.jpg', 'AD9892405', 'V, A')],
    childrenCount: 1,
    status: 'Active',
    pillClass: 'is-active',
    pillIcon: null,
    pillLabel: 'Active',
    transport: 'Bus Route 09 · Elm Corner',
    transportKey: 'route 09',
    year: '2024/2025',
    registered: '2024',
    classKey: 'class v',
    sectionKey: 'sec a',
    emergencyContacts: [
      { label: 'Father', phone: '+1 23230 37402' },
      { label: 'Alternate', phone: '+1 44120 90160' },
    ],
    feePaid: '$4,500',
    feeOutstanding: '$0',
    feeStatus: 'Paid',
    feeBadgeClass: 'badge-soft-success',
    communications: ['6 days ago · Email', 'Fee reminder sent · 12 May'],
    meetingNote: "PTM 19 Jan 2024 — discussed Julie's progress.",
    search:
      'jeffrey g153729 father architect active julie ad9892405 class v sec a jeffrey@example.com +12323037402 route 09 2024/2025',
  },
  {
    id: 'G153728',
    name: 'Galina',
    avatar: 'assets/img/guardians/guardian-08.jpg',
    relationship: 'Grandmother',
    occupation: 'Retired',
    organization: '',
    primaryContact: false,
    emergencyContact: true,
    phone: '+1 91304 34834',
    email: 'galina@example.com',
    address: '5 Willow Way, Meadowbrook, USA',
    channel: 'Phone',
    channelIcon: 'ti ti-device-mobile-message',
    lastContact: 'Today · Call',
    child: child('Janet', 'assets/img/students/student-09.jpg', 'AD9892398', 'III, A'),
    children: [child('Janet', 'assets/img/students/student-09.jpg', 'AD9892398', 'III, A')],
    childrenCount: 1,
    status: 'Emergency Contact',
    pillClass: 'is-emergency',
    pillIcon: 'ti ti-urgent',
    pillLabel: 'Emergency',
    transport: 'Bus Route 04 · Willow Bend',
    transportKey: 'route 04',
    year: '2024/2025',
    registered: '2024',
    classKey: 'class iii',
    sectionKey: 'sec a',
    emergencyContacts: [
      { label: 'Grandmother', phone: '+1 91304 34834' },
      { label: 'Alternate', phone: '+1 44120 90170' },
    ],
    feePaid: '$4,200',
    feeOutstanding: '$0',
    feeStatus: 'Paid',
    feeBadgeClass: 'badge-soft-success',
    communications: ['Today · Call', 'Fee reminder sent · 12 May'],
    meetingNote: "PTM 08 Jan 2024 — discussed Janet's progress.",
    search:
      'galina g153728 grandmother retired emergency contact janet ad9892398 class iii sec a galina@example.com +19130434834 route 04 2024/2025',
  },
  {
    id: 'G153727',
    name: 'Paul',
    avatar: 'assets/img/guardians/guardian-09.jpg',
    relationship: 'Father',
    occupation: 'Lawyer',
    organization: 'Paul & Associates',
    primaryContact: true,
    emergencyContact: false,
    phone: '+1 84394 28204',
    email: 'paul@example.com',
    address: '220 Spruce Blvd, Westend, USA',
    channel: 'Email',
    channelIcon: 'ti ti-device-mobile-message',
    lastContact: '4 days ago · Meeting',
    child: child('Susan', 'assets/img/students/student-10.jpg', 'AD9892387', 'VIII, B'),
    children: [child('Susan', 'assets/img/students/student-10.jpg', 'AD9892387', 'VIII, B')],
    childrenCount: 1,
    status: 'Active',
    pillClass: 'is-active',
    pillIcon: null,
    pillLabel: 'Active',
    transport: 'Bus Route 11 · Spruce Plaza',
    transportKey: 'route 11',
    year: '2024/2025',
    registered: '2024',
    classKey: 'class viii',
    sectionKey: 'sec b',
    emergencyContacts: [
      { label: 'Father', phone: '+1 84394 28204' },
      { label: 'Alternate', phone: '+1 44120 90180' },
    ],
    feePaid: '$5,100',
    feeOutstanding: '$400',
    feeStatus: 'Partial',
    feeBadgeClass: 'badge-soft-warning',
    communications: ['4 days ago · Meeting', 'Fee reminder sent · 12 May'],
    meetingNote: "PTM 22 Dec 2023 — discussed Susan's progress.",
    search:
      'paul g153727 father lawyer active susan ad9892387 class viii sec b paul@example.com +18439428204 route 11 2024/2025',
  },
  {
    id: 'G153726',
    name: 'Tracy',
    avatar: 'assets/img/guardians/guardian-10.jpg',
    relationship: 'Mother',
    occupation: 'Business Consultant',
    organization: 'BrightPath',
    primaryContact: false,
    emergencyContact: false,
    phone: '+1 93402 39342',
    email: 'tracy@example.com',
    address: '91 Aspen Drive, Eastgate, USA',
    channel: 'Email',
    channelIcon: 'ti ti-device-mobile-message',
    lastContact: '2 months ago · Email',
    child: child('Richard', 'assets/img/students/student-11.jpg', 'AD9892375', 'VII, B'),
    children: [child('Richard', 'assets/img/students/student-11.jpg', 'AD9892375', 'VII, B')],
    childrenCount: 1,
    status: 'Archived',
    pillClass: 'is-archived',
    pillIcon: 'ti ti-archive',
    pillLabel: 'Archived',
    transport: 'No transport',
    transportKey: 'no transport',
    year: '2023/2024',
    registered: '2023',
    classKey: 'class vii',
    sectionKey: 'sec b',
    emergencyContacts: [
      { label: 'Mother', phone: '+1 93402 39342' },
      { label: 'Alternate', phone: '+1 44120 90190' },
    ],
    feePaid: '$4,800',
    feeOutstanding: '$0',
    feeStatus: 'Paid',
    feeBadgeClass: 'badge-soft-success',
    communications: ['2 months ago · Email', 'Fee reminder sent · 12 May'],
    meetingNote: "PTM 15 Dec 2023 — discussed Richard's progress.",
    search:
      'tracy g153726 mother business consultant archived richard ad9892375 class vii sec b tracy@example.com +19340239342 no transport 2023/2024',
  },
  {
    id: 'G153725',
    name: 'Edwin',
    avatar: 'assets/img/guardians/guardian-11.jpg',
    relationship: 'Uncle',
    occupation: 'Pharmacist',
    organization: '',
    primaryContact: true,
    emergencyContact: true,
    phone: '+1 65738 58940',
    email: 'edw@example.com',
    address: '34 Poplar Street, Sunnyvale, USA',
    channel: 'SMS',
    channelIcon: 'ti ti-device-mobile-message',
    lastContact: '1 week ago · Call',
    child: child('Veronica', 'assets/img/students/student-12.jpg', 'AD9892360', 'IX, A'),
    children: [child('Veronica', 'assets/img/students/student-12.jpg', 'AD9892360', 'IX, A')],
    childrenCount: 1,
    status: 'Active',
    pillClass: 'is-active',
    pillIcon: null,
    pillLabel: 'Active',
    transport: 'Bus Route 06 · Poplar Stop',
    transportKey: 'route 06',
    year: '2024/2025',
    registered: '2024',
    classKey: 'class ix',
    sectionKey: 'sec a',
    emergencyContacts: [
      { label: 'Uncle', phone: '+1 65738 58940' },
      { label: 'Alternate', phone: '+1 44120 90200' },
    ],
    feePaid: '$5,400',
    feeOutstanding: '$0',
    feeStatus: 'Paid',
    feeBadgeClass: 'badge-soft-success',
    communications: ['1 week ago · Call', 'Fee reminder sent · 12 May'],
    meetingNote: "PTM 10 Dec 2023 — discussed Veronica's progress.",
    search:
      'edwin g153725 uncle pharmacist active veronica ad9892360 class ix sec a edw@example.com +16573858940 route 06 2024/2025',
  },
];

/* -------------------------------------------------------------------------- */
/*                                Saved views                                 */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

/** `all` plus the five statuses the template exposes as `data-cls-view` values. */
export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Guardians', icon: 'ti ti-layout-list' },
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'Pending Verification', label: 'Pending Verification', icon: 'ti ti-clock-hour-4' },
  { id: 'Emergency Contact', label: 'Emergency Contacts', icon: 'ti ti-urgent' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-circle-x' },
  { id: 'Archived', label: 'Archived', icon: 'ti ti-archive' },
];

export const quickFilters: SavedView[] = [
  { id: 'Active', label: 'Active', icon: 'ti ti-user-check' },
  { id: 'Pending Verification', label: 'Pending', icon: 'ti ti-clock-hour-4' },
  { id: 'Emergency Contact', label: 'Emergency', icon: 'ti ti-urgent' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-user-off' },
  { id: 'Archived', label: 'Archived', icon: 'ti ti-archive' },
];

/* -------------------------------------------------------------------------- */
/*                              Advanced filters                              */
/* -------------------------------------------------------------------------- */

export type FilterKey =
  | 'relationship'
  | 'occupation'
  | 'student'
  | 'class'
  | 'section'
  | 'status'
  | 'transport'
  | 'year'
  | 'registered';

export interface AdvancedFilterOption {
  /** Matched against the row; equals `label` unless the template set a value. */
  value: string;
  label: string;
}

export interface AdvancedFilter {
  inputId: string;
  key: FilterKey;
  label: string;
  options: AdvancedFilterOption[];
  /** Registration Date spans the full row in the template. */
  wide?: boolean;
  /** Registration Date's empty option reads "Any time" rather than "All". */
  emptyLabel?: string;
}

const plain = (values: string[]): AdvancedFilterOption[] => values.map((value) => ({ value, label: value }));

export const advancedFilters: AdvancedFilter[] = [
  {
    inputId: 'relationship',
    key: 'relationship',
    label: 'Relationship',
    options: plain(['Father', 'Mother', 'Legal Guardian', 'Grandmother', 'Uncle']),
  },
  {
    inputId: 'occupation',
    key: 'occupation',
    label: 'Occupation',
    options: plain([
      'Business Owner',
      'Doctor',
      'Software Engineer',
      'School Teacher',
      'Accountant',
      'Architect',
      'Lawyer',
      'Pharmacist',
      'Business Consultant',
    ]),
  },
  {
    inputId: 'student',
    key: 'student',
    label: 'Student',
    options: plain(['Janet', 'Joann', 'Kathleen', 'Gifford', 'Lisa', 'Ralph', 'Julie', 'Susan', 'Richard', 'Veronica']),
  },
  {
    inputId: 'class',
    key: 'class',
    label: 'Class',
    options: ['I', 'II', 'III', 'IV', 'V', 'VII', 'VIII', 'IX'].map((label) => ({
      value: `class ${label.toLowerCase()}`,
      label,
    })),
  },
  {
    inputId: 'section',
    key: 'section',
    label: 'Section',
    options: [
      { value: 'sec a', label: 'A' },
      { value: 'sec b', label: 'B' },
    ],
  },
  {
    inputId: 'status',
    key: 'status',
    label: 'Status',
    options: plain(['Active', 'Inactive', 'Pending Verification', 'Emergency Contact', 'Archived']),
  },
  {
    inputId: 'transport',
    key: 'transport',
    label: 'Transport',
    options: [
      { value: 'route 02', label: 'Route 02' },
      { value: 'route 04', label: 'Route 04' },
      { value: 'route 06', label: 'Route 06' },
      { value: 'route 07', label: 'Route 07' },
      { value: 'route 09', label: 'Route 09' },
      { value: 'route 11', label: 'Route 11' },
      { value: 'no transport', label: 'No Transport' },
    ],
  },
  {
    inputId: 'academic-year',
    key: 'year',
    label: 'Academic Year',
    options: plain(['2024/2025', '2023/2024']),
  },
  {
    inputId: 'registration-date',
    key: 'registered',
    label: 'Registration Date',
    wide: true,
    emptyLabel: 'Any time',
    options: [
      { value: '2024', label: 'Registered in 2024' },
      { value: '2023', label: 'Registered in 2023' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                             Column visibility                              */
/* -------------------------------------------------------------------------- */

export type ColumnId = 'guardian' | 'contact' | 'student' | 'status';

export interface ColumnDef {
  id: ColumnId;
  label: string;
}

export const columnDefs: ColumnDef[] = [
  { id: 'guardian', label: 'Guardian' },
  { id: 'contact', label: 'Contact' },
  { id: 'student', label: 'Students' },
  { id: 'status', label: 'Status' },
];

export const allColumns: Record<ColumnId, boolean> = {
  guardian: true,
  contact: true,
  student: true,
  status: true,
};

/* -------------------------------------------------------------------------- */
/*                                    Sort                                    */
/* -------------------------------------------------------------------------- */

export type SortKey = 'name' | 'relationship' | 'student' | 'children' | 'status' | 'recent';

export interface SortOption {
  id: SortKey;
  label: string;
  icon: string;
}

export const sortOptions: SortOption[] = [
  { id: 'name', label: 'Guardian name (A–Z)', icon: 'ti ti-abc' },
  { id: 'relationship', label: 'Relationship', icon: 'ti ti-heart-handshake' },
  { id: 'student', label: 'Student name', icon: 'ti ti-school' },
  { id: 'children', label: 'Linked students', icon: 'ti ti-users' },
  { id: 'recent', label: 'Recently added', icon: 'ti ti-clock' },
];

/** Column headers in template order; `sort` doubles as the `data-cls-sort` key. */
export const tableHeaders: { id: ColumnId; label: string; sort?: SortKey }[] = [
  { id: 'guardian', label: 'Guardian', sort: 'name' },
  { id: 'contact', label: 'Contact' },
  { id: 'student', label: 'Students', sort: 'student' },
  { id: 'status', label: 'Status', sort: 'status' },
];

/* -------------------------------------------------------------------------- */
/*                                   Density                                  */
/* -------------------------------------------------------------------------- */

export type DensityId = 'compact' | 'default' | 'comfortable';

export const densityOptions: { id: DensityId; title: string; icon: string }[] = [
  { id: 'compact', title: 'Compact', icon: 'ti ti-baseline-density-small' },
  { id: 'default', title: 'Default', icon: 'ti ti-baseline-density-medium' },
  { id: 'comfortable', title: 'Comfortable', icon: 'ti ti-baseline-density-large' },
];

/* -------------------------------------------------------------------------- */
/*                          Exports, paging and modals                        */
/* -------------------------------------------------------------------------- */

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
];

export const pageSizes = ['10', '25', '50', '100'];

export type GuardianListModalId = 'import' | 'add' | 'edit' | 'view' | 'delete';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

/* -------------------------------------------------------------------------- */
/*                                Bulk actions                                */
/* -------------------------------------------------------------------------- */

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  modal?: GuardianListModalId;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { id: 'sms', label: 'Send SMS', icon: 'ti ti-message-2' },
  { id: 'email', label: 'Send Email', icon: 'ti ti-mail' },
  { id: 'announcement', label: 'Announcement', icon: 'ti ti-speakerphone' },
  { id: 'assign_students', label: 'Assign Students', icon: 'ti ti-user-plus' },
  { id: 'portal_access', label: 'Portal Access', icon: 'ti ti-key' },
  { id: 'export_csv', label: 'Export', icon: 'ti ti-download' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

/** Toast copy for every `data-cls-action` the template fires. */
export const actionToasts: Record<string, string> = {
  sms: 'SMS queued for the selected guardians',
  email: 'Email queued for the selected guardians',
  announcement: 'Announcement sent',
  assign_students: 'Student assignment opened',
  portal_access: 'Portal access generated',
  reset_password: 'Portal password reset link sent',
  export_csv: 'Exported as CSV',
  export_pdf: 'Exported as PDF',
  export_excel: 'Exported as Excel',
  print: 'Print view opened',
  archive: 'Selected guardians archived',
  save_view: 'Current view saved',
  refresh: 'Guardian list refreshed',
};

/** Row kebab entries that only navigate or toast — the template's 19-item menu. */
export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  /** Route key on `all_routes`; omitted entries fire a toast instead. */
  route?: string;
  modal?: GuardianListModalId;
  action?: string;
  divider?: boolean;
  danger?: boolean;
}

export const rowMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View Guardian', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'linked', label: 'Linked Students', icon: 'ti ti-users', modal: 'view' },
  { id: 'profile', label: 'Student Profile', icon: 'ti ti-user', route: 'studentDetail' },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-calendar-check', route: 'studentAttendance' },
  { id: 'progress', label: 'Academic Progress', icon: 'ti ti-chart-line', route: 'studentResult' },
  { id: 'fees', label: 'Fee Details', icon: 'ti ti-report-money', route: 'feesGroup' },
  { id: 'payments', label: 'Payment History', icon: 'ti ti-history', route: 'accountsTransactions' },
  { id: 'library', label: 'Library', icon: 'ti ti-books', route: 'libraryMembers' },
  { id: 'transport', label: 'Transport', icon: 'ti ti-bus', route: 'transportRoutes' },
  { id: 'documents', label: 'Documents', icon: 'ti ti-file-text', action: 'documents' },
  { id: 'comms', label: 'Communication History', icon: 'ti ti-messages', route: 'chat' },
  { id: 'email', label: 'Email', icon: 'ti ti-mail', action: 'email' },
  { id: 'download', label: 'Download Profile', icon: 'ti ti-download', action: 'download' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer', action: 'print' },
  { id: 'assign_students', label: 'Assign Student', icon: 'ti ti-user-plus', action: 'assign_students', divider: true },
  { id: 'portal_access', label: 'Generate Portal Access', icon: 'ti ti-key', action: 'portal_access' },
  { id: 'reset_password', label: 'Reset Portal Password', icon: 'ti ti-lock-cog', action: 'reset_password' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive', action: 'archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];
