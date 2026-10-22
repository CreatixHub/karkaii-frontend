export type StudentAttendanceModalId =
  | 'att_take'
  | 'att_bulk'
  | 'att_import'
  | 'att_report'
  | 'att_leave'
  | 'att_notify'
  | 'att_advanced'
  | 'att_settings';

export interface SavedView {
  id: 'today' | 'absent' | 'late' | 'leave' | 'risk' | 'missing';
  label: string;
  count: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'today', label: 'Today', count: '1,329', icon: 'ti ti-calendar-event' },
  { id: 'absent', label: 'Absentees', count: '12', icon: 'ti ti-user-x' },
  { id: 'late', label: 'Late', count: '5', icon: 'ti ti-clock-exclamation' },
  { id: 'leave', label: 'On Leave', count: '26', icon: 'ti ti-calendar-off' },
  { id: 'risk', label: 'At Risk', count: '8', icon: 'ti ti-alert-triangle' },
  { id: 'missing', label: 'Not Marked', count: '14', icon: 'ti ti-help-circle' },
];

export interface SelectField {
  id: string;
  label: string;
  ariaLabel: string;
  options: string[];
}

export const filterSelects: SelectField[] = [
  { id: 'year', label: 'Year', ariaLabel: 'Academic year', options: ['2024–2025', '2023–2024'] },
  { id: 'term', label: 'Term', ariaLabel: 'Term', options: ['Term II', 'Term I', 'Term III'] },
  {
    id: 'class',
    label: 'Class',
    ariaLabel: 'Class',
    options: ['All classes', 'Grade III', 'Grade VI', 'Grade IX'],
  },
  { id: 'section', label: 'Section', ariaLabel: 'Section', options: ['All', 'A', 'B', 'C'] },
  {
    id: 'subject',
    label: 'Subject',
    ariaLabel: 'Subject',
    options: ['All subjects', 'Mathematics', 'Science', 'English'],
  },
  {
    id: 'teacher',
    label: 'Teacher',
    ariaLabel: 'Teacher',
    options: ['All teachers', 'Ms. Teresa Susan', 'Mr. John Doe'],
  },
  {
    id: 'status',
    label: 'Status',
    ariaLabel: 'Attendance status',
    options: ['Any status', 'Present', 'Absent', 'Late', 'Half day', 'On leave'],
  },
];

export const defaultFilterDate = '22-07-2025';

export interface FilterChip {
  id: string;
  label: string;
}

export const initialFilterChips: FilterChip[] = [
  { id: 'house', label: 'House: Red' },
  { id: 'transport', label: 'Transport: Route 12' },
  { id: 'session', label: 'Session: Morning' },
];

export type DetailAccent = 'info' | 'late' | 'leave' | 'absent' | 'present' | 'violet' | 'muted' | 'warn';

export interface DetailLine {
  icon: string;
  variant: DetailAccent;
  title: string;
  subtitle: string;
  hasDoc?: boolean;
}

export interface GuardianLine {
  img: string;
  name: string;
  relation: string;
  phone: string;
}

export interface StatFact {
  variant: 'present' | 'absent' | 'late' | 'leave';
  count: number;
  label: string;
}

export interface TeacherRemark {
  img?: string;
  icon?: string;
  variant?: DetailAccent;
  name: string;
  note: string;
}

export interface QuickAction {
  icon: string;
  label: string;
  kind: 'mark' | 'leave' | 'export' | 'notify';
}

export interface AttendanceDrawer {
  heatKey: '1' | '2' | '3' | '4' | '5';
  ytdBadge: string;
  houseBadge: string;
  guardian: GuardianLine;
  secondaryHeading: string;
  secondaryIcon: string;
  secondary: DetailLine;
  stats: StatFact[];
  recordsHeading: string;
  records: DetailLine[];
  remarks: TeacherRemark[];
  actions: QuickAction[];
}

