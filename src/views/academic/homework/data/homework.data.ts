/* -------------------------------------------------------------------------- */
/*                                   Unions                                   */
/* -------------------------------------------------------------------------- */

export type TabId = 'homework' | 'tracking' | 'submission' | 'late';

export type HomeworkStatus =
  | 'Draft'
  | 'Assigned'
  | 'In Progress'
  | 'Completed'
  | 'Overdue'
  | 'Archived';

export type Priority = 'High' | 'Medium' | 'Low';

export type ReviewStatus = 'Reviewed' | 'Under Review' | 'Returned' | 'Not Reviewed';

export type ApprovalStatus = 'Approved' | 'Rejected' | 'Pending';

export type FinalStatus = 'Accepted' | 'Penalized' | 'Under Review';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

/**
 * The template's nine dialogs, normalised: `add_home_work`, `edit_home_work`,
 * `view_home_work`, `home_work_import`, `student_submission`, `grade_home_work`,
 * `teacher_feedback`, `analytics_home_work` and `delete-modal`.
 */
export type HomeworkModalId =
  | 'add'
  | 'edit'
  | 'view'
  | 'import'
  | 'submission'
  | 'grade'
  | 'feedback'
  | 'analytics'
  | 'delete';

export type FilterKey =
  | 'year'
  | 'class'
  | 'section'
  | 'subject'
  | 'teacher'
  | 'status'
  | 'submission'
  | 'due'
  | 'priority'
  | 'type'
  | 'review'
  | 'approval'
  | 'final'
  | 'reason';

export type SortKey =
  | 'recent'
  | 'name'
  | 'subject'
  | 'teacher'
  | 'submitted'
  | 'status'
  | 'completion'
  | 'pending'
  | 'score'
  | 'student'
  | 'homework'
  | 'date'
  | 'grade'
  | 'review'
  | 'delay'
  | 'deducted'
  | 'final';

/* -------------------------------------------------------------------------- */
/*                                    Rows                                    */
/* -------------------------------------------------------------------------- */

export interface HomeworkRow {
  kind: 'homework';
  /** The homework code, `HW1783929` — used as the row key. */
  id: string;
  name: string;
  subject: string;
  /** Tabler icon for the avatar tile. */
  icon: string;
  /** Bootstrap text tone on the avatar tile, e.g. `primary`. */
  tone: string;
  type: string;
  typeBadge: string;
  priority: Priority;
  priorityBadge: string;
  teacher: string;
  avatar: string;
  className: string;
  section: string;
  year: string;
  assigned: string;
  due: string;
  duration: string;
  submitted: number;
  total: number;
  percent: number;
  /** Meter tone: the template picked `success`, `warning` or `danger` per row. */
  meter: string;
  pending: number;
  late: number;
  files: number;
  updated: string;
  status: HomeworkStatus;
  pillClass: string;
  /** Completed and Draft show a bare dot; the rest show an icon. */
  pillIcon: string | null;
  /** Detail-panel teacher note — the template wrote one of four lines by status. */
  notes: string;
  search: string;
}

export interface TrackingRow {
  kind: 'tracking';
  id: string;
  name: string;
  subject: string;
  className: string;
  section: string;
  classLabel: string;
  icon: string;
  tone: string;
  completion: number;
  meter: string;
  submitted: number;
  total: number;
  pending: number;
  /** Zero pending was a grey badge in the template, not the amber one. */
  pendingBadge: string;
  reviewed: number;
  returned: number;
  score: number;
  activity: string;
  search: string;
}

export interface Attachment {
  label: string;
  badge: string;
  icon: string | null;
}

export interface HistoryEntry {
  icon: string;
  text: string;
}

export interface SubmissionRow {
  kind: 'submission';
  id: string;
  student: string;
  studentAvatar: string;
  admission: string;
  classLabel: string;
  homework: string;
  subject: string;
  subjectBadge: string;
  date: string;
  time: string;
  type: string;
  typeIcon: string;
  typeBadge: string;
  grade: string;
  gradeBadge: string;
  feedback: string;
  feedbackBadge: string;
  /** Only the "Added" feedback badge carried an icon. */
  feedbackIcon: string | null;
  review: ReviewStatus;
  reviewPill: string;
  reviewIcon: string;
  teacher: string;
  teacherAvatar: string;
  details: string[];
  comments: string;
  attachments: Attachment[];
  history: HistoryEntry[];
  search: string;
}

export interface LateRow {
  kind: 'late';
  id: string;
  student: string;
  studentAvatar: string;
  classLabel: string;
  homework: string;
  subject: string;
  due: string;
  submittedOn: string;
  delay: string;
  delayDays: number;
  delayBadge: string;
  reason: string;
  approval: ApprovalStatus;
  approvalPill: string;
  approvalIcon: string;
  deducted: string;
  deductedBadge: string;
  deductedValue: number;
  final: FinalStatus;
  finalBadge: string;
  search: string;
}

export type TabRow = HomeworkRow | TrackingRow | SubmissionRow | LateRow;

/* -------------------------------------------------------------------------- */
/*                            Tab 1 — Homework rows                           */
/* -------------------------------------------------------------------------- */

const PILLS: Record<HomeworkStatus, { pillClass: string; pillIcon: string | null }> = {
  Draft: { pillClass: 'is-inactive', pillIcon: null },
  Assigned: { pillClass: 'is-new', pillIcon: 'ti ti-send' },
  'In Progress': { pillClass: 'is-pending', pillIcon: 'ti ti-progress' },
  Completed: { pillClass: 'is-active', pillIcon: null },
  Overdue: { pillClass: 'is-emergency', pillIcon: 'ti ti-alert-triangle' },
  Archived: { pillClass: 'is-archived', pillIcon: 'ti ti-archive' },
};

/** The four teacher notes the template wrote into the detail panel, keyed by status. */
const NOTES: Record<HomeworkStatus, string> = {
  Draft: 'Draft — not yet published to students.',
  Assigned: 'On track — reviewing submissions as they arrive.',
  'In Progress': 'On track — reviewing submissions as they arrive.',
  Completed: 'All submissions graded and returned.',
  Overdue: 'Follow up with students who missed the deadline.',
  Archived: 'On track — reviewing submissions as they arrive.',
};

type HomeworkSeed = Omit<HomeworkRow, 'kind' | 'pillClass' | 'pillIcon' | 'notes' | 'search'>;

const hw = (seed: HomeworkSeed): HomeworkRow => ({
  kind: 'homework',
  ...seed,
  ...PILLS[seed.status],
  notes: NOTES[seed.status],
  search:
    `${seed.name} ${seed.id} ${seed.subject} ${seed.type} class ${seed.className} sec ${seed.section} ` +
    `${seed.teacher} ${seed.status} ${seed.priority} ${seed.due}`.toLowerCase(),
});

