/* --------------------------------- Shared --------------------------------- */

export interface MetaRow {
  key: string;
  value: string;
  /** Extra classes on the value, e.g. `text-danger` for the blood group. */
  valueClass?: string;
}

/* ---------------------------------- Hero ---------------------------------- */

export const heroIdentity = {
  photo: 'assets/img/students/student-01.jpg',
  name: 'Janet Daniel',
  status: { label: 'Active', accent: 'accent-success' },
  meta: [
    { icon: 'ti ti-id-badge-2', label: 'Admission', value: 'AD1256589' },
    { icon: 'ti ti-hash', label: 'Roll No', value: '35013' },
    { icon: 'ti ti-school', label: 'Class', value: 'III - A' },
    { icon: 'ti ti-calendar', label: 'AY', value: '2024 / 2025' },
    { icon: 'ti ti-home', label: 'House', value: 'Red' },
    { icon: 'ti ti-droplet', label: 'Blood', value: 'O +ve' },
  ],
  badges: [
    { icon: 'ti ti-award', label: 'Scholarship', accent: 'accent-warning' },
    { icon: 'ti ti-bus', label: 'Transport', accent: 'accent-info' },
    { icon: 'ti ti-building', label: 'Hostel', accent: 'accent-purple' },
    { icon: 'ti ti-users', label: 'Parent Portal', accent: 'accent-teal' },
  ],
  completion: 92,
};

export const heroRings = [
  { id: 'attendance', accent: 'accent-success', value: 96, count: 96, suffix: '%', label: 'Attendance' },
  { id: 'academic', accent: 'accent-primary', value: 88, count: 8.8, suffix: '', label: 'Academic' },
  { id: 'index', accent: 'accent-purple', value: 82, count: 82, suffix: '', label: 'Perf. Index' },
];

export const heroContacts = [
  { id: 'call', icon: 'ti ti-phone', className: 'c-green', title: 'Call', action: 'call' },
  { id: 'whatsapp', icon: 'ti ti-brand-whatsapp', className: 'c-whatsapp', title: 'WhatsApp', action: 'whatsapp' },
  { id: 'email', icon: 'ti ti-mail', className: '', title: 'Email', action: 'email' },
  { id: 'message', icon: 'ti ti-message', className: 'c-amber', title: 'Message', action: 'message' },
] as const;

/* ----------------------------- Executive overview -------------------------- */

export interface OverviewTile {
  id: string;
  accent: string;
  icon: string;
  label: string;
  /** Static text value, or a counter when `count` is set. */
  value?: string;
  count?: number;
  suffix?: string;
  sub: { icon: string; text: string; className: string };
}

export const overviewTiles: OverviewTile[] = [
  { id: 'attendance', accent: 'accent-success', icon: 'ti ti-checks', label: 'Attendance', count: 96, suffix: '%', sub: { icon: 'ti ti-trending-up', text: '+2% this month', className: 'document-upload' } },
  { id: 'gpa', accent: 'accent-primary', icon: 'ti ti-award', label: 'Academic GPA', count: 8.8, sub: { icon: 'ti ti-trending-up', text: 'Top 5% of class', className: 'document-upload' } },
  { id: 'behavior', accent: 'accent-teal', icon: 'ti ti-mood-happy', label: 'Behavior', count: 94, suffix: '/100', sub: { icon: 'ti ti-trending-up', text: 'Excellent', className: 'document-upload' } },
  { id: 'fees', accent: 'accent-warning', icon: 'ti ti-report-money', label: 'Fee Status', value: 'Due', sub: { icon: 'ti ti-alert-triangle', text: '$2,000 pending', className: 'profile-down' } },
  { id: 'transport', accent: 'accent-info', icon: 'ti ti-bus', label: 'Transport', value: 'Route 12', sub: { icon: 'ti ti-map-pin', text: 'Bus 04 · Active', className: 'document-upload' } },
  { id: 'library', accent: 'accent-indigo', icon: 'ti ti-books', label: 'Library', count: 3, sub: { icon: 'ti ti-book', text: 'Books issued', className: 'document-upload' } },
  { id: 'medical', accent: 'accent-danger', icon: 'ti ti-heartbeat', label: 'Medical', value: 'Fit', sub: { icon: 'ti ti-vaccine', text: 'Vaccinated', className: 'document-upload' } },
  { id: 'login', accent: 'accent-slate', icon: 'ti ti-login-2', label: 'Last Login', value: '2h ago', sub: { icon: 'ti ti-clock', text: 'Student portal', className: '' } },
  { id: 'portal', accent: 'accent-purple', icon: 'ti ti-users', label: 'Parent Portal', value: 'Active', sub: { icon: 'ti ti-circle-check', text: 'Linked', className: 'document-upload' } },
  { id: 'index', accent: 'accent-pink', icon: 'ti ti-chart-radar', label: 'Performance Index', count: 82, suffix: '/100', sub: { icon: 'ti ti-trending-up', text: 'Rank 3', className: 'document-upload' } },
];

