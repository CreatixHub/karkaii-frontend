export type WardenStatus = 'Active' | 'Probation' | 'On Leave' | 'Pending Assignment' | 'Retired';

export type Shift = 'Day Shift' | 'Night Shift' | 'Rotational';

export type Designation = 'Chief Warden' | 'Warden' | 'Assistant Warden' | 'Junior Warden';

export interface Pair {
  label: string;
  value: string;
}

export interface DocumentEntry {
  name: string;
  meta: string;
}

export interface Warden {
  id: string;
  name: string;
  avatar: string;
  designation: Designation;
  employeeId: string;
  /** Short hostel name as the badge prints it, or '' when unassigned. */
  hostel: string;
  block: string;
  /** "All floors", "1st & 2nd floor" — the sub-line under the block. */
  floors: string;
  shift: Shift;
  contact: string;
  /** Years of service, printed as "7 years". */
  experience: number;
  status: WardenStatus;

  gender: 'Female' | 'Male';
  dob: string;
  joined: string;
  email: string;
  /** "On campus · Warden Quarters 1". */
  residence: string;

  /** The panel's varying sections, verbatim. */
  hostelPairs: Pair[];
  blockPairs: Pair[];
  dutyPairs: Pair[];
  emergencyPairs: Pair[];

  qualification: string;
  documents: DocumentEntry[];
  notes: string;
}

export const statusPill: Record<WardenStatus, string> = {
  Active: 'is-active',
  Probation: 'is-review',
  'On Leave': 'is-suspended',
  'Pending Assignment': 'is-pending',
  Retired: 'is-inactive',
};

/** The View dialog and the panel print the status as a soft badge instead. */
export const statusBadge: Record<WardenStatus, string> = {
  Active: 'badge badge-soft-success',
  Probation: 'badge badge-soft-info',
  'On Leave': 'badge badge-soft-warning',
  'Pending Assignment': 'badge badge-soft-secondary',
  Retired: 'badge badge-soft-dark',
};