export const homeworkRows: HomeworkRow[] = [
  hw({
    id: 'HW1783929',
    name: 'Reading Comprehension — Unit 4',
    subject: 'English',
    icon: 'ti ti-abc',
    tone: 'primary',
    type: 'Worksheet',
    typeBadge: 'badge-soft-primary',
    priority: 'High',
    priorityBadge: 'badge-soft-danger',
    teacher: 'Erickson',
    avatar: 'assets/img/teachers/teacher-01.jpg',
    className: 'III',
    section: 'A',
    year: '2024/2025',
    assigned: '10 May 2024',
    due: '12 May 2024',
    duration: '45 min',
    submitted: 38,
    total: 42,
    percent: 90,
    meter: 'meter-success',
    pending: 4,
    late: 2,
    files: 3,
    updated: '2h ago',
    status: 'Assigned',
  }),
  hw({
    id: 'HW1783928',
    name: 'Algebra Practice Set B',
    subject: 'Mathematics',
    icon: 'ti ti-math-symbols',
    tone: 'success',
    type: 'Problem Set',
    typeBadge: 'badge-soft-success',
    priority: 'Medium',
    priorityBadge: 'badge-soft-warning',
    teacher: 'Mori',
    avatar: 'assets/img/teachers/teacher-02.jpg',
    className: 'IV',
    section: 'B',
    year: '2024/2025',
    assigned: '09 May 2024',
    due: '14 May 2024',
    duration: '60 min',
    submitted: 34,
    total: 40,
    percent: 85,
    meter: 'meter-success',
    pending: 6,
    late: 1,
    files: 2,
    updated: '5h ago',
    status: 'In Progress',
  }),
  hw({
    id: 'HW1783927',
    name: "Newton's Laws — Lab Report",
    subject: 'Physics',
    icon: 'ti ti-atom',
    tone: 'info',
    type: 'Lab Report',
    typeBadge: 'badge-soft-info',
    priority: 'High',
    priorityBadge: 'badge-soft-danger',
    teacher: 'Joseph',
    avatar: 'assets/img/teachers/teacher-03.jpg',
    className: 'V',
    section: 'A',
    year: '2024/2025',
    assigned: '08 May 2024',
    due: '11 May 2024',
    duration: '90 min',
    submitted: 40,
    total: 40,
    percent: 100,
    meter: 'meter-success',
    pending: 0,
    late: 0,
    files: 5,
    updated: '1d ago',
    status: 'Completed',
  }),
  hw({
    id: 'HW1783926',
    name: 'Periodic Table Chart',
    subject: 'Chemistry',
    icon: 'ti ti-flask',
    tone: 'warning',
    type: 'Project',
    typeBadge: 'badge-soft-warning',
    priority: 'Low',
    priorityBadge: 'badge-soft-success',
    teacher: 'James',
    avatar: 'assets/img/teachers/teacher-04.jpg',
    className: 'V',
    section: 'B',
    year: '2024/2025',
    assigned: '11 May 2024',
    due: '18 May 2024',
    duration: '120 min',
    submitted: 8,
    total: 39,
    percent: 21,
    meter: 'meter-danger',
    pending: 31,
    late: 0,
    files: 1,
    updated: '3h ago',
    status: 'Draft',
  }),
  hw({
    id: 'HW1783925',
    name: 'Cell Structure Diagram',
    subject: 'Biology',
    icon: 'ti ti-dna',
    tone: 'danger',
    type: 'Worksheet',
    typeBadge: 'badge-soft-danger',
    priority: 'Medium',
    priorityBadge: 'badge-soft-warning',
    teacher: 'Teresa',
    avatar: 'assets/img/teachers/teacher-05.jpg',
    className: 'V',
    section: 'C',
    year: '2024/2025',
    assigned: '06 May 2024',
    due: '09 May 2024',
    duration: '45 min',
    submitted: 32,
    total: 41,
    percent: 78,
    meter: 'meter-warning',
    pending: 9,
    late: 5,
    files: 2,
    updated: '6h ago',
    status: 'Overdue',
  }),
  hw({
    id: 'HW1783924',
    name: 'Python Loops Assignment',
    subject: 'Computer Science',
    icon: 'ti ti-code',
    tone: 'dark',
    type: 'Coding',
    typeBadge: 'badge-soft-dark',
    priority: 'High',
    priorityBadge: 'badge-soft-danger',
    teacher: 'Hendrita',
    avatar: 'assets/img/teachers/teacher-06.jpg',
    className: 'VI',
    section: 'A',
    year: '2024/2025',
    assigned: '12 May 2024',
    due: '19 May 2024',
    duration: '90 min',
    submitted: 20,
    total: 36,
    percent: 56,
    meter: 'meter-warning',
    pending: 16,
    late: 0,
    files: 4,
    updated: '1h ago',
    status: 'In Progress',
  }),
  hw({
    id: 'HW1783923',
    name: 'Map Work — Continents',
    subject: 'Geography',
    icon: 'ti ti-world',
    tone: 'pink',
    type: 'Worksheet',
    typeBadge: 'badge-soft-pink',
    priority: 'Low',
    priorityBadge: 'badge-soft-success',
    teacher: 'Jacquelin',
    avatar: 'assets/img/teachers/teacher-07.jpg',
    className: 'III',
    section: 'B',
    year: '2023/2024',
    assigned: '01 May 2024',
    due: '05 May 2024',
    duration: '40 min',
    submitted: 38,
    total: 38,
    percent: 100,
    meter: 'meter-success',
    pending: 0,
    late: 2,
    files: 1,
    updated: '1w ago',
    status: 'Archived',
  }),
  hw({
    id: 'HW1783922',
    name: 'Demand & Supply Case Study',
    subject: 'Economics',
    icon: 'ti ti-coin',
    tone: 'teal',
    type: 'Essay',
    typeBadge: 'badge-soft-teal',
    priority: 'Medium',
    priorityBadge: 'badge-soft-warning',
    teacher: 'Ramsey',
    avatar: 'assets/img/teachers/teacher-08.jpg',
    className: 'VII',
    section: 'A',
    year: '2024/2025',
    assigned: '07 May 2024',
    due: '15 May 2024',
    duration: '75 min',
    submitted: 24,
    total: 36,
    percent: 67,
    meter: 'meter-warning',
    pending: 12,
    late: 1,
    files: 3,
    updated: '4h ago',
    status: 'Assigned',
  }),
  hw({
    id: 'HW1783921',
    name: 'World War II Timeline',
    subject: 'History',
    icon: 'ti ti-books',
    tone: 'purple',
    type: 'Project',
    typeBadge: 'badge-soft-purple',
    priority: 'High',
    priorityBadge: 'badge-soft-danger',
    teacher: 'Morgan',
    avatar: 'assets/img/teachers/teacher-10.jpg',
    className: 'VII',
    section: 'B',
    year: '2024/2025',
    assigned: '09 May 2024',
    due: '16 May 2024',
    duration: '120 min',
    submitted: 44,
    total: 46,
    percent: 96,
    meter: 'meter-success',
    pending: 2,
    late: 0,
    files: 6,
    updated: '1d ago',
    status: 'Completed',
  }),
  hw({
    id: 'HW1783920',
    name: 'Fitness Log — Week 3',
    subject: 'Physical Education',
    icon: 'ti ti-run',
    tone: 'secondary',
    type: 'Log',
    typeBadge: 'badge-soft-secondary',
    priority: 'Low',
    priorityBadge: 'badge-soft-success',
    teacher: 'Aariv',
    avatar: 'assets/img/teachers/teacher-09.jpg',
    className: 'VIII',
    section: 'A',
    year: '2024/2025',
    assigned: '13 May 2024',
    due: '20 May 2024',
    duration: '30 min',
    submitted: 4,
    total: 43,
    percent: 9,
    meter: 'meter-danger',
    pending: 39,
    late: 0,
    files: 0,
    updated: '8h ago',
    status: 'Draft',
  }),
];

