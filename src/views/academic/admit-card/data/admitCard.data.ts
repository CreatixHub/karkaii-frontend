/** The template's two dialogs, `#send_mail` (L1784) and `#send_bulk_mail` (L1846). */
export type AdmitCardModalId = 'sendMail' | 'sendBulkMail';

export type CardTemplateId = 'standard' | 'premium' | 'classic';

/** The batch rail's five states (L1537–1541). A card sits in several of them at once. */
export type CardStateId = 'generated' | 'pending' | 'verified' | 'printed' | 'hold';

export interface SelectOption {
  id: string;
  label: string;
}

/* ------------------------------ Selection lists ----------------------------- */

/** Academic Year select, L1571–1575. */
export const academicYears: SelectOption[] = [
  { id: '2026-2027', label: '2026 / 2027' },
  { id: '2025-2026', label: '2025 / 2026' },
  { id: '2024-2025', label: '2024 / 2025' },
];

export interface Examination extends SelectOption {
  /** Printed across the head of the card, L1657. */
  heading: string;
  /** The short form the chip rail prints, L1545. */
  chip: string;
  /** The card footer's validity note, L1717. */
  validity: string;
  /** Quoted by the email body, L1807. */
  commencing: string;
  /** The default subject line both dialogs carry, L1804 / L1868. */
  mailSubject: string;
}

/** Examination select, L1579–1584. */
export const examinations: Examination[] = [
  {
    id: 'half-yearly',
    label: 'Half-Yearly Examination',
    heading: 'Half-Yearly Examination – December 2026',
    chip: 'Half-Yearly 2026',
    validity: 'Valid for all Half-Yearly sessions',
    commencing: '08 December 2026',
    mailSubject: 'Admit Card - Half-Yearly Examination, December 2026',
  },
  {
    id: 'quarterly',
    label: 'Quarterly Examination',
    heading: 'Quarterly Examination – August 2026',
    chip: 'Quarterly 2026',
    validity: 'Valid for all Quarterly sessions',
    commencing: '10 August 2026',
    mailSubject: 'Admit Card - Quarterly Examination, August 2026',
  },
  {
    id: 'annual',
    label: 'Annual Examination',
    heading: 'Annual Examination – March 2027',
    chip: 'Annual 2027',
    validity: 'Valid for all Annual sessions',
    commencing: '09 March 2027',
    mailSubject: 'Admit Card - Annual Examination, March 2027',
  },
  {
    id: 'pre-board',
    label: 'Pre-Board Examination',
    heading: 'Pre-Board Examination – January 2027',
    chip: 'Pre-Board 2027',
    validity: 'Valid for all Pre-Board sessions',
    commencing: '12 January 2027',
    mailSubject: 'Admit Card - Pre-Board Examination, January 2027',
  },
];

/** Class select, L1588–1592 — Grade 10 first, as the template ships it selected. */
export const classes: SelectOption[] = [
  { id: 'grade-10', label: 'Grade 10' },
  { id: 'grade-9', label: 'Grade 9' },
  { id: 'grade-11', label: 'Grade 11' },
  { id: 'grade-12', label: 'Grade 12' },
];

/** Section select, L1597–1600. */
export const sections: SelectOption[] = [
  { id: 'a', label: 'Section A' },
  { id: 'b', label: 'Section B' },
  { id: 'c', label: 'Section C' },
];

/* --------------------------------- The school ------------------------------- */

/** Masthead, L1642–1653. */
export const school = {
  name: 'Global International School',
  address: '128 Riverside Avenue, Springfield, CA 94040',
  affiliation: 'Affiliation No. 1930472',
  logo: 'assets/img/favicon.png',
  badge: 'Admit Card',
  note: 'This card must be produced at every examination session',
};

export interface Signatory {
  id: string;
  name: string;
  role: string;
}

/** The two signature blocks, L1702–1711. */
export const signatories: Signatory[] = [
  { id: 'controller', name: 'Marcus Bennett', role: 'Exam Controller' },
  { id: 'principal', name: 'Dr. Teresa Getto', role: 'Principal' },
];

export const signatureImage = 'assets/img/icons/signature.svg';

/* -------------------------------- The students ------------------------------ */

