export type VisitStatus = 'Inside' | 'Checked Out' | 'Pending Approval' | 'Pass Expired' | 'Blocked';

export type VisitorType =
  | 'Parent / Guardian' | 'Local Guardian' | 'Relative' | 'Family Friend'
  | 'Doctor / Medical' | 'Official / Vendor' | 'Alumni';

export interface Pair {
  label: string;
  value: string;
}

export interface Entry {
  title: string;
  meta: string;
}

export interface Visitor {
  id: string;
  visitor: string;
  visitorAvatar: string;
  visitorType: VisitorType;
  /** "Mother", "Family Doctor" — the badge under the relationship column. */
  relationship: string;
  student: string;
  studentAvatar: string;
  /** "II B · A-104" — class and room in one line. */
  studentLine: string;
  /** Short hostel name as the badge prints it. */
  hostel: string;
  /** "31 Jul, 10:15 AM", or '' when the visit has not started. */
  checkIn: string;
  checkOut: string;
  /** "Driving Licence", or '' when none was produced. */
  idProof: string;
  /** "DL-44••••71" — the masked number under the proof badge. */
  idNumber: string;
  status: VisitStatus;
  /** '' for a pending request, which the grid prints as "Awaiting". */
  verifiedBy: string;
  verifierAvatar: string;

  visitorPairs: Pair[];
  studentPairs: Pair[];
  contactPairs: Pair[];
  durationPairs: Pair[];
  identity: Entry[];
  history: Entry[];
  purpose: string;
  remarks: string;
  /** The pass number the print dialog carries, e.g. "VP-0412". */
  pass: string;
}

export const statusPill: Record<VisitStatus, string> = {
  Inside: 'is-active',
  'Checked Out': 'is-completed',
  'Pending Approval': 'is-pending',
  'Pass Expired': 'is-review',
  Blocked: 'is-blocked',
};

/** The View dialog and the panel print the status as a soft badge instead. */
export const statusBadge: Record<VisitStatus, string> = {
  Inside: 'badge badge-soft-success',
  'Checked Out': 'badge badge-soft-secondary',
  'Pending Approval': 'badge badge-soft-warning',
  'Pass Expired': 'badge badge-soft-info',
  Blocked: 'badge badge-soft-danger',
};

export const hostelTint: Record<string, string> = {
  Nightingale: 'purple',
  Everest: 'primary',
};

export const hostelGender: Record<string, string> = {
  Nightingale: 'Girls Hostel',
  Everest: 'Boys Hostel',
};

/* ------------------------------ Filter options ------------------------------ */

export const hostelOptions = ['Nightingale Hostel · Girls', 'Everest Hostel · Boys'];

export const visitorTypeOptions: VisitorType[] = [
  'Parent / Guardian', 'Local Guardian', 'Relative', 'Family Friend',
  'Doctor / Medical', 'Official / Vendor', 'Alumni',
];

export const statusOptions: VisitStatus[] = [
  'Inside', 'Checked Out', 'Pending Approval', 'Pass Expired', 'Blocked',
];

export const dateRangeOptions = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Custom range'];

export const idProofOptions = [
  'National ID', 'Driving Licence', 'Passport', 'Medical Council ID', 'Not produced',
];

