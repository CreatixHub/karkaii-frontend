export interface DetailField {
  label: string;
  value: string;
}

export const profile = {
  name: 'Aaralyn Maria',
  avatar: 'assets/img/students/student-01.jpg',
  admissionNo: 'ADM202501',
  status: { label: 'Pending', className: 'badge-soft-warning' },
  classApplied: 'I',
  academicYear: '2024 / 2025',
  appliedDate: '02 Jul 2026',
  parentName: 'Antony Maria',
  parentPhone: '+1 65465 21345',
};

export interface SummaryCard {
  id: string;
  accent: string;
  icon: string;
  label: string;
  kind: 'badge' | 'text';
  value: string;
  valueClassName?: string;
  avatar?: string;
}

export const summaryCards: SummaryCard[] = [
  { id: 'status', accent: 'bg-warning-transparent text-warning', icon: 'ti ti-clipboard-check', label: 'Admission Status', kind: 'badge', value: 'Pending', valueClassName: 'badge-soft-warning' },
  { id: 'stage', accent: 'bg-info-transparent text-info', icon: 'ti ti-file-search', label: 'Application Stage', kind: 'text', value: 'Under Review' },
  { id: 'fee', accent: 'bg-danger-transparent text-danger', icon: 'ti ti-report-money', label: 'Fee Status', kind: 'badge', value: 'Unpaid', valueClassName: 'badge-soft-danger' },
  { id: 'interview', accent: 'bg-secondary-transparent text-secondary', icon: 'ti ti-calendar-event', label: 'Interview Status', kind: 'badge', value: 'Not Scheduled', valueClassName: 'badge-soft-secondary' },
  { id: 'documents', accent: 'bg-primary-transparent text-primary', icon: 'ti ti-file-check', label: 'Documents', kind: 'text', value: '2 / 3 Verified' },
  { id: 'counselor', accent: '', icon: '', label: 'Counselor', kind: 'text', value: 'Teena Mathew', avatar: 'assets/img/profiles/avatar-27.jpg' },
];

export const overview = {
  completeness: 60,
  basics: [
    { label: 'Class Applied', value: 'I' },
    { label: 'Academic Year', value: '2024 / 2025' },
    { label: 'Gender', value: 'Female' },
    { label: 'Date of Birth', value: '10 Jan 2018' },
    { label: 'Applied On', value: '02 Jul 2026' },
    { label: 'Assigned Staff', value: 'Teena Mathew' },
  ] as DetailField[],
};

export interface DetailTab {
  id: string;
  label: string;
  icon: string;
}

export const detailTabs: DetailTab[] = [
  { id: 'personal', label: 'Personal', icon: 'ti ti-user' },
  { id: 'academic', label: 'Academic', icon: 'ti ti-book' },
  { id: 'medical', label: 'Medical', icon: 'ti ti-heartbeat' },
  { id: 'guardian', label: 'Guardian', icon: 'ti ti-users' },
  { id: 'emergency', label: 'Emergency', icon: 'ti ti-phone-call' },
  { id: 'transport', label: 'Transport', icon: 'ti ti-bus' },
  { id: 'hostel', label: 'Hostel', icon: 'ti ti-building-fortress' },
  { id: 'previous', label: 'Previous School', icon: 'ti ti-school' },
  { id: 'documents', label: 'Documents', icon: 'ti ti-files' },
  { id: 'interview', label: 'Interview', icon: 'ti ti-calendar-event' },
  { id: 'fees', label: 'Fees', icon: 'ti ti-report-money' },
  { id: 'timeline', label: 'Timeline', icon: 'ti ti-timeline-event' },
  { id: 'notes', label: 'Notes', icon: 'ti ti-notes' },
  { id: 'activity', label: 'Activity', icon: 'ti ti-activity' },
];

export const personalDetails: DetailField[] = [
  { label: 'First Name', value: 'Aaralyn' },
  { label: 'Last Name', value: 'Maria' },
  { label: 'Gender', value: 'Female' },
  { label: 'Date of Birth', value: '10 Jan 2018' },
  { label: 'Blood Group', value: 'O+' },
  { label: 'Religion', value: 'Christian' },
  { label: 'Nationality', value: 'American' },
  { label: 'Mother Tongue', value: 'English' },
];
export const personalAddress = '3521 Franklin Street, New York, NY 10001';

export const academicDetails: DetailField[] = [
  { label: 'Class Applied', value: 'I' },
  { label: 'Section Preference', value: 'A' },
  { label: 'Academic Year', value: '2024 / 2025' },
  { label: 'Admission Type', value: 'New Admission' },
  { label: 'Second Language', value: 'Spanish' },
];

export const medicalDetails: DetailField[] = [
  { label: 'Blood Group', value: 'O+' },
  { label: 'Allergies', value: 'None' },
  { label: 'Medical Conditions', value: 'None' },
  { label: 'Medications', value: 'N/A' },
];
export const medicalDoctorContact = 'Dr. Smith · +1 65465 10000';

export interface GuardianCard {
  name: string;
  role: string;
  avatar: string;
  phone: string;
  email: string;
  occupation: string;
}

export const guardians: GuardianCard[] = [
  { name: 'Antony Maria', role: 'Father', avatar: 'assets/img/profiles/avatar-27.jpg', phone: '+1 65465 21345', email: 'antony@example.com', occupation: 'Business Owner' },
  { name: 'Sara Maria', role: 'Mother', avatar: 'assets/img/profiles/avatar-23.jpg', phone: '+1 65465 21346', email: 'sara@example.com', occupation: 'Teacher' },
];

