/* ------------------------------- The register ------------------------------ */

/** What the report reads from, before any filter narrows it. */
export const REGISTER_TOTAL = 1486;

/** The term the ledger covers; the date-range field opens on July within it. */
export const TERM_LABEL = 'Term 1 · 96 days';
export const REPORT_RANGE = '01 Jul 2026 - 31 Jul 2026';

/** Attendance at or above this is on target for every record type. */
export const TARGET_PCT = 95;

/** Late marks allowed in a calendar month before the threshold is breached. */
export const LATE_THRESHOLD = 3;

/** A record below its type's floor is what the strip counts as low attendance. */
export const FLOOR_PCT: Record<RecordType, number> = {
  Student: 75,
  Teacher: 85,
  Staff: 85,
};

/** Department means, as the teacher and staff panels print them. */
export const DEPARTMENT_MEAN: Record<string, number> = {
  Mathematics: 94.1,
  Science: 94.1,
  Administration: 92.8,
  Transport: 89.4,
};

/* --------------------------------- Shapes ---------------------------------- */

export type RecordType = 'Student' | 'Teacher' | 'Staff';

export type AttendanceState = 'Present' | 'Absent' | 'Late' | 'Half day' | 'Leave' | 'Holiday';

export type StatusPill =
  | 'Excellent'
  | 'Good'
  | 'At Risk'
  | 'Under Review'
  | 'Low Attendance'
  | 'Policy Violation';

/** One month of the ledger. Everything the page counts comes from these. */
export interface MonthEntry {
  month: string;
  present: number;
  working: number;
}

export interface TimelineEvent {
  kind: AttendanceState | 'Late arrival' | 'Medical leave' | 'Casual leave';
  date: string;
  note: string;
}

export interface FactLine {
  label: string;
  value: string;
  /** The smaller line under the value, where the panel carries one. */
  hint?: string;
}

export interface ListEntry {
  title: string;
  detail: string;
}

export interface RemarkEntry {
  author: string;
  role: string;
  date: string;
  body: string;
}

export interface AttendanceRecord {
  id: string;
  name: string;
  image: string;
  /** The line under the name: roll number, posting or route. */
  role: string;
  shift: 'Morning' | 'General' | 'Afternoon' | 'Evening';
  /** The badge the template puts beside the name on flagged records. */
  flag?: { label: string; tint: string };

  code: string;
  since: string;
  type: RecordType;
  /** Class for students, department for everyone else. */
  group: string;
  groupNote: string;
  /** Section for students, designation for everyone else. */
  unit: string;
  unitNote: string;

  /** The ledger. Working days, present days and the rate all come from here. */
  months: MonthEntry[];
  absent: number;
  lateMarks: number;
  leave: number;
  halfDays: number;
  /** Days the register never marked either way. */
  unmarked?: number;
  /** Days worked on a declared holiday, which the staff panels count out. */
  dutyDays?: number;

  lastDate: string;
  lastState: AttendanceState;
  lastNote: string;

  timeline: TimelineEvent[];
  /** The line under the monthly ledger — a trend, a streak or a mean. */
  weekly: FactLine[];
  weeklyNote: FactLine;
  leaveHistory: ListEntry[];
  leaveFacts: FactLine[];
  lateLatest: ListEntry;
  /** Mean minutes across every late mark. Not reconstructible from the worst one. */
  averageDelay: number;
  lateFacts: FactLine[];
  holiday: FactLine[];
  /** Open exceptions, in the order the panel raises them. */
  exceptions: string[];
  /** What the panel says once nothing is open. */
  exceptionsNote: ListEntry;
  remarks: RemarkEntry[];
  notifications: ListEntry[];
  notificationsSent: number;
  audit: ListEntry[];
}