/* ---------------------------- Personal information ------------------------- */

export const personalInformation: MetaRow[] = [
  { key: 'Full Name', value: 'Janet Daniel' },
  { key: 'Date of Birth', value: '25 Jan 2008' },
  { key: 'Age', value: '16 Years' },
  { key: 'Gender', value: 'Female' },
  { key: 'Nationality', value: 'American' },
  { key: 'Religion', value: 'Christianity' },
  { key: 'Blood Group', value: 'O +ve', valueClass: 'text-danger' },
  { key: 'National ID', value: '•••• •••• 4521' },
  { key: 'Passport', value: 'P1234567' },
  { key: 'Emergency', value: '+1 809 095 5468' },
  { key: 'Email', value: 'janet.d@example.com' },
  { key: 'Phone', value: '+1 46548 84588' },
];

export const languages = ['English', 'Spanish', 'French'];
export const address = '911 Deer Ridge Drive, Cedar Rapids, IA 52402, USA';

/* ----------------------------- Parent & guardian --------------------------- */

export interface ProfilePerson {
  id: string;
  photo?: string;
  icon?: string;
  name: string;
  roles: string[];
  actions: { id: string; icon: string; className: string; title: string; action: string }[];
}

export const parentsAndGuardians: ProfilePerson[] = [
  {
    id: 'father',
    photo: 'assets/img/parents/parent-01.jpg',
    name: 'Robert Daniel',
    roles: ['Father · Business Owner, Daniel & Co.', '+1 809 095 5468 · robert.d@example.com'],
    actions: [
      { id: 'call', icon: 'ti ti-phone', className: 'c-green', title: 'Call', action: 'call' },
      { id: 'whatsapp', icon: 'ti ti-brand-whatsapp', className: 'c-whatsapp', title: 'WhatsApp', action: 'whatsapp' },
      { id: 'message', icon: 'ti ti-message', className: 'c-amber', title: 'Message', action: 'message' },
    ],
  },
  {
    id: 'mother',
    photo: 'assets/img/parents/parent-02.jpg',
    name: 'Sarah Daniel',
    roles: ['Mother · Senior Nurse, City Hospital', '+1 809 555 1245 · sarah.d@example.com'],
    actions: [
      { id: 'call', icon: 'ti ti-phone', className: 'c-green', title: 'Call', action: 'call' },
      { id: 'email', icon: 'ti ti-mail', className: '', title: 'Email', action: 'email' },
    ],
  },
  {
    id: 'guardian',
    icon: 'ti ti-shield-check',
    name: 'David Miller',
    roles: ['Local Guardian · Uncle', 'Emergency Contact: +1 809 777 3321'],
    actions: [],
  },
];

/* -------------------------------- Transport -------------------------------- */

export const transportRows: MetaRow[] = [
  { key: 'Bus Number', value: 'BUS-04 / KA-01-1234' },
  { key: 'Route', value: 'Route 12 — Downtown' },
  { key: 'Driver', value: 'Michael Doe · +1 4587 220 145' },
  { key: 'Pickup Point', value: 'Maple Street · 07:45 AM' },
  { key: 'Drop Point', value: 'Maple Street · 03:30 PM' },
];

export const transportEta = {
  time: 'ETA 07:41 AM',
  detail: 'Bus 04 · 1.2 km away · on time',
};

/* --------------------------------- Hostel ---------------------------------- */

export const hostelRows: MetaRow[] = [
  { key: 'Room Number', value: 'H-204' },
  { key: 'Block', value: 'Sunrise Girls Block B' },
  { key: 'Warden', value: 'Mrs. Angela Smith' },
  { key: 'Roommates', value: 'Lisa, Kathleen (2)' },
  { key: 'Check-in Date', value: '12 Jun 2024' },
];