export const emergencyDetails: DetailField[] = [
  { label: 'Contact Name', value: 'Robert Maria' },
  { label: 'Relationship', value: 'Uncle' },
  { label: 'Phone', value: '+1 65465 78900' },
  { label: 'Alternate Phone', value: '+1 65465 78901' },
];

export const transportDetails: DetailField[] = [
  { label: 'Transport Required', value: 'Yes' },
  { label: 'Route', value: 'Route 12 - Downtown' },
  { label: 'Pickup Point', value: 'Franklin Street' },
  { label: 'Vehicle', value: 'Bus 04 (KA-01-2345)' },
];

export const hostelDetails: DetailField[] = [
  { label: 'Hostel Required', value: 'No' },
  { label: 'Hostel Name', value: 'N/A' },
  { label: 'Room Type', value: 'N/A' },
];

export const previousSchoolDetails: DetailField[] = [
  { label: 'School Name', value: 'Little Angels Pre-School' },
  { label: 'Board', value: 'State Board' },
  { label: 'Last Class', value: 'UKG' },
  { label: 'TC Number', value: 'TC-2025-0091' },
];

export interface DocumentCard {
  id: string;
  icon: string;
  iconAccent: string;
  title: string;
  status: { label: string; className: string };
  meta: string;
  action: 'preview' | 'upload';
}

export const documentCards: DocumentCard[] = [
  { id: 'birth', icon: 'ti ti-file-type-pdf', iconAccent: 'bg-danger-transparent text-danger', title: 'Birth Certificate', status: { label: 'Verified', className: 'badge-soft-success' }, meta: '02 Jul 2026', action: 'preview' },
  { id: 'aadhar', icon: 'ti ti-file-type-jpg', iconAccent: 'bg-info-transparent text-info', title: 'Aadhar / ID Proof', status: { label: 'Pending', className: 'badge-soft-warning' }, meta: '02 Jul 2026', action: 'preview' },
  { id: 'transfer', icon: 'ti ti-file', iconAccent: 'bg-secondary-transparent text-secondary', title: 'Transfer Certificate', status: { label: 'Not Uploaded', className: 'badge-soft-secondary' }, meta: 'Not uploaded', action: 'upload' },
];

export interface FeeSummary {
  total: string;
  paid: string;
  balance: string;
}

export const feeSummary: FeeSummary = { total: '$1,500', paid: '$0', balance: '$1,500' };

export interface TimelineEntry {
  title: string;
  meta: string;
  icon: string;
  tone: 'success' | 'primary' | 'pending';
}

export const admissionTimeline: TimelineEntry[] = [
  { title: 'Application Submitted', meta: 'by Admin · 02 Jul 2026, 10:24 AM', icon: 'ti ti-check', tone: 'success' },
  { title: 'Documents Uploaded', meta: 'by Parent · 02 Jul 2026, 11:05 AM', icon: 'ti ti-check', tone: 'success' },
  { title: 'Under Review', meta: 'Assigned to Teena Mathew · In progress', icon: 'ti ti-clock', tone: 'primary' },
  { title: 'Interview', meta: 'Pending', icon: 'ti ti-calendar-event', tone: 'pending' },
  { title: 'Enrollment', meta: 'Pending', icon: 'ti ti-user-check', tone: 'pending' },
];

export interface NoteEntry {
  avatar: string;
  text: string;
  meta: string;
}

export const notes: NoteEntry[] = [
  { avatar: 'assets/img/profiles/avatar-27.jpg', text: 'Followed up with parent regarding pending ID proof.', meta: 'Teena Mathew · 2h ago' },
  { avatar: 'assets/img/profiles/avatar-23.jpg', text: 'Application looks complete except TC.', meta: 'Daniel Josua · Yesterday' },
];

export interface ActivityEntry {
  icon: string;
  iconAccent: string;
  title: string;
  meta: string;
}

export const activityHistory: ActivityEntry[] = [
  { icon: 'ti ti-mail', iconAccent: 'bg-soft-primary', title: 'Acknowledgement email sent', meta: 'System · 02 Jul 2026, 10:25 AM' },
  { icon: 'ti ti-file-check', iconAccent: 'bg-soft-success', title: 'Birth Certificate verified', meta: 'Teena Mathew · 02 Jul 2026, 02:10 PM' },
  { icon: 'ti ti-user-plus', iconAccent: 'bg-soft-info', title: 'Assigned to Teena Mathew', meta: 'Admin · 02 Jul 2026, 10:30 AM' },
];

export const quickActions = [
  { id: 'interview', label: 'Schedule Interview', icon: 'ti ti-calendar-event' },
  { id: 'fees', label: 'Collect Fees', icon: 'ti ti-report-money' },
  { id: 'email', label: 'Send Email', icon: 'ti ti-mail' },
  { id: 'waitlist', label: 'Move to Waitlist', icon: 'ti ti-hourglass' },
] as const;

export const moreActions = [
  { id: 'letter', label: 'Generate Admission Letter', icon: 'ti ti-file-text' },
  { id: 'fees', label: 'Collect Fees', icon: 'ti ti-report-money' },
  { id: 'documents', label: 'Verify Documents', icon: 'ti ti-file-check' },
  { id: 'interview', label: 'Schedule Interview', icon: 'ti ti-calendar-event' },
  { id: 'download', label: 'Download PDF', icon: 'ti ti-file-type-pdf' },
] as const;

/** The ten dialogs shipped with `admission-details.html`. */
export type AdmissionDetailsModalId =
  | 'collectFees'
  | 'rejectApplication'
  | 'waitlistApplication'
  | 'scheduleInterview'
  | 'assignStaff'
  | 'sendEmail'
  | 'sendSms'
  | 'importApplications'
  | 'delete'
  | 'uploadDocument';