/* --------------------------------- The rows -------------------------------- */

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: 'AD9892434',
    name: 'Aaradhya Sharma',
    image: 'assets/img/students/student-01.jpg',
    role: 'Roll 14',
    shift: 'Morning',
    code: 'AD9892434',
    since: 'Admitted Jun 2019',
    type: 'Student',
    group: 'Class X',
    groupNote: 'Senior section',
    unit: 'Section B',
    unitNote: 'Mrs. Ellen Cruz',
    months: [
      { month: 'April 2026', present: 22, working: 22 },
      { month: 'May 2026', present: 18, working: 19 },
      { month: 'June 2026', present: 25, working: 26 },
      { month: 'July 2026', present: 28, working: 29 },
    ],
    absent: 2,
    lateMarks: 1,
    leave: 1,
    halfDays: 0,
    lastDate: '31 Jul 2026',
    lastState: 'Present',
    lastNote: '8:22 AM',
    timeline: [
      { kind: 'Present', date: '31 Jul 2026', note: '8:22 AM · Gate 1' },
      { kind: 'Present', date: '30 Jul 2026', note: '8:18 AM · Gate 1' },
      { kind: 'Late arrival', date: '24 Jul 2026', note: '8:47 AM · 17 min' },
      { kind: 'Absent', date: '17 Jul 2026', note: 'unexcused' },
    ],
    weekly: [
      { label: 'Monday', value: '100%' },
      { label: 'Wednesday', value: '96%' },
    ],
    weeklyNote: { label: 'Weakest Day', value: 'Friday · 92%' },
    leaveHistory: [{ title: 'Sick leave · 1 day', detail: '8 May 2026 · approved by class teacher' }],
    leaveFacts: [{ label: 'Pending Requests', value: 'None' }],
    lateLatest: { title: '17 minutes late', detail: '24 Jul 2026 · school bus delay' },
    averageDelay: 17,
    lateFacts: [],
    holiday: [
      { label: 'Declared Holidays', value: '14 days' },
      { label: 'Weekends', value: '26 days' },
      { label: 'Term Break', value: '6 days', hint: 'May 2026' },
      { label: 'Adjacent Absences', value: '0' },
      { label: 'Next Holiday', value: '15 Aug 2026' },
    ],
    exceptions: [],
    exceptionsNote: {
      title: 'Biometric mismatch resolved',
      detail: '24 Jul 2026 · manual entry accepted',
    },
    remarks: [
      {
        author: 'Mrs. Ellen Cruz',
        role: 'Class Teacher',
        date: '28 Jul 2026',
        body: 'Attendance has held above 95% every month of the term. No follow up needed.',
      },
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        date: '30 Jul 2026',
        body: 'Eligible for the term attendance award at the assembly on 14 Aug.',
      },
    ],
    notifications: [
      { title: 'SMS · absence alert', detail: '17 Jul 2026 · delivered · Mr. Rakesh Sharma' },
      { title: 'Email · late arrival notice', detail: '24 Jul 2026 · opened' },
    ],
    notificationsSent: 2,
    audit: [
      { title: 'Marked present manually', detail: '24 Jul 2026 · Mrs. Ellen Cruz' },
      { title: 'Register locked for July', detail: '31 Jul 2026 · Ms. Fatima Sheikh' },
    ],
  },

  {
    id: 'AD9892518',
    name: 'Rohan Verma',
    image: 'assets/img/students/student-02.jpg',
    role: 'Roll 09',
    shift: 'Morning',
    flag: { label: 'Chronic Absentee', tint: 'danger' },
    code: 'AD9892518',
    since: 'Admitted Jun 2020',
    type: 'Student',
    group: 'Class IX',
    groupNote: 'Senior section',
    unit: 'Section C',
    unitNote: 'Mr. Arjun Kale',
    months: [
      { month: 'April 2026', present: 19, working: 22 },
      { month: 'May 2026', present: 15, working: 19 },
      { month: 'June 2026', present: 19, working: 26 },
      { month: 'July 2026', present: 18, working: 29 },
    ],
    absent: 18,
    lateMarks: 6,
    leave: 5,
    halfDays: 2,
    unmarked: 2,
    lastDate: '30 Jul 2026',
    lastState: 'Absent',
    lastNote: 'unexcused',
    timeline: [
      { kind: 'Absent', date: '30 Jul 2026', note: 'unexcused · 3rd this week' },
      { kind: 'Absent', date: '29 Jul 2026', note: 'unexcused' },
      { kind: 'Half day', date: '27 Jul 2026', note: 'left at 11:40 AM' },
      { kind: 'Late arrival', date: '23 Jul 2026', note: '9:12 AM · 42 min' },
    ],
    weekly: [
      { label: 'Monday', value: '58%' },
      { label: 'Friday', value: '54%' },
    ],
    weeklyNote: { label: 'Pattern', value: 'Absent either side of a holiday' },
    leaveHistory: [
      { title: 'Medical leave · 3 days', detail: '11 - 13 Jun 2026 · certificate on file' },
      { title: 'Family leave · 2 days', detail: '6 - 7 May 2026 · approved' },
    ],
    leaveFacts: [],
    lateLatest: { title: '42 minutes late', detail: '23 Jul 2026 · no reason recorded' },
    averageDelay: 28,
    lateFacts: [],
    holiday: [
      { label: 'Declared Holidays', value: '14 days' },
      { label: 'Weekends', value: '26 days' },
      { label: 'Term Break', value: '6 days', hint: 'May 2026' },
      { label: 'Adjacent Absences', value: '7 days' },
      { label: 'Next Holiday', value: '15 Aug 2026' },
    ],
    exceptions: ['Below 75% policy', 'Late threshold', '2 unmarked days'],
    exceptionsNote: {
      title: 'Detention eligibility at risk',
      detail: 'Needs 75% by 30 Sep 2026',
    },
    remarks: [
      {
        author: 'Mr. Arjun Kale',
        role: 'Class Teacher',
        date: '29 Jul 2026',
        body: 'Guardian meeting held on 22 Jul. Attendance has not improved since.',
      },
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        date: '30 Jul 2026',
        body: 'Referred to the counsellor. Second warning letter to be issued this week.',
      },
    ],
    notifications: [
      { title: 'Email · first warning letter', detail: '22 Jul 2026 · opened · Mrs. Sunita Verma' },
      { title: 'SMS · absence alert', detail: '30 Jul 2026 · delivered' },
    ],
    notificationsSent: 11,
    audit: [
      { title: 'Half day corrected from absent', detail: '27 Jul 2026 · Mr. Arjun Kale' },
      { title: 'Flagged as chronic absentee', detail: '28 Jul 2026 · system rule' },
    ],
  },

  {
    id: 'AD9893660',
    name: 'Meera Iyer',
    image: 'assets/img/students/student-03.jpg',
    role: 'Roll 21',
    shift: 'Morning',
    flag: { label: 'Perfect Attendance', tint: 'success' },
    code: 'AD9893660',
    since: 'Admitted Jun 2022',
    type: 'Student',
    group: 'Class V',
    groupNote: 'Junior section',
    unit: 'Section A',
    unitNote: 'Ms. Grace Otieno',
    months: [
      { month: 'April 2026', present: 22, working: 22 },
      { month: 'May 2026', present: 19, working: 19 },
      { month: 'June 2026', present: 26, working: 26 },
      { month: 'July 2026', present: 29, working: 29 },
    ],
    absent: 0,
    lateMarks: 0,
    leave: 0,
    halfDays: 0,
    lastDate: '31 Jul 2026',
    lastState: 'Present',
    lastNote: '8:05 AM',
    timeline: [
      { kind: 'Present', date: '31 Jul 2026', note: '8:05 AM · Gate 2' },
      { kind: 'Present', date: '30 Jul 2026', note: '8:02 AM · Gate 2' },
      { kind: 'Holiday', date: '26 Jul 2026', note: 'declared holiday' },
    ],
    weekly: [
      { label: 'Every Weekday', value: '100%' },
      { label: 'Average Entry', value: '8:04 AM' },
    ],
    weeklyNote: { label: 'Pattern', value: 'No dips recorded' },
    leaveHistory: [{ title: 'No leave taken', detail: 'Full term · 96 working days' }],
    leaveFacts: [{ label: 'Pending Requests', value: 'None' }],
    lateLatest: { title: 'No late marks', detail: 'Earliest entry 7:52 AM · 14 Jul' },
    averageDelay: 0,
    lateFacts: [],
    holiday: [
      { label: 'Declared Holidays', value: '14 days' },
      { label: 'Weekends', value: '26 days' },
      { label: 'Term Break', value: '6 days', hint: 'May 2026' },
      { label: 'Adjacent Absences', value: '0' },
      { label: 'Next Holiday', value: '15 Aug 2026' },
    ],
    exceptions: [],
    exceptionsNote: {
      title: 'No exceptions raised',
      detail:
        'Every working day of the term carries a verified biometric punch. Nothing was entered manually.',
    },
    remarks: [
      {
        author: 'Ms. Grace Otieno',
        role: 'Class Teacher',
        date: '30 Jul 2026',
        body: 'Full attendance for a second term running. Nominated for the annual attendance shield.',
      },
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        date: '31 Jul 2026',
        body: 'Added to the perfect attendance list published with the term report.',
      },
    ],
    notifications: [
      { title: 'Email · appreciation note', detail: '31 Jul 2026 · opened · Mrs. Lakshmi Iyer' },
      { title: 'SMS · monthly summary', detail: '1 Jul 2026 · delivered' },
    ],
    notificationsSent: 4,
    audit: [
      { title: 'Added to perfect attendance list', detail: '31 Jul 2026 · system rule' },
      { title: 'Register locked for July', detail: '31 Jul 2026 · Ms. Fatima Sheikh' },
    ],
  },

  {
    id: 'AD9893712',
    name: 'Kabir Nair',
    image: 'assets/img/students/student-04.jpg',
    role: 'Roll 07',
    shift: 'Morning',
    flag: { label: 'Late Pattern', tint: 'warning' },
    code: 'AD9893712',
    since: 'Admitted Jun 2021',
    type: 'Student',
    group: 'Class VII',
    groupNote: 'Middle section',
    unit: 'Section B',
    unitNote: 'Mrs. Sofia Alvarez',
    months: [
      { month: 'April 2026', present: 21, working: 22 },
      { month: 'May 2026', present: 17, working: 19 },
      { month: 'June 2026', present: 23, working: 26 },
      { month: 'July 2026', present: 25, working: 29 },
    ],
    absent: 6,
    lateMarks: 9,
    leave: 4,
    halfDays: 2,
    lastDate: '31 Jul 2026',
    lastState: 'Late',
    lastNote: '8:51 AM',
    timeline: [
      { kind: 'Late arrival', date: '31 Jul 2026', note: '8:51 AM · 21 min' },
      { kind: 'Half day', date: '28 Jul 2026', note: 'dental appointment' },
      { kind: 'Present', date: '27 Jul 2026', note: '8:29 AM · Gate 1' },
    ],
    weekly: [
      { label: 'Monday', value: '78%' },
      { label: 'Thursday', value: '94%' },
    ],
    weeklyNote: { label: 'Pattern', value: 'Late on Mondays' },
    leaveHistory: [
      { title: 'Sick leave · 2 days', detail: '19 - 20 Jun 2026 · approved' },
      { title: 'Sports leave · 2 days', detail: '8 - 9 Jul 2026 · district meet' },
    ],
    leaveFacts: [],
    lateLatest: { title: '21 minutes late', detail: '31 Jul 2026 · private transport' },
    averageDelay: 19,
    lateFacts: [{ label: 'Policy Threshold', value: '4 in July' }],
    holiday: [
      { label: 'Declared Holidays', value: '14 days' },
      { label: 'Weekends', value: '26 days' },
      { label: 'Term Break', value: '6 days', hint: 'May 2026' },
      { label: 'Adjacent Absences', value: '2 days' },
      { label: 'Next Holiday', value: '15 Aug 2026' },
    ],
    exceptions: ['Late threshold · July'],
    exceptionsNote: {
      title: '4 late marks in one month',
      detail: 'Policy allows 3 · awaiting coordinator review',
    },
    remarks: [
      {
        author: 'Mrs. Sofia Alvarez',
        role: 'Class Teacher',
        date: '31 Jul 2026',
        body: 'Late almost every Monday. Guardians asked to move him to the school bus route.',
      },
      {
        author: 'Mr. Vikram Sethi',
        role: 'Sports',
        date: '12 Jul 2026',
        body: 'Two days of the absence were the district athletics meet and count as duty leave.',
      },
    ],
    notifications: [
      { title: 'Email · late arrival summary', detail: '28 Jul 2026 · opened · Mr. Suresh Nair' },
      { title: 'SMS · half day alert', detail: '28 Jul 2026 · delivered' },
    ],
    notificationsSent: 7,
    audit: [
      { title: 'Absence reclassified as duty leave', detail: '12 Jul 2026 · Mr. Vikram Sethi' },
      { title: 'Added to the late watchlist', detail: '29 Jul 2026 · system rule' },
    ],
  },

  {
    id: 'TCH-2043',
    name: 'Mrs. Ellen Cruz',
    image: 'assets/img/teachers/teacher-01.jpg',
    role: 'Class teacher X B',
    shift: 'General',
    code: 'TCH-2043',
    since: 'Joined Apr 2016',
    type: 'Teacher',
    group: 'Mathematics',
    groupNote: 'Senior wing',
    unit: 'Senior Teacher',
    unitNote: 'Grade IX – X',
    months: [
      { month: 'April 2026', present: 21, working: 21 },
      { month: 'May 2026', present: 17, working: 18 },
      { month: 'June 2026', present: 24, working: 24 },
      { month: 'July 2026', present: 23, working: 25 },
    ],
    absent: 1,
    lateMarks: 2,
    leave: 2,
    halfDays: 0,
    dutyDays: 2,
    lastDate: '31 Jul 2026',
    lastState: 'Present',
    lastNote: '7:48 AM',
    timeline: [
      { kind: 'Present', date: '31 Jul 2026', note: '7:48 AM · staff gate' },
      { kind: 'Casual leave', date: '21 Jul 2026', note: 'approved by the principal' },
      { kind: 'Late arrival', date: '9 Jul 2026', note: '8:14 AM · 14 min' },
    ],
    weekly: [
      { label: 'Average Entry', value: '7:51 AM' },
      { label: 'Periods Covered', value: '412 of 424' },
    ],
    weeklyNote: { label: 'Substitutions Given', value: '18 periods' },
    leaveHistory: [{ title: 'Casual leave · 2 days', detail: '21 Jul and 14 May 2026 · approved' }],
    leaveFacts: [
      { label: 'Casual Leave', value: '2 of 12 used' },
      { label: 'Sick Leave', value: '0 of 10 used' },
      { label: 'Earned Leave', value: '0 of 15 used' },
    ],
    lateLatest: { title: '14 minutes late', detail: '9 Jul 2026 · heavy rain' },
    averageDelay: 11,
    lateFacts: [{ label: 'Grace Window', value: '10 min after 7:45 AM' }],
    holiday: [
      { label: 'Declared Holidays', value: '14 days' },
      { label: 'Weekends', value: '26 days' },
      { label: 'Working Holidays', value: '2 days', hint: 'exam duty' },
      { label: 'Compensatory Off', value: '2 days due' },
      { label: 'Next Holiday', value: '15 Aug 2026' },
    ],
    exceptions: [],
    exceptionsNote: { title: 'Missed punch out resolved', detail: '17 Jul 2026 · approved by HR' },
    remarks: [
      {
        author: 'Ms. Fatima Sheikh',
        role: 'HR Executive',
        date: '30 Jul 2026',
        body: 'Two compensatory offs are due for the exam duty worked on 4 and 11 Jul.',
      },
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        date: '31 Jul 2026',
        body: 'Highest attendance in the mathematics department for the third term running.',
      },
    ],
    notifications: [],
    notificationsSent: 0,
    audit: [
      { title: 'Punch out added manually', detail: '17 Jul 2026 · Ms. Fatima Sheikh' },
      { title: 'Casual leave approved', detail: '18 Jul 2026 · Principal' },
    ],
  },

  {
    id: 'TCH-2088',
    name: 'Mr. Vikram Sethi',
    image: 'assets/img/teachers/teacher-02.jpg',
    role: 'Science lab in charge',
    shift: 'General',
    flag: { label: 'Under Review', tint: 'warning' },
    code: 'TCH-2088',
    since: 'Joined Jul 2019',
    type: 'Teacher',
    group: 'Science',
    groupNote: 'Senior wing',
    unit: 'TGT',
    unitNote: 'Grade VIII – X',
    months: [
      { month: 'April 2026', present: 20, working: 21 },
      { month: 'May 2026', present: 16, working: 18 },
      { month: 'June 2026', present: 21, working: 24 },
      { month: 'July 2026', present: 19, working: 25 },
    ],
    absent: 5,
    lateMarks: 7,
    leave: 6,
    halfDays: 1,
    unmarked: 3,
    lastDate: '30 Jul 2026',
    lastState: 'Leave',
    lastNote: 'medical',
    timeline: [
      { kind: 'Medical leave', date: '30 Jul 2026', note: 'certificate pending' },
      { kind: 'Absent', date: '23 Jul 2026', note: 'leave not applied' },
      { kind: 'Late arrival', date: '22 Jul 2026', note: '8:26 AM · 26 min' },
    ],
    weekly: [
      { label: 'Average Entry', value: '8:06 AM' },
      { label: 'Periods Covered', value: '352 of 424' },
    ],
    weeklyNote: { label: 'Substitutions Taken', value: '64 periods' },
    leaveHistory: [{ title: 'Medical leave · 4 days', detail: '27 - 30 Jul 2026 · certificate pending' }],
    leaveFacts: [
      { label: 'Casual Leave', value: '2 of 12 used' },
      { label: 'Sick Leave', value: '4 of 10 used' },
      { label: 'Unapproved Days', value: '1 day' },
    ],
    lateLatest: { title: '26 minutes late', detail: '22 Jul 2026 · no reason recorded' },
    averageDelay: 22,
    lateFacts: [{ label: 'Grace Window', value: 'Exceeded 7 times' }],
    holiday: [
      { label: 'Declared Holidays', value: '14 days' },
      { label: 'Weekends', value: '26 days' },
      { label: 'Working Holidays', value: '1 day', hint: 'exam duty' },
      { label: 'Adjacent Absences', value: '3 days' },
      { label: 'Next Holiday', value: '15 Aug 2026' },
    ],
    exceptions: ['Leave without application', 'Certificate pending'],
    exceptionsNote: { title: '23 Jul marked loss of pay', detail: 'Awaiting HR confirmation' },
    remarks: [
      {
        author: 'Ms. Fatima Sheikh',
        role: 'HR Executive',
        date: '30 Jul 2026',
        body: 'Medical certificate for 27 - 30 Jul is still outstanding. Payroll is on hold.',
      },
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        date: '29 Jul 2026',
        body: '64 substitution periods this term. Class IX C practicals are running behind.',
      },
    ],
    notifications: [],
    notificationsSent: 0,
    audit: [
      { title: 'Marked under review', detail: '29 Jul 2026 · system rule' },
      { title: 'Absence converted to loss of pay', detail: '28 Jul 2026 · Ms. Fatima Sheikh' },
    ],
  },

  {
    id: 'STF-3310',
    name: 'Ms. Fatima Sheikh',
    image: 'assets/img/profiles/avatar-05.jpg',
    role: 'School office',
    shift: 'General',
    code: 'STF-3310',
    since: 'Joined Feb 2018',
    type: 'Staff',
    group: 'Administration',
    groupNote: 'Front office',
    unit: 'Office Executive',
    unitNote: 'Admissions desk',
    months: [
      { month: 'April 2026', present: 22, working: 22 },
      { month: 'May 2026', present: 20, working: 21 },
      { month: 'June 2026', present: 24, working: 25 },
      { month: 'July 2026', present: 22, working: 24 },
    ],
    absent: 2,
    lateMarks: 2,
    leave: 2,
    halfDays: 0,
    dutyDays: 4,
    lastDate: '31 Jul 2026',
    lastState: 'Present',
    lastNote: '8:34 AM',
    timeline: [
      { kind: 'Present', date: '31 Jul 2026', note: '8:34 AM · staff gate' },
      { kind: 'Casual leave', date: '15 Jul 2026', note: 'approved by HR' },
      { kind: 'Late arrival', date: '6 Jul 2026', note: '9:02 AM · 32 min' },
    ],
    weekly: [
      { label: 'Average Entry', value: '8:31 AM' },
      { label: 'Average Exit', value: '4:48 PM' },
    ],
    weeklyNote: { label: 'Hours Logged', value: '726 of 736' },
    leaveHistory: [{ title: 'Casual leave · 2 days', detail: '15 Jul and 22 May 2026 · approved' }],
    leaveFacts: [
      { label: 'Casual Leave', value: '2 of 12 used' },
      { label: 'Sick Leave', value: '0 of 10 used' },
      { label: 'Earned Leave', value: '0 of 18 used' },
    ],
    lateLatest: { title: '32 minutes late', detail: '6 Jul 2026 · traffic diversion' },
    averageDelay: 24,
    lateFacts: [{ label: 'Grace Window', value: '15 min after 8:30 AM' }],
    holiday: [
      { label: 'Declared Holidays', value: '10 days' },
      { label: 'Weekends', value: '26 days' },
      { label: 'Working Holidays', value: '4 days', hint: 'admission drive' },
      { label: 'Compensatory Off', value: '4 days due' },
      { label: 'Next Holiday', value: '15 Aug 2026' },
    ],
    exceptions: [],
    exceptionsNote: {
      title: 'Weekend duty regularised',
      detail: '20 Jun 2026 · compensatory off credited',
    },
    remarks: [
      {
        author: 'Mr. Rajiv Menon',
        role: 'Administrative Officer',
        date: '30 Jul 2026',
        body: 'Covered the admission desk on four weekends. Four compensatory offs are due.',
      },
      {
        author: 'Principal',
        role: 'Principal',
        date: '31 Jul 2026',
        body: 'Recommended for the annual service commendation at the staff meeting.',
      },
    ],
    notifications: [],
    notificationsSent: 0,
    audit: [
      { title: 'Compensatory off credited', detail: '22 Jun 2026 · Mr. Rajiv Menon' },
      { title: 'Register locked for July', detail: '31 Jul 2026 · Mr. Rajiv Menon' },
    ],
  },

  {
    id: 'STF-3355',
    name: 'Mr. Daniel Okafor',
    image: 'assets/img/profiles/avatar-12.jpg',
    role: 'Route 4 — Green Line',
    shift: 'Morning',
    flag: { label: 'Policy Violation', tint: 'danger' },
    code: 'STF-3355',
    since: 'Joined Sep 2021',
    type: 'Staff',
    group: 'Transport',
    groupNote: 'Fleet operations',
    unit: 'Driver',
    unitNote: 'Bus KA-05-AB-2214',
    months: [
      { month: 'April 2026', present: 20, working: 22 },
      { month: 'May 2026', present: 18, working: 21 },
      { month: 'June 2026', present: 20, working: 25 },
      { month: 'July 2026', present: 16, working: 24 },
    ],
    absent: 11,
    lateMarks: 5,
    leave: 6,
    halfDays: 1,
    unmarked: 4,
    lastDate: '29 Jul 2026',
    lastState: 'Absent',
    lastNote: 'unapproved',
    timeline: [
      { kind: 'Absent', date: '29 Jul 2026', note: 'relief driver deployed' },
      { kind: 'Late arrival', date: '25 Jul 2026', note: '7:12 AM · 42 min' },
      { kind: 'Half day', date: '18 Jul 2026', note: 'afternoon route only' },
    ],
    weekly: [
      { label: 'Monday', value: '64%' },
      { label: 'Average Entry', value: '6:41 AM' },
    ],
    weeklyNote: { label: 'Routes Missed', value: '17 of 184' },
    leaveHistory: [{ title: 'Sick leave · 4 days', detail: '2 - 5 Jun 2026 · approved' }],
    leaveFacts: [
      { label: 'Casual Leave', value: '2 of 12 used' },
      { label: 'Sick Leave', value: '4 of 10 used' },
      { label: 'Unapproved Days', value: '6 days' },
    ],
    lateLatest: { title: '42 minutes late', detail: '25 Jul 2026 · route delayed by 35 min' },
    averageDelay: 31,
    lateFacts: [{ label: 'Grace Window', value: 'Exceeded 5 times' }],
    holiday: [
      { label: 'Declared Holidays', value: '10 days' },
      { label: 'Weekends', value: '26 days' },
      { label: 'Working Holidays', value: '2 days', hint: 'excursion duty' },
      { label: 'Adjacent Absences', value: '5 days' },
      { label: 'Next Holiday', value: '15 Aug 2026' },
    ],
    exceptions: ['Below 85% transport policy', '6 unapproved days', '4 unmarked days'],
    exceptionsNote: {
      title: 'Route continuity clause breached',
      detail: 'Second notice issued 30 Jul 2026',
    },
    remarks: [
      {
        author: 'Mr. Suresh Pillai',
        role: 'Transport Manager',
        date: '30 Jul 2026',
        body: 'Route 4 needed a relief driver on 11 mornings this term. Guardians have complained twice.',
      },
      {
        author: 'Ms. Fatima Sheikh',
        role: 'HR Executive',
        date: '31 Jul 2026',
        body: 'Second written notice issued. A review meeting is set for 7 Aug 2026.',
      },
    ],
    notifications: [],
    notificationsSent: 0,
    audit: [
      { title: 'Flagged for policy violation', detail: '30 Jul 2026 · system rule' },
      { title: 'Relief driver logged against route', detail: '29 Jul 2026 · Mr. Suresh Pillai' },
    ],
  },
];