/* ----------------------------- Medical record ------------------------------ */

export const medicalRows: MetaRow[] = [
  { key: 'Blood Group', value: 'O +ve', valueClass: 'text-danger' },
  { key: 'Allergies', value: 'Peanuts, Dust' },
  { key: 'Conditions', value: 'Mild Asthma' },
];

export const medicalDoctor: MetaRow = { key: 'Doctor', value: 'Dr. Emily Clark' };
export const medicalNote = 'Carries an inhaler. Notify nurse during sports.';

/* -------------------------------- AI insights ------------------------------ */

export interface ProfileInsight {
  id: string;
  icon: string;
  iconClass: string;
  title: string;
  risk?: { label: string; className: string };
  /** Rendered as HTML-free segments; `bold` pieces map to `<b>`. */
  body: { text: string; bold?: boolean }[];
}

export const aiInsights: ProfileInsight[] = [
  {
    id: 'risk',
    icon: 'ti ti-alert-triangle',
    iconClass: 'text-warning',
    title: 'Attendance Risk',
    risk: { label: 'Low', className: 'insight-risk low ms-auto' },
    body: [{ text: 'Consistent 96% attendance. No intervention required this term.' }],
  },
  {
    id: 'prediction',
    icon: 'ti ti-chart-line',
    iconClass: 'text-primary',
    title: 'Performance Prediction',
    body: [
      { text: 'Projected to finish the year with a ' },
      { text: '9.1 GPA', bold: true },
      { text: ' — a 3% improvement, driven by strong Math & Science trends.' },
    ],
  },
  {
    id: 'actions',
    icon: 'ti ti-bulb',
    iconClass: 'text-info',
    title: 'Recommended Actions',
    body: [
      {
        text: 'Enrol in the advanced Science club; schedule extra reading support to lift English scores.',
      },
    ],
  },
  {
    id: 'strengths',
    icon: 'ti ti-thumb-up',
    iconClass: 'text-success',
    title: 'Strengths & Weaknesses',
    body: [
      { text: 'Strengths:', bold: true },
      { text: ' Mathematics, Science, Sports. ' },
      { text: 'Focus areas:', bold: true },
      { text: ' English, History.' },
    ],
  },
];

/* ------------------------------ Header actions ----------------------------- */

export const recordLinks = [
  { id: 'attendance', icon: 'ti ti-calendar-check', label: 'Attendance', route: 'studentAttendance' },
  { id: 'fees', icon: 'ti ti-report-money', label: 'Fees', route: 'studentFees' },
  { id: 'results', icon: 'ti ti-file-certificate', label: 'Exam Results', route: 'studentResult' },
  { id: 'timetable', icon: 'ti ti-table', label: 'Time Table', route: 'studentTimeTable' },
  { id: 'leaves', icon: 'ti ti-calendar-off', label: 'Leaves', route: 'studentLeaves' },
  { id: 'library', icon: 'ti ti-books', label: 'Library', route: 'studentLibrary' },
  { id: 'documents', icon: 'ti ti-files', label: 'Documents', route: 'studentDocuments' },
  { id: 'wallet', icon: 'ti ti-wallet', label: 'Wallet', route: 'studentWallet' },
] as const;

/* ------------------------------- Downloads --------------------------------- */

export const PROFILE_TEXT = [
  'PRESKOOL ACADEMY — STUDENT PROFILE',
  '====================================',
  'Name: Janet Daniel',
  'Admission No: AD1256589',
  'Roll No: 35013',
  'Class: III - A   Academic Year: 2024/2025',
  'DOB: 25 Jan 2008   Blood Group: O +ve',
  'Attendance: 96%   GPA: 8.8/10   Rank: 3',
  'Guardian: Robert Daniel (+1 809 095 5468)',
  'Generated from the Student 360 Profile.',
].join('\n');

export const CERTIFICATE_TEXT =
  'PRESKOOL ACADEMY\nCertificate of Achievement\nAwarded to Janet Daniel (AD1256589).\n';

export const REPORT_CARD_TEXT = `PRESKOOL ACADEMY
Progress Report Card — 2024-26 · Term II
Student: Janet Daniel (AD1256589) · Class III-A

Overall Score: 89%  |  Grade: A  |  Class Rank: 3 of 42

Mathematics  94%  A+
Science      91%  A
Geography    85%  B+
English      68%  C

Result: PASS (Distinction)
`;