export interface AttendanceRecord {
  id: number;
  statusAttr: string;
  img: string;
  name: string;
  houseLine: string;
  admissionNo: string;
  rollNo: string;
  klass: string;
  section: string;
  status: { variant: DetailAccent | 'half'; icon: string; label: string };
  checkIn?: { time: string; note: string };
  checkOut?: { time: string; note: string };
  lateMin?: string;
  leave?: { label: string; variant: 'muted' | 'present' };
  pct: { value: string; variant: 'good' | 'bad' | 'warn' };
  remark: { text: string; warning?: boolean };
  detail: AttendanceDrawer;
}

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: 1,
    statusAttr: 'present',
    img: 'assets/img/students/student-01.jpg',
    name: 'Janet Daniel',
    houseLine: 'Red House · Route 12',
    admissionNo: 'AD1256589',
    rollNo: '35013',
    klass: 'Grade III',
    section: 'A',
    status: { variant: 'present', icon: 'ti ti-circle-check', label: 'Present' },
    checkIn: { time: '08:02', note: 'Gate 2' },
    checkOut: { time: '15:30', note: 'Bus' },
    pct: { value: '96%', variant: 'good' },
    remark: { text: 'On time all week' },
    detail: {
      heatKey: '1',
      ytdBadge: '96% YTD',
      houseBadge: 'Red House',
      guardian: { img: 'assets/img/profiles/avatar-27.jpg', name: 'Robert Daniel', relation: 'Father', phone: '+1 4587 220' },
      secondaryHeading: 'Transport',
      secondaryIcon: 'ti ti-bus',
      secondary: {
        icon: 'ti ti-bus',
        variant: 'info',
        title: 'Route 12 · BUS-04',
        subtitle: 'Pickup 07:41 · Drop 15:30',
      },
      stats: [
        { variant: 'present', count: 142, label: 'Present' },
        { variant: 'absent', count: 4, label: 'Absent' },
        { variant: 'late', count: 2, label: 'Late' },
        { variant: 'leave', count: 3, label: 'Leave' },
      ],
      recordsHeading: 'Late & Leave Records',
      records: [
        { icon: 'ti ti-clock', variant: 'late', title: 'Late by 12 min', subtitle: '14 Jul · traffic on Route 12' },
        { icon: 'ti ti-stethoscope', variant: 'leave', title: 'Medical leave · 2 days', subtitle: '02–03 Jul · approved' },
        { icon: 'ti ti-calendar-off', variant: 'leave', title: 'Family function · 1 day', subtitle: '18 Jun · approved' },
      ],
      remarks: [
        {
          img: 'assets/img/teachers/teacher-01.jpg',
          name: 'Ms. Teresa Susan',
          note: 'Punctual and consistent this term.',
        },
        {
          icon: 'ti ti-award',
          variant: 'present',
          name: 'Behaviour note',
          note: 'Perfect attendance award · October',
        },
      ],
      actions: [
        { icon: 'ti ti-checkbox', label: 'Update status', kind: 'mark' },
        { icon: 'ti ti-calendar-off', label: 'Apply leave', kind: 'leave' },
        { icon: 'ti ti-download', label: 'Register', kind: 'export' },
      ],
    },
  },
  {
    id: 2,
    statusAttr: 'late',
    img: 'assets/img/students/student-02.jpg',
    name: 'Joann Michael',
    houseLine: 'Blue House · Route 07',
    admissionNo: 'AD1256590',
    rollNo: '35014',
    klass: 'Grade III',
    section: 'A',
    status: { variant: 'late', icon: 'ti ti-clock-exclamation', label: 'Late' },
    checkIn: { time: '08:34', note: 'Gate 1' },
    checkOut: { time: '15:30', note: 'Bus' },
    lateMin: '19',
    pct: { value: '91%', variant: 'good' },
    remark: { text: '3rd late this month' },
    detail: {
      heatKey: '2',
      ytdBadge: '91% YTD',
      houseBadge: 'Blue House',
      guardian: { img: 'assets/img/profiles/avatar-23.jpg', name: 'Sarah Michael', relation: 'Mother', phone: '+1 4587 331' },
      secondaryHeading: 'Transport',
      secondaryIcon: 'ti ti-bus',
      secondary: {
        icon: 'ti ti-bus',
        variant: 'info',
        title: 'Route 07 · BUS-02',
        subtitle: 'Pickup 07:55 · frequently delayed',
      },
      stats: [
        { variant: 'present', count: 134, label: 'Present' },
        { variant: 'absent', count: 7, label: 'Absent' },
        { variant: 'late', count: 9, label: 'Late' },
        { variant: 'leave', count: 1, label: 'Leave' },
      ],
      recordsHeading: 'Late & Leave Records',
      records: [
        { icon: 'ti ti-clock', variant: 'late', title: 'Late by 19 min', subtitle: 'Today · bus delay on Route 07' },
        { icon: 'ti ti-clock', variant: 'late', title: 'Late by 11 min', subtitle: '15 Jul · bus delay' },
        { icon: 'ti ti-clock', variant: 'late', title: 'Late by 8 min', subtitle: '08 Jul · personal' },
      ],
      remarks: [
        {
          img: 'assets/img/teachers/teacher-01.jpg',
          name: 'Ms. Teresa Susan',
          note: 'Repeated bus delays — discuss route change with parents.',
        },
        {
          icon: 'ti ti-alert-triangle',
          variant: 'late',
          name: 'Pattern flagged',
          note: '9 late arrivals, all Route 07 mornings',
        },
      ],
      actions: [
        { icon: 'ti ti-checkbox', label: 'Update status', kind: 'mark' },
        { icon: 'ti ti-message', label: 'Notify guardian', kind: 'notify' },
        { icon: 'ti ti-download', label: 'Register', kind: 'export' },
      ],
    },
  },
  {
    id: 3,
    statusAttr: 'absent',
    img: 'assets/img/students/student-07.jpg',
    name: 'Aaron Kessler',
    houseLine: 'Green House · Day scholar',
    admissionNo: 'AD1256593',
    rollNo: '35017',
    klass: 'Grade VI',
    section: 'B',
    status: { variant: 'absent', icon: 'ti ti-circle-x', label: 'Absent' },
    leave: { label: 'Unreported', variant: 'muted' },
    pct: { value: '74%', variant: 'bad' },
    remark: { text: '4th absence this month', warning: true },
    detail: {
      heatKey: '3',
      ytdBadge: '74% YTD',
      houseBadge: 'Green House',
      guardian: { img: 'assets/img/profiles/avatar-19.jpg', name: 'Linda Kessler', relation: 'Mother', phone: '+1 4587 118' },
      secondaryHeading: 'Transport',
      secondaryIcon: 'ti ti-walk',
      secondary: { icon: 'ti ti-walk', variant: 'muted', title: 'Day scholar', subtitle: 'No transport assigned' },
      stats: [
        { variant: 'present', count: 105, label: 'Present' },
        { variant: 'absent', count: 28, label: 'Absent' },
        { variant: 'late', count: 6, label: 'Late' },
        { variant: 'leave', count: 4, label: 'Leave' },
      ],
      recordsHeading: 'Late & Leave Records',
      records: [
        { icon: 'ti ti-circle-x', variant: 'absent', title: 'Absent · unreported', subtitle: 'Today · no guardian response' },
        { icon: 'ti ti-circle-x', variant: 'absent', title: 'Absent · 3 days', subtitle: '14–16 Jul · unreported' },
        { icon: 'ti ti-stethoscope', variant: 'leave', title: 'Medical leave · 4 days', subtitle: '01–04 Jul · approved' },
      ],
      remarks: [
        {
          img: 'assets/img/teachers/teacher-02.jpg',
          name: 'Mr. John Doe',
          note: 'Attendance below 75% — counsellor meeting requested.',
        },
        {
          icon: 'ti ti-alert-triangle',
          variant: 'absent',
          name: 'Risk flag',
          note: 'Below the 75% exam-eligibility threshold',
        },
      ],
      actions: [
        { icon: 'ti ti-checkbox', label: 'Update status', kind: 'mark' },
        { icon: 'ti ti-message', label: 'Escalate to parent', kind: 'notify' },
        { icon: 'ti ti-download', label: 'Register', kind: 'export' },
      ],
    },
  },
  {
    id: 4,
    statusAttr: 'leave',
    img: 'assets/img/students/student-05.jpg',
    name: 'Emeley Karen',
    houseLine: 'Yellow House · Boarder',
    admissionNo: 'AD1256591',
    rollNo: '35015',
    klass: 'Grade IV',
    section: 'B',
    status: { variant: 'leave', icon: 'ti ti-stethoscope', label: 'Medical Leave' },
    leave: { label: 'Approved', variant: 'present' },
    pct: { value: '93%', variant: 'good' },
    remark: { text: 'Certificate on file' },
    detail: {
      heatKey: '4',
      ytdBadge: '93% YTD',
      houseBadge: 'Yellow House',
      guardian: { img: 'assets/img/profiles/avatar-25.jpg', name: 'David Karen', relation: 'Father', phone: '+1 4587 442' },
      secondaryHeading: 'Residence',
      secondaryIcon: 'ti ti-building-community',
      secondary: { icon: 'ti ti-bed', variant: 'violet', title: 'Hostel Block B', subtitle: 'Room 214 · warden notified' },
      stats: [
        { variant: 'present', count: 131, label: 'Present' },
        { variant: 'absent', count: 3, label: 'Absent' },
        { variant: 'late', count: 1, label: 'Late' },
        { variant: 'leave', count: 8, label: 'Leave' },
      ],
      recordsHeading: 'Leave Records',
      records: [
        {
          icon: 'ti ti-stethoscope',
          variant: 'leave',
          title: 'Medical leave · 22–24 Jul',
          subtitle: 'Viral fever · certificate attached',
          hasDoc: true,
        },
        { icon: 'ti ti-calendar-off', variant: 'leave', title: 'Family function · 2 days', subtitle: '10–11 Jun · approved' },
        {
          icon: 'ti ti-stethoscope',
          variant: 'leave',
          title: 'Dental appointment · half day',
          subtitle: '28 May · approved',
        },
      ],
      remarks: [
        {
          img: 'assets/img/teachers/teacher-03.jpg',
          name: 'Ms. Rita Owen',
          note: 'Notes shared with the student for missed lessons.',
        },
      ],
      actions: [
        { icon: 'ti ti-eye', label: 'Leave detail', kind: 'leave' },
        { icon: 'ti ti-paperclip', label: 'Certificate', kind: 'mark' },
        { icon: 'ti ti-download', label: 'Register', kind: 'export' },
      ],
    },
  },
  {
    id: 5,
    statusAttr: 'present',
    img: 'assets/img/students/student-13.jpg',
    name: 'Marcus Lee',
    houseLine: 'Red House · Boarder',
    admissionNo: 'AD1256595',
    rollNo: '35019',
    klass: 'Grade XII',
    section: 'A',
    status: { variant: 'half', icon: 'ti ti-clock-hour-6', label: 'Half Day' },
    checkIn: { time: '08:00', note: 'Gate 2' },
    checkOut: { time: '12:15', note: 'Early exit' },
    leave: { label: 'Excused', variant: 'present' },
    pct: { value: '97%', variant: 'good' },
    remark: { text: 'Board exam counselling' },
    detail: {
      heatKey: '5',
      ytdBadge: '97% YTD',
      houseBadge: 'Red House',
      guardian: { img: 'assets/img/profiles/avatar-21.jpg', name: 'Priya Raman', relation: 'Mother', phone: '+1 4587 907' },
      secondaryHeading: 'Residence',
      secondaryIcon: 'ti ti-building-community',
      secondary: { icon: 'ti ti-bed', variant: 'violet', title: 'Hostel Block C', subtitle: 'Room 311 · senior wing' },
      stats: [
        { variant: 'present', count: 138, label: 'Present' },
        { variant: 'absent', count: 2, label: 'Absent' },
        { variant: 'late', count: 0, label: 'Late' },
        { variant: 'leave', count: 2, label: 'Leave' },
      ],
      recordsHeading: 'Early Exit Records',
      records: [
        { icon: 'ti ti-logout', variant: 'late', title: 'Early checkout · 12:15', subtitle: 'Today · board exam counselling' },
        { icon: 'ti ti-logout', variant: 'late', title: 'Early checkout · 13:40', subtitle: '09 Jul · sports selection' },
      ],
      remarks: [
        {
          img: 'assets/img/teachers/teacher-05.jpg',
          name: 'Ms. Nina Patel',
          note: 'Excellent record — eligible for the attendance award.',
        },
        {
          icon: 'ti ti-trophy',
          variant: 'present',
          name: 'Behaviour note',
          note: 'House captain · sets a strong example',
        },
      ],
      actions: [
        { icon: 'ti ti-checkbox', label: 'Update status', kind: 'mark' },
        { icon: 'ti ti-message', label: 'Notify guardian', kind: 'notify' },
        { icon: 'ti ti-download', label: 'Register', kind: 'export' },
      ],
    },
  },
];