/* ------------------------------- Derivations ------------------------------- */

const round1 = (value: number) => Math.round(value * 10) / 10;

/** The term's working days, as the monthly ledger counts them. */
export const workingDaysOf = (row: AttendanceRecord) =>
  row.months.reduce((total, month) => total + month.working, 0);

/**
 * Days the record was credited as present.
 *
 * This is the panel's own "Effective Present N of M" figure, and it is the
 * numerator of the attendance rate. It differs from the grid's Present column
 * only where the register credits half days — Kabir Nair's two half days are
 * counted, which is why his ledger sums to 86 against a Present of 84.
 */
export const effectivePresentOf = (row: AttendanceRecord) =>
  row.months.reduce((total, month) => total + month.present, 0);

/** Days marked fully present. The grid's Present column. */
export const presentOf = (row: AttendanceRecord) =>
  workingDaysOf(row) - row.absent - row.leave - row.halfDays;

/** Half days the register credited towards presence; zero on seven of the eight. */
export const halfDayCreditOf = (row: AttendanceRecord) =>
  effectivePresentOf(row) - presentOf(row);

export const attendancePctOf = (row: AttendanceRecord) =>
  round1((effectivePresentOf(row) / workingDaysOf(row)) * 100);

/** Drops the trailing zero the template drops: 100%, not 100.0%. */
export const pctLabel = (value: number) => `${Number.isInteger(value) ? value : value.toFixed(1)}%`;