export interface AdmitCardStudent {
  /** Admission number, which is also the row key and what the Student select carries. */
  id: string;
  name: string;
  rollNo: string;
  registrationNo: string;
  classId: string;
  className: string;
  sectionId: string;
  section: string;
  /** "Grade 10 · A", as the card prints it. */
  classSection: string;
  dob: string;
  gender: string;
  house: string;
  /** The house pill's tint, L1750. */
  houseBadge: string;
  parent: string;
  parentEmail: string;
  contact: string;
  centre: string;
  photo: string;
  /** Card serial under the barcode, L1697. */
  serial: string;
  seatNo: string;
  /** The PDF the email dialog attaches, L1816. */
  attachment: string;
  attachmentSize: string;
  eligibility: { label: string; badge: string };
  /** The preview header's pill, L1634. */
  verification: { label: string; badge: string };
  states: CardStateId[];
  issuedOn: string;
  /** Search haystack for the toolbar's search box. */
  search: string;
}

const student = (
  id: string,
  name: string,
  rollNo: string,
  registrationNo: string,
  classId: string,
  className: string,
  sectionId: string,
  section: string,
  dob: string,
  gender: string,
  house: string,
  houseBadge: string,
  parent: string,
  parentEmail: string,
  contact: string,
  centre: string,
  photoNo: string,
  serial: string,
  seatNo: string,
  eligibility: { label: string; badge: string },
  verification: { label: string; badge: string },
  states: CardStateId[],
  issuedOn: string,
): AdmitCardStudent => ({
  id,
  name,
  rollNo,
  registrationNo,
  classId,
  className,
  sectionId,
  section,
  classSection: `${className} · ${section}`,
  dob,
  gender,
  house,
  houseBadge,
  parent,
  parentEmail,
  contact,
  centre,
  photo: `assets/img/students/student-${photoNo}.jpg`,
  serial,
  seatNo,
  attachment: `Admit_Card_${name.replace(/[^A-Za-z]+/g, '_')}.pdf`,
  attachmentSize: '248 KB',
  eligibility,
  verification,
  states,
  issuedOn,
  search: `${name} ${id} ${rollNo} ${registrationNo} ${className} ${section} ${house}`.toLowerCase(),
});

const ELIGIBLE = { label: 'Eligible', badge: 'badge-soft-success' };
const PROVISIONAL = { label: 'Provisional', badge: 'badge-soft-warning' };
const ON_HOLD = { label: 'On Hold', badge: 'badge-soft-danger' };

const VERIFIED = { label: 'Verified', badge: 'badge-soft-success' };
const AWAITING = { label: 'Awaiting Verification', badge: 'badge-soft-warning' };
const NOT_GENERATED = { label: 'Not Generated', badge: 'badge-soft-danger' };

/**
 * Aaron Cooper is the template's record verbatim (L1667–1674, L1741–1754, L1697, L1802).
 * The rest follow the same shape so the Class / Section / Student selects switch for real.
 */