/** `HEAT`/`ABSENT` from `student-attendance.js`, copied verbatim so cell colours match. */
export const HEAT: Record<string, number[]> = {
  '1': [3, 4, 4, 2, 4, 0, 0, 4, 3, 4, 4, 4, 1, 0, 4, 4, 3, 4, 4, 2, 0, 4, 4, 4, 3, 4, 4, 1, 4, 3],
  '2': [3, 2, 4, 2, 3, 0, 0, 2, 3, 4, 2, 4, 1, 0, 3, 2, 3, 4, 2, 2, 0, 4, 3, 2, 3, 4, 2, 1, 3, 2],
  '3': [1, 0, 2, 0, 1, 0, 0, 2, 1, 0, 2, 1, 0, 0, 1, 2, 0, 1, 2, 0, 0, 2, 1, 0, 1, 2, 0, 1, 0, 1],
  '4': [4, 4, 3, 4, 4, 0, 0, 4, 4, 3, 4, 4, 2, 0, 4, 4, 4, 3, 4, 4, 0, 4, 4, 4, 3, 4, 0, 0, 0, 4],
  '5': [4, 4, 4, 4, 3, 0, 0, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 3, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  school: [3, 4, 4, 3, 4, 0, 0, 4, 3, 4, 4, 4, 3, 0, 4, 4, 3, 4, 4, 3, 0, 4, 4, 4, 3, 4, 4, 3, 4, 4],
};

export const ABSENT: Record<string, number[]> = {
  '1': [5, 20],
  '2': [5, 13, 20],
  '3': [1, 3, 5, 9, 13, 16, 20, 23, 26],
  '4': [5, 20, 26, 27, 28],
  '5': [5, 13, 20],
  school: [5, 6, 13, 20, 27],
};

export interface PagerButton {
  label: string;
  active?: boolean;
  disabled?: boolean;
  gapBefore?: boolean;
}

export const pagerButtons: PagerButton[] = [
  { label: '1', active: true },
  { label: '2' },
  { label: '3' },
  { label: '266', gapBefore: true },
];

export const rowsPerPageOptions = ['5', '25', '50', '100'];