export const monthPctOf = (month: MonthEntry) => round1((month.present / month.working) * 100);

export const daysMarkedOf = (row: AttendanceRecord) => workingDaysOf(row) - (row.unmarked ?? 0);

/* --------------------------------- Banding --------------------------------- */

/** The attendance band the More Filters panel offers. */
export const bandOf = (row: AttendanceRecord): string => {
  const pct = attendancePctOf(row);
  if (pct >= 100) return '100%';
  if (pct >= 95) return '95% and above';
  if (pct >= 85) return '85% – 95%';
  if (pct >= 75) return '75% – 85%';
  return 'Below 75%';
};

/**
 * The badge beside the percentage.
 *
 * On target reads the same for everyone; short of it, the badge names the line
 * the record has fallen under, and that line is per type — a student's 75%
 * floor, a teacher's department mean, a driver's transport policy.
 */
export const rateBadgeOf = (row: AttendanceRecord): { label: string; tint: string } => {
  const pct = attendancePctOf(row);
  if (pct >= 100) return { label: 'Perfect', tint: 'success' };
  if (pct >= TARGET_PCT) return { label: 'Above target', tint: 'success' };
  if (row.type === 'Teacher') return { label: 'Below department mean', tint: 'warning' };
  if (row.type === 'Staff') {
    return pct < FLOOR_PCT.Staff
      ? { label: 'Below policy', tint: 'danger' }
      : { label: 'Watchlist', tint: 'warning' };
  }
  return pct < FLOOR_PCT.Student
    ? { label: 'Below 75%', tint: 'danger' }
    : { label: 'Watchlist', tint: 'warning' };
};