export const students: AdmitCardStudent[] = [
  student(
    'PRE748210', 'Aaron Cooper', '10A-024', 'GIS/2026/10/0248',
    'grade-10', 'Grade 10', 'a', 'A',
    '14 Mar 2011', 'Male', 'Aravali', 'badge-soft-warning',
    'Daniel Cooper', 'daniel.cooper@example.com', '+1 806-555-0142',
    'Main Campus · Block B', '01', 'AC-2026-10A-0248', '24',
    ELIGIBLE, VERIFIED, ['generated', 'verified', 'printed'], '24 Jul 2026',
  ),
  student(
    'PRE748214', 'Bianca Reid', '10A-031', 'GIS/2026/10/0251',
    'grade-10', 'Grade 10', 'a', 'A',
    '02 Jun 2011', 'Female', 'Nilgiri', 'badge-soft-info',
    'Marion Reid', 'marion.reid@example.com', '+1 806-555-0187',
    'Main Campus · Block B', '02', 'AC-2026-10A-0251', '31',
    ELIGIBLE, VERIFIED, ['generated', 'verified', 'printed'], '24 Jul 2026',
  ),
  student(
    'PRE748219', 'Carlos Mendez', '10A-038', 'GIS/2026/10/0256',
    'grade-10', 'Grade 10', 'a', 'A',
    '19 Sep 2010', 'Male', 'Vindhya', 'badge-soft-purple',
    'Rosa Mendez', 'rosa.mendez@example.com', '+1 806-555-0219',
    'Main Campus · Block B', '03', 'AC-2026-10A-0256', '38',
    PROVISIONAL, AWAITING, ['generated', 'verified'], '24 Jul 2026',
  ),
  student(
    'PRE748233', 'Delia Osborne', '10B-012', 'GIS/2026/10/0264',
    'grade-10', 'Grade 10', 'b', 'B',
    '27 Jan 2011', 'Female', 'Everest', 'badge-soft-success',
    'Howard Osborne', 'howard.osborne@example.com', '+1 806-555-0263',
    'Main Campus · Block C', '04', 'AC-2026-10B-0264', '12',
    ELIGIBLE, VERIFIED, ['generated', 'verified', 'printed'], '24 Jul 2026',
  ),
  student(
    'PRE748241', 'Evan Whitfield', '11A-007', 'GIS/2026/11/0271',
    'grade-11', 'Grade 11', 'a', 'A',
    '08 Nov 2009', 'Male', 'Aravali', 'badge-soft-warning',
    'Priya Whitfield', 'priya.whitfield@example.com', '+1 806-555-0304',
    'Senior Wing · Block A', '05', 'AC-2026-11A-0271', '07',
    ELIGIBLE, VERIFIED, ['generated', 'verified'], '23 Jul 2026',
  ),
  student(
    'PRE748256', 'Farah Nazeer', '09C-019', 'GIS/2026/09/0283',
    'grade-9', 'Grade 9', 'c', 'C',
    '30 Apr 2012', 'Female', 'Nilgiri', 'badge-soft-info',
    'Imran Nazeer', 'imran.nazeer@example.com', '+1 806-555-0348',
    'Junior Wing · Block D', '06', 'AC-2026-09C-0283', '19',
    ELIGIBLE, AWAITING, ['pending'], '—',
  ),
  student(
    'PRE748262', 'Gideon Park', '12B-004', 'GIS/2026/12/0292',
    'grade-12', 'Grade 12', 'b', 'B',
    '12 Feb 2009', 'Male', 'Vindhya', 'badge-soft-purple',
    'Soo-Ah Park', 'sooah.park@example.com', '+1 806-555-0391',
    'Senior Wing · Block A', '07', 'AC-2026-12B-0292', '04',
    ON_HOLD, NOT_GENERATED, ['pending', 'hold'], '—',
  ),
];

/* ----------------------------- Examination schedule ------------------------- */

export interface ExamSession {
  id: string;
  /** Subject code as it appears on the timetable. */
  code: string;
  subject: string;
  date: string;
  day: string;
  session: string;
  time: string;
  duration: string;
  room: string;
}

export interface ExamSchedule {
  examId: string;
  classId: string;
  sessions: ExamSession[];
}

const session = (
  id: string,
  code: string,
  subject: string,
  date: string,
  day: string,
  slot: string,
  time: string,
  duration: string,
  room: string,
): ExamSession => ({ id, code, subject, date, day, session: slot, time, duration, room });

const MORNING_LONG = '09:30 AM – 12:30 PM';
const MORNING_SHORT = '09:30 AM – 12:00 PM';
const AFTERNOON = '01:30 PM – 03:30 PM';

/**
 * One schedule per examination and class. Half-Yearly is written out for every class; the
 * other three examinations are written out for Grade 10 and `findSchedule` falls back for
 * combinations the template never showed.
 */
