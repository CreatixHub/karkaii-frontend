export interface AlumniProfileSummary {
  name: string;
  avatar: string;
  statusLabel: string;
  batchLine: string;
  currentRole: string;
  currentOrg: string;
  phone: string;
  email: string;
}

export const profile: AlumniProfileSummary = {
  name: 'Jenny Wilson',
  avatar: 'assets/img/profiles/avatar-27.jpg',
  statusLabel: 'Working Professional',
  batchLine: 'Batch 2018-2022 · Science',
  currentRole: 'Software Engineer',
  currentOrg: 'Google · New York, USA',
  phone: '+1 65465 21345',
  email: 'jenny@example.com',
};

export const socialLinks = [
  { id: 'linkedin', icon: 'ti ti-brand-linkedin' },
  { id: 'x', icon: 'ti ti-brand-x' },
  { id: 'github', icon: 'ti ti-brand-github' },
  { id: 'website', icon: 'ti ti-world' },
];

export interface EngagementStat {
  id: string;
  label: string;
  value: string;
  badgeClass: string;
}

export const engagementStats: EngagementStat[] = [
  { id: 'events', label: 'Events Attended', value: '8', badgeClass: 'badge-soft-primary' },
  { id: 'donations', label: 'Total Donations', value: '$2,500', badgeClass: 'badge-soft-success' },
  { id: 'certificates', label: 'Certificates', value: '5', badgeClass: 'badge-soft-info' },
];

export interface ProfileTabDef {
  id: string;
  label: string;
}

export const profileTabs: ProfileTabDef[] = [
  { id: 'al-personal', label: 'Personal' },
  { id: 'al-academic', label: 'Academic' },
  { id: 'al-achievements', label: 'Achievements' },
  { id: 'al-employment', label: 'Employment' },
  { id: 'al-higher', label: 'Higher Studies' },
  { id: 'al-skills', label: 'Skills' },
  { id: 'al-certificates', label: 'Certificates' },
  { id: 'al-events', label: 'Events' },
  { id: 'al-donations', label: 'Donations' },
  { id: 'al-timeline', label: 'Timeline' },
  { id: 'al-notes', label: 'Notes' },
];

export interface DetailField {
  label: string;
  value: string;
}

export const personalDetails: DetailField[] = [
  { label: 'Full Name', value: 'Jenny Wilson' },
  { label: 'Admission No', value: 'AD100234' },
  { label: 'Gender', value: 'Female' },
  { label: 'Date of Birth', value: '14 May 2004' },
];

export const personalAddress = '21 Park Avenue, New York, USA';

export interface AcademicRow {
  cls: string;
  year: string;
  grade: string;
  remarks: string;
}

export const academicHistory: AcademicRow[] = [
  { cls: 'Class X', year: '2020', grade: 'A+', remarks: 'Distinction' },
  { cls: 'Class XII', year: '2022', grade: 'A', remarks: 'School Topper' },
];

export interface AchievementItem {
  icon: string;
  title: string;
  year: string;
}

export const achievements: AchievementItem[] = [
  { icon: 'ti ti-award', title: 'National Science Olympiad - Gold Medal', year: '2021' },
  { icon: 'ti ti-medal', title: 'School Topper - Class XII', year: '2022' },
];

export interface RoleItem {
  icon: string;
  title: string;
  org: string;
}

export const employmentHistory: RoleItem[] = [
  { icon: 'ti ti-briefcase', title: 'Software Engineer', org: 'Google · 2023 - Present · New York, USA' },
  { icon: 'ti ti-briefcase', title: 'Software Intern', org: 'Microsoft · 2022 - 2023 · Seattle, USA' },
];

export const higherStudies: RoleItem[] = [{ icon: 'ti ti-book', title: 'B.Tech Computer Science', org: 'MIT · 2022 - 2026' }];

export const skills: string[] = ['JavaScript', 'Python', 'React', 'Machine Learning', 'Cloud (GCP)'];

export interface CertificateItem {
  title: string;
  meta: string;
}

export const certificates: CertificateItem[] = [
  { title: 'Google Cloud Certified', meta: '1.1 MB · PDF' },
  { title: 'AWS Solutions Architect', meta: '0.9 MB · PDF' },
];

export interface EventRow {
  name: string;
  date: string;
  role: string;
  status: string;
}

export const eventsAttended: EventRow[] = [
  { name: 'Annual Alumni Meet 2025', date: '12 Mar 2025', role: 'Speaker', status: 'Attended' },
  { name: 'Tech Career Fair', date: '05 Nov 2024', role: 'Mentor', status: 'Attended' },
];

export interface DonationSummaryTile {
  id: string;
  label: string;
  value: string;
  valueClass?: string;
}

export const donationSummary: DonationSummaryTile[] = [
  { id: 'total', label: 'Total Donated', value: '$2,500', valueClass: 'text-success' },
  { id: 'count', label: 'Donations', value: '3' },
  { id: 'last', label: 'Last Gift', value: 'Mar 2025' },
];

export interface DonationRow {
  amount: string;
  purpose: string;
  date: string;
  receipt: string;
}

export const donationRows: DonationRow[] = [
  { amount: '$1,500', purpose: 'Scholarship Fund', date: '12 Mar 2025', receipt: 'RCPT-0451' },
  { amount: '$1,000', purpose: 'Library Renovation', date: '20 Jun 2024', receipt: 'RCPT-0322' },
];

export interface TimelineItem {
  icon: string;
  bg: string;
  title: string;
  when: string;
}

export const timelineItems: TimelineItem[] = [
  { icon: 'ti ti-school', bg: 'bg-success', title: 'Graduated - Class XII', when: '2022' },
  { icon: 'ti ti-book', bg: 'bg-info', title: 'Joined MIT - B.Tech CS', when: '2022' },
  { icon: 'ti ti-briefcase', bg: 'bg-primary', title: 'Joined Google as Software Engineer', when: '2023' },
];

export interface NoteItem {
  avatar: string;
  text: string;
  by: string;
}

export const notes: NoteItem[] = [
  { avatar: 'assets/img/profiles/avatar-23.jpg', text: 'Willing to mentor current students in CS.', by: 'Alumni Cell · 3d ago' },
];

export type AlumniProfileModalId = 'sendEmail' | 'addDonation';