/* -------------------------- Homework detail panel -------------------------- */

/** The description sentence the template composed per row — "a essay" quirk included. */
export const homeworkDescription = (row: HomeworkRow) =>
  `${row.name} — a ${row.type.toLowerCase()} for Class ${row.className}-${row.section} ${row.subject}, ` +
  `due ${row.due}. Estimated ${row.duration} of work.`;

export const learningObjectives = (subject: string) => [
  `Reinforce the ${subject} concepts taught in class.`,
  'Practice independent application of skills.',
  'Prepare for the upcoming assessment.',
];

export const referenceMaterials = (row: HomeworkRow) =>
  `${row.subject} Textbook (Gr ${row.className}) & class notes`;

export const submissionSummary = (row: HomeworkRow) =>
  `${row.submitted} submitted · ${row.pending} pending · ${row.late} late of ${row.total}`;

export const homeworkInstructions =
  'Complete all sections neatly, show working where required, and submit before the due date.';

/** Every detail panel listed the same two files and the same three rubric weights. */
export const homeworkAttachments: Attachment[] = [
  { label: 'Brief.pdf', badge: 'badge-soft-primary', icon: 'ti ti-file-type-pdf' },
  { label: 'Template.docx', badge: 'badge-soft-info', icon: 'ti ti-file-type-doc' },
];

export const gradingCriteria: { label: string; weight: string }[] = [
  { label: 'Accuracy', weight: '50%' },
  { label: 'Presentation', weight: '30%' },
  { label: 'Timeliness', weight: '20%' },
];

/* -------------------------------------------------------------------------- */
/*                            Tab 2 — Tracking rows                           */
/* -------------------------------------------------------------------------- */

type TrackingSeed = Omit<TrackingRow, 'kind' | 'classLabel' | 'pendingBadge' | 'search'>;

const track = (seed: TrackingSeed): TrackingRow => ({
  kind: 'tracking',
  ...seed,
  classLabel: `Class ${seed.className}-${seed.section}`,
  pendingBadge: seed.pending === 0 ? 'badge-soft-secondary' : 'badge-soft-warning',
  search:
    `${seed.name} ${seed.subject} class ${seed.className} sec ${seed.section} ${seed.activity}`.toLowerCase(),
});

export const trackingRows: TrackingRow[] = [
  track({
    id: 'TRK-01',
    name: 'Reading Comprehension — Unit 4',
    subject: 'English',
    className: 'III',
    section: 'A',
    icon: 'ti ti-abc',
    tone: 'primary',
    completion: 90,
    meter: 'meter-success',
    submitted: 38,
    total: 42,
    pending: 4,
    reviewed: 30,
    returned: 6,
    score: 82,
    activity: '2h ago',
  }),
  track({
    id: 'TRK-02',
    name: 'Algebra Practice Set B',
    subject: 'Mathematics',
    className: 'IV',
    section: 'B',
    icon: 'ti ti-math-symbols',
    tone: 'success',
    completion: 62,
    meter: 'meter-warning',
    submitted: 26,
    total: 42,
    pending: 16,
    reviewed: 18,
    returned: 8,
    score: 74,
    activity: '5h ago',
  }),
  track({
    id: 'TRK-03',
    name: "Newton's Laws — Lab Report",
    subject: 'Physics',
    className: 'VII',
    section: 'A',
    icon: 'ti ti-atom',
    tone: 'info',
    completion: 78,
    meter: 'meter-primary',
    submitted: 36,
    total: 46,
    pending: 10,
    reviewed: 28,
    returned: 8,
    score: 80,
    activity: '1d ago',
  }),
  track({
    id: 'TRK-04',
    name: 'World War II Timeline',
    subject: 'History',
    className: 'VIII',
    section: 'A',
    icon: 'ti ti-map',
    tone: 'warning',
    completion: 100,
    meter: 'meter-success',
    submitted: 44,
    total: 44,
    pending: 0,
    reviewed: 44,
    returned: 2,
    score: 88,
    activity: '2d ago',
  }),
  track({
    id: 'TRK-05',
    name: 'Python Loops Assignment',
    subject: 'Computer Science',
    className: 'VI',
    section: 'A',
    icon: 'ti ti-code',
    tone: 'danger',
    completion: 35,
    meter: 'meter-danger',
    submitted: 14,
    total: 40,
    pending: 26,
    reviewed: 8,
    returned: 4,
    score: 69,
    activity: '30m ago',
  }),
  track({
    id: 'TRK-06',
    name: 'Periodic Table Chart',
    subject: 'Chemistry',
    className: 'VII',
    section: 'B',
    icon: 'ti ti-flask',
    tone: 'purple',
    completion: 54,
    meter: 'meter-warning',
    submitted: 22,
    total: 41,
    pending: 19,
    reviewed: 15,
    returned: 7,
    score: 71,
    activity: '6h ago',
  }),
];

/* -------------------------------------------------------------------------- */
/*                           Tab 3 — Submission rows                          */
/* -------------------------------------------------------------------------- */

const REVIEW_PILLS: Record<ReviewStatus, { reviewPill: string; reviewIcon: string }> = {
  Reviewed: { reviewPill: 'is-active', reviewIcon: 'ti ti-circle-check' },
  'Under Review': { reviewPill: 'is-pending', reviewIcon: 'ti ti-hourglass' },
  Returned: { reviewPill: 'is-inactive', reviewIcon: 'ti ti-rotate' },
  'Not Reviewed': { reviewPill: 'is-new', reviewIcon: 'ti ti-file-upload' },
};

type SubmissionSeed = Omit<SubmissionRow, 'kind' | 'reviewPill' | 'reviewIcon' | 'search'>;

const sub = (seed: SubmissionSeed): SubmissionRow => ({
  kind: 'submission',
  ...seed,
  ...REVIEW_PILLS[seed.review],
  search:
    `${seed.student} ${seed.admission} ${seed.classLabel} ${seed.homework} ${seed.subject} ` +
    `${seed.type} ${seed.grade} ${seed.review} ${seed.teacher} ${seed.date}`.toLowerCase(),
});