export const examSchedules: ExamSchedule[] = [
  {
    examId: 'half-yearly',
    classId: 'grade-10',
    sessions: [
      session('hy10-1', 'ENG-101', 'English Language & Literature', '08 Dec 2026', 'Tuesday', 'Morning', MORNING_LONG, '3 hrs', 'Block B · Room 204'),
      session('hy10-2', 'MAT-102', 'Mathematics (Standard)', '10 Dec 2026', 'Thursday', 'Morning', MORNING_LONG, '3 hrs', 'Block B · Room 204'),
      session('hy10-3', 'PHY-103', 'Physics', '12 Dec 2026', 'Saturday', 'Morning', MORNING_SHORT, '2 hrs 30 min', 'Block B · Room 204'),
      session('hy10-4', 'CHE-104', 'Chemistry', '14 Dec 2026', 'Monday', 'Morning', MORNING_SHORT, '2 hrs 30 min', 'Block B · Room 204'),
      session('hy10-5', 'BIO-105', 'Biology', '16 Dec 2026', 'Wednesday', 'Morning', MORNING_SHORT, '2 hrs 30 min', 'Block B · Room 204'),
      session('hy10-6', 'SOC-109', 'Social Science', '18 Dec 2026', 'Friday', 'Morning', MORNING_LONG, '3 hrs', 'Block B · Room 204'),
      session('hy10-7', 'CSC-106', 'Computer Science', '21 Dec 2026', 'Monday', 'Afternoon', AFTERNOON, '2 hrs', 'Block C · Lab 02'),
      session('hy10-8', 'FRE-121', 'Second Language – French', '22 Dec 2026', 'Tuesday', 'Afternoon', AFTERNOON, '2 hrs', 'Block B · Room 204'),
    ],
  },
  {
    examId: 'half-yearly',
    classId: 'grade-9',
    sessions: [
      session('hy09-1', 'ENG-091', 'English Language & Literature', '08 Dec 2026', 'Tuesday', 'Morning', MORNING_LONG, '3 hrs', 'Block D · Room 108'),
      session('hy09-2', 'MAT-092', 'Mathematics', '10 Dec 2026', 'Thursday', 'Morning', MORNING_LONG, '3 hrs', 'Block D · Room 108'),
      session('hy09-3', 'SCI-093', 'General Science', '12 Dec 2026', 'Saturday', 'Morning', MORNING_SHORT, '2 hrs 30 min', 'Block D · Room 108'),
      session('hy09-4', 'SOC-094', 'Social Science', '14 Dec 2026', 'Monday', 'Morning', MORNING_LONG, '3 hrs', 'Block D · Room 108'),
      session('hy09-5', 'HIN-095', 'Second Language – Hindi', '16 Dec 2026', 'Wednesday', 'Morning', MORNING_SHORT, '2 hrs 30 min', 'Block D · Room 108'),
      session('hy09-6', 'CSC-096', 'Information Technology', '18 Dec 2026', 'Friday', 'Afternoon', AFTERNOON, '2 hrs', 'Block C · Lab 01'),
      session('hy09-7', 'ART-097', 'Art & Design', '21 Dec 2026', 'Monday', 'Afternoon', AFTERNOON, '2 hrs', 'Block D · Studio 1'),
      session('hy09-8', 'PED-098', 'Physical Education (Theory)', '22 Dec 2026', 'Tuesday', 'Afternoon', AFTERNOON, '2 hrs', 'Block D · Room 108'),
    ],
  },
  {
    examId: 'half-yearly',
    classId: 'grade-11',
    sessions: [
      session('hy11-1', 'ENG-111', 'English Core', '08 Dec 2026', 'Tuesday', 'Morning', MORNING_LONG, '3 hrs', 'Block A · Room 302'),
      session('hy11-2', 'PHY-112', 'Physics', '10 Dec 2026', 'Thursday', 'Morning', MORNING_LONG, '3 hrs', 'Block A · Room 302'),
      session('hy11-3', 'CHE-113', 'Chemistry', '12 Dec 2026', 'Saturday', 'Morning', MORNING_LONG, '3 hrs', 'Block A · Room 302'),
      session('hy11-4', 'MAT-114', 'Mathematics', '15 Dec 2026', 'Tuesday', 'Morning', MORNING_LONG, '3 hrs', 'Block A · Room 302'),
      session('hy11-5', 'BIO-115', 'Biology', '17 Dec 2026', 'Thursday', 'Morning', MORNING_LONG, '3 hrs', 'Block A · Room 302'),
      session('hy11-6', 'CSC-116', 'Computer Science', '19 Dec 2026', 'Saturday', 'Afternoon', AFTERNOON, '2 hrs', 'Block C · Lab 03'),
      session('hy11-7', 'PHY-117', 'Physics Practical', '22 Dec 2026', 'Tuesday', 'Afternoon', AFTERNOON, '2 hrs', 'Block A · Lab 05'),
    ],
  },
  {
    examId: 'half-yearly',
    classId: 'grade-12',
    sessions: [
      session('hy12-1', 'ENG-121', 'English Core', '08 Dec 2026', 'Tuesday', 'Morning', MORNING_LONG, '3 hrs', 'Block A · Room 401'),
      session('hy12-2', 'MAT-122', 'Mathematics', '10 Dec 2026', 'Thursday', 'Morning', MORNING_LONG, '3 hrs', 'Block A · Room 401'),
      session('hy12-3', 'PHY-123', 'Physics', '12 Dec 2026', 'Saturday', 'Morning', MORNING_LONG, '3 hrs', 'Block A · Room 401'),
      session('hy12-4', 'CHE-124', 'Chemistry', '15 Dec 2026', 'Tuesday', 'Morning', MORNING_LONG, '3 hrs', 'Block A · Room 401'),
      session('hy12-5', 'BIO-125', 'Biology', '17 Dec 2026', 'Thursday', 'Morning', MORNING_LONG, '3 hrs', 'Block A · Room 401'),
      session('hy12-6', 'ECO-126', 'Economics', '19 Dec 2026', 'Saturday', 'Morning', MORNING_LONG, '3 hrs', 'Block A · Room 401'),
      session('hy12-7', 'CSC-127', 'Computer Science', '21 Dec 2026', 'Monday', 'Afternoon', AFTERNOON, '2 hrs', 'Block C · Lab 03'),
      session('hy12-8', 'CHE-128', 'Chemistry Practical', '23 Dec 2026', 'Wednesday', 'Afternoon', AFTERNOON, '2 hrs', 'Block A · Lab 06'),
    ],
  },
  {
    examId: 'quarterly',
    classId: 'grade-10',
    sessions: [
      session('qt10-1', 'ENG-101', 'English Language & Literature', '10 Aug 2026', 'Monday', 'Morning', MORNING_SHORT, '2 hrs 30 min', 'Block B · Room 204'),
      session('qt10-2', 'MAT-102', 'Mathematics (Standard)', '12 Aug 2026', 'Wednesday', 'Morning', MORNING_SHORT, '2 hrs 30 min', 'Block B · Room 204'),
      session('qt10-3', 'PHY-103', 'Physics', '14 Aug 2026', 'Friday', 'Morning', MORNING_SHORT, '2 hrs 30 min', 'Block B · Room 204'),
      session('qt10-4', 'CHE-104', 'Chemistry', '17 Aug 2026', 'Monday', 'Morning', MORNING_SHORT, '2 hrs 30 min', 'Block B · Room 204'),
      session('qt10-5', 'BIO-105', 'Biology', '19 Aug 2026', 'Wednesday', 'Morning', MORNING_SHORT, '2 hrs 30 min', 'Block B · Room 204'),
      session('qt10-6', 'SOC-109', 'Social Science', '21 Aug 2026', 'Friday', 'Morning', MORNING_SHORT, '2 hrs 30 min', 'Block B · Room 204'),
      session('qt10-7', 'CSC-106', 'Computer Science', '24 Aug 2026', 'Monday', 'Afternoon', AFTERNOON, '2 hrs', 'Block C · Lab 02'),
      session('qt10-8', 'FRE-121', 'Second Language – French', '25 Aug 2026', 'Tuesday', 'Afternoon', AFTERNOON, '2 hrs', 'Block B · Room 204'),
    ],
  },
  {
    examId: 'annual',
    classId: 'grade-10',
    sessions: [
      session('an10-1', 'ENG-101', 'English Language & Literature', '09 Mar 2027', 'Tuesday', 'Morning', MORNING_LONG, '3 hrs', 'Examination Hall 1'),
      session('an10-2', 'MAT-102', 'Mathematics (Standard)', '11 Mar 2027', 'Thursday', 'Morning', MORNING_LONG, '3 hrs', 'Examination Hall 1'),
      session('an10-3', 'PHY-103', 'Physics', '13 Mar 2027', 'Saturday', 'Morning', MORNING_LONG, '3 hrs', 'Examination Hall 1'),
      session('an10-4', 'CHE-104', 'Chemistry', '16 Mar 2027', 'Tuesday', 'Morning', MORNING_LONG, '3 hrs', 'Examination Hall 1'),
      session('an10-5', 'BIO-105', 'Biology', '18 Mar 2027', 'Thursday', 'Morning', MORNING_LONG, '3 hrs', 'Examination Hall 1'),
      session('an10-6', 'SOC-109', 'Social Science', '20 Mar 2027', 'Saturday', 'Morning', MORNING_LONG, '3 hrs', 'Examination Hall 1'),
      session('an10-7', 'CSC-106', 'Computer Science', '23 Mar 2027', 'Tuesday', 'Afternoon', AFTERNOON, '2 hrs', 'Block C · Lab 02'),
      session('an10-8', 'FRE-121', 'Second Language – French', '25 Mar 2027', 'Thursday', 'Afternoon', AFTERNOON, '2 hrs', 'Examination Hall 1'),
    ],
  },
  {
    examId: 'pre-board',
    classId: 'grade-10',
    sessions: [
      session('pb10-1', 'ENG-101', 'English Language & Literature', '12 Jan 2027', 'Tuesday', 'Morning', MORNING_LONG, '3 hrs', 'Block B · Room 210'),
      session('pb10-2', 'MAT-102', 'Mathematics (Standard)', '14 Jan 2027', 'Thursday', 'Morning', MORNING_LONG, '3 hrs', 'Block B · Room 210'),
      session('pb10-3', 'PHY-103', 'Physics', '16 Jan 2027', 'Saturday', 'Morning', MORNING_LONG, '3 hrs', 'Block B · Room 210'),
      session('pb10-4', 'CHE-104', 'Chemistry', '19 Jan 2027', 'Tuesday', 'Morning', MORNING_LONG, '3 hrs', 'Block B · Room 210'),
      session('pb10-5', 'BIO-105', 'Biology', '21 Jan 2027', 'Thursday', 'Morning', MORNING_LONG, '3 hrs', 'Block B · Room 210'),
      session('pb10-6', 'SOC-109', 'Social Science', '23 Jan 2027', 'Saturday', 'Morning', MORNING_LONG, '3 hrs', 'Block B · Room 210'),
      session('pb10-7', 'CSC-106', 'Computer Science', '25 Jan 2027', 'Monday', 'Afternoon', AFTERNOON, '2 hrs', 'Block C · Lab 02'),
    ],
  },
];

