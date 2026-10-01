import type { AwardModalId } from './awardsWorkspace.data';

export interface DetailPair {
  label: string;
  value: string;
  /** Some values are rendered as a badge rather than plain text. */
  badgeClass?: string;
}

export interface DocEntry {
  tint: string;
  icon: string;
  title: string;
  meta: string;
}

export interface EmptyState {
  tint: string;
  icon: string;
  title: string;
  hint: string;
}

export interface NoteBadge {
  className: string;
  label: string;
}

export interface DetailAction {
  id: string;
  label: string;
  icon: string;
  variant: 'primary' | 'light';
  target: AwardModalId | 'panel';
}

export interface AchievementDetail {
  profile: DetailPair[];
  achievement: DetailPair[];
  event: DetailPair[];
  certificates: DocEntry[];
  certificatesEmpty?: EmptyState;
  mentor: DetailPair[];
  recognition: DocEntry[];
  remarks: string;
  remarkDocs: DocEntry[];
  noteBadges: NoteBadge[];
  noteText: string;
  actions: DetailAction[];
}

export interface Achievement {
  id: string;
  /** The `.collapse` id the expand button targeted. */
  collapseId: string;
  avatar: string;
  student: string;
  studentSub: string;
  admissionNo: string;
  studentClass: string;
  title: string;
  event: string;
  category: { className: string; icon: string; label: string };
  level: { className: string; label: string; meta: string };
  awardDate: {
    value: string;
    valueClass: string;
    event: string;
    ago: string;
    agoClass: string;
  };
  issuedBy: { name: string; role: string };
  status: { pillClass: string; label: string; meta: string };
  detail: AchievementDetail;
}

/* ------------------------------ Shorthand helpers --------------------------- */

const p = (label: string, value: string, badgeClass?: string): DetailPair => ({
  label,
  value,
  badgeClass,
});

const cert = (title: string, meta: string): DocEntry => ({
  tint: 'bg-success-transparent text-success',
  icon: 'ti ti-certificate',
  title,
  meta,
});

const pdf = (title: string, meta: string): DocEntry => ({
  tint: 'bg-danger-transparent text-danger',
  icon: 'ti ti-file-type-pdf',
  title,
  meta,
});

const award = (tint: string, title: string, meta: string): DocEntry => ({
  tint,
  icon: 'ti ti-award',
  title,
  meta,
});

const trophy = (title: string, meta: string): DocEntry => ({
  tint: 'bg-secondary-transparent text-secondary',
  icon: 'ti ti-trophy',
  title,
  meta,
});

const NOT_ISSUED: EmptyState = {
  tint: 'bg-warning-transparent text-warning',
  icon: 'ti ti-certificate-off',
  title: 'Certificate not yet issued',
  hint: 'Issued once the result is verified',
};

const printAward: DetailAction = {
  id: 'print',
  label: 'Print Award',
  icon: 'ti ti-printer',
  variant: 'primary',
  target: 'print',
};

const uploadCertificate: DetailAction = {
  id: 'upload',
  label: 'Upload Certificate',
  icon: 'ti ti-upload',
  variant: 'primary',
  target: 'upload',
};

const nominate: DetailAction = {
  id: 'nominate',
  label: 'Nominate',
  icon: 'ti ti-star',
  variant: 'primary',
  target: 'nominate',
};

const viewDetails: DetailAction = {
  id: 'view',
  label: 'View Details',
  icon: 'ti ti-eye',
  variant: 'light',
  target: 'view',
};

const editAward: DetailAction = {
  id: 'edit',
  label: 'Edit',
  icon: 'ti ti-edit',
  variant: 'light',
  target: 'edit',
};

const openPanel: DetailAction = {
  id: 'panel',
  label: 'Achievement Panel',
  icon: 'ti ti-trophy',
  variant: 'light',
  target: 'panel',
};

/* --------------------------------- The rows --------------------------------- */