export const submissionRows: SubmissionRow[] = [
  sub({
    id: 'sub1',
    student: 'Janet Daniel',
    studentAvatar: 'assets/img/students/student-01.jpg',
    admission: 'AD9892434',
    classLabel: 'Class III-A',
    homework: 'Reading Comprehension — Unit 4',
    subject: 'English',
    subjectBadge: 'badge-soft-primary',
    date: '11 May 2024',
    time: '09:14 AM',
    type: 'File Upload',
    typeIcon: 'ti ti-file-text',
    typeBadge: 'badge-soft-info',
    grade: 'A',
    gradeBadge: 'badge-soft-success fw-semibold',
    feedback: 'Added',
    feedbackBadge: 'badge-soft-primary',
    feedbackIcon: 'ti ti-message-dots',
    review: 'Reviewed',
    teacher: 'Erickson',
    teacherAvatar: 'assets/img/teachers/teacher-01.jpg',
    details: ['Submitted 1 day before deadline', '2 files · 1.4 MB total', 'Word count: 640'],
    comments: 'Excellent comprehension and clear handwriting. Watch spelling on section 3.',
    attachments: [
      { label: 'Answer.pdf', badge: 'badge-soft-primary', icon: 'ti ti-file-type-pdf' },
      { label: 'Scan.jpg', badge: 'badge-soft-info', icon: 'ti ti-photo' },
    ],
    history: [
      { icon: 'ti ti-file-upload text-success', text: 'Submitted · 11 May 09:14' },
      { icon: 'ti ti-writing text-warning', text: 'Graded A · 11 May 14:20' },
    ],
  }),
  sub({
    id: 'sub2',
    student: 'Joann Michel',
    studentAvatar: 'assets/img/students/student-02.jpg',
    admission: 'AD9892433',
    classLabel: 'Class IV-B',
    homework: 'Algebra Practice Set B',
    subject: 'Mathematics',
    subjectBadge: 'badge-soft-success',
    date: '13 May 2024',
    time: '11:02 AM',
    type: 'Online',
    typeIcon: 'ti ti-world',
    typeBadge: 'badge-soft-primary',
    grade: 'B+',
    gradeBadge: 'badge-soft-info fw-semibold',
    feedback: 'Pending',
    feedbackBadge: 'badge-soft-secondary',
    feedbackIcon: null,
    review: 'Under Review',
    teacher: 'Mori',
    teacherAvatar: 'assets/img/teachers/teacher-02.jpg',
    details: ['Submitted on the due date', 'Online quiz · 20 questions'],
    comments: 'Awaiting review — grading scheduled for this evening.',
    attachments: [{ label: 'Quiz-Result.pdf', badge: 'badge-soft-info', icon: null }],
    history: [{ icon: 'ti ti-file-upload text-success', text: 'Submitted · 13 May 11:02' }],
  }),
  sub({
    id: 'sub3',
    student: 'Kenny Hutchinson',
    studentAvatar: 'assets/img/students/student-03.jpg',
    admission: 'AD9892432',
    classLabel: 'Class VII-A',
    homework: "Newton's Laws — Lab Report",
    subject: 'Physics',
    subjectBadge: 'badge-soft-info',
    date: '12 May 2024',
    time: '04:47 PM',
    type: 'File Upload',
    typeIcon: 'ti ti-file-text',
    typeBadge: 'badge-soft-info',
    grade: 'A-',
    gradeBadge: 'badge-soft-success fw-semibold',
    feedback: 'Added',
    feedbackBadge: 'badge-soft-primary',
    feedbackIcon: 'ti ti-message-dots',
    review: 'Returned',
    teacher: 'Joseph',
    teacherAvatar: 'assets/img/teachers/teacher-03.jpg',
    details: ['Returned for a diagram correction', 'Resubmission requested'],
    comments: 'Good report — please re-plot the force diagram in Q4 and resubmit.',
    attachments: [{ label: 'Lab-Report.pdf', badge: 'badge-soft-primary', icon: null }],
    history: [
      { icon: 'ti ti-file-upload text-success', text: 'Submitted · 12 May' },
      { icon: 'ti ti-rotate text-secondary', text: 'Returned · 13 May' },
    ],
  }),
  sub({
    id: 'sub4',
    student: 'Ralph Claudia',
    studentAvatar: 'assets/img/students/student-05.jpg',
    admission: 'AD9892431',
    classLabel: 'Class VIII-A',
    homework: 'World War II Timeline',
    subject: 'History',
    subjectBadge: 'badge-soft-warning',
    date: '14 May 2024',
    time: '08:30 AM',
    type: 'Link',
    typeIcon: 'ti ti-link',
    typeBadge: 'badge-soft-secondary',
    grade: 'A',
    gradeBadge: 'badge-soft-success fw-semibold',
    feedback: 'Added',
    feedbackBadge: 'badge-soft-primary',
    feedbackIcon: 'ti ti-message-dots',
    review: 'Reviewed',
    teacher: 'Teresa',
    teacherAvatar: 'assets/img/teachers/teacher-05.jpg',
    details: ['Interactive timeline link', 'Reviewed and approved'],
    comments: 'Outstanding research depth and presentation. Full marks.',
    attachments: [{ label: 'timeline.link', badge: 'badge-soft-secondary', icon: null }],
    history: [
      { icon: 'ti ti-file-upload text-success', text: 'Submitted · 14 May' },
      { icon: 'ti ti-writing text-warning', text: 'Graded A · 14 May' },
    ],
  }),
  sub({
    id: 'sub5',
    student: 'Julie Scott',
    studentAvatar: 'assets/img/students/student-06.jpg',
    admission: 'AD9892430',
    classLabel: 'Class VI-A',
    homework: 'Python Loops Assignment',
    subject: 'Computer Science',
    subjectBadge: 'badge-soft-danger',
    date: '15 May 2024',
    time: '07:20 PM',
    type: 'File Upload',
    typeIcon: 'ti ti-file-text',
    typeBadge: 'badge-soft-info',
    grade: '—',
    gradeBadge: 'badge-soft-secondary',
    feedback: 'Pending',
    feedbackBadge: 'badge-soft-secondary',
    feedbackIcon: null,
    review: 'Not Reviewed',
    teacher: 'Hendrita',
    teacherAvatar: 'assets/img/teachers/teacher-06.jpg',
    details: ['Source code file submitted', 'Awaiting first review'],
    comments: 'No comments yet.',
    attachments: [{ label: 'loops.py', badge: 'badge-soft-info', icon: null }],
    history: [{ icon: 'ti ti-file-upload text-success', text: 'Submitted · 15 May' }],
  }),
  sub({
    id: 'sub6',
    student: 'Aaron Hawkins',
    studentAvatar: 'assets/img/students/student-07.jpg',
    admission: 'AD9892429',
    classLabel: 'Class VII-B',
    homework: 'Periodic Table Chart',
    subject: 'Chemistry',
    subjectBadge: 'badge-soft-purple',
    date: '13 May 2024',
    time: '10:05 AM',
    type: 'File Upload',
    typeIcon: 'ti ti-file-text',
    typeBadge: 'badge-soft-info',
    grade: 'B',
    gradeBadge: 'badge-soft-info fw-semibold',
    feedback: 'Added',
    feedbackBadge: 'badge-soft-primary',
    feedbackIcon: 'ti ti-message-dots',
    review: 'Reviewed',
    teacher: 'James',
    teacherAvatar: 'assets/img/teachers/teacher-04.jpg',
    details: ['Hand-drawn chart scan', 'Reviewed with minor notes'],
    comments: 'Neat work. Label the transition metals more clearly next time.',
    attachments: [{ label: 'Chart.jpg', badge: 'badge-soft-info', icon: null }],
    history: [
      { icon: 'ti ti-file-upload text-success', text: 'Submitted · 13 May' },
      { icon: 'ti ti-writing text-warning', text: 'Graded B · 13 May' },
    ],
  }),
];