export const verifiedByOptions = [
  'Mrs. Alice Ray', 'Mr. David Kim', 'Ms. Priya Raman', 'Mr. Samuel Ortiz',
  'Mr. Ethan Brooks', 'Not verified',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const relationshipOptions = [
  'Mother', 'Father', 'Guardian', 'Sibling', 'Family Doctor', 'Family Friend', 'Other',
];

export const studentChoices = [
  'Lisa Gourley · AD9892431 · A-104',
  'Julie Scott · AD9892429 · B-208',
  'Richard Soley · AD9892427 · C-012',
  'Joann Michael · AD9892433 · B-118',
  'Janet Daniel · AD9892434 · C-115',
];

export const meetingPointOptions = [
  'Visitor Lounge', "Warden's Office", 'Residential Block · escorted', 'Main Gate',
];

export const idProofTypeOptions = [
  'National ID', 'Driving Licence', 'Passport', 'Medical Council ID', 'Employee ID',
];

export const passValidOptions = ['2 hours', '1 hour', '45 minutes', '30 minutes', 'Full day'];

export const wardenChoices = [
  'Mrs. Alice Ray · Chief Warden',
  'Mr. David Kim · Warden',
  'Ms. Priya Raman · Assistant Warden',
  'Mr. Samuel Ortiz · Assistant Warden',
];

export const passReturnedOptions = ['Yes · surrendered at the gate', 'No · not returned', 'Lost'];

export const checkedOutByOptions = [
  'Mrs. Alice Ray · Chief Warden', 'Ms. Priya Raman · Assistant Warden', 'Security Gate',
];

export const decisionOptions = ['Approve visit', 'Approve with escort', 'Reject visit', 'Add to watchlist'];

export const accessLevelOptions = ['Visitor Lounge only', "Warden's Office", 'Residential Block · escorted'];

export const passFormatOptions = ['Badge · 100 x 70 mm', 'A5 · PDF', 'Thermal · 80 mm'];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const hostelTintOf = (row: Visitor): string => hostelTint[row.hostel] ?? 'secondary';

/** Mother and Father read primary, a doctor info, everyone else secondary. */
export const relationshipTint = (relationship: string): string => {
  if (/mother|father|guardian/i.test(relationship)) return 'primary';
  if (/doctor/i.test(relationship)) return 'info';
  return 'secondary';
};

/** The grid prints "Awaiting" where a pending request has no verifier yet. */
export const verifierLabel = (row: Visitor): string => row.verifiedBy || 'Awaiting';

export const idProofBandOf = (row: Visitor): string => row.idProof || 'Not produced';

export const verifiedBandOf = (row: Visitor): string => row.verifiedBy || 'Not verified';

/** "VIS-2026-0412 · Parent / Guardian · Nightingale", the dialog sub-line. */
export const summaryOf = (row: Visitor): string =>
  `${row.id}  •  ${row.visitorType}  •  ${row.hostel} Hostel`;

export const studentSummaryOf = (row: Visitor): string => `${row.student} · ${row.studentLine}`;

/** A visit is open while the visitor is inside or the pass has run out. */
export const isOpen = (row: Visitor): boolean =>
  row.status === 'Inside' || row.status === 'Pass Expired';

/**
 * Minutes on site, read out of the duration section the panel prints — the
 * template writes it as "1h 40m", "55m" or "12 minutes · gate only".
 */
export const durationMinutesOf = (row: Visitor): number => {
  const line = row.durationPairs.find((pair) =>
    /elapsed|duration|premises/i.test(pair.label))?.value ?? '';
  const hours = /(\d+)\s*h/i.exec(line);
  const minutes = /(\d+)\s*(?:m|minutes)/i.exec(line);
  return (hours ? Number(hours[1]) * 60 : 0) + (minutes ? Number(minutes[1]) : 0);
};

/** The Date Range filter's three fixed windows, read off the check-in date. */
export const dateBandOf = (row: Visitor): string => {
  const day = /^(\d+)\s+([A-Za-z]{3})/.exec(row.checkIn || '');
  if (!day) return 'Today';
  const date = Number(day[1]);
  if (date === 31) return 'Today';
  if (date === 30) return 'Yesterday';
  if (date >= 24) return 'Last 7 days';
  return 'Last 30 days';
};

export const searchIndexOf = (row: Visitor): string =>
  [
    row.id, row.visitor, row.visitorType, row.relationship, row.student, row.studentLine,
    row.hostel, row.checkIn, row.checkOut, row.idProof, row.idNumber, row.status,
    verifierLabel(row),
  ]
    .join(' ')
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Sortable key for the template's "31 Jul, 10:15 AM"; a visit with no check-in
 * yet sorts to the end whichever way the column runs.
 */
export const timeKey = (value: string): number => {
  const match = /^(\d+)\s+([A-Za-z]{3}),\s*(\d+):(\d+)\s*(AM|PM)$/i.exec(value.trim());
  if (!match) return -1;
  const month = months.indexOf(match[2]);
  let hour = Number(match[3]) % 12;
  if (match[5].toUpperCase() === 'PM') hour += 12;
  return (month + 1) * 1000000 + Number(match[1]) * 10000 + hour * 100 + Number(match[4]);
};

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole gate register for the day — 24 visitors against the
 * eight rows this page lists — so the template's figures stand and the roster
 * moves them.
 */
export const SUMMARY_TOTALS = {
  today: 24,
  date: '31 Jul 2026',
  inside: 6,
  expired: 1,
  checkedOut: 16,
  averageStay: '1h 12m',
  pending: 2,
  blocked: 3,
};

/* ---------------------------------- Rows ------------------------------------ */

export const visitors: Visitor[] = [
  {
    id: 'VIS-2026-0412', visitor: 'Janet Gourley', visitorAvatar: 'assets/img/profiles/avatar-14.jpg',
    visitorType: 'Parent / Guardian', relationship: 'Mother',
    student: 'Lisa Gourley', studentAvatar: 'assets/img/students/student-04.jpg',
    studentLine: 'II B · A-104', hostel: 'Nightingale',
    checkIn: '31 Jul, 10:15 AM', checkOut: '',
    idProof: 'Driving Licence', idNumber: 'DL-44••••71', status: 'Inside',
    verifiedBy: 'Mrs. Alice Ray', verifierAvatar: 'assets/img/teachers/teacher-01.jpg',
    visitorPairs: [
      { label: 'Visitor Type', value: 'Parent / Guardian' },
      { label: 'Mobile', value: '+1 546 8548 894' },
      { label: 'Email', value: 'janet.g@example.com' },
      { label: 'Vehicle', value: 'Car · KA-05-MJ-4471' },
      { label: 'Visits This Term', value: '4' },
    ],
    studentPairs: [
      { label: 'Student', value: 'Lisa Gourley' },
      { label: 'Admission No', value: 'AD9892431' },
      { label: 'Class & Section', value: 'II B' },
      { label: 'Room · Bed', value: 'A-104 · B2' },
      { label: 'Allocation', value: 'ALC-2026-0118' },
    ],
    contactPairs: [
      { label: 'Primary Mobile', value: '+1 546 8548 894' },
      { label: 'Alternate', value: '+1 546 8548 889' },
      { label: 'Address', value: 'Hillside, Block 4' },
      { label: 'Relationship Proof', value: 'On file · verified' },
    ],
    durationPairs: [
      { label: 'Checked In', value: '31 Jul 2026, 10:15 AM' },
      { label: 'Pass Valid To', value: '31 Jul 2026, 12:15 PM' },
      { label: 'Time Elapsed', value: '1h 40m' },
      { label: 'Meeting Point', value: 'Visitor Lounge · Block A' },
    ],
    identity: [
      { title: 'Driving Licence', meta: 'DL-44••••71 · scanned at gate' },
      { title: 'Photo Captured', meta: 'Yes · 31 Jul 2026, 10:14 AM' },
    ],
    history: [
      { title: 'Checked in at the main gate', meta: '31 Jul 2026, 10:15 AM · Mrs. Alice Ray' },
      { title: 'Previous visit checked out', meta: '18 Jul 2026, 04:20 PM · Ms. Priya Raman' },
    ],
    purpose: 'Routine parental visit. Bringing prescribed medication and collecting laundry for the weekend.',
    remarks: 'Regular visitor with a clean record. Medication handed to the hostel nurse as per policy.',
    pass: 'VP-0412',
  },
  {
    id: 'VIS-2026-0413', visitor: 'Andrew Scott', visitorAvatar: 'assets/img/profiles/avatar-07.jpg',
    visitorType: 'Parent / Guardian', relationship: 'Father',
    student: 'Julie Scott', studentAvatar: 'assets/img/students/student-06.jpg',
    studentLine: 'VI A · B-208', hostel: 'Nightingale',
    checkIn: '31 Jul, 11:02 AM', checkOut: '31 Jul, 12:40 PM',
    idProof: 'Passport', idNumber: 'P-88••••23', status: 'Checked Out',
    verifiedBy: 'Mrs. Alice Ray', verifierAvatar: 'assets/img/teachers/teacher-01.jpg',
    visitorPairs: [
      { label: 'Visitor Type', value: 'Parent / Guardian' },
      { label: 'Mobile', value: '+1 546 8548 896' },
      { label: 'Email', value: 'andrew.s@example.com' },
      { label: 'Vehicle', value: 'Car · KA-01-AS-8823' },
      { label: 'Visits This Term', value: '2' },
    ],
    studentPairs: [
      { label: 'Student', value: 'Julie Scott' },
      { label: 'Admission No', value: 'AD9892429' },
      { label: 'Class & Section', value: 'VI A' },
      { label: 'Room · Bed', value: 'B-208 · B1' },
      { label: 'Allocation', value: 'ALC-2026-0121' },
    ],
    contactPairs: [
      { label: 'Primary Mobile', value: '+1 546 8548 896' },
      { label: 'Alternate', value: '+1 546 8548 885' },
      { label: 'Address', value: 'Market Town, Lane 12' },
      { label: 'Relationship Proof', value: 'On file · verified' },
    ],
    durationPairs: [
      { label: 'Checked In', value: '31 Jul 2026, 11:02 AM' },
      { label: 'Checked Out', value: '31 Jul 2026, 12:40 PM' },
      { label: 'Total Duration', value: '1h 38m' },
      { label: 'Meeting Point', value: 'Visitor Lounge · Block B' },
    ],
    identity: [
      { title: 'Passport', meta: 'P-88••••23 · scanned at gate' },
      { title: 'Photo Captured', meta: 'Yes · 31 Jul 2026, 11:01 AM' },
    ],
    history: [
      { title: 'Checked out at the main gate', meta: '31 Jul 2026, 12:40 PM · Mrs. Alice Ray' },
      { title: 'Checked in at the main gate', meta: '31 Jul 2026, 11:02 AM · Mrs. Alice Ray' },
    ],
    purpose: 'Term II fee discussion with the accounts office, followed by a short meeting with the student.',
    remarks: 'Visit completed within the pass window. Pass VP-0413 surrendered at the gate.',
    pass: 'VP-0413',
  },
  {
    id: 'VIS-2026-0414', visitor: 'Helen Soley', visitorAvatar: 'assets/img/profiles/avatar-11.jpg',
    visitorType: 'Parent / Guardian', relationship: 'Mother',
    student: 'Richard Soley', studentAvatar: 'assets/img/students/student-08.jpg',
    studentLine: 'V B · C-012', hostel: 'Everest',
    checkIn: '31 Jul, 09:30 AM', checkOut: '31 Jul, 10:55 AM',
    idProof: 'National ID', idNumber: 'N-22••••14', status: 'Checked Out',
    verifiedBy: 'Mr. David Kim', verifierAvatar: 'assets/img/teachers/teacher-04.jpg',
    visitorPairs: [
      { label: 'Visitor Type', value: 'Parent / Guardian' },
      { label: 'Mobile', value: '+1 546 8548 898' },
      { label: 'Email', value: 'helen.s@example.com' },
      { label: 'Vehicle', value: 'None · arrived on foot' },
      { label: 'Visits This Term', value: '3' },
    ],
    studentPairs: [
      { label: 'Student', value: 'Richard Soley' },
      { label: 'Admission No', value: 'AD9892427' },
      { label: 'Class & Section', value: 'V B' },
      { label: 'Room · Bed', value: 'C-012 · B3' },
      { label: 'Allocation', value: 'ALC-2026-0125' },
    ],
    contactPairs: [
      { label: 'Primary Mobile', value: '+1 546 8548 898' },
      { label: 'Alternate', value: '+1 546 8548 881' },
      { label: 'Address', value: 'Fern Hill, House 22' },
      { label: 'Relationship Proof', value: 'On file · verified' },
    ],
    durationPairs: [
      { label: 'Checked In', value: '31 Jul 2026, 09:30 AM' },
      { label: 'Checked Out', value: '31 Jul 2026, 10:55 AM' },
      { label: 'Total Duration', value: '1h 25m' },
      { label: 'Meeting Point', value: "Warden's Office · Block C" },
    ],
    identity: [
      { title: 'National ID', meta: 'N-22••••14 · scanned at gate' },
      { title: 'Photo Captured', meta: 'Yes · 31 Jul 2026, 09:29 AM' },
    ],
    history: [
      { title: 'Checked out at the main gate', meta: '31 Jul 2026, 10:55 AM · Mr. David Kim' },
      { title: 'Checked in at the main gate', meta: '31 Jul 2026, 09:30 AM · Mr. David Kim' },
    ],
    purpose: 'Meeting with the warden and accounts regarding the outstanding hostel fee and the fee hold.',
    remarks: 'Discussed the $1,800 outstanding against INV-2026-0474. Payment plan to be confirmed by 05 Aug.',
    pass: 'VP-0414',
  },
  {
    id: 'VIS-2026-0415', visitor: 'Peter Michael', visitorAvatar: 'assets/img/profiles/avatar-03.jpg',
    visitorType: 'Parent / Guardian', relationship: 'Father',
    student: 'Joann Michael', studentAvatar: 'assets/img/students/student-02.jpg',
    studentLine: 'IV B · B-118', hostel: 'Everest',
    checkIn: '31 Jul, 02:20 PM', checkOut: '',
    idProof: 'Driving Licence', idNumber: 'DL-11••••80', status: 'Inside',
    verifiedBy: 'Mr. David Kim', verifierAvatar: 'assets/img/teachers/teacher-04.jpg',
    visitorPairs: [
      { label: 'Visitor Type', value: 'Parent / Guardian' },
      { label: 'Mobile', value: '+1 546 8548 892' },
      { label: 'Email', value: 'peter.m@example.com' },
      { label: 'Vehicle', value: 'Car · KA-09-PM-1180' },
      { label: 'Visits This Term', value: '5' },
    ],
    studentPairs: [
      { label: 'Student', value: 'Joann Michael' },
      { label: 'Admission No', value: 'AD9892433' },
      { label: 'Class & Section', value: 'IV B' },
      { label: 'Room · Bed', value: 'B-118 · B4' },
      { label: 'Allocation', value: 'ALC-2026-0134' },
    ],
    contactPairs: [
      { label: 'Primary Mobile', value: '+1 546 8548 892' },
      { label: 'Alternate', value: '+1 546 8548 883' },
      { label: 'Address', value: 'Lakeview, Apartment 7C' },
      { label: 'Relationship Proof', value: 'On file · verified' },
    ],
    durationPairs: [
      { label: 'Checked In', value: '31 Jul 2026, 02:20 PM' },
      { label: 'Pass Valid To', value: '31 Jul 2026, 04:20 PM' },
      { label: 'Time Elapsed', value: '55m' },
      { label: 'Meeting Point', value: 'Block A · escorted' },
    ],
    identity: [
      { title: 'Driving Licence', meta: 'DL-11••••80 · scanned at gate' },
      { title: 'Photo Captured', meta: 'Yes · 31 Jul 2026, 02:19 PM' },
    ],
    history: [
      { title: 'Escorted to Block A by the warden', meta: '31 Jul 2026, 02:35 PM · Mr. David Kim' },
      { title: 'Checked in at the main gate', meta: '31 Jul 2026, 02:20 PM · Mr. David Kim' },
    ],
    purpose: 'Following up on the Block A transfer request and inspecting the proposed room A-207.',
    remarks: 'Escorted visit to a residential block. Warden accompaniment required outside the visitor lounge.',
    pass: 'VP-0415',
  },
  {
    id: 'VIS-2026-0416', visitor: 'Dr. Neil Fraser', visitorAvatar: 'assets/img/profiles/avatar-05.jpg',
    visitorType: 'Doctor / Medical', relationship: 'Family Doctor',
    student: 'Janet Daniel', studentAvatar: 'assets/img/students/student-01.jpg',
    studentLine: 'III A · C-115', hostel: 'Nightingale',
    checkIn: '31 Jul, 03:05 PM', checkOut: '',
    idProof: 'Medical Council ID', idNumber: 'MC-90••••42', status: 'Pass Expired',
    verifiedBy: 'Mrs. Alice Ray', verifierAvatar: 'assets/img/teachers/teacher-01.jpg',
    visitorPairs: [
      { label: 'Visitor Type', value: 'Doctor / Medical' },
      { label: 'Mobile', value: '+1 546 8548 921' },
      { label: 'Email', value: 'n.fraser@clinic.example.com' },
      { label: 'Organisation', value: 'Green Park Family Clinic' },
      { label: 'Visits This Term', value: '1' },
    ],
    studentPairs: [
      { label: 'Student', value: 'Janet Daniel' },
      { label: 'Admission No', value: 'AD9892434' },
      { label: 'Class & Section', value: 'III A' },
      { label: 'Room · Bed', value: 'C-115 · B1' },
      { label: 'Allocation', value: 'ALC-2026-0112' },
    ],
    contactPairs: [
      { label: 'Primary Mobile', value: '+1 546 8548 921' },
      { label: 'Clinic Landline', value: '+1 546 8548 922' },
      { label: 'Address', value: 'Green Park Family Clinic' },
      { label: 'Relationship Proof', value: 'Guardian authorisation on file' },
    ],
    durationPairs: [
      { label: 'Checked In', value: '31 Jul 2026, 03:05 PM' },
      { label: 'Pass Valid To', value: '31 Jul 2026, 04:00 PM' },
      { label: 'Time Elapsed', value: '2h 05m' },
      { label: 'Overstay', value: '1h 05m past expiry' },
    ],
    identity: [
      { title: 'Medical Council ID', meta: 'MC-90••••42 · scanned at gate' },
      { title: 'Photo Captured', meta: 'Yes · 31 Jul 2026, 03:04 PM' },
    ],
    history: [
      { title: 'Pass expiry alert raised', meta: '31 Jul 2026, 04:00 PM · System' },
      { title: 'Checked in at the main gate', meta: '31 Jul 2026, 03:05 PM · Mrs. Alice Ray' },
    ],
    purpose: 'Scheduled medical review supporting the single-room approval. Attended by the school nurse.',
    remarks: 'Pass expired at 04:00 PM and the visitor has not checked out. Warden notified to close the visit.',
    pass: 'VP-0416',
  },
  {
    id: 'VIS-2026-0417', visitor: 'Claudia Ralph', visitorAvatar: 'assets/img/profiles/avatar-09.jpg',
    visitorType: 'Parent / Guardian', relationship: 'Mother',
    student: 'Ralph Claudia', studentAvatar: 'assets/img/students/student-05.jpg',
    studentLine: 'V A · A-214', hostel: 'Everest',
    checkIn: '', checkOut: '',
    idProof: 'National ID', idNumber: 'N-31••••07', status: 'Pending Approval',
    verifiedBy: '', verifierAvatar: '',
    visitorPairs: [
      { label: 'Visitor Type', value: 'Parent / Guardian' },
      { label: 'Mobile', value: '+1 546 8548 895' },
      { label: 'Email', value: 'claudia.r@example.com' },
      { label: 'Vehicle', value: 'Car · KA-02-CR-3107' },
      { label: 'Visits This Term', value: '0' },
    ],
    studentPairs: [
      { label: 'Student', value: 'Ralph Claudia' },
      { label: 'Admission No', value: 'AD9892430' },
      { label: 'Class & Section', value: 'V A' },
      { label: 'Room · Bed', value: 'A-214 · held' },
      { label: 'Allocation', value: 'ALC-2026-0131 · pending' },
    ],
    contactPairs: [
      { label: 'Primary Mobile', value: '+1 546 8548 895' },
      { label: 'Alternate', value: '+1 546 8548 887' },
      { label: 'Address', value: 'Central Square, Flat 9' },
      { label: 'Relationship Proof', value: 'Submitted · under review' },
    ],
    durationPairs: [
      { label: 'Requested Slot', value: '01 Aug 2026, 11:00 AM' },
      { label: 'Requested Duration', value: '45 minutes' },
      { label: 'Approver', value: 'Mr. Samuel Ortiz' },
      { label: 'Status', value: 'Awaiting warden approval' },
    ],
    identity: [
      { title: 'National ID', meta: 'N-31••••07 · awaiting gate scan' },
      { title: 'Photo Captured', meta: 'Not yet captured' },
    ],
    history: [
      { title: 'Visit request submitted', meta: '30 Jul 2026, 06:12 PM · Parent portal' },
    ],
    purpose: 'First visit since the hostel application. Wishes to view the reserved room before approval.',
    remarks: 'Allocation is still pending approval, so access is limited to the visitor lounge if approved.',
    pass: 'VP-0417',
  },
  {
    id: 'VIS-2026-0418', visitor: 'Robert Dison', visitorAvatar: 'assets/img/profiles/avatar-02.jpg',
    visitorType: 'Parent / Guardian', relationship: 'Father',
    student: 'Kathleen Dison', studentAvatar: 'assets/img/students/student-03.jpg',
    studentLine: 'III A · not assigned', hostel: 'Nightingale',
    checkIn: '', checkOut: '',
    idProof: 'National ID', idNumber: 'N-55••••67', status: 'Pending Approval',
    verifiedBy: '', verifierAvatar: '',
    visitorPairs: [
      { label: 'Visitor Type', value: 'Parent / Guardian' },
      { label: 'Mobile', value: '+1 546 8548 893' },
      { label: 'Email', value: 'robert.d@example.com' },
      { label: 'Vehicle', value: 'None · arriving by taxi' },
      { label: 'Visits This Term', value: '1' },
    ],
    studentPairs: [
      { label: 'Student', value: 'Kathleen Dison' },
      { label: 'Admission No', value: 'AD9892432' },
      { label: 'Class & Section', value: 'III A' },
      { label: 'Room · Bed', value: 'Not assigned' },
      { label: 'Allocation', value: 'ALC-2026-0136 · waiting list' },
    ],
    contactPairs: [
      { label: 'Primary Mobile', value: '+1 546 8548 893' },
      { label: 'Alternate', value: '+1 546 8548 884' },
      { label: 'Address', value: 'Riverside, House 3' },
      { label: 'Relationship Proof', value: 'On file · verified' },
    ],
    durationPairs: [
      { label: 'Requested Slot', value: '01 Aug 2026, 09:30 AM' },
      { label: 'Requested Duration', value: '30 minutes' },
      { label: 'Approver', value: 'Mrs. Alice Ray' },
      { label: 'Status', value: 'Awaiting warden approval' },
    ],
    identity: [
      { title: 'National ID', meta: 'N-55••••67 · awaiting gate scan' },
      { title: 'Photo Captured', meta: 'Not yet captured' },
    ],
    history: [
      { title: 'Visit request submitted', meta: '31 Jul 2026, 08:45 AM · Parent portal' },
    ],
    purpose: 'Meeting the warden about the waiting list position and the need-based concession request.',
    remarks: 'Warden meeting only. Student is on the waiting list and has no room to visit yet.',
    pass: 'VP-0418',
  },
  {
    id: 'VIS-2026-0405', visitor: 'Marcus Reed', visitorAvatar: 'assets/img/profiles/avatar-16.jpg',
    visitorType: 'Family Friend', relationship: 'Family Friend',
    student: 'Joann Michael', studentAvatar: 'assets/img/students/student-02.jpg',
    studentLine: 'IV B · B-118', hostel: 'Everest',
    checkIn: '26 Jul, 07:40 PM', checkOut: '26 Jul, 07:52 PM',
    idProof: '', idNumber: '', status: 'Blocked',
    verifiedBy: 'Mr. Ethan Brooks', verifierAvatar: 'assets/img/teachers/teacher-05.jpg',
    visitorPairs: [
      { label: 'Visitor Type', value: 'Family Friend' },
      { label: 'Mobile', value: '+1 546 8548 933' },
      { label: 'Email', value: 'Not provided' },
      { label: 'Vehicle', value: 'Motorcycle · unregistered' },
      { label: 'Visits This Term', value: '1' },
    ],
    studentPairs: [
      { label: 'Student', value: 'Joann Michael' },
      { label: 'Admission No', value: 'AD9892433' },
      { label: 'Class & Section', value: 'IV B' },
      { label: 'Room · Bed', value: 'B-118 · B4' },
      { label: 'Allocation', value: 'ALC-2026-0134' },
    ],
    contactPairs: [
      { label: 'Primary Mobile', value: '+1 546 8548 933' },
      { label: 'Alternate', value: 'Not provided' },
      { label: 'Address', value: 'Not provided' },
      { label: 'Relationship Proof', value: 'Not submitted' },
    ],
    durationPairs: [
      { label: 'Arrived', value: '26 Jul 2026, 07:40 PM' },
      { label: 'Turned Away', value: '26 Jul 2026, 07:52 PM' },
      { label: 'On Premises', value: '12 minutes · gate only' },
      { label: 'Access Granted', value: 'None' },
    ],
    identity: [
      { title: 'ID Proof', meta: 'Not produced at the gate' },
      { title: 'Photo Captured', meta: 'Yes · 26 Jul 2026, 07:41 PM' },
    ],
    history: [
      { title: 'Added to the security watchlist', meta: '26 Jul 2026, 08:10 PM · Mr. David Kim' },
      { title: 'Entry refused at the main gate', meta: '26 Jul 2026, 07:52 PM · Mr. Ethan Brooks' },
    ],
    purpose: 'Arrived after visiting hours without prior guardian authorisation. Entry refused at the gate.',
    remarks: 'Blocked pending written guardian authorisation from Mr. Peter Michael. Escalated to the Hostel Director.',
    pass: 'VP-0405',
  },
];