export const achievements: Achievement[] = [
  {
    id: 'ACH-2026-0218',
    collapseId: 'aw_01',
    avatar: 'bg-warning-transparent text-warning',
    student: 'Ananya Rao',
    studentSub: 'Award 3 · 65 points',
    admissionNo: 'AD9887402',
    studentClass: 'X B',
    title: 'State Science Exhibition — First Place',
    event: 'State Level Science Exhibition 2026',
    category: { className: 'badge-soft-warning', icon: 'ti ti-award', label: 'Competition' },
    level: {
      className: 'badge-soft-warning',
      label: 'State',
      meta: 'Winner · 35 recognition points',
    },
    awardDate: {
      value: '18 Jul 2026',
      valueClass: 'd-block fs-13 fw-medium text-nowrap',
      event: 'Event 17 Jul 2026',
      ago: '13 days ago',
      agoClass: 'fs-12 text-muted text-nowrap',
    },
    issuedBy: { name: 'State Science Council', role: 'Regional Coordinator · Ms. Anita Bose' },
    status: {
      pillClass: 'is-completed',
      label: 'Certificate Issued',
      meta: 'SSC-2026-0417',
    },
    detail: {
      profile: [
        p('Student', 'Ananya Rao'),
        p('Admission No.', 'AD9887402'),
        p('Class', 'X B'),
        p('Academic Year', '2026-2027'),
        p('Awards This Year', '3 on the register'),
        p('Recognition Points', '65 points'),
      ],
      achievement: [
        p('Achievement ID', 'ACH-2026-0218'),
        p('Category', 'Competition', 'badge-soft-warning'),
        p('Award Level', 'State', 'badge-soft-warning'),
        p('Placing', 'Winner'),
        p('Points Carried', '35 points'),
        p('Issued By', 'State Science Council'),
      ],
      event: [
        p('Event', 'State Level Science Exhibition 2026'),
        p('Organiser', 'State Science Council'),
        p('Held On', '17 Jul 2026'),
        p('Venue', 'Civic Convention Centre, Hall 2'),
        p('Entry', 'Low cost water filtration using local clay'),
        p('Representing', 'Individual entry'),
      ],
      certificates: [
        cert('Certificate SSC-2026-0417', 'Issued 22 Jul 2026 by State Science Council'),
        pdf('State Science Certificate.pdf', 'SSC-2026-0417 · issued 22 Jul 2026 · 96 KB'),
        pdf('Project Report.pdf', 'Water filtration study · 214 KB'),
      ],
      mentor: [
        p('Mentor', 'Mr. Vikram Sethi'),
        p('Role', 'Science Teacher · Physics and Chemistry'),
        p('Verified By', 'Mrs. Alice Ray'),
        p('Verified On', '20 Jul 2026'),
        p('Issuing Authority', 'Regional Coordinator · Ms. Anita Bose'),
      ],
      recognition: [
        award(
          'bg-warning-transparent text-warning',
          'State Science Exhibition — First Place',
          'Award 3 · 35 points',
        ),
        trophy('District Science Fair — First Place', '12 Mar 2026 · District · Winner · 20 points'),
        trophy('School Science Quiz — Winner', '8 Nov 2025 · School · Winner · 10 points'),
      ],
      remarks:
        'Selected for the national round in October. The project drew a special mention from the judging panel.',
      remarkDocs: [
        pdf('State Science Certificate.pdf', 'SSC-2026-0417 · issued 22 Jul 2026 · 96 KB'),
        pdf('Project Report.pdf', 'Water filtration study · 214 KB'),
      ],
      noteBadges: [
        { className: 'badge-soft-warning', label: 'State' },
        { className: 'badge-soft-warning', label: 'Winner' },
      ],
      noteText:
        'Laboratory access approved for the national round build. Practical work paused while the forearm sutures heal after MV-2026-0511.',
      actions: [printAward, viewDetails, openPanel],
    },
  },
  {
    id: 'ACH-2026-0221',
    collapseId: 'aw_02',
    avatar: 'bg-success-transparent text-success',
    student: 'Aarav Kumar',
    studentSub: 'Award 2 · 24 points',
    admissionNo: 'AD9891255',
    studentClass: 'VII A',
    title: 'Inter-School Athletics — 200m Runner-Up',
    event: 'District Inter-School Athletics Meet',
    category: { className: 'badge-soft-success', icon: 'ti ti-medal', label: 'Sports' },
    level: {
      className: 'badge-soft-primary',
      label: 'District',
      meta: 'Runner-Up · 14 recognition points',
    },
    awardDate: {
      value: '24 Jul 2026',
      valueClass: 'd-block fs-13 fw-medium text-nowrap',
      event: 'Event 24 Jul 2026',
      ago: '7 days ago',
      agoClass: 'fs-12 text-muted text-nowrap',
    },
    issuedBy: { name: 'District Sports Board', role: 'Meet Referee · Mr. Harish Patil' },
    status: { pillClass: 'is-active', label: 'Verified', meta: 'Verified by Mr. Ethan Brooks' },
    detail: {
      profile: [
        p('Student', 'Aarav Kumar'),
        p('Admission No.', 'AD9891255'),
        p('Class', 'VII A'),
        p('Academic Year', '2026-2027'),
        p('Awards This Year', '2 on the register'),
        p('Recognition Points', '24 points'),
      ],
      achievement: [
        p('Achievement ID', 'ACH-2026-0221'),
        p('Category', 'Sports', 'badge-soft-success'),
        p('Award Level', 'District', 'badge-soft-primary'),
        p('Placing', 'Runner-Up'),
        p('Points Carried', '14 points'),
        p('Issued By', 'District Sports Board'),
      ],
      event: [
        p('Event', 'District Inter-School Athletics Meet'),
        p('Organiser', 'District Sports Board'),
        p('Held On', '24 Jul 2026'),
        p('Venue', 'Municipal Athletics Stadium, Track 1'),
        p('Entry', '200 metres, under fourteen boys'),
        p('Representing', 'School athletics squad'),
      ],
      certificates: [],
      certificatesEmpty: NOT_ISSUED,
      mentor: [
        p('Mentor', 'Ms. Deepa Rawat'),
        p('Role', 'Physical Education Teacher · Athletics'),
        p('Verified By', 'Mr. Ethan Brooks'),
        p('Verified On', '27 Jul 2026'),
        p('Issuing Authority', 'Meet Referee · Mr. Harish Patil'),
      ],
      recognition: [
        award(
          'bg-success-transparent text-success',
          'Inter-School Athletics — 200m Runner-Up',
          'Award 2 · 14 points',
        ),
        trophy('School Sports Day — 100m Winner', '19 Feb 2026 · School · Winner · 10 points'),
      ],
      remarks:
        'Personal best by 0.4 seconds. Qualified for the state trials subject to a fitness clearance.',
      remarkDocs: [pdf('Meet Result Sheet.pdf', 'District Sports Board · 74 KB')],
      noteBadges: [
        { className: 'badge-soft-primary', label: 'District' },
        { className: 'badge-soft-success', label: 'Runner-Up' },
      ],
      noteText:
        'Certificate not yet received from the board. State trial entry is on hold while the ankle sprain from MV-2026-0502 is reviewed.',
      actions: [uploadCertificate, printAward, openPanel],
    },
  },
  {
    id: 'ACH-2026-0226',
    collapseId: 'aw_03',
    avatar: 'bg-purple-transparent text-purple',
    student: 'Meera Iyer',
    studentSub: 'Award 3 · 59 points',
    admissionNo: 'AD9893660',
    studentClass: 'V A',
    title: 'Regional Youth Festival — Classical Dance First Place',
    event: 'Regional Youth Cultural Festival 2026',
    category: { className: 'badge-soft-purple', icon: 'ti ti-music', label: 'Cultural' },
    level: {
      className: 'badge-soft-warning',
      label: 'State',
      meta: 'Winner · 35 recognition points',
    },
    awardDate: {
      value: '27 Jul 2026',
      valueClass: 'd-block fs-13 fw-medium text-nowrap',
      event: 'Event 26 Jul 2026',
      ago: '4 days ago',
      agoClass: 'fs-12 text-muted text-nowrap',
    },
    issuedBy: { name: 'State Cultural Academy', role: 'Festival Director · Mrs. Radha Iyengar' },
    status: { pillClass: 'is-completed', label: 'Certificate Issued', meta: 'SCA-2026-0192' },
    detail: {
      profile: [
        p('Student', 'Meera Iyer'),
        p('Admission No.', 'AD9893660'),
        p('Class', 'V A'),
        p('Academic Year', '2026-2027'),
        p('Awards This Year', '3 on the register'),
        p('Recognition Points', '59 points'),
      ],
      achievement: [
        p('Achievement ID', 'ACH-2026-0226'),
        p('Category', 'Cultural', 'badge-soft-purple'),
        p('Award Level', 'State', 'badge-soft-warning'),
        p('Placing', 'Winner'),
        p('Points Carried', '35 points'),
        p('Issued By', 'State Cultural Academy'),
      ],
      event: [
        p('Event', 'Regional Youth Cultural Festival 2026'),
        p('Organiser', 'State Cultural Academy'),
        p('Held On', '26 Jul 2026'),
        p('Venue', 'Academy Auditorium, Main Stage'),
        p('Entry', 'Bharatanatyam solo, junior category'),
        p('Representing', 'Individual entry'),
      ],
      certificates: [
        cert('Certificate SCA-2026-0192', 'Issued 29 Jul 2026 by State Cultural Academy'),
        pdf('Youth Festival Certificate.pdf', 'SCA-2026-0192 · issued 29 Jul 2026 · 88 KB'),
        pdf('Performance Photographs.pdf', 'Festival gallery · 1.2 MB'),
      ],
      mentor: [
        p('Mentor', 'Mrs. Kalpana Menon'),
        p('Role', 'Cultural Coordinator · Dance'),
        p('Verified By', 'Mrs. Alice Ray'),
        p('Verified On', '28 Jul 2026'),
        p('Issuing Authority', 'Festival Director · Mrs. Radha Iyengar'),
      ],
      recognition: [
        award(
          'bg-purple-transparent text-purple',
          'Regional Youth Festival — Classical Dance First Place',
          'Award 3 · 35 points',
        ),
        trophy(
          'District Dance Competition — Runner-Up',
          '3 May 2026 · District · Runner-Up · 14 points',
        ),
        trophy('School Annual Day — Best Performer', '14 Dec 2025 · School · Winner · 10 points'),
      ],
      remarks: 'Invited to perform at the school foundation day assembly in September.',
      remarkDocs: [
        pdf('Youth Festival Certificate.pdf', 'SCA-2026-0192 · issued 29 Jul 2026 · 88 KB'),
        pdf('Performance Photographs.pdf', 'Festival gallery · 1.2 MB'),
      ],
      noteBadges: [
        { className: 'badge-soft-warning', label: 'State' },
        { className: 'badge-soft-purple', label: 'Winner' },
      ],
      noteText:
        'Rehearsals paused this week. The student is in the sick room on VIS-2026-0426 with a febrile illness.',
      actions: [printAward, viewDetails, openPanel],
    },
  },
  {
    id: 'ACH-2026-0231',
    collapseId: 'aw_04',
    avatar: 'bg-primary-transparent text-primary',
    student: 'Rohan Desai',
    studentSub: 'Award 3 · 35 points',
    admissionNo: 'AD9889014',
    studentClass: 'IX C',
    title: 'National Mathematics Olympiad — Merit Certificate',
    event: 'National Mathematics Olympiad, Stage 2',
    category: {
      className: 'badge-soft-primary',
      icon: 'ti ti-school',
      label: 'Academic Excellence',
    },
    level: {
      className: 'badge-soft-danger',
      label: 'National',
      meta: 'Merit · 20 recognition points',
    },
    awardDate: {
      value: '20 Jul 2026',
      valueClass: 'd-block fs-13 fw-medium text-nowrap',
      event: 'Event 5 Jul 2026',
      ago: '11 days ago',
      agoClass: 'fs-12 text-muted text-nowrap',
    },
    issuedBy: {
      name: 'National Mathematics Foundation',
      role: 'Examination Board · Dr. S. Raghavan',
    },
    status: { pillClass: 'is-completed', label: 'Certificate Issued', meta: 'NMF-2026-1188' },
    detail: {
      profile: [
        p('Student', 'Rohan Desai'),
        p('Admission No.', 'AD9889014'),
        p('Class', 'IX C'),
        p('Academic Year', '2026-2027'),
        p('Awards This Year', '3 on the register'),
        p('Recognition Points', '35 points'),
      ],
      achievement: [
        p('Achievement ID', 'ACH-2026-0231'),
        p('Category', 'Academic Excellence', 'badge-soft-primary'),
        p('Award Level', 'National', 'badge-soft-danger'),
        p('Placing', 'Merit'),
        p('Points Carried', '20 points'),
        p('Issued By', 'National Mathematics Foundation'),
      ],
      event: [
        p('Event', 'National Mathematics Olympiad, Stage 2'),
        p('Organiser', 'National Mathematics Foundation'),
        p('Held On', '5 Jul 2026'),
        p('Venue', 'Regional Examination Centre 14'),
        p('Entry', 'Stage 2 written paper, senior category'),
        p('Representing', 'Individual entry'),
      ],
      certificates: [
        cert('Certificate NMF-2026-1188', 'Issued 25 Jul 2026 by National Mathematics Foundation'),
        pdf('Olympiad Merit Certificate.pdf', 'NMF-2026-1188 · issued 25 Jul 2026 · 92 KB'),
        pdf('Score Report.pdf', 'Stage 2 · 48 KB'),
      ],
      mentor: [
        p('Mentor', 'Mr. Ethan Brooks'),
        p('Role', 'Class Teacher · Mathematics'),
        p('Verified By', 'Mrs. Alice Ray'),
        p('Verified On', '23 Jul 2026'),
        p('Issuing Authority', 'Examination Board · Dr. S. Raghavan'),
      ],
      recognition: [
        award(
          'bg-primary-transparent text-primary',
          'National Mathematics Olympiad — Merit Certificate',
          'Award 3 · 20 points',
        ),
        trophy(
          'Regional Maths Olympiad — Qualified',
          '22 Jan 2026 · District · Participation · 5 points',
        ),
        trophy('School Maths Challenge — Winner', '9 Sep 2025 · School · Winner · 10 points'),
      ],
      remarks:
        'Placed in the top eight percent nationally. Eligible for the foundation mentoring programme.',
      remarkDocs: [
        pdf('Olympiad Merit Certificate.pdf', 'NMF-2026-1188 · issued 25 Jul 2026 · 92 KB'),
        pdf('Score Report.pdf', 'Stage 2 · 48 KB'),
      ],
      noteBadges: [
        { className: 'badge-soft-danger', label: 'National' },
        { className: 'badge-soft-primary', label: 'Merit' },
      ],
      noteText:
        'Mentoring programme consent form sent to the guardian. Asthma action plan noted for any residential camp.',
      actions: [printAward, viewDetails, openPanel],
    },
  },
  {
    id: 'ACH-2026-0235',
    collapseId: 'aw_05',
    avatar: 'bg-primary-transparent text-primary',
    student: 'Lisa Gourley',
    studentSub: 'Award 2 · 9 points',
    admissionNo: 'AD9892431',
    studentClass: 'II B',
    title: 'Junior Reading Challenge — Class Champion',
    event: 'Junior Reading Challenge, Term 2',
    category: {
      className: 'badge-soft-primary',
      icon: 'ti ti-school',
      label: 'Academic Excellence',
    },
    level: {
      className: 'badge-soft-secondary',
      label: 'Class',
      meta: 'Winner · 5 recognition points',
    },
    awardDate: {
      value: '29 Jul 2026',
      valueClass: 'd-block fs-13 fw-medium text-nowrap',
      event: 'Event 29 Jul 2026',
      ago: '2 days ago',
      agoClass: 'fs-12 text-muted text-nowrap',
    },
    issuedBy: { name: 'School Library', role: 'Librarian · Ms. Fatima Sheikh' },
    status: { pillClass: 'is-active', label: 'Verified', meta: 'Verified by Mrs. Ellen Cruz' },
    detail: {
      profile: [
        p('Student', 'Lisa Gourley'),
        p('Admission No.', 'AD9892431'),
        p('Class', 'II B'),
        p('Academic Year', '2026-2027'),
        p('Awards This Year', '2 on the register'),
        p('Recognition Points', '9 points'),
      ],
      achievement: [
        p('Achievement ID', 'ACH-2026-0235'),
        p('Category', 'Academic Excellence', 'badge-soft-primary'),
        p('Award Level', 'Class', 'badge-soft-secondary'),
        p('Placing', 'Winner'),
        p('Points Carried', '5 points'),
        p('Issued By', 'School Library'),
      ],
      event: [
        p('Event', 'Junior Reading Challenge, Term 2'),
        p('Organiser', 'School Library'),
        p('Held On', '29 Jul 2026'),
        p('Venue', 'Library reading corner'),
        p('Entry', 'Forty two books read across the term'),
        p('Representing', 'Class II B'),
      ],
      certificates: [],
      certificatesEmpty: NOT_ISSUED,
      mentor: [
        p('Mentor', 'Mrs. Ellen Cruz'),
        p('Role', 'Class Teacher · II B'),
        p('Verified By', 'Mrs. Ellen Cruz'),
        p('Verified On', '30 Jul 2026'),
        p('Issuing Authority', 'Librarian · Ms. Fatima Sheikh'),
      ],
      recognition: [
        award(
          'bg-primary-transparent text-primary',
          'Junior Reading Challenge — Class Champion',
          'Award 2 · 5 points',
        ),
        trophy(
          'Junior Reading Challenge Term 1 — Runner-Up',
          '11 Apr 2026 · Class · Runner-Up · 4 points',
        ),
      ],
      remarks:
        'Highest book count in the junior section. Reading badge to be presented at the class assembly.',
      remarkDocs: [pdf('Reading Log.pdf', 'Term 2 · forty two titles · 56 KB')],
      noteBadges: [
        { className: 'badge-soft-secondary', label: 'Class' },
        { className: 'badge-soft-primary', label: 'Winner' },
      ],
      noteText:
        'Certificate to be printed with the term reports. Guardian meeting APT-2026-0724 covered the reading progress.',
      actions: [uploadCertificate, printAward, openPanel],
    },
  },
  {
    id: 'ACH-2026-0239',
    collapseId: 'aw_06',
    avatar: 'bg-success-transparent text-success',
    student: 'Kabir Shah',
    studentSub: 'Award 2 · 15 points',
    admissionNo: 'AD9892008',
    studentClass: 'VI B',
    title: 'Inter-House Chess Tournament — School Champion',
    event: 'Inter-House Chess Tournament 2026',
    category: { className: 'badge-soft-success', icon: 'ti ti-medal', label: 'Sports' },
    level: {
      className: 'badge-soft-info',
      label: 'School',
      meta: 'Winner · 10 recognition points',
    },
    awardDate: {
      value: '30 Jul 2026',
      valueClass: 'd-block fs-13 fw-medium text-nowrap',
      event: 'Event 30 Jul 2026',
      ago: 'Yesterday',
      agoClass: 'fs-12 text-muted text-nowrap',
    },
    issuedBy: { name: 'School Games Department', role: 'House Master · Mr. Arjun Kale' },
    status: {
      pillClass: 'is-review',
      label: 'Pending Verification',
      meta: 'Awaiting a countersignature',
    },
    detail: {
      profile: [
        p('Student', 'Kabir Shah'),
        p('Admission No.', 'AD9892008'),
        p('Class', 'VI B'),
        p('Academic Year', '2026-2027'),
        p('Awards This Year', '2 on the register'),
        p('Recognition Points', '15 points'),
      ],
      achievement: [
        p('Achievement ID', 'ACH-2026-0239'),
        p('Category', 'Sports', 'badge-soft-success'),
        p('Award Level', 'School', 'badge-soft-info'),
        p('Placing', 'Winner'),
        p('Points Carried', '10 points'),
        p('Issued By', 'School Games Department'),
      ],
      event: [
        p('Event', 'Inter-House Chess Tournament 2026'),
        p('Organiser', 'School Games Department'),
        p('Held On', '30 Jul 2026'),
        p('Venue', 'Activity Hall, Board 1'),
        p('Entry', 'Under thirteen boys, six round swiss'),
        p('Representing', 'Everest House'),
      ],
      certificates: [],
      certificatesEmpty: NOT_ISSUED,
      mentor: [
        p('Mentor', 'Mr. Arjun Kale'),
        p('Role', 'Games Department · Chess'),
        p('Verified By', 'Not yet verified'),
        p('Verified On', 'Pending'),
        p('Issuing Authority', 'House Master · Mr. Arjun Kale'),
      ],
      recognition: [
        award(
          'bg-success-transparent text-success',
          'Inter-House Chess Tournament — School Champion',
          'Award 2 · 10 points',
        ),
        trophy('House Chess Ladder — Third Place', '6 Feb 2026 · School · Third Place · 5 points'),
      ],
      remarks:
        'Won five of six rounds. Recommended for the district chess selection in September.',
      remarkDocs: [pdf('Tournament Score Sheet.pdf', 'Six rounds · 42 KB')],
      noteBadges: [
        { className: 'badge-soft-info', label: 'School' },
        { className: 'badge-soft-success', label: 'Winner' },
      ],
      noteText:
        'Awaiting the house master to countersign the result sheet before the award is verified.',
      actions: [uploadCertificate, editAward, openPanel],
    },
  },
  {
    id: 'ACH-2026-0242',
    collapseId: 'aw_07',
    avatar: 'bg-purple-transparent text-purple',
    student: 'Ishaan Verma',
    studentSub: 'Award 2 · 10 points',
    admissionNo: 'AD9894107',
    studentClass: 'IV A',
    title: 'International Junior Art Contest — shortlisted entry',
    event: 'International Junior Art Contest 2026',
    category: { className: 'badge-soft-purple', icon: 'ti ti-music', label: 'Cultural' },
    level: {
      className: 'badge-soft-purple',
      label: 'International',
      meta: 'Participation · Points on confirmation',
    },
    awardDate: {
      value: '—',
      valueClass: 'd-block fs-13 text-muted text-nowrap',
      event: 'Result due 12 Aug 2026',
      ago: 'In 12 days',
      agoClass: 'fs-12 text-info text-nowrap',
    },
    issuedBy: { name: 'Global Young Artists Trust', role: 'Contest Secretariat' },
    status: { pillClass: 'is-pending', label: 'Nominated', meta: 'Result due 12 Aug 2026' },
    detail: {
      profile: [
        p('Student', 'Ishaan Verma'),
        p('Admission No.', 'AD9894107'),
        p('Class', 'IV A'),
        p('Academic Year', '2026-2027'),
        p('Awards This Year', '2 on the register'),
        p('Recognition Points', '10 points'),
      ],
      achievement: [
        p('Achievement ID', 'ACH-2026-0242'),
        p('Category', 'Cultural', 'badge-soft-purple'),
        p('Award Level', 'International', 'badge-soft-purple'),
        p('Placing', 'Participation'),
        p('Points Carried', 'Awarded on confirmation'),
        p('Issued By', 'Global Young Artists Trust'),
      ],
      event: [
        p('Event', 'International Junior Art Contest 2026'),
        p('Organiser', 'Global Young Artists Trust'),
        p('Held On', '12 Aug 2026'),
        p('Venue', 'Online submission · results announced remotely'),
        p('Entry', 'Watercolour, theme Water and Life'),
        p('Representing', 'Individual entry'),
      ],
      certificates: [],
      certificatesEmpty: {
        tint: 'bg-warning-transparent text-warning',
        icon: 'ti ti-certificate-off',
        title: 'Certificate not yet issued',
        hint: 'Prints if the entry places',
      },
      mentor: [
        p('Mentor', 'Mrs. Kalpana Menon'),
        p('Role', 'Cultural Coordinator · Art'),
        p('Verified By', 'Not yet verified'),
        p('Verified On', 'Pending'),
        p('Issuing Authority', 'Contest Secretariat'),
      ],
      recognition: [
        award(
          'bg-purple-transparent text-purple',
          'International Junior Art Contest — shortlisted entry',
          'Pending · not counted yet',
        ),
        trophy(
          'School Art Exhibition — Best Junior Entry',
          '28 Mar 2026 · School · Winner · 10 points',
        ),
      ],
      remarks:
        'Shortlisted from over four thousand entries. Results are announced on 12 Aug 2026.',
      remarkDocs: [
        pdf('Contest Entry Receipt.pdf', 'Submitted 30 Jun 2026 · 38 KB'),
        pdf('Shortlist Notification.pdf', 'Received 21 Jul 2026 · 44 KB'),
      ],
      noteBadges: [
        { className: 'badge-soft-purple', label: 'International' },
        { className: 'badge-soft-purple', label: 'Participation' },
      ],
      noteText:
        'Nomination logged so the award prints automatically if the entry places. No certificate exists yet.',
      actions: [nominate, editAward, openPanel],
    },
  },
  {
    id: 'ACH-2026-0244',
    collapseId: 'aw_08',
    avatar: 'bg-warning-transparent text-warning',
    student: 'Tanvi Sharma',
    studentSub: 'Award 2 · 7 points',
    admissionNo: 'AD9893712',
    studentClass: 'V A',
    title: 'District Spell Bee — entry withdrawn',
    event: 'District Spell Bee, Round 2',
    category: { className: 'badge-soft-warning', icon: 'ti ti-award', label: 'Competition' },
    level: {
      className: 'badge-soft-primary',
      label: 'District',
      meta: 'Participation · Points on confirmation',
    },
    awardDate: {
      value: '—',
      valueClass: 'd-block fs-13 text-muted text-nowrap',
      event: 'Event held 15 Jul 2026',
      ago: '16 days ago',
      agoClass: 'fs-12 text-danger text-nowrap',
    },
    issuedBy: { name: 'District Language Council', role: 'Round Coordinator' },
    status: {
      pillClass: 'is-blocked',
      label: 'Not Approved',
      meta: 'Withdrawn from the register',
    },
    detail: {
      profile: [
        p('Student', 'Tanvi Sharma'),
        p('Admission No.', 'AD9893712'),
        p('Class', 'V A'),
        p('Academic Year', '2026-2027'),
        p('Awards This Year', '2 on the register'),
        p('Recognition Points', '7 points'),
      ],
      achievement: [
        p('Achievement ID', 'ACH-2026-0244'),
        p('Category', 'Competition', 'badge-soft-warning'),
        p('Award Level', 'District', 'badge-soft-primary'),
        p('Placing', 'Participation'),
        p('Points Carried', 'Awarded on confirmation'),
        p('Issued By', 'District Language Council'),
      ],
      event: [
        p('Event', 'District Spell Bee, Round 2'),
        p('Organiser', 'District Language Council'),
        p('Held On', '15 Jul 2026'),
        p('Venue', 'Council Hall, Room 3'),
        p('Entry', 'Junior category, round two'),
        p('Representing', 'Individual entry'),
      ],
      certificates: [],
      certificatesEmpty: {
        tint: 'bg-danger-transparent text-danger',
        icon: 'ti ti-certificate-off',
        title: 'No certificate on file',
        hint: 'Claim withdrawn from the register',
      },
      mentor: [
        p('Mentor', 'Mrs. Ellen Cruz'),
        p('Role', 'Class Teacher · V A'),
        p('Verified By', 'Not yet verified'),
        p('Verified On', 'Pending'),
        p('Issuing Authority', 'Round Coordinator'),
      ],
      recognition: [
        award(
          'bg-warning-transparent text-warning',
          'District Spell Bee — entry withdrawn',
          'Pending · not counted yet',
        ),
        trophy(
          'School Spelling Contest — Runner-Up',
          '2 Jun 2026 · School · Runner-Up · 7 points',
        ),
      ],
      remarks:
        'The council register shows no round two result for this entry. The claim has been withdrawn from the record.',
      remarkDocs: [pdf('Council Correspondence.pdf', 'Reply dated 26 Jul 2026 · 40 KB')],
      noteBadges: [
        { className: 'badge-soft-primary', label: 'District' },
        { className: 'badge-soft-warning', label: 'Participation' },
      ],
      noteText:
        'Class teacher asked to confirm future entries with the organiser before they are logged on the achievement register.',
      actions: [viewDetails, openPanel],
    },
  },
];