/* -------------------------------------------------------------------------- */
/*                        Tab 4 — Late submission rows                        */
/* -------------------------------------------------------------------------- */

const APPROVAL_PILLS: Record<ApprovalStatus, { approvalPill: string; approvalIcon: string }> = {
  Approved: { approvalPill: 'is-active', approvalIcon: 'ti ti-circle-check' },
  Rejected: { approvalPill: 'is-emergency', approvalIcon: 'ti ti-x' },
  Pending: { approvalPill: 'is-pending', approvalIcon: 'ti ti-hourglass' },
};

const FINAL_BADGES: Record<FinalStatus, string> = {
  Accepted: 'badge-soft-success',
  Penalized: 'badge-soft-warning',
  'Under Review': 'badge-soft-secondary',
};

type LateSeed = Omit<
  LateRow,
  'kind' | 'approvalPill' | 'approvalIcon' | 'finalBadge' | 'delay' | 'search'
>;

const late = (seed: LateSeed): LateRow => ({
  kind: 'late',
  ...seed,
  delay: `${seed.delayDays} ${seed.delayDays === 1 ? 'day' : 'days'}`,
  ...APPROVAL_PILLS[seed.approval],
  finalBadge: FINAL_BADGES[seed.final],
  search:
    `${seed.student} ${seed.classLabel} ${seed.homework} ${seed.subject} ${seed.reason} ` +
    `${seed.approval} ${seed.final} ${seed.submittedOn}`.toLowerCase(),
});

export const lateRows: LateRow[] = [
  late({
    id: 'LATE-01',
    student: 'Nyle Reese',
    studentAvatar: 'assets/img/students/student-08.jpg',
    classLabel: 'Class VII-A',
    homework: 'Biology Diagram',
    subject: 'Biology',
    due: '10 May 2024',
    submittedOn: '13 May 2024',
    delayDays: 3,
    delayBadge: 'badge-soft-warning',
    reason: 'Medical leave',
    approval: 'Approved',
    deducted: '-5%',
    deductedBadge: 'badge-soft-danger',
    deductedValue: 5,
    final: 'Accepted',
  }),
  late({
    id: 'LATE-02',
    student: 'Micheal Walker',
    studentAvatar: 'assets/img/students/student-09.jpg',
    classLabel: 'Class III-A',
    homework: 'English Essay',
    subject: 'English',
    due: '12 May 2024',
    submittedOn: '15 May 2024',
    delayDays: 3,
    delayBadge: 'badge-soft-warning',
    reason: 'Forgot deadline',
    approval: 'Rejected',
    deducted: '-10%',
    deductedBadge: 'badge-soft-danger',
    deductedValue: 10,
    final: 'Penalized',
  }),
  late({
    id: 'LATE-03',
    student: 'Tim Franklin',
    studentAvatar: 'assets/img/students/student-10.jpg',
    classLabel: 'Class VI-A',
    homework: 'Python Loops',
    subject: 'Computer Science',
    due: '18 May 2024',
    submittedOn: '19 May 2024',
    delayDays: 1,
    delayBadge: 'badge-soft-secondary',
    reason: 'Technical issue',
    approval: 'Approved',
    deducted: '0%',
    deductedBadge: 'badge-soft-secondary',
    deductedValue: 0,
    final: 'Accepted',
  }),
  late({
    id: 'LATE-04',
    student: 'Rachel Green',
    studentAvatar: 'assets/img/students/student-11.jpg',
    classLabel: 'Class VII-B',
    homework: 'Periodic Table Chart',
    subject: 'Chemistry',
    due: '17 May 2024',
    submittedOn: '21 May 2024',
    delayDays: 4,
    delayBadge: 'badge-soft-danger',
    reason: 'Family function',
    approval: 'Pending',
    deducted: 'TBD',
    deductedBadge: 'badge-soft-secondary',
    deductedValue: 0,
    final: 'Under Review',
  }),
  late({
    id: 'LATE-05',
    student: 'Lewis Bond',
    studentAvatar: 'assets/img/students/student-12.jpg',
    classLabel: 'Class VIII-A',
    homework: 'World War II Timeline',
    subject: 'History',
    due: '14 May 2024',
    submittedOn: '16 May 2024',
    delayDays: 2,
    delayBadge: 'badge-soft-warning',
    reason: 'Sports event',
    approval: 'Approved',
    deducted: '-5%',
    deductedBadge: 'badge-soft-danger',
    deductedValue: 5,
    final: 'Accepted',
  }),
  late({
    id: 'LATE-06',
    student: 'Emma Foster',
    studentAvatar: 'assets/img/students/student-13.jpg',
    classLabel: 'Class IV-B',
    homework: 'Algebra Practice Set B',
    subject: 'Mathematics',
    due: '14 May 2024',
    submittedOn: '20 May 2024',
    delayDays: 6,
    delayBadge: 'badge-soft-danger',
    reason: 'No reason given',
    approval: 'Rejected',
    deducted: '-15%',
    deductedBadge: 'badge-soft-danger',
    deductedValue: 15,
    final: 'Penalized',
  }),
];

/* -------------------------------------------------------------------------- */
/*                        Inspector offcanvas — L3549–3637                    */
/* -------------------------------------------------------------------------- */

export interface InspectorStudent {
  name: string;
  avatar: string;
  state: string;
  badge: string;
}

/** The three students the Assigned Students accordion listed. */
export const inspectorStudents: InspectorStudent[] = [
  {
    name: 'Janet Daniel',
    avatar: 'assets/img/students/student-01.jpg',
    state: 'Submitted',
    badge: 'badge-soft-success',
  },
  {
    name: 'Joann Michel',
    avatar: 'assets/img/students/student-02.jpg',
    state: 'Pending',
    badge: 'badge-soft-warning',
  },
  {
    name: 'Kenny Hutchinson',
    avatar: 'assets/img/students/student-03.jpg',
    state: 'Submitted',
    badge: 'badge-soft-success',
  },
];

/** The inspector's Teacher Notes is a longer variant of the detail panel's line. */
export const inspectorNotes =
  'On track — reviewing submissions as they arrive. Follow up with pending students before the due date.';

/** Recent Activity — the second and third lines were fixed copy in the template. */
export const inspectorActivity: { icon: string; text: string }[] = [
  { icon: 'ti ti-writing text-warning', text: '6 submissions graded · 4h ago' },
  { icon: 'ti ti-message-dots text-primary', text: 'Feedback added for Ralph · 1d ago' },
];

/* -------------------------------------------------------------------------- */
/*                            Toolbar vocabularies                            */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: FilterKey;
  /** Short name used on the removable chip. */
  label: string;
  /** The `<label>` above the select inside the filter panel. */
  panelLabel: string;
  /** Page-slug-prefixed DOM id — the template's bare `class`/`section` ids collide. */
  domId: string;
  /** "All" on most facets; the Due Date select said "Any". */
  emptyLabel?: string;
  options: FilterOption[];
}