/**
 * The exact examination and class if it is published, otherwise the same examination for the
 * class the template shipped selected, otherwise the class's Half-Yearly sitting.
 */
export const findSchedule = (examId: string, classId: string): ExamSession[] => {
  const exact = examSchedules.find((item) => item.examId === examId && item.classId === classId);
  if (exact) return exact.sessions;

  const sameExam = examSchedules.find((item) => item.examId === examId);
  if (sameExam) return sameExam.sessions;

  const sameClass = examSchedules.find((item) => item.classId === classId);
  return sameClass ? sameClass.sessions : [];
};

/* ----------------------------------- Toolbar -------------------------------- */

export interface SavedBatch {
  id: string;
  label: string;
  count: string;
  classId: string;
  sectionId: string;
}

/** Saved Batches menu, L1506–1511. */
export const savedBatches: SavedBatch[] = [
  { id: '10-a', label: 'Grade 10 · Section A', count: '42', classId: 'grade-10', sectionId: 'a' },
  { id: '10-b', label: 'Grade 10 · Section B', count: '38', classId: 'grade-10', sectionId: 'b' },
  { id: '11-science', label: 'Grade 11 · Science', count: '45', classId: 'grade-11', sectionId: 'a' },
];

export interface CardTemplate {
  id: CardTemplateId;
  label: string;
  icon: string;
  /** The pill beside the preview heading, L1635. */
  badge: string;
}

