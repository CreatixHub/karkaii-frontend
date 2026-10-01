export interface MarkRow {
  img: string;
  name: string;
  roll: string;
  initial: 'present' | 'late' | 'absent';
}

export const takeAttendanceClasses = ['Grade III', 'Grade IV', 'Grade VI'];
export const takeAttendanceSections = ['A', 'B', 'C'];
export const takeAttendanceSessions = ['Period 3 · 10:15', 'Post-lunch · 13:00'];

export const takeAttendanceRows: MarkRow[] = [
  { img: 'assets/img/students/student-01.jpg', name: 'Janet Daniel', roll: 'Roll 35013', initial: 'present' },
  { img: 'assets/img/students/student-02.jpg', name: 'Joann Michael', roll: 'Roll 35014', initial: 'late' },
  { img: 'assets/img/students/student-05.jpg', name: 'Emeley Karen', roll: 'Roll 35015', initial: 'absent' },
  { img: 'assets/img/students/student-07.jpg', name: 'Aaron Kessler', roll: 'Roll 35017', initial: 'absent' },
  { img: 'assets/img/students/student-13.jpg', name: 'Marcus Lee', roll: 'Roll 35019', initial: 'present' },
];

export const bulkScopes = ['Whole class', 'Whole section', 'Selected students', 'Entire school'];
export const bulkClasses = ['Grade III', 'Grade IV', 'Grade VI'];
export const bulkSections = ['All', 'A', 'B'];
export const bulkApplyStatuses = ['Present', 'Absent', 'Half day', 'Holiday', 'Excused'];

export const importSources = ['Biometric device export', 'RFID gate log', 'Manual CSV'];
export const importConflictOptions = ['Keep existing record', 'Overwrite with imported', 'Flag for review'];

export interface ReportQuickAction {
  id: string;
  variant: 'primary' | 'present' | 'late' | 'absent';
  icon: string;
  label: string;
}

export const reportQuickActions: ReportQuickAction[] = [
  { id: 'daily', variant: 'primary', icon: 'ti ti-calendar-stats', label: 'Daily Register' },
  { id: 'monthly', variant: 'present', icon: 'ti ti-chart-bar', label: 'Monthly Summary' },
  { id: 'late', variant: 'late', icon: 'ti ti-clock-exclamation', label: 'Late Arrivals' },
  { id: 'defaulters', variant: 'absent', icon: 'ti ti-user-x', label: 'Defaulters' },
];

export const reportFormats = ['Excel (.xlsx)', 'CSV', 'PDF'];

export const leaveModalStats: { count: number; label: string; variant: 'late' | 'present' | 'absent' }[] = [
  { count: 18, label: 'Pending', variant: 'late' },
  { count: 126, label: 'Approved', variant: 'present' },
  { count: 9, label: 'Rejected', variant: 'absent' },
];

export interface LeaveModalLine {
  img: string;
  name: string;
  detail: string;
  hasDoc?: boolean;
}

export const leaveModalLines: LeaveModalLine[] = [
  {
    img: 'assets/img/students/student-05.jpg',
    name: 'Emeley Karen · Grade IV-B',
    detail: 'Medical · 22–24 Jul · viral fever',
    hasDoc: true,
  },
  { img: 'assets/img/students/student-11.jpg', name: 'Ella Simpson · Grade IX-A', detail: 'Family function · 24 Jul' },
  { img: 'assets/img/students/student-09.jpg', name: 'Daniel Josh · Grade VI-B', detail: 'Emergency · today · no document' },
  {
    img: 'assets/img/students/student-03.jpg',
    name: 'Sophia Ray · Grade VIII-B',
    detail: 'Medical · 25–26 Jul · dental',
    hasDoc: true,
  },
  { img: 'assets/img/students/student-13.jpg', name: 'Marcus Lee · Grade XII-A', detail: 'Half day · today · exam counselling' },
];

export const notifyModalStats: { count: number; label: string; variant: 'absent' | 'late' | 'present' }[] = [
  { count: 12, label: 'Absent', variant: 'absent' },
  { count: 5, label: 'Late', variant: 'late' },
  { count: 7, label: 'Replied', variant: 'present' },
];

export const notifyAudiences = ['Guardians of absentees (12)', 'Guardians of late arrivals (5)', 'Selected students'];
export const notifyChannels = ['SMS + Email + App', 'SMS only', 'Email only'];
export const notifyDefaultMessage =
  "Your ward was marked absent for today's session on 22 July 2025. Please respond through the parent portal or contact the class teacher.";

export const advancedHouses = ['Any', 'Red', 'Blue', 'Green', 'Yellow'];
export const advancedTransport = ['Any', 'Bus users', 'Day scholars'];
export const advancedResidence = ['Any', 'Boarders', 'Day scholars'];
export const advancedAttendancePct = ['Any', 'Below 75%', '75–90%', 'Above 90%'];

export const settingsNotifyOptions = ['On absence and late arrival', 'On absence only', 'Disabled'];
export const settingsModeOptions = ['Session-wise', 'Period-wise', 'Daily once'];