export interface ColumnDef {
  id: string;
  label: string;
  sort: SortKey | null;
  /** Columns the Columns menu may hide; the rest are structural. */
  toggleable?: boolean;
}

export interface SortOption {
  id: SortKey;
  label: string;
  icon: string;
}

export interface EmptyState {
  icon: string;
  title: string;
  body: string;
  action: { kind: 'reset' | 'create'; label: string; icon: string } | null;
}

export interface TabConfig {
  id: TabId;
  label: string;
  icon: string;
  badgeClass: string;
  caption: string;
  columns: ColumnDef[];
  rows: TabRow[];
  filters: FilterField[];
  sortOptions: SortOption[];
  savedViews: SavedView[];
  quickFilters: SavedView[];
  emptyState: EmptyState;
  /** Only the Homework grid had checkboxes and a bulk bar. */
  selectable: boolean;
  /**
   * Class on the chevron button, or `null` where the grid has no detail row. Homework used
   * `dt-expand` with a `dt-detail` sibling; Submission Status used `dt-ib` with a collapse.
   */
  expandToggle: string | null;
  /** The card wrapper — Submission Status was a plain `.data-table`, the rest `dt-cards`. */
  tableClass: string;
  searchPlaceholder: string;
  searchLabel: string;
  /** Noun used in the filter hit count, the footer range and the view toasts. */
  noun: string;
  paginationLabel: string;
}

const plain = (values: string[]): FilterOption[] => values.map((value) => ({ value, label: value }));

const CLASS_OPTIONS: FilterOption[] = [
  { value: 'class iii', label: 'III' },
  { value: 'class iv', label: 'IV' },
  { value: 'class v', label: 'V' },
  { value: 'class vi', label: 'VI' },
  { value: 'class vii', label: 'VII' },
  { value: 'class viii', label: 'VIII' },
];

const SUBJECT_OPTIONS = plain([
  'English',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Geography',
  'Economics',
  'History',
  'Physical Education',
]);

const TEACHER_OPTIONS = plain([
  'Erickson',
  'Mori',
  'Joseph',
  'James',
  'Teresa',
  'Hendrita',
  'Jacquelin',
  'Ramsey',
  'Morgan',
  'Aariv',
]);

/**
 * `homework.html` L1533–1542. Class, Section and Due Date carry haystack fragments as their
 * option values — the engine matched those against `data-search` rather than a parsed field.
 */
const homeworkFilters: FilterField[] = [
  {
    key: 'year',
    label: 'Year',
    panelLabel: 'Academic Year',
    domId: 'hw-academic-year',
    options: plain(['2024/2025', '2023/2024']),
  },
  { key: 'class', label: 'Class', panelLabel: 'Class', domId: 'hw-class', options: CLASS_OPTIONS },
  {
    key: 'section',
    label: 'Section',
    panelLabel: 'Section',
    domId: 'hw-section',
    options: [
      { value: 'sec a', label: 'A' },
      { value: 'sec b', label: 'B' },
      { value: 'sec c', label: 'C' },
    ],
  },
  {
    key: 'subject',
    label: 'Subject',
    panelLabel: 'Subject',
    domId: 'hw-subject',
    options: SUBJECT_OPTIONS,
  },
  {
    key: 'teacher',
    label: 'Teacher',
    panelLabel: 'Teacher',
    domId: 'hw-teacher',
    options: TEACHER_OPTIONS,
  },
  {
    key: 'status',
    label: 'Status',
    panelLabel: 'Homework Status',
    domId: 'hw-homework-status',
    options: plain(['Draft', 'Assigned', 'In Progress', 'Completed', 'Overdue', 'Archived']),
  },
  {
    key: 'submission',
    label: 'Submission',
    panelLabel: 'Submission Status',
    domId: 'hw-submission-status',
    options: plain(['Completed', 'In Progress', 'Overdue']),
  },
  {
    key: 'due',
    label: 'Due',
    panelLabel: 'Due Date',
    domId: 'hw-due-date',
    emptyLabel: 'Any',
    options: [
      { value: 'may', label: 'This month' },
      { value: '12 may', label: 'Due 12 May' },
      { value: '18 may', label: 'Due 18 May' },
    ],
  },
  {
    key: 'priority',
    label: 'Priority',
    panelLabel: 'Priority',
    domId: 'hw-priority',
    options: plain(['High', 'Medium', 'Low']),
  },
];

const trackingFilters: FilterField[] = [
  {
    key: 'subject',
    label: 'Subject',
    panelLabel: 'Subject',
    domId: 'hw-trk-subject',
    options: SUBJECT_OPTIONS,
  },
  { key: 'class', label: 'Class', panelLabel: 'Class', domId: 'hw-trk-class', options: CLASS_OPTIONS },
];

const submissionFilters: FilterField[] = [
  {
    key: 'subject',
    label: 'Subject',
    panelLabel: 'Subject',
    domId: 'hw-sub-subject',
    options: SUBJECT_OPTIONS,
  },
  {
    key: 'type',
    label: 'Type',
    panelLabel: 'Submission Type',
    domId: 'hw-sub-type',
    options: plain(['File Upload', 'Online', 'Link']),
  },
  {
    key: 'review',
    label: 'Review',
    panelLabel: 'Review Status',
    domId: 'hw-sub-review',
    options: plain(['Reviewed', 'Under Review', 'Returned', 'Not Reviewed']),
  },
  {
    key: 'teacher',
    label: 'Teacher',
    panelLabel: 'Teacher',
    domId: 'hw-sub-teacher',
    options: TEACHER_OPTIONS,
  },
];

const lateFilters: FilterField[] = [
  {
    key: 'approval',
    label: 'Approval',
    panelLabel: 'Teacher Approval',
    domId: 'hw-late-approval',
    options: plain(['Approved', 'Rejected', 'Pending']),
  },
  {
    key: 'final',
    label: 'Final Status',
    panelLabel: 'Final Status',
    domId: 'hw-late-final',
    options: plain(['Accepted', 'Penalized', 'Under Review']),
  },
  {
    key: 'reason',
    label: 'Reason',
    panelLabel: 'Reason',
    domId: 'hw-late-reason',
    options: plain([
      'Medical leave',
      'Forgot deadline',
      'Technical issue',
      'Family function',
      'Sports event',
      'No reason given',
    ]),
  },
];

/** `homework.html` L1590–1596 — the template's Sort menu, which served the Homework grid. */
const homeworkSort: SortOption[] = [
  { id: 'name', label: 'Title (A–Z)', icon: 'ti ti-abc' },
  { id: 'subject', label: 'Subject', icon: 'ti ti-book' },
  { id: 'teacher', label: 'Teacher', icon: 'ti ti-user' },
  { id: 'submitted', label: 'Submissions', icon: 'ti ti-checklist' },
  { id: 'recent', label: 'Recently assigned', icon: 'ti ti-clock' },
];