/** Below the floor its type is held to. What the strip counts as low. */
export const isLowAttendance = (row: AttendanceRecord) =>
  attendancePctOf(row) < FLOOR_PCT[row.type];

/**
 * The status pill.
 *
 * Open exceptions drive it: three or more and the pill names the breach in the
 * record's own terms, two puts it under review, one puts it at risk. A record
 * with nothing open is read on its rate alone — above target is Good, and
 * clear of it is Excellent.
 */
export const statusOf = (row: AttendanceRecord): StatusPill => {
  const open = row.exceptions.length;
  if (open >= 3) {
    if (row.type === 'Student') return 'Low Attendance';
    if (row.type === 'Staff') return 'Policy Violation';
    return 'Under Review';
  }
  if (open === 2) return 'Under Review';
  if (open === 1) return 'At Risk';
  return attendancePctOf(row) > TARGET_PCT + 1 ? 'Excellent' : 'Good';
};

export const statusPill: Record<StatusPill, string> = {
  Excellent: 'is-completed',
  Good: 'is-active',
  'At Risk': 'is-pending',
  'Under Review': 'is-review',
  'Low Attendance': 'is-blocked',
  'Policy Violation': 'is-suspended',
};

export const exceptionLabelOf = (row: AttendanceRecord) => {
  const open = row.exceptions.length;
  if (open === 0) return 'No exceptions';
  return open === 1 ? '1 open exception' : `${open} open exceptions`;
};