export const shiftTint: Record<Shift, string> = {
  'Day Shift': 'warning',
  'Night Shift': 'info',
  Rotational: 'secondary',
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

export const hostelOptions = ['Nightingale Hostel · Girls', 'Everest Hostel · Boys', 'Not assigned'];

export const blockFloorOptions = [
  'Block A · Ground', 'Block A · 1st Floor', 'Block A · 2nd Floor',
  'Block B · 1st Floor', 'Block B · 2nd Floor',
  'Block C · Ground', 'Block C · 1st Floor', 'Block C · 2nd Floor',
];

export const genderOptions: Warden['gender'][] = ['Female', 'Male'];

export const shiftOptions = [
  'Day Shift · 06:00 – 18:00', 'Night Shift · 18:00 – 06:00', 'Rotational',
];

export const statusOptions: WardenStatus[] = [
  'Active', 'Probation', 'On Leave', 'Pending Assignment', 'Retired',
];

export const designationOptions: Designation[] = [
  'Chief Warden', 'Warden', 'Assistant Warden', 'Junior Warden',
];

export const experienceOptions = ['Under 2 years', '2 – 5 years', '5 – 8 years', 'Over 8 years'];

export const residenceOptions = ['On campus', 'Off campus'];

/* --------------------------- Dialog option lists ----------------------------- */

export const formHostelOptions = [
  'Nightingale Hostel · Girls', 'Everest Hostel · Boys', 'Assign later',
];

export const blockOptions = ['Block A', 'Block B', 'Block C'];

export const relationOptions = ['Spouse', 'Parent', 'Sibling', 'Other'];

export const assignHostelOptions = [
  'Nightingale Hostel · Girls · 48 rooms', 'Everest Hostel · Boys · 48 rooms',
];

export const assignBlockOptions = ['Block C · 1 vacancy', 'Block A', 'Block B'];

export const floorResponsibilityOptions = ['1st floor', 'Ground floor', '2nd floor', 'All floors'];

export const reportsToOptions = [
  'Mrs. Alice Ray · Chief Warden', 'Mr. David Kim · Warden', 'Hostel Director',
];

export const weeklyOffOptions = ['Sunday', 'Saturday', 'Rotating', 'None'];

export const coverWardenOptions = [
  'Ms. Priya Raman · Night Shift', 'Mr. David Kim · Day Shift', 'Mr. Samuel Ortiz · Night Shift',
];

export const documentTypeOptions = [
  'Police Verification', 'Appointment Letter', 'Qualification Proof',
  'First Aid Certificate', 'Handover Report', 'Other',
];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const hostelTintOf = (row: Warden): string => hostelTint[row.hostel] ?? 'secondary';

export const experienceLabel = (row: Warden): string =>
  `${row.experience} ${row.experience === 1 ? 'year' : 'years'}`;

/** "WRD-001 · Chief Warden · 7 years", the line the dialogs print. */
export const wardenLineOf = (row: Warden): string =>
  `${row.id} · ${row.designation} · ${experienceLabel(row)}`;

/** "Nightingale · Block A · All floors", the placement line. */
export const placementOf = (row: Warden): string =>
  row.hostel ? `${row.hostel} · ${row.block} · ${row.floors}` : 'Not assigned';

export const summaryOf = (row: Warden): string =>
  `${row.id}  •  ${row.designation}  •  ${row.employeeId}`;

export const profilePairsOf = (row: Warden): Pair[] => [
  { label: 'Gender', value: row.gender },
  { label: 'Date of Birth', value: row.dob },
  { label: 'Joined On', value: row.joined },
  { label: 'Email', value: row.email },
  { label: 'Residence', value: row.residence },
];

/** The View dialog's shorter Personal & Contact block. */
export const contactPairsOf = (row: Warden): Pair[] => [
  { label: 'Gender', value: row.gender },
  { label: 'Date of Birth', value: row.dob },
  { label: 'Mobile', value: row.contact },
  { label: 'Email', value: row.email },
];

export const employmentPairsOf = (row: Warden): Pair[] => [
  { label: 'Employee ID', value: row.employeeId },
  { label: 'Designation', value: row.designation },
  { label: 'Joined On', value: row.joined },
  { label: 'Experience', value: experienceLabel(row) },
];

export interface AuditEntry {
  title: string;
  meta: string;
}

/**
 * The offcanvas audit trail. The template writes three fixed entries; here they
 * are the profile's own history — created on the joining date, whatever the
 * status implies, and the police verification the document list already records.
 */
export const auditOf = (row: Warden): AuditEntry[] => {
  const entries: AuditEntry[] = [
    { title: 'Warden profile created', meta: `${row.joined} · HR Office` },
  ];

  switch (row.status) {
    case 'Retired':
      entries.push({ title: 'Retired from service', meta: 'Handover completed · Hostel Director' });
      break;
    case 'On Leave':
      entries.push({ title: 'Leave approved', meta: 'HR Office · cover assigned' });
      break;
    case 'Probation':
      entries.push({ title: 'Joined on probation', meta: `${row.joined} · HR Office` });
      break;
    case 'Pending Assignment':
      entries.push({ title: 'Offer accepted', meta: 'HR Office · awaiting clearance' });
      break;
    case 'Active':
    default:
      entries.push({ title: `Serving as ${row.designation}`, meta: `${row.hostel} · Hostel Director` });
      break;
  }

  const verification = row.documents.find((document) => /police/i.test(document.name));
  if (verification) {
    entries.push({ title: 'Police verification on file', meta: `${verification.meta} · HR Office` });
  }
  return entries;
};

/* --------------------------------- Filters ---------------------------------- */

export const experienceBandOf = (row: Warden): string => {
  if (row.experience < 2) return 'Under 2 years';
  if (row.experience <= 5) return '2 – 5 years';
  if (row.experience <= 8) return '5 – 8 years';
  return 'Over 8 years';
};

export const residenceBandOf = (row: Warden): string =>
  row.residence.startsWith('Off campus') ? 'Off campus' : 'On campus';

export const hostelKeyOf = (row: Warden): string =>
  row.hostel ? `${row.hostel} Hostel · ${hostelGender[row.hostel]?.replace(' Hostel', '')}` : 'Not assigned';

export const shiftKeyOf = (row: Warden): string => {
  if (row.shift === 'Day Shift') return 'Day Shift · 06:00 – 18:00';
  if (row.shift === 'Night Shift') return 'Night Shift · 18:00 – 06:00';
  return 'Rotational';
};

/**
 * The Block / Floor filter names one floor of one block; a warden covering "All
 * floors" answers for every floor of theirs, so the match is by block first and
 * then by whether the floor line covers the one named.
 */
export const coversBlockFloor = (row: Warden, value: string): boolean => {
  if (!row.block) return false;
  const [block, floor] = value.split('·').map((part) => part.trim());
  if (row.block !== block) return false;
  if (/all floors/i.test(row.floors)) return true;
  const wanted = floor.replace(' Floor', '').toLowerCase();
  return row.floors.toLowerCase().includes(wanted);
};

export const searchIndexOf = (row: Warden): string =>
  [
    row.id, row.name, row.employeeId, row.designation, row.hostel, row.block, row.floors,
    row.shift, row.contact, experienceLabel(row), row.status, row.email,
  ]
    .join(' ')
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "02 Apr 2019" dates. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole staff — twelve wardens against the eight this page
 * lists, which the template says outright ("8 shown on this page") — so its
 * figures stand and the roster moves them.
 */
export const SUMMARY_TOTALS = {
  wardens: 12,
  shown: 8,
  active: 10,
  hostels: 2,
  rooms: 96,
  day: 5,
  night: 5,
};

/* ---------------------------------- Rows ------------------------------------ */

export const wardens: Warden[] = [
  {
    id: 'WRD-001', name: 'Mrs. Alice Ray', avatar: 'assets/img/teachers/teacher-01.jpg',
    designation: 'Chief Warden', employeeId: 'EMP-2019-014',
    hostel: 'Nightingale', block: 'Block A', floors: 'All floors', shift: 'Day Shift',
    contact: '+1 546 8548 301', experience: 7, status: 'Active',
    gender: 'Female', dob: '14 Mar 1984', joined: '02 Apr 2019', email: 'alice.ray@karkaii.com',
    residence: 'On campus · Warden Quarters 1',
    hostelPairs: [
      { label: 'Hostel', value: 'Nightingale Hostel' },
      { label: 'Type', value: 'Girls' },
      { label: 'Total Rooms', value: '48' },
      { label: 'Students', value: '134' },
      { label: 'Mess', value: 'Vegetarian & regular' },
    ],
    blockPairs: [
      { label: 'Block A', value: 'Ground, 1st and 2nd floor' },
      { label: 'Rooms Covered', value: 'A-001 to A-224' },
      { label: 'Escalation', value: 'Reports to the Hostel Director' },
    ],
    dutyPairs: [
      { label: 'Mon – Fri', value: '06:00 – 18:00' },
      { label: 'Saturday', value: '06:00 – 14:00' },
      { label: 'Sunday', value: 'Off · on call' },
      { label: 'Night Cover', value: 'Ms. Priya Raman' },
    ],
    emergencyPairs: [
      { label: 'Contact', value: 'Mr. Peter Ray' },
      { label: 'Relation', value: 'Spouse' },
      { label: 'Mobile', value: '+1 546 8548 401' },
      { label: 'Alternate', value: '+1 546 8548 402' },
    ],
    qualification:
      'M.A. Education, Springfield University · 2008. Certified in adolescent counselling and hostel administration.',
    documents: [
      { name: 'Appointment Letter.pdf', meta: 'Uploaded 02 Apr 2019 · 240 KB' },
      { name: 'Police Verification.pdf', meta: 'Renewed 12 Jan 2026 · 180 KB' },
      { name: 'First Aid Certificate.pdf', meta: 'Valid to 31 Mar 2027 · 96 KB' },
    ],
    notes: 'Chief warden for the girls wing. Handles medical single-room approvals with the school nurse.',
  },
  {
    id: 'WRD-002', name: 'Mr. David Kim', avatar: 'assets/img/teachers/teacher-04.jpg',
    designation: 'Warden', employeeId: 'EMP-2020-027',
    hostel: 'Everest', block: 'Block C', floors: 'All floors', shift: 'Day Shift',
    contact: '+1 546 8548 302', experience: 6, status: 'Active',
    gender: 'Male', dob: '02 Sep 1986', joined: '17 Jun 2020', email: 'david.kim@karkaii.com',
    residence: 'On campus · Warden Quarters 3',
    hostelPairs: [
      { label: 'Hostel', value: 'Everest Hostel' },
      { label: 'Type', value: 'Boys' },
      { label: 'Total Rooms', value: '48' },
      { label: 'Students', value: '128' },
      { label: 'Mess', value: 'Regular' },
    ],
    blockPairs: [
      { label: 'Block C', value: 'Ground and 1st floor' },
      { label: 'Rooms Covered', value: 'C-001 to C-124' },
      { label: 'Escalation', value: 'Reports to the Hostel Director' },
    ],
    dutyPairs: [
      { label: 'Mon – Fri', value: '06:00 – 18:00' },
      { label: 'Saturday', value: '06:00 – 14:00' },
      { label: 'Sunday', value: 'Off · on call' },
      { label: 'Night Cover', value: 'Mr. Samuel Ortiz' },
    ],
    emergencyPairs: [
      { label: 'Contact', value: 'Mrs. Hana Kim' },
      { label: 'Relation', value: 'Spouse' },
      { label: 'Mobile', value: '+1 546 8548 403' },
      { label: 'Alternate', value: '+1 546 8548 404' },
    ],
    qualification:
      'B.Sc. Physical Education, Northfield College · 2010. Trained in fire safety and emergency evacuation.',
    documents: [
      { name: 'Appointment Letter.pdf', meta: 'Uploaded 17 Jun 2020 · 232 KB' },
      { name: 'Police Verification.pdf', meta: 'Renewed 08 Feb 2026 · 176 KB' },
      { name: 'Fire Safety Certificate.pdf', meta: 'Valid to 30 Sep 2026 · 104 KB' },
    ],
    notes: 'Manages the boys wing fee-hold cases with accounts. Currently holding bed C-012 / B3.',
  },
  {
    id: 'WRD-003', name: 'Ms. Priya Raman', avatar: 'assets/img/teachers/teacher-06.jpg',
    designation: 'Assistant Warden', employeeId: 'EMP-2021-046',
    hostel: 'Nightingale', block: 'Block B', floors: '1st & 2nd floor', shift: 'Night Shift',
    contact: '+1 546 8548 303', experience: 4, status: 'Active',
    gender: 'Female', dob: '25 Nov 1991', joined: '09 Aug 2021', email: 'priya.raman@karkaii.com',
    residence: 'On campus · Warden Quarters 2',
    hostelPairs: [
      { label: 'Hostel', value: 'Nightingale Hostel' },
      { label: 'Type', value: 'Girls' },
      { label: 'Total Rooms', value: '48' },
      { label: 'Students', value: '134' },
      { label: 'Mess', value: 'Vegetarian & regular' },
    ],
    blockPairs: [
      { label: 'Block B', value: '1st and 2nd floor' },
      { label: 'Rooms Covered', value: 'B-101 to B-224' },
      { label: 'Escalation', value: 'Reports to Mrs. Alice Ray' },
    ],
    dutyPairs: [
      { label: 'Mon – Sat', value: '18:00 – 06:00' },
      { label: 'Sunday', value: 'Off' },
      { label: 'Roll Call', value: '21:30 nightly' },
      { label: 'Day Cover', value: 'Mrs. Alice Ray' },
    ],
    emergencyPairs: [
      { label: 'Contact', value: 'Mrs. Latha Raman' },
      { label: 'Relation', value: 'Mother' },
      { label: 'Mobile', value: '+1 546 8548 405' },
      { label: 'Alternate', value: '+1 546 8548 406' },
    ],
    qualification: 'M.Sc. Psychology, Riverside University · 2015. Certified school counsellor.',
    documents: [
      { name: 'Appointment Letter.pdf', meta: 'Uploaded 09 Aug 2021 · 228 KB' },
      { name: 'Police Verification.pdf', meta: 'Renewed 03 Mar 2026 · 182 KB' },
      { name: 'Counselling Licence.pdf', meta: 'Valid to 31 Dec 2027 · 118 KB' },
    ],
    notes: 'Runs the nightly roll call for Block B. Point of contact for after-hours medical escalations.',
  },
  {
    id: 'WRD-004', name: 'Mr. Samuel Ortiz', avatar: 'assets/img/teachers/teacher-07.jpg',
    designation: 'Assistant Warden', employeeId: 'EMP-2018-009',
    hostel: 'Everest', block: 'Block A', floors: 'Ground & 1st floor', shift: 'Night Shift',
    contact: '+1 546 8548 304', experience: 8, status: 'Active',
    gender: 'Male', dob: '18 Jan 1982', joined: '21 May 2018', email: 'samuel.ortiz@karkaii.com',
    residence: 'Off campus · Fern Hill',
    hostelPairs: [
      { label: 'Hostel', value: 'Everest Hostel' },
      { label: 'Type', value: 'Boys' },
      { label: 'Total Rooms', value: '48' },
      { label: 'Students', value: '128' },
      { label: 'Mess', value: 'Regular' },
    ],
    blockPairs: [
      { label: 'Block A', value: 'Ground and 1st floor' },
      { label: 'Rooms Covered', value: 'A-001 to A-124' },
      { label: 'Escalation', value: 'Reports to Mr. David Kim' },
    ],
    dutyPairs: [
      { label: 'Mon – Sat', value: '18:00 – 06:00' },
      { label: 'Sunday', value: 'Off' },
      { label: 'Roll Call', value: '21:30 nightly' },
      { label: 'Day Cover', value: 'Mr. David Kim' },
    ],
    emergencyPairs: [
      { label: 'Contact', value: 'Mrs. Elena Ortiz' },
      { label: 'Relation', value: 'Spouse' },
      { label: 'Mobile', value: '+1 546 8548 407' },
      { label: 'Alternate', value: '+1 546 8548 408' },
    ],
    qualification: 'B.A. Sociology, Old Mill College · 2006. Level 3 first aid responder.',
    documents: [
      { name: 'Appointment Letter.pdf', meta: 'Uploaded 21 May 2018 · 244 KB' },
      { name: 'Police Verification.pdf', meta: 'Renewed 19 Jan 2026 · 174 KB' },
      { name: 'First Aid Certificate.pdf', meta: 'Valid to 30 Jun 2027 · 92 KB' },
    ],
    notes: 'Longest serving warden on the boys wing. Holds the master key register for Block A.',
  },
  {
    id: 'WRD-005', name: 'Mrs. Nora Fielding', avatar: 'assets/img/teachers/teacher-09.jpg',
    designation: 'Assistant Warden', employeeId: 'EMP-2022-058',
    hostel: 'Nightingale', block: 'Block C', floors: '1st floor', shift: 'Day Shift',
    contact: '+1 546 8548 305', experience: 3, status: 'On Leave',
    gender: 'Female', dob: '07 Jul 1993', joined: '14 Mar 2022', email: 'nora.fielding@karkaii.com',
    residence: 'Off campus · Green Park',
    hostelPairs: [
      { label: 'Hostel', value: 'Nightingale Hostel' },
      { label: 'Type', value: 'Girls' },
      { label: 'Total Rooms', value: '48' },
      { label: 'Students', value: '134' },
      { label: 'Mess', value: 'Vegetarian & regular' },
    ],
    blockPairs: [
      { label: 'Block C', value: '1st floor only' },
      { label: 'Rooms Covered', value: 'C-101 to C-124' },
      { label: 'Escalation', value: 'Reports to Mrs. Alice Ray' },
    ],
    dutyPairs: [
      { label: 'Status', value: 'Maternity leave' },
      { label: 'Leave From', value: '01 Jul 2026' },
      { label: 'Expected Return', value: '02 Nov 2026' },
      { label: 'Covering Warden', value: 'Mrs. Alice Ray' },
    ],
    emergencyPairs: [
      { label: 'Contact', value: 'Mr. Owen Fielding' },
      { label: 'Relation', value: 'Spouse' },
      { label: 'Mobile', value: '+1 546 8548 409' },
      { label: 'Alternate', value: '+1 546 8548 410' },
    ],
    qualification: 'B.Ed. Primary Education, Hillside University · 2016.',
    documents: [
      { name: 'Appointment Letter.pdf', meta: 'Uploaded 14 Mar 2022 · 236 KB' },
      { name: 'Police Verification.pdf', meta: 'Renewed 22 Apr 2026 · 178 KB' },
      { name: 'Leave Approval.pdf', meta: 'Approved 18 Jun 2026 · 88 KB' },
    ],
    notes: 'On maternity leave to 02 Nov 2026. Block C duties absorbed by the chief warden meanwhile.',
  },
  {
    id: 'WRD-006', name: 'Mr. Ethan Brooks', avatar: 'assets/img/teachers/teacher-05.jpg',
    designation: 'Junior Warden', employeeId: 'EMP-2023-071',
    hostel: 'Everest', block: 'Block B', floors: '1st floor', shift: 'Night Shift',
    contact: '+1 546 8548 306', experience: 2, status: 'Probation',
    gender: 'Male', dob: '30 Apr 1997', joined: '05 Sep 2023', email: 'ethan.brooks@karkaii.com',
    residence: 'On campus · Warden Quarters 4',
    hostelPairs: [
      { label: 'Hostel', value: 'Everest Hostel' },
      { label: 'Type', value: 'Boys' },
      { label: 'Total Rooms', value: '48' },
      { label: 'Students', value: '128' },
      { label: 'Mess', value: 'Regular' },
    ],
    blockPairs: [
      { label: 'Block B', value: '1st floor only' },
      { label: 'Rooms Covered', value: 'B-101 to B-124' },
      { label: 'Escalation', value: 'Reports to Mr. Samuel Ortiz' },
    ],
    dutyPairs: [
      { label: 'Mon – Sat', value: '18:00 – 06:00' },
      { label: 'Sunday', value: 'Off' },
      { label: 'Roll Call', value: '21:30 nightly' },
      { label: 'Day Cover', value: 'Mr. David Kim' },
    ],
    emergencyPairs: [
      { label: 'Contact', value: 'Mrs. Diane Brooks' },
      { label: 'Relation', value: 'Mother' },
      { label: 'Mobile', value: '+1 546 8548 411' },
      { label: 'Alternate', value: '+1 546 8548 412' },
    ],
    qualification: 'B.Sc. Sports Science, Lakeview College · 2020. Hostel administration training in progress.',
    documents: [
      { name: 'Appointment Letter.pdf', meta: 'Uploaded 05 Sep 2023 · 230 KB' },
      { name: 'Police Verification.pdf', meta: 'Renewed 11 May 2026 · 172 KB' },
      { name: 'Probation Review.pdf', meta: 'Due 05 Sep 2026 · 74 KB' },
    ],
    notes: 'Probation review due 05 Sep 2026. Supervised by Mr. Samuel Ortiz on the night shift.',
  },
  {
    id: 'WRD-007', name: 'Ms. Carla Mendes', avatar: 'assets/img/teachers/teacher-10.jpg',
    designation: 'Assistant Warden', employeeId: 'EMP-2024-088',
    hostel: '', block: '', floors: '', shift: 'Day Shift',
    contact: '+1 546 8548 307', experience: 1, status: 'Pending Assignment',
    gender: 'Female', dob: '11 Feb 1998', joined: '01 Jul 2026', email: 'carla.mendes@karkaii.com',
    residence: 'Off campus · Market Town',
    hostelPairs: [
      { label: 'Preferred Hostel', value: 'Nightingale Hostel' },
      { label: 'Type', value: 'Girls' },
      { label: 'Vacancy', value: 'Block C · 1st floor' },
      { label: 'Available From', value: '05 Aug 2026' },
      { label: 'Interview', value: 'Cleared 24 Jun 2026' },
    ],
    blockPairs: [
      { label: 'Block', value: 'Not assigned yet' },
      { label: 'Rooms Covered', value: 'To be confirmed' },
      { label: 'Escalation', value: 'Reports to the Hostel Director' },
    ],
    dutyPairs: [
      { label: 'Proposed Shift', value: 'Day · 06:00 – 18:00' },
      { label: 'Start Date', value: '05 Aug 2026' },
      { label: 'Induction', value: '01 – 04 Aug 2026' },
      { label: 'Shadowing', value: 'Mrs. Alice Ray' },
    ],
    emergencyPairs: [
      { label: 'Contact', value: 'Mr. Luis Mendes' },
      { label: 'Relation', value: 'Father' },
      { label: 'Mobile', value: '+1 546 8548 413' },
      { label: 'Alternate', value: '+1 546 8548 414' },
    ],
    qualification: 'M.A. Social Work, Riverside University · 2022. One year residential care experience.',
    documents: [
      { name: 'Offer Letter.pdf', meta: 'Uploaded 26 Jun 2026 · 214 KB' },
      { name: 'Police Verification.pdf', meta: 'Pending · requested 01 Jul 2026' },
      { name: 'Qualification Proof.pdf', meta: 'Verified 28 Jun 2026 · 156 KB' },
    ],
    notes: 'Police verification pending. Cannot be assigned to a block until the clearance is received.',
  },
  {
    id: 'WRD-008', name: 'Mr. Victor Hale', avatar: 'assets/img/teachers/teacher-02.jpg',
    designation: 'Warden', employeeId: 'EMP-2017-005',
    hostel: 'Everest', block: 'Block C', floors: '2nd floor', shift: 'Rotational',
    contact: '+1 546 8548 308', experience: 9, status: 'Retired',
    gender: 'Male', dob: '03 Dec 1966', joined: '10 Jan 2017', email: 'victor.hale@karkaii.com',
    residence: 'Off campus · Central Square',
    hostelPairs: [
      { label: 'Hostel', value: 'Everest Hostel' },
      { label: 'Type', value: 'Boys' },
      { label: 'Total Rooms', value: '48' },
      { label: 'Students', value: '128' },
      { label: 'Mess', value: 'Regular' },
    ],
    blockPairs: [
      { label: 'Block C', value: '2nd floor · handed over' },
      { label: 'Rooms Covered', value: 'C-201 to C-224' },
      { label: 'Handed Over To', value: 'Mr. David Kim' },
    ],
    dutyPairs: [
      { label: 'Status', value: 'Retired' },
      { label: 'Last Working Day', value: '30 Jun 2026' },
      { label: 'Handover', value: 'Completed 28 Jun 2026' },
      { label: 'Successor', value: 'Recruitment in progress' },
    ],
    emergencyPairs: [
      { label: 'Contact', value: 'Mrs. Rita Hale' },
      { label: 'Relation', value: 'Spouse' },
      { label: 'Mobile', value: '+1 546 8548 415' },
      { label: 'Alternate', value: '+1 546 8548 416' },
    ],
    qualification: 'B.A. History, Old Mill College · 1990. Nine years of residential hostel supervision.',
    documents: [
      { name: 'Appointment Letter.pdf', meta: 'Uploaded 10 Jan 2017 · 248 KB' },
      { name: 'Handover Report.pdf', meta: 'Signed 28 Jun 2026 · 210 KB' },
      { name: 'Service Certificate.pdf', meta: 'Issued 30 Jun 2026 · 132 KB' },
    ],
    notes: 'Retired 30 Jun 2026 after nine years. Block C 2nd floor now covered by Mr. David Kim.',
  },
];