/** Card template menu, L1520–1523. */
export const cardTemplates: CardTemplate[] = [
  { id: 'standard', label: 'Standard', icon: 'ti ti-file-certificate', badge: 'Standard Template' },
  { id: 'premium', label: 'Premium', icon: 'ti ti-award', badge: 'Premium Template' },
  { id: 'classic', label: 'Classic', icon: 'ti ti-file-text', badge: 'Classic Template' },
];

export interface BatchFilter {
  id: CardStateId;
  label: string;
  icon: string;
  /** The batch-wide count the template printed; the loaded records are a demo slice of it. */
  count: string;
}

/** Batch rail, L1537–1541. */
export const batchFilters: BatchFilter[] = [
  { id: 'generated', label: 'Generated', icon: 'ti ti-circle-check', count: '42' },
  { id: 'pending', label: 'Pending', icon: 'ti ti-clock', count: '6' },
  { id: 'verified', label: 'Verified', icon: 'ti ti-shield-check', count: '40' },
  { id: 'printed', label: 'Printed', icon: 'ti ti-printer', count: '36' },
  { id: 'hold', label: 'On Hold', icon: 'ti ti-alert-triangle', count: '2' },
];

/* ------------------------------- Action menus ------------------------------- */

/** What an action does beyond pushing its toast. */
export type ActionEffect = 'print' | 'download' | 'preview' | 'verify' | 'mail' | 'bulkMail' | 'share';