/* ---------------------------- The detail panels ---------------------------- */

/** Present → a tick, an absence → a cross, and so on down the timeline. */
export const timelineTone = (kind: TimelineEvent['kind']): { tint: string; icon: string } => {
  switch (kind) {
    case 'Present':
      return { tint: 'success', icon: 'ti ti-check' };
    case 'Absent':
      return { tint: 'danger', icon: 'ti ti-x' };
    case 'Late':
    case 'Late arrival':
      return { tint: 'warning', icon: 'ti ti-clock-exclamation' };
    case 'Half day':
      return { tint: 'warning', icon: 'ti ti-clock-half-2' };
    case 'Holiday':
      return { tint: 'secondary', icon: 'ti ti-calendar-off' };
    default:
      return { tint: 'info', icon: 'ti ti-calendar-minus' };
  }
};

/**
 * The line under the monthly ledger.
 *
 * A perfect record gets its streak, a falling one gets how far it has fallen,
 * and a teacher or staff record is read against its department instead — which
 * is what their panels print. Everything else gets its best and weakest month.
 */
export const ledgerNoteOf = (row: AttendanceRecord): FactLine => {
  const pcts = row.months.map(monthPctOf);

  if (row.type !== 'Student') {
    const mean = DEPARTMENT_MEAN[row.group] ?? 0;
    const gap = round1(attendancePctOf(row) - mean);
    return {
      label: 'Department Mean',
      value: `${pctLabel(mean)}`,
      hint: `${gap >= 0 ? 'above' : 'below'} by ${Math.abs(gap).toFixed(1)}`,
    };
  }

  if (pcts.every((pct) => pct >= 100)) {
    return { label: 'Streak', value: `${workingDaysOf(row)} working days` };
  }

  const falling = pcts.every((pct, index) => index === 0 || pct <= pcts[index - 1]);
  if (falling) {
    const drop = round1(pcts[0] - pcts[pcts.length - 1]);
    return drop >= 15
      ? { label: 'Trend', value: 'Falling', hint: `${row.months.length} months` }
      : { label: 'Trend', value: 'Slipping' };
  }

  const best = row.months.reduce((a, b) => (monthPctOf(b) > monthPctOf(a) ? b : a));
  const weakest = row.months.reduce((a, b) => (monthPctOf(b) < monthPctOf(a) ? b : a));
  return {
    label: 'Best / Weakest',
    value: `${best.month.split(' ')[0]} ${pctLabel(monthPctOf(best))}`,
    hint: `${weakest.month.split(' ')[0]} ${pctLabel(monthPctOf(weakest))}`,
  };
};