const trackingSort: SortOption[] = [
  { id: 'name', label: 'Title (A–Z)', icon: 'ti ti-abc' },
  { id: 'subject', label: 'Subject', icon: 'ti ti-book' },
  { id: 'completion', label: 'Completion', icon: 'ti ti-chart-arcs' },
  { id: 'submitted', label: 'Submissions', icon: 'ti ti-checklist' },
  { id: 'pending', label: 'Pending', icon: 'ti ti-hourglass' },
  { id: 'score', label: 'Average score', icon: 'ti ti-award' },
  { id: 'recent', label: 'Recently assigned', icon: 'ti ti-clock' },
];

const submissionSort: SortOption[] = [
  { id: 'student', label: 'Student (A–Z)', icon: 'ti ti-abc' },
  { id: 'homework', label: 'Homework', icon: 'ti ti-notebook' },
  { id: 'subject', label: 'Subject', icon: 'ti ti-book' },
  { id: 'date', label: 'Submitted on', icon: 'ti ti-calendar-check' },
  { id: 'grade', label: 'Grade', icon: 'ti ti-award' },
  { id: 'review', label: 'Review status', icon: 'ti ti-writing' },
  { id: 'recent', label: 'Recently assigned', icon: 'ti ti-clock' },
];

const lateSort: SortOption[] = [
  { id: 'student', label: 'Student (A–Z)', icon: 'ti ti-abc' },
  { id: 'homework', label: 'Homework', icon: 'ti ti-notebook' },
  { id: 'delay', label: 'Delay', icon: 'ti ti-clock-exclamation' },
  { id: 'deducted', label: 'Marks deducted', icon: 'ti ti-percentage' },
  { id: 'final', label: 'Final status', icon: 'ti ti-flag-3' },
  { id: 'recent', label: 'Recently assigned', icon: 'ti ti-clock' },
];

/** `homework.html` L1518–1526 and L1580–1586. */
const homeworkViews: SavedView[] = [
  { id: 'all', label: 'All Homework', icon: 'ti ti-layout-list' },
  { id: 'Assigned', label: 'Assigned', icon: 'ti ti-send' },
  { id: 'In Progress', label: 'In Progress', icon: 'ti ti-progress' },
  { id: 'Completed', label: 'Completed', icon: 'ti ti-circle-check' },
  { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle' },
  { id: 'Draft', label: 'Draft', icon: 'ti ti-pencil' },
];

/**
 * Tabs 2–4 shared the one toolbar in the template, so it only ever offered the Homework
 * statuses. Their views key off the status axis each grid actually renders.
 */
const trackingViews: SavedView[] = [{ id: 'all', label: 'All Tracking', icon: 'ti ti-layout-list' }];

const submissionViews: SavedView[] = [
  { id: 'all', label: 'All Submissions', icon: 'ti ti-layout-list' },
  { id: 'Reviewed', label: 'Reviewed', icon: 'ti ti-circle-check' },
  { id: 'Under Review', label: 'Under Review', icon: 'ti ti-hourglass' },
  { id: 'Returned', label: 'Returned', icon: 'ti ti-rotate' },
  { id: 'Not Reviewed', label: 'Not Reviewed', icon: 'ti ti-file-upload' },
];

const lateViews: SavedView[] = [
  { id: 'all', label: 'All Late Submissions', icon: 'ti ti-layout-list' },
  { id: 'Accepted', label: 'Accepted', icon: 'ti ti-circle-check' },
  { id: 'Penalized', label: 'Penalized', icon: 'ti ti-flag-3' },
  { id: 'Under Review', label: 'Under Review', icon: 'ti ti-hourglass' },
];

/* -------------------------------------------------------------------------- */
/*                                    Tabs                                    */
/* -------------------------------------------------------------------------- */

export const tabs: TabConfig[] = [
  {
    id: 'homework',
    label: 'Homework',
    icon: 'ti ti-notebook',
    badgeClass: 'badge-soft-primary',
    caption: 'Homework list with academic details, submission progress and status',
    columns: [
      { id: 'homework', label: 'Homework', sort: 'name', toggleable: true },
      { id: 'details', label: 'Academic Details', sort: null, toggleable: true },
      { id: 'submission', label: 'Submission', sort: 'submitted', toggleable: true },
      { id: 'status', label: 'Status', sort: 'status', toggleable: true },
    ],
    rows: homeworkRows,
    filters: homeworkFilters,
    sortOptions: homeworkSort,
    savedViews: homeworkViews,
    quickFilters: homeworkViews.slice(1),
    emptyState: {
      icon: 'ti ti-file-off',
      title: 'No homework matches your filters',
      body: 'Try adjusting your search terms or clearing the active filters to see more results.',
      action: { kind: 'reset', label: 'Reset filters', icon: 'ti ti-rotate' },
    },
    selectable: true,
    expandToggle: 'dt-expand',
    tableClass: 'data-table dt-cards',
    searchPlaceholder: 'Search homework, code, subject or teacher…',
    searchLabel: 'Search homework',
    noun: 'homework',
    paginationLabel: 'Homework pagination',
  },
  {
    id: 'tracking',
    label: 'Tracking',
    icon: 'ti ti-chart-arcs',
    badgeClass: 'badge-soft-secondary',
    caption: 'Homework tracking with completion progress and review status',
    columns: [
      { id: 'homework', label: 'Homework', sort: 'name', toggleable: true },
      { id: 'completion', label: 'Completion', sort: 'completion', toggleable: true },
      { id: 'submitted', label: 'Submitted', sort: 'submitted', toggleable: true },
      { id: 'pending', label: 'Pending', sort: 'pending', toggleable: true },
      { id: 'reviewed', label: 'Reviewed', sort: null, toggleable: true },
      { id: 'returned', label: 'Returned', sort: null, toggleable: true },
      { id: 'score', label: 'Average Score', sort: 'score', toggleable: true },
      { id: 'activity', label: 'Last Activity', sort: null, toggleable: true },
    ],
    rows: trackingRows,
    filters: trackingFilters,
    sortOptions: trackingSort,
    savedViews: trackingViews,
    quickFilters: [],
    emptyState: {
      icon: 'ti ti-chart-arcs',
      title: 'No tracking data yet',
      body: 'Assign homework to start tracking completion, reviews and average scores here.',
      action: { kind: 'create', label: 'Create Homework', icon: 'ti ti-plus' },
    },
    selectable: false,
    expandToggle: null,
    tableClass: 'data-table dt-cards',
    searchPlaceholder: 'Search homework, subject or class…',
    searchLabel: 'Search tracking',
    noun: 'tracking rows',
    paginationLabel: 'Tracking pagination',
  },
  {
    id: 'submission',
    label: 'Submission Status',
    icon: 'ti ti-file-check',
    badgeClass: 'badge-soft-success',
    caption: 'Student submission status with grades, feedback and review state',
    columns: [
      { id: 'student', label: 'Student', sort: 'student', toggleable: true },
      { id: 'homework', label: 'Homework', sort: 'homework', toggleable: true },
      { id: 'subject', label: 'Subject', sort: 'subject', toggleable: true },
      { id: 'submitted', label: 'Submitted On', sort: 'date', toggleable: true },
      { id: 'type', label: 'Submission Type', sort: null, toggleable: true },
      { id: 'grade', label: 'Grade', sort: 'grade', toggleable: true },
      { id: 'feedback', label: 'Feedback', sort: null, toggleable: true },
      { id: 'review', label: 'Review Status', sort: 'review', toggleable: true },
      { id: 'teacher', label: 'Teacher', sort: 'teacher', toggleable: true },
    ],
    rows: submissionRows,
    filters: submissionFilters,
    sortOptions: submissionSort,
    savedViews: submissionViews,
    quickFilters: submissionViews.slice(1),
    emptyState: {
      icon: 'ti ti-file-off',
      title: 'No submissions yet',
      body: 'Once students start submitting their homework, their submissions will appear here for review and grading.',
      action: { kind: 'create', label: 'Create Homework', icon: 'ti ti-plus' },
    },
    selectable: false,
    expandToggle: 'dt-ib',
    tableClass: 'data-table',
    searchPlaceholder: 'Search student, homework, subject or teacher…',
    searchLabel: 'Search submissions',
    noun: 'submissions',
    paginationLabel: 'Submissions pagination',
  },
  {
    id: 'late',
    label: 'Late Submissions',
    icon: 'ti ti-clock-exclamation',
    badgeClass: 'badge-soft-danger',
    caption: 'Late homework submissions with delay, approval and penalty',
    columns: [
      { id: 'student', label: 'Student', sort: 'student', toggleable: true },
      { id: 'homework', label: 'Homework', sort: 'homework', toggleable: true },
      { id: 'due', label: 'Due Date', sort: null, toggleable: true },
      { id: 'submitted', label: 'Submitted Date', sort: null, toggleable: true },
      { id: 'delay', label: 'Delay', sort: 'delay', toggleable: true },
      { id: 'reason', label: 'Reason', sort: null, toggleable: true },
      { id: 'approval', label: 'Teacher Approval', sort: null, toggleable: true },
      { id: 'deducted', label: 'Marks Deducted', sort: 'deducted', toggleable: true },
      { id: 'final', label: 'Final Status', sort: 'final', toggleable: true },
    ],
    rows: lateRows,
    filters: lateFilters,
    sortOptions: lateSort,
    savedViews: lateViews,
    quickFilters: lateViews.slice(1),
    emptyState: {
      icon: 'ti ti-clock-check',
      title: 'No late submissions',
      body: 'Great news — every student has submitted on time. Late submissions will be listed here for review.',
      action: null,
    },
    selectable: false,
    expandToggle: null,
    tableClass: 'data-table dt-cards',
    searchPlaceholder: 'Search student, homework or reason…',
    searchLabel: 'Search late submissions',
    noun: 'late submissions',
    paginationLabel: 'Late submissions pagination',
  },
];

/** Facets whose option values are fragments of the row's search haystack, not a field. */
export const HAYSTACK_FACETS: FilterKey[] = ['class', 'section', 'due'];

export const densityOptions: { id: DensityId; icon: string; title: string }[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default' },
  { id: 'comfortable', icon: 'ti ti-baseline-density-large', title: 'Comfortable' },
];

export const pageSizes = ['10', '25', '50'];

/* -------------------------------------------------------------------------- */
/*                        Header, bulk bar and row menus                      */
/* -------------------------------------------------------------------------- */

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
];

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  modal?: HomeworkModalId;
  danger?: boolean;
}