export interface CardAction {
  id: string;
  label: string;
  icon: string;
  effect: ActionEffect;
}

/** Quick Actions dropdown in the page header, L1475–1482. */
export const headerActions: CardAction[] = [
  { id: 'header-print', label: 'Print Admit Card', icon: 'ti ti-printer', effect: 'print' },
  { id: 'header-pdf', label: 'Download PDF', icon: 'ti ti-file-type-pdf', effect: 'download' },
  { id: 'header-preview', label: 'Preview', icon: 'ti ti-eye', effect: 'preview' },
  { id: 'header-verify', label: 'Verify', icon: 'ti ti-shield-check', effect: 'verify' },
];

/** The three items below the divider in the same menu, L1480–1482. */
export const headerMailActions: CardAction[] = [
  { id: 'header-mail', label: 'Email Admit Card', icon: 'ti ti-mail', effect: 'mail' },
  { id: 'header-bulk-mail', label: 'Email to Batch', icon: 'ti ti-mail-forward', effect: 'bulkMail' },
  { id: 'header-share', label: 'Share', icon: 'ti ti-share', effect: 'share' },
];

/** Quick Actions card, L1765–1769. Only the first is `btn-primary`. */
export const quickActions: CardAction[] = [
  { id: 'quick-print', label: 'Print Admit Card', icon: 'ti ti-printer', effect: 'print' },
  { id: 'quick-pdf', label: 'Download PDF', icon: 'ti ti-file-type-pdf', effect: 'download' },
  { id: 'quick-preview', label: 'Preview', icon: 'ti ti-eye', effect: 'preview' },
  { id: 'quick-verify', label: 'Verify', icon: 'ti ti-shield-check', effect: 'verify' },
  { id: 'quick-share', label: 'Share', icon: 'ti ti-share', effect: 'share' },
];

/* ---------------------------------- Copy ------------------------------------ */

/**
 * The template shipped no page script, so it carried no toast copy. These read the way the
 * rest of the workspace pages phrase their confirmations.
 */
export const actionToasts: Record<string, string> = {
  print: 'Sending the admit card to your printer…',
  download: 'Admit card PDF is being prepared for download.',
  preview: 'Opening the print preview.',
  verify: 'Admit card verified against the examination register.',
  share: 'Share link copied — the card is available for 7 days.',
  generate: 'Admit cards generated for the selected batch.',
  refresh: 'Admit card batch refreshed.',
  apply: 'Selection applied.',
  reset: 'Selection reset to the current batch.',
  clearFilters: 'Filters cleared.',
  saveBatch: 'Current batch saved to your list.',
  mailSent: 'Admit card emailed successfully.',
  bulkSent: 'Batch email queued for delivery.',
};

export const strings = {
  /** Card-footer note under the toolbar, L1551. */
  lockNote:
    'Admit cards are locked once the examination begins. Reprints require coordinator approval.',
  issueWindow: 'Issue Window Open',
  batchSize: '48 Students in Batch',
  /** Selection-panel footer, L1614. */
  lastGenerated: 'Last generated on 24 Jul 2026 at 10:42 AM by Kevin Larry',
  searchPlaceholder: 'Search student, admission or roll number…',
  scheduleTitle: 'Examination Schedule',
  scheduleNote: 'Report to the examination centre 30 minutes before each session begins.',
  emptyTitle: 'No admit card for this selection',
  emptyBody:
    'No student in this class and section matches the current batch filter. Try another section or clear the filters.',
};

/** Totals the bulk-mail dialog lists, L1873–1876. */
export const batchSummary = [
  { id: 'roll', label: 'Students in batch', value: '48', badge: null },
  { id: 'generated', label: 'Admit cards generated', value: '42', badge: 'badge-soft-success' },
  { id: 'pending', label: 'Pending generation', value: '06', badge: 'badge-soft-warning' },
  { id: 'emails', label: 'Emails to be sent', value: '42', badge: null },
];