/**
 * The third line of the Working Days Analysis panel, which says whichever of
 * these three the record has: credited half days, unmarked days, or days
 * worked on a declared holiday.
 */
export const workingDaysNoteOf = (row: AttendanceRecord): FactLine => {
  const credit = halfDayCreditOf(row);
  if (credit > 0) {
    return {
      label: 'Half Days Counted',
      value: `${row.halfDays}`,
      hint: `credited as ${credit} ${credit === 1 ? 'day' : 'days'}`,
    };
  }
  if (row.unmarked) {
    return { label: 'Unmarked Days', value: `${row.unmarked}` };
  }
  if (row.dutyDays) {
    return { label: 'Duty Days', value: `${row.dutyDays}`, hint: 'on declared holidays' };
  }
  return { label: 'Unmarked Days', value: '0' };
};

/** Students carry a 12-day allowance; the leave taken is the ledger's own. */
export const leaveBalanceOf = (row: AttendanceRecord) => 12 - row.leave;

export const averageDelayLabel = (row: AttendanceRecord) =>
  row.lateMarks === 0 ? '—' : `${row.averageDelay} min`;

/**
 * The last line of the late-arrival panel.
 *
 * Students are held to a monthly count and the panel prints the allowance, or
 * says it has been breached once the record carries a late-threshold exception.
 * Teachers and staff are held to a grace window instead, which is a fact of
 * their shift rather than a count, so it stays in `lateFacts`.
 */