/** `homework.html` L1614–1623. */
export const bulkActions: BulkAction[] = [
  { id: 'publish', label: 'Publish', icon: 'ti ti-send' },
  { id: 'assign', label: 'Assign', icon: 'ti ti-user-plus' },
  { id: 'extend', label: 'Extend Due Date', icon: 'ti ti-calendar-plus' },
  { id: 'download', label: 'Download', icon: 'ti ti-download' },
  { id: 'export_csv', label: 'Export', icon: 'ti ti-file-export' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  /** Key of `all_routes` when the template linked to another page. */
  route?: string;
  modal?: HomeworkModalId;
  danger?: boolean;
  divider?: boolean;
}

/** `homework.html` L1693–1711. */
export const rowMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View Homework', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'submissions', label: 'Submissions', icon: 'ti ti-checklist' },
  { id: 'grade', label: 'Grade', icon: 'ti ti-writing', route: 'marksEntry' },
  { id: 'feedback', label: 'Feedback', icon: 'ti ti-message-dots', modal: 'feedback' },
  { id: 'attachments', label: 'Attachments', icon: 'ti ti-paperclip' },
  { id: 'students', label: 'Student List', icon: 'ti ti-users', route: 'studentList' },
  { id: 'discussion', label: 'Discussion', icon: 'ti ti-messages', route: 'chat' },
  { id: 'announcements', label: 'Announcements', icon: 'ti ti-speakerphone', route: 'noticeBoard' },
  { id: 'download', label: 'Download', icon: 'ti ti-download' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'duplicate', label: 'Duplicate Homework', icon: 'ti ti-copy', divider: true },
  { id: 'extend', label: 'Extend Due Date', icon: 'ti ti-calendar-plus' },
  { id: 'publish', label: 'Publish', icon: 'ti ti-send' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

/* -------------------------------------------------------------------------- */
/*                                   Copy                                     */
/* -------------------------------------------------------------------------- */

/** `tables.js` L945–967, verbatim; the last three are the engine's own defaults. */
export const actionToasts: Record<string, string> = {
  refresh: 'Homework list refreshed.',
  save_view: 'Current filters saved as a new view.',
  duplicate: 'Homework duplicated as a draft.',
  publish: 'Selected homework published.',
  assign: 'Assignment opened for the selected homework.',
  extend: 'Due-date extension opened for the selected homework.',
  submissions: 'Submissions opened for this homework.',
  grade: 'Grading opened for this homework.',
  feedback: 'Feedback opened for this homework.',
  attachments: 'Attachments opened for this homework.',
  students: 'Student list opened for this homework.',
  discussion: 'Discussion opened for this homework.',
  announcements: 'Announcements opened for this homework.',
  download: 'Homework files queued for download.',
  reports: 'Homework report opened.',
  notes: 'Teacher notes opened for this homework.',
  print: 'Sending the homework list to the printer…',
  archive: 'Selected homework archived.',
  export_excel: 'Excel workbook queued for download.',
  export_pdf: 'PDF export queued for download.',
  page: 'Loading the selected page…',
  export_csv: 'Preparing export…',
  clear_filters: 'Filters cleared.',
  reset_columns: 'All columns restored.',
};

/** `tables.js` L969. The fourth entry is the CSV filename the export menu writes. */
export const strings = {
  recentSort: 'Showing the most recently assigned homework first.',
  filterMatch: ' homework match the current filters.',
  viewMatch: ' homework in “',
  csvFile: 'class-home-work.csv',
};

/** `tables.js` L938–944 — the columns the CSV export writes, in order. */
export const csvColumns = [
  'Title',
  'Code',
  'Subject',
  'Type',
  'Class',
  'Teacher',
  'Assigned',
  'Due',
  'Submitted',
  'Status',
];