export const lateThresholdOf = (row: AttendanceRecord): FactLine | null => {
  if (row.type !== 'Student') return null;
  const breached = row.exceptions.some((item) => item.toLowerCase().startsWith('late threshold'));
  return breached
    ? { label: 'Policy Threshold', value: 'Breached', hint: `${LATE_THRESHOLD} in a month` }
    : { label: 'Policy Threshold', value: `${LATE_THRESHOLD} in a month` };
};

/* -------------------------------- The filters ------------------------------- */

export const searchIndexOf = (row: AttendanceRecord) =>
  [row.name, row.code, row.group, row.unit, row.unitNote, row.role, row.type]
    .join(' ')
    .toLowerCase();

export const shiftOptions = [
  'Morning · 7:30 AM',
  'General · 8:30 AM',
  'Afternoon · 12:30 PM',
  'Evening · 2:30 PM',
];

export const classOptions = ['Class V', 'Class VII', 'Class VIII', 'Class IX', 'Class X'];
export const sectionOptions = ['A', 'B', 'C', 'D'];
export const departmentOptions = [
  'Mathematics',
  'Science',
  'Languages',
  'Administration',
  'Transport',
  'Housekeeping',
];
export const designationOptions = [
  'Senior Teacher',
  'TGT',
  'PGT',
  'Lab Assistant',
  'Office Executive',
  'Driver',
];
export const statusFilterOptions = ['Present', 'Absent', 'Late', 'Half Day', 'Leave', 'Holiday'];
export const academicYearOptions = ['2026-2027', '2025-2026', '2024-2025'];
export const workingDayOptions = [
  'Term 1 · 96 days',
  'July 2026 · 24 days',
  'Half Yearly · 118 days',
  'Custom range',
];
export const recordTypeOptions: RecordType[] = ['Student', 'Teacher', 'Staff'];
export const bandOptions = ['100%', '95% and above', '85% – 95%', '75% – 85%', 'Below 75%'];

/** Students file under their class, everyone else under their department. */
export const classOf = (row: AttendanceRecord) => (row.type === 'Student' ? row.group : '');
export const departmentOf = (row: AttendanceRecord) => (row.type === 'Student' ? '' : row.group);
export const sectionOf = (row: AttendanceRecord) =>
  row.type === 'Student' ? row.unit.replace('Section ', '') : '';
export const designationOf = (row: AttendanceRecord) => (row.type === 'Student' ? '' : row.unit);
