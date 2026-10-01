import { daysBetween } from '../../data/dates';

import { STUDENTS_ENROLLED } from '../../data/registers';

/* ------------------------------- The register ------------------------------ */

/** What the engine watches, and what it has flagged out of that. */
export const MONITORED = STUDENTS_ENROLLED;
export const FLAGGED_TOTAL = 128;
export const CRITICAL_TOTAL = 31;
export const HIGH_TOTAL = 44;
export const MEDIUM_TOTAL = 53;

/** How many crossed into critical on the overnight run. */
export const NEW_CRITICAL = 9;

/** Cases under care and cases already recovered, register-wide. */
export const IN_CARE_TOTAL = 62;
export const RECOVERED_TOTAL = 47;

export const MODEL_CONFIDENCE = 94.2;
export const LAST_RUN = '06:15';
export const RUN_DURATION = '3m 48s';
export const NEXT_RUN = '02 Aug 2026, 06:00';

/** The register's own clock: 31 July 2026. */
export const TODAY = '31 Jul 2026';

/** Where a score places a case. */
export const RISK_BANDS: { band: RiskBand; floor: number }[] = [
  { band: 'Critical', floor: 80 },
  { band: 'High', floor: 65 },
  { band: 'Medium', floor: 50 },
  { band: 'Low', floor: 0 },
];

/** A case closes once its score holds under this for two reviews. */
export const CLOSURE_THRESHOLD = 40;
/** And reopens on its own if the score climbs back over this. */
export const REOPEN_THRESHOLD = 65;

/* --------------------------------- Shapes ---------------------------------- */

export type RiskBand = 'Critical' | 'High' | 'Medium' | 'Low';

export type CaseStatus = 'Open' | 'Recovering' | 'Closed';

export type SignalGroup = 'Attendance' | 'Academics' | 'Finance' | 'Behaviour' | 'Health' | 'Transport';

export interface Signal {
  group: SignalGroup;
  reading: string;
  /** Whether this group is contributing to the score. */
  clean?: boolean;
}

export interface TimelineEntry {
  title: string;
  date: string;
  note: string;
}

export interface Recommendation {
  id: string;
  title: string;
  urgency: 'Urgent' | 'High' | 'Medium';
  confidence: number;
  reasoning: string;
  outcome: string;
  timeline: string;
  /** Set once a decision has been taken on it. */
  decision?: 'Applied' | 'Dismissed';
}

export interface DecisionEntry {
  title: string;
  date: string;
  by: string;
  note: string;
}

export interface InterventionAction {
  id: string;
  title: string;
  state: 'Assigned' | 'Required' | 'Pending' | 'In progress' | 'Not needed' | 'Review';
  note: string;
}

export interface Review {
  week: number;
  date: string;
  /** The score this review closed at; the movement is read pairwise. */
  score: number;
  verdict: 'On track' | 'Slow' | 'Stalled';
}

export interface RelatedCase {
  name: string;
  className: string;
  note: string;
  match: number;
}

export interface AuditEntry {
  title: string;
  date: string;
  by: string;
}

export interface RiskCase {
  id: string;
  student: string;
  studentId: string;
  className: string;
  image: string;

  /** The score the queue bands on. */
  score: number;
  /**
   * Where the case has got to since. Only set where an intervention has moved
   * it; the workspace, the review chain and the closure test read this.
   */
  currentScore?: number;
  confidence: number;
  primaryRisk: string;
  status: CaseStatus;

  updatedNote: string;
  daysOpen: number;
  stage: string;
  nextReview: string;
  openedOn: string;
  projectedClosure?: string;
  /** How likely the engine thinks the plan is to work. */
  successProbability?: number;

  teacher: string;
  teacherImage: string;
  counselor: string;
  counselorImage: string;
  /**
   * Eight weeks of score, oldest first. The card's spark bars read these, and
   * the last one is where the case stands now.
   */
  trajectory: number[];
  guardian: string;
  guardianPhone: string;

  predictedOutcome: string;
  suggestedIntervention: string;

  signals: Signal[];
  observation: string;
  observationDate: string;
  reasoning: string;
  supportingSignals: { label: string; value: string }[];
  detection: TimelineEntry[];
  evidence: { source: string; scope: string }[];
  related: RelatedCase[];

  recommendations: Recommendation[];
  decisions: DecisionEntry[];
  actions: InterventionAction[];

  progress: TimelineEntry[];
  reviews: Review[];
  completed: { title: string; date: string }[];
  audit: AuditEntry[];
}

/* --------------------------------- The cases ------------------------------- */

export const riskCases: RiskCase[] = [
  {
    id: 'RSK-1042',
    student: 'Liam Walker',
    studentId: 'STU-1042',
    className: 'Class IV-B',
    image: 'assets/img/students/student-01.jpg',
    score: 91,
    currentScore: 58,
    confidence: 96,
    primaryRisk: 'Attendance collapse',
    status: 'Recovering',
    updatedNote: 'updated 2 hours ago',
    daysOpen: 29,
    stage: 'Recovery plan',
    nextReview: '05 Aug 2026',
    openedOn: '02 Jul 2026',
    projectedClosure: '12 Aug 2026',
    successProbability: 84,
    teacher: 'Teena Mathew',
    teacherImage: 'assets/img/teachers/teacher-01.jpg',
    counselor: 'Dr. Anjali Rao',
    counselorImage: 'assets/img/profiles/avatar-02.jpg',
    trajectory: [40, 50, 50, 60, 70, 80, 90, 91],
    guardian: 'Mr. Andrew Walker',
    guardianPhone: '+91 98450 22140',
    predictedOutcome: 'Statutory breach in 11 days',
    suggestedIntervention: 'Reroute transport, open a four-week catch-up block',
    signals: [
      { group: 'Attendance', reading: '58% this term' },
      { group: 'Academics', reading: 'B+ to D' },
      { group: 'Finance', reading: 'One term due' },
      { group: 'Behaviour', reading: 'No incidents', clean: true },
      { group: 'Health', reading: 'No flags', clean: true },
      { group: 'Transport', reading: 'Route 7 delayed' },
    ],
    observation: 'Attendance dropped 18% in four weeks',
    observationDate: '02 Jul 2026 · re-confirmed on every run since',
    reasoning:
      'Every missed session falls on a day the revised bus route runs late, and the drop begins the week that route changed. Grades follow two weeks behind — the lag this cohort normally shows. Behaviour and health are clean, and the family answered every notice before the route changed. The engine therefore reads transport, not disengagement, as the cause.',
    supportingSignals: [
      { label: 'Route delay', value: '+22 min' },
      { label: 'Sessions missed', value: '14 of 20' },
      { label: 'Grade movement', value: 'B+ to D' },
      { label: 'Notices ignored', value: '3 of 3' },
    ],
    detection: [
      {
        title: 'Route 7 timetable changed',
        date: '02 Jun 2026',
        note: 'Arrival slipped by an average of 22 minutes.',
      },
      {
        title: 'Absences began',
        date: '09 Jun 2026',
        note: 'First three missed sessions, all on delayed-route days.',
      },
      { title: 'Grades followed', date: '23 Jun 2026', note: 'Mathematics and English fell two bands.' },
      { title: 'Case opened', date: '02 Jul 2026', note: 'Score crossed 80 and entered the critical band.' },
    ],
    evidence: [
      { source: 'Attendance register', scope: 'Last 20 sessions' },
      { source: 'Transport log', scope: 'Route 7, same period' },
      { source: 'Unit test results', scope: 'Term 2' },
      { source: 'Guardian notice records', scope: '3 sent, 0 answered' },
      { source: 'Closed case archive', scope: '10 matching signatures' },
    ],
    related: [
      { name: 'Nisha Varma', className: 'VII-A', note: 'Same signature · recovered in 5 weeks', match: 94 },
      { name: 'Rohan Das', className: 'V-C', note: 'Same signature · recovered in 7 weeks', match: 88 },
      { name: 'Imran Qureshi', className: 'VIII-C', note: 'Same signature · case closed', match: 81 },
    ],
    recommendations: [
      {
        id: 'parent-meeting',
        title: 'Parent Meeting',
        urgency: 'Urgent',
        confidence: 96,
        reasoning:
          'Three notices unanswered. A meeting inside seven days recovers attendance in 7 of 10 comparable cases.',
        outcome: 'Attendance +18%',
        timeline: '2–3 weeks',
      },
      {
        id: 'transport',
        title: 'Transport Reassignment',
        urgency: 'Urgent',
        confidence: 94,
        reasoning: 'Moving to Route 4 removes the delay entirely. Capacity is available from Monday.',
        outcome: 'Removes root cause',
        timeline: 'Immediate',
        decision: 'Applied',
      },
      {
        id: 'catchup',
        title: 'Academic Catch-up Block',
        urgency: 'High',
        confidence: 90,
        reasoning:
          'Four weeks of targeted Mathematics and English recovers the two lost bands in most comparable cases.',
        outcome: 'One grade band',
        timeline: '4 weeks',
      },
    ],
    decisions: [
      {
        title: 'Counselor referral approved',
        date: '11 Jul 2026',
        by: 'Leela Nambiar',
        note: 'Accepted the engine’s recommendation. Session held the same week.',
      },
      {
        title: 'Parent notice escalated',
        date: '05 Jul 2026',
        by: 'Priya Sundaram',
        note: 'Third notice sent after two went unanswered.',
      },
      {
        title: 'Fourth written notice dismissed',
        date: '04 Jul 2026',
        by: 'Leela Nambiar',
        note: 'Rejected in favour of a face-to-face meeting. Reason: recovery rate 1 in 10.',
      },
    ],
    actions: [
      { id: 'teacher', title: 'Assign Teacher', state: 'Assigned', note: 'Teena Mathew' },
      { id: 'counselor', title: 'Assign Counselor', state: 'Assigned', note: 'Dr. Anjali Rao' },
      { id: 'meeting', title: 'Schedule Parent Meeting', state: 'Required', note: 'Not yet booked' },
      { id: 'plan', title: 'Create Recovery Plan', state: 'Pending', note: 'Draft ready to approve' },
      { id: 'academic', title: 'Academic Support', state: 'In progress', note: 'Mathematics and English' },
      { id: 'behaviour', title: 'Behaviour Monitoring', state: 'Not needed', note: 'Not applicable for this case' },
      { id: 'finance', title: 'Financial Assistance', state: 'Review', note: 'One term outstanding' },
      { id: 'medical', title: 'Medical Review', state: 'Not needed', note: 'No health flags recorded' },
    ],
    progress: [
      { title: 'Risk detected', date: '02 Jul 2026', note: 'Score 91, critical band.' },
      { title: 'Teacher assigned', date: '03 Jul 2026', note: 'Teena Mathew, weekly Thursday check-in.' },
      { title: 'Parent contacted', date: '05 Jul 2026', note: 'Guardian acknowledged the notice.' },
      { title: 'Counseling started', date: '11 Jul 2026', note: 'Transport identified as the root cause.' },
      { title: 'Recovery plan opened', date: '15 Jul 2026', note: 'Route change plus catch-up sessions.' },
      { title: 'Performance improved', date: '29 Jul 2026', note: 'Attendance 86%, score down to 58.' },
    ],
    reviews: [
      { week: 4, date: '29 Jul 2026', score: 58, verdict: 'On track' },
      { week: 3, date: '22 Jul 2026', score: 71, verdict: 'On track' },
      { week: 2, date: '15 Jul 2026', score: 78, verdict: 'Slow' },
      { week: 1, date: '08 Jul 2026', score: 84, verdict: 'Slow' },
    ],
    completed: [
      { title: 'Teacher mentor assigned', date: '03 Jul' },
      { title: 'Guardian notice acknowledged', date: '05 Jul' },
      { title: 'Counselor session held', date: '11 Jul' },
      { title: 'Transport rerouted to Route 4', date: '16 Jul' },
      { title: 'Catch-up block started', date: '18 Jul' },
      { title: 'Checkpoint 2 passed', date: '26 Jul' },
    ],
    audit: [
      { title: 'Score recalculated 91 to 58', date: '29 Jul 2026', by: 'AI Risk Engine' },
      { title: 'Checkpoint 2 marked passed', date: '26 Jul 2026', by: 'Leela Nambiar' },
      { title: 'Transport reassignment applied', date: '16 Jul 2026', by: 'Priya Sundaram' },
      { title: 'Counselor session logged', date: '11 Jul 2026', by: 'Dr. Anjali Rao' },
      { title: 'Case opened by nightly run', date: '02 Jul 2026', by: 'AI Risk Engine' },
    ],
  },

  {
    id: 'RSK-0871',
    student: 'Kabir Sethi',
    studentId: 'STU-0871',
    className: 'Class VIII-A',
    image: 'assets/img/students/student-02.jpg',
    score: 88,
    confidence: 94,
    primaryRisk: 'Dropout signature',
    status: 'Open',
    updatedNote: 'updated 2 hours ago',
    daysOpen: 8,
    stage: 'Parent contact',
    nextReview: '04 Aug 2026',
    openedOn: '23 Jul 2026',
    projectedClosure: '18 Sep 2026',
    successProbability: 62,
    teacher: 'Meera Joshi',
    teacherImage: 'assets/img/teachers/teacher-03.jpg',
    counselor: 'Dr. Anjali Rao',
    counselorImage: 'assets/img/profiles/avatar-02.jpg',
    trajectory: [52, 55, 61, 66, 72, 80, 86, 88],
    guardian: 'Mrs. Neha Sethi',
    guardianPhone: '+91 98450 31877',
    predictedOutcome: 'Withdrawal risk at term end',
    suggestedIntervention: 'Assign mentor, open a parent conversation within 7 days',
    signals: [
      { group: 'Attendance', reading: '71% this term' },
      { group: 'Academics', reading: 'A to C+' },
      { group: 'Finance', reading: 'Two terms due' },
      { group: 'Behaviour', reading: 'Withdrawn in class' },
      { group: 'Health', reading: 'No flags', clean: true },
      { group: 'Transport', reading: 'Not enrolled', clean: true },
    ],
    observation: 'Every disengagement signal moved at once',
    observationDate: '23 Jul 2026 · confirmed on three runs',
    reasoning:
      'Attendance, participation and submission rate all fell in the same fortnight, and the fee account went two terms behind in the same window. That pairing is the dropout signature: in the closed archive, families under financial strain disengage before they withdraw. No single signal is severe; the shape of them together is what the engine flagged.',
    supportingSignals: [
      { label: 'Signals moving', value: '4 of 6' },
      { label: 'Submissions', value: '3 of 11' },
      { label: 'Fee arrears', value: 'Two terms' },
      { label: 'Archive match', value: '10 signatures' },
    ],
    detection: [
      { title: 'Second fee term missed', date: '02 Jul 2026', note: 'No contact from the family.' },
      { title: 'Participation fell away', date: '09 Jul 2026', note: 'Three subject teachers logged it.' },
      { title: 'Submissions stopped', date: '16 Jul 2026', note: 'Eight of eleven pieces not handed in.' },
      { title: 'Case opened', date: '23 Jul 2026', note: 'Signature matched ten closed withdrawals.' },
    ],
    evidence: [
      { source: 'Attendance register', scope: 'Term 2' },
      { source: 'Submission log', scope: '11 assignments' },
      { source: 'Fee ledger', scope: 'Two terms' },
      { source: 'Teacher observations', scope: '3 subjects' },
      { source: 'Closed case archive', scope: '10 withdrawals' },
    ],
    related: [
      { name: 'Farhan Ali', className: 'VII-B', note: 'Same signature · retained after hardship review', match: 91 },
      { name: 'Divya Menon', className: 'IX-A', note: 'Same signature · withdrew at term end', match: 86 },
    ],
    recommendations: [
      {
        id: 'hardship',
        title: 'Hardship Review',
        urgency: 'Urgent',
        confidence: 94,
        reasoning:
          'The fee account moved first. In eight of ten comparable cases a hardship review reversed the disengagement.',
        outcome: 'Removes the trigger',
        timeline: '1 week',
      },
      {
        id: 'mentor',
        title: 'Assign Mentor',
        urgency: 'Urgent',
        confidence: 92,
        reasoning: 'A named adult inside seven days is what separates the retained cases from the withdrawn.',
        outcome: 'Re-engagement',
        timeline: '2 weeks',
      },
      {
        id: 'family',
        title: 'Family Conversation',
        urgency: 'High',
        confidence: 88,
        reasoning: 'Nothing has been heard from the family in six weeks. A conversation precedes every recovery.',
        outcome: 'Restores contact',
        timeline: '7 days',
      },
    ],
    decisions: [
      {
        title: 'Case escalated to the counselor',
        date: '25 Jul 2026',
        by: 'Meera Joshi',
        note: 'Dropout signature confirmed on the second run.',
      },
    ],
    actions: [
      { id: 'teacher', title: 'Assign Teacher', state: 'Assigned', note: 'Meera Joshi' },
      { id: 'counselor', title: 'Assign Counselor', state: 'Assigned', note: 'Dr. Anjali Rao' },
      { id: 'meeting', title: 'Schedule Parent Meeting', state: 'Required', note: 'Within seven days' },
      { id: 'plan', title: 'Create Recovery Plan', state: 'Pending', note: 'Waiting on the family conversation' },
      { id: 'academic', title: 'Academic Support', state: 'Required', note: 'Eight pieces outstanding' },
      { id: 'behaviour', title: 'Behaviour Monitoring', state: 'Not needed', note: 'Withdrawn, not disruptive' },
      { id: 'finance', title: 'Financial Assistance', state: 'Required', note: 'Two terms outstanding' },
      { id: 'medical', title: 'Medical Review', state: 'Not needed', note: 'No health flags recorded' },
    ],
    progress: [
      { title: 'Risk detected', date: '23 Jul 2026', note: 'Score 88, critical band.' },
      { title: 'Teacher assigned', date: '24 Jul 2026', note: 'Meera Joshi, daily check-in.' },
      { title: 'Escalated to counselor', date: '25 Jul 2026', note: 'Dropout signature confirmed.' },
    ],
    reviews: [{ week: 1, date: '30 Jul 2026', score: 88, verdict: 'Stalled' }],
    completed: [
      { title: 'Teacher mentor assigned', date: '24 Jul' },
      { title: 'Counselor escalation logged', date: '25 Jul' },
    ],
    audit: [
      { title: 'Case escalated to counselor', date: '25 Jul 2026', by: 'Meera Joshi' },
      { title: 'Case opened by nightly run', date: '23 Jul 2026', by: 'AI Risk Engine' },
    ],
  },

  {
    id: 'RSK-1190',
    student: 'George Kettut',
    studentId: 'STU-1190',
    className: 'Class II-A',
    image: 'assets/img/students/student-03.jpg',
    score: 84,
    confidence: 92,
    primaryRisk: 'Behaviour escalation',
    status: 'Open',
    updatedNote: 'updated 5 hours ago',
    daysOpen: 12,
    stage: 'Counselor review',
    nextReview: '06 Aug 2026',
    openedOn: '19 Jul 2026',
    projectedClosure: '10 Sep 2026',
    successProbability: 71,
    teacher: 'Daniel Josua',
    teacherImage: 'assets/img/teachers/teacher-04.jpg',
    counselor: 'Mr. Vinod Kamath',
    counselorImage: 'assets/img/profiles/avatar-05.jpg',
    trajectory: [38, 44, 52, 61, 68, 76, 82, 84],
    guardian: 'Mrs. Grace Kettut',
    guardianPhone: '+91 98450 11902',
    predictedOutcome: 'Formal escalation in 3 weeks',
    suggestedIntervention: 'Weekly behaviour monitoring with one named observer',
    signals: [
      { group: 'Attendance', reading: '92% this term', clean: true },
      { group: 'Academics', reading: 'Holding at B' },
      { group: 'Finance', reading: 'Up to date', clean: true },
      { group: 'Behaviour', reading: '6 incidents in 4 weeks' },
      { group: 'Health', reading: 'Sleep noted by guardian' },
      { group: 'Transport', reading: 'Not enrolled', clean: true },
    ],
    observation: 'Six incidents in four weeks, all after 1 pm',
    observationDate: '19 Jul 2026 · re-confirmed twice since',
    reasoning:
      'Every incident falls in the afternoon block and none in the morning. Attendance, academics and finance are all clean, so the engine reads this as a within-day pattern rather than a general escalation. The guardian has separately noted disturbed sleep, which the afternoon timing is consistent with.',
    supportingSignals: [
      { label: 'Incidents', value: '6 in 4 weeks' },
      { label: 'Time of day', value: 'All after 1 pm' },
      { label: 'Morning incidents', value: 'None' },
      { label: 'Observers', value: '3 different staff' },
    ],
    detection: [
      { title: 'First incident logged', date: '22 Jun 2026', note: 'Afternoon block, one observer.' },
      { title: 'Pattern noticed', date: '06 Jul 2026', note: 'Third incident, same time of day.' },
      { title: 'Guardian raised sleep', date: '14 Jul 2026', note: 'Mentioned at the open house.' },
      { title: 'Case opened', date: '19 Jul 2026', note: 'Sixth incident crossed the behaviour threshold.' },
    ],
    evidence: [
      { source: 'Incident log', scope: '6 entries, 4 weeks' },
      { source: 'Timetable', scope: 'Afternoon block' },
      { source: 'Guardian notes', scope: 'Open house record' },
      { source: 'Attendance register', scope: 'Term 2' },
    ],
    related: [
      { name: 'Aditya Bose', className: 'III-B', note: 'Same signature · resolved with a timetable change', match: 89 },
      { name: 'Sara Nathan', className: 'II-C', note: 'Same signature · medical cause found', match: 83 },
    ],
    recommendations: [
      {
        id: 'observer',
        title: 'Named Observer',
        urgency: 'Urgent',
        confidence: 92,
        reasoning:
          'Three different staff have logged incidents. One named observer removes the inconsistency in how they are recorded.',
        outcome: 'Reliable record',
        timeline: 'Immediate',
      },
      {
        id: 'medical',
        title: 'Sleep Review',
        urgency: 'High',
        confidence: 87,
        reasoning:
          'The afternoon-only pattern and the guardian’s note point the same way. Two comparable cases had a medical cause.',
        outcome: 'Finds the cause',
        timeline: '2 weeks',
      },
      {
        id: 'timetable',
        title: 'Afternoon Timetable Review',
        urgency: 'Medium',
        confidence: 81,
        reasoning: 'A timetable change resolved the closest comparable case entirely.',
        outcome: 'Removes trigger',
        timeline: '3 weeks',
      },
    ],
    decisions: [
      {
        title: 'Counselor review opened',
        date: '21 Jul 2026',
        by: 'Daniel Josua',
        note: 'Afternoon pattern accepted as the working explanation.',
      },
    ],
    actions: [
      { id: 'teacher', title: 'Assign Teacher', state: 'Assigned', note: 'Daniel Josua' },
      { id: 'counselor', title: 'Assign Counselor', state: 'Assigned', note: 'Mr. Vinod Kamath' },
      { id: 'meeting', title: 'Schedule Parent Meeting', state: 'Pending', note: 'After the sleep review' },
      { id: 'plan', title: 'Create Recovery Plan', state: 'Pending', note: 'Waiting on the cause' },
      { id: 'academic', title: 'Academic Support', state: 'Not needed', note: 'Holding at B' },
      { id: 'behaviour', title: 'Behaviour Monitoring', state: 'In progress', note: 'Weekly, one named observer' },
      { id: 'finance', title: 'Financial Assistance', state: 'Not needed', note: 'Account up to date' },
      { id: 'medical', title: 'Medical Review', state: 'Required', note: 'Sleep noted by the guardian' },
    ],
    progress: [
      { title: 'Risk detected', date: '19 Jul 2026', note: 'Score 84, critical band.' },
      { title: 'Teacher assigned', date: '20 Jul 2026', note: 'Daniel Josua, named observer.' },
      { title: 'Counselor review opened', date: '21 Jul 2026', note: 'Afternoon pattern confirmed.' },
    ],
    reviews: [
      { week: 2, date: '30 Jul 2026', score: 84, verdict: 'Stalled' },
      { week: 1, date: '23 Jul 2026', score: 86, verdict: 'Slow' },
    ],
    completed: [
      { title: 'Named observer assigned', date: '20 Jul' },
      { title: 'Counselor review opened', date: '21 Jul' },
    ],
    audit: [
      { title: 'Counselor review opened', date: '21 Jul 2026', by: 'Daniel Josua' },
      { title: 'Case opened by nightly run', date: '19 Jul 2026', by: 'AI Risk Engine' },
    ],
  },

  {
    id: 'RSK-0654',
    student: 'Sophia Reyes',
    studentId: 'STU-0654',
    className: 'Class III-A',
    image: 'assets/img/students/student-06.jpg',
    score: 76,
    confidence: 89,
    primaryRisk: 'Academic decline',
    status: 'Open',
    updatedNote: 'updated Yesterday',
    daysOpen: 14,
    stage: 'Mentor assigned',
    nextReview: '07 Aug 2026',
    openedOn: '17 Jul 2026',
    projectedClosure: '04 Sep 2026',
    successProbability: 78,
    teacher: 'Leela Nambiar',
    teacherImage: 'assets/img/teachers/teacher-05.jpg',
    counselor: 'Mr. Vinod Kamath',
    counselorImage: 'assets/img/profiles/avatar-05.jpg',
    trajectory: [44, 48, 55, 60, 66, 71, 74, 76],
    guardian: 'Mr. Carlos Reyes',
    guardianPhone: '+91 98450 66540',
    predictedOutcome: 'Two more bands lost by term end',
    suggestedIntervention: 'Academic mentor plus twice-weekly submission checkpoint',
    signals: [
      { group: 'Attendance', reading: '94% this term', clean: true },
      { group: 'Academics', reading: 'A to C, three subjects' },
      { group: 'Finance', reading: 'Up to date', clean: true },
      { group: 'Behaviour', reading: 'No incidents', clean: true },
      { group: 'Health', reading: 'No flags', clean: true },
      { group: 'Transport', reading: 'Route 2, on time', clean: true },
    ],
    observation: 'Three subjects fell two bands with attendance untouched',
    observationDate: '17 Jul 2026 · confirmed on two runs',
    reasoning:
      'Attendance is 94% and every other signal is clean, so the decline is not absence-driven. The three subjects that fell all changed to the new assessment scheme in the same fortnight, and submissions dropped rather than marks — the engine reads this as a workload or method problem, not a capability one.',
    supportingSignals: [
      { label: 'Subjects down', value: '3 of 6' },
      { label: 'Band movement', value: 'A to C' },
      { label: 'Attendance', value: '94%' },
      { label: 'Submissions', value: '9 of 16' },
    ],
    detection: [
      { title: 'Assessment scheme changed', date: '15 Jun 2026', note: 'Three subjects moved to portfolio work.' },
      { title: 'Submissions slipped', date: '29 Jun 2026', note: 'Seven pieces late across the three.' },
      { title: 'Bands fell', date: '10 Jul 2026', note: 'A to C in Mathematics, Science and English.' },
      { title: 'Case opened', date: '17 Jul 2026', note: 'Academic trajectory crossed the threshold.' },
    ],
    evidence: [
      { source: 'Submission log', scope: '16 pieces, 3 subjects' },
      { source: 'Unit test results', scope: 'Term 2' },
      { source: 'Assessment scheme record', scope: 'Change of 15 Jun' },
      { source: 'Attendance register', scope: 'Term 2' },
    ],
    related: [
      { name: 'Tanvi Rao', className: 'IV-A', note: 'Same signature · recovered with a checkpoint plan', match: 92 },
      { name: 'Kiran Shah', className: 'III-C', note: 'Same signature · recovered in 6 weeks', match: 85 },
    ],
    recommendations: [
      {
        id: 'checkpoint',
        title: 'Twice-weekly Checkpoint',
        urgency: 'Urgent',
        confidence: 89,
        reasoning:
          'Submissions, not marks, are what fell. A checkpoint recovered both comparable cases inside six weeks.',
        outcome: 'Submissions back',
        timeline: '6 weeks',
      },
      {
        id: 'mentor',
        title: 'Academic Mentor',
        urgency: 'High',
        confidence: 86,
        reasoning: 'A named mentor for the three affected subjects, reviewed at each checkpoint.',
        outcome: 'One band back',
        timeline: '8 weeks',
      },
    ],
    decisions: [
      {
        title: 'Mentor assigned',
        date: '19 Jul 2026',
        by: 'Leela Nambiar',
        note: 'Accepted. Twice-weekly checkpoint starts the same week.',
      },
    ],
    actions: [
      { id: 'teacher', title: 'Assign Teacher', state: 'Assigned', note: 'Leela Nambiar' },
      { id: 'counselor', title: 'Assign Counselor', state: 'Assigned', note: 'Mr. Vinod Kamath' },
      { id: 'meeting', title: 'Schedule Parent Meeting', state: 'Pending', note: 'At the first checkpoint' },
      { id: 'plan', title: 'Create Recovery Plan', state: 'In progress', note: 'Checkpoint plan running' },
      { id: 'academic', title: 'Academic Support', state: 'In progress', note: 'Three subjects' },
      { id: 'behaviour', title: 'Behaviour Monitoring', state: 'Not needed', note: 'No incidents' },
      { id: 'finance', title: 'Financial Assistance', state: 'Not needed', note: 'Account up to date' },
      { id: 'medical', title: 'Medical Review', state: 'Not needed', note: 'No health flags recorded' },
    ],
    progress: [
      { title: 'Risk detected', date: '17 Jul 2026', note: 'Score 76, high band.' },
      { title: 'Mentor assigned', date: '19 Jul 2026', note: 'Leela Nambiar, twice weekly.' },
      { title: 'Checkpoint plan opened', date: '22 Jul 2026', note: 'Three subjects in scope.' },
    ],
    reviews: [
      { week: 2, date: '31 Jul 2026', score: 76, verdict: 'On track' },
      { week: 1, date: '24 Jul 2026', score: 79, verdict: 'Slow' },
    ],
    completed: [
      { title: 'Academic mentor assigned', date: '19 Jul' },
      { title: 'Checkpoint plan opened', date: '22 Jul' },
      { title: 'Checkpoint 1 passed', date: '29 Jul' },
    ],
    audit: [
      { title: 'Checkpoint 1 marked passed', date: '29 Jul 2026', by: 'Leela Nambiar' },
      { title: 'Mentor assigned', date: '19 Jul 2026', by: 'Leela Nambiar' },
      { title: 'Case opened by nightly run', date: '17 Jul 2026', by: 'AI Risk Engine' },
    ],
  },

  {
    id: 'RSK-0328',
    student: 'Aarav Menon',
    studentId: 'STU-0328',
    className: 'Class VI-B',
    image: 'assets/img/students/student-08.jpg',
    score: 71,
    confidence: 87,
    primaryRisk: 'Fee default risk',
    status: 'Open',
    updatedNote: 'updated Yesterday',
    daysOpen: 21,
    stage: 'Fund review',
    nextReview: '08 Aug 2026',
    openedOn: '10 Jul 2026',
    projectedClosure: '28 Aug 2026',
    successProbability: 74,
    teacher: 'Priya Sundaram',
    teacherImage: 'assets/img/teachers/teacher-06.jpg',
    counselor: 'Ms. Kavita Menon',
    counselorImage: 'assets/img/profiles/avatar-12.jpg',
    trajectory: [35, 41, 48, 56, 62, 68, 70, 71],
    guardian: 'Mr. Ramesh Menon',
    guardianPhone: '+91 98450 03288',
    predictedOutcome: 'Enrolment lapse at fee cut-off',
    suggestedIntervention: 'Hardship fund review before the term-end deadline',
    signals: [
      { group: 'Attendance', reading: '89% this term' },
      { group: 'Academics', reading: 'Steady at B+', clean: true },
      { group: 'Finance', reading: 'Two terms due' },
      { group: 'Behaviour', reading: 'No incidents', clean: true },
      { group: 'Health', reading: 'No flags', clean: true },
      { group: 'Transport', reading: 'Route 4, on time', clean: true },
    ],
    observation: 'Fee account two terms behind with academics untouched',
    observationDate: '10 Jul 2026 · confirmed on four runs',
    reasoning:
      'Academics, behaviour and health are all clean, so this is a household signal rather than a student one. The account went behind the month the guardian’s employer was reported closing, and attendance has slipped only on days a payment reminder went out. The engine reads financial strain, not disengagement.',
    supportingSignals: [
      { label: 'Fee arrears', value: 'Two terms' },
      { label: 'Reminders sent', value: '4' },
      { label: 'Academics', value: 'Steady at B+' },
      { label: 'Hardship fund', value: 'Not yet applied' },
    ],
    detection: [
      { title: 'First term missed', date: '02 May 2026', note: 'No contact from the family.' },
      { title: 'Second term missed', date: '05 Jul 2026', note: 'Two reminders unanswered.' },
      { title: 'Attendance slipped', date: '08 Jul 2026', note: 'Absent on reminder days.' },
      { title: 'Case opened', date: '10 Jul 2026', note: 'Enrolment lapse projected at the cut-off.' },
    ],
    evidence: [
      { source: 'Fee ledger', scope: 'Two terms' },
      { source: 'Reminder log', scope: '4 sent' },
      { source: 'Attendance register', scope: 'Term 2' },
      { source: 'Hardship fund register', scope: 'No application' },
    ],
    related: [
      { name: 'Ishan Gupta', className: 'VI-A', note: 'Same signature · retained after hardship award', match: 90 },
      { name: 'Neha Rathi', className: 'V-B', note: 'Same signature · instalment plan agreed', match: 84 },
    ],
    recommendations: [
      {
        id: 'hardship',
        title: 'Hardship Fund Review',
        urgency: 'Urgent',
        confidence: 87,
        reasoning:
          'Both comparable cases were retained by a hardship award. The deadline is the term-end cut-off.',
        outcome: 'Retains enrolment',
        timeline: '2 weeks',
      },
      {
        id: 'instalment',
        title: 'Instalment Plan',
        urgency: 'High',
        confidence: 83,
        reasoning: 'If the fund is not awarded, an instalment plan has retained one comparable case.',
        outcome: 'Clears arrears',
        timeline: '1 term',
      },
    ],
    decisions: [
      {
        title: 'Fund review opened',
        date: '14 Jul 2026',
        by: 'Priya Sundaram',
        note: 'Application raised on the family’s behalf.',
      },
    ],
    actions: [
      { id: 'teacher', title: 'Assign Teacher', state: 'Assigned', note: 'Priya Sundaram' },
      { id: 'counselor', title: 'Assign Counselor', state: 'Assigned', note: 'Ms. Kavita Menon' },
      { id: 'meeting', title: 'Schedule Parent Meeting', state: 'Required', note: 'Before the cut-off' },
      { id: 'plan', title: 'Create Recovery Plan', state: 'Pending', note: 'Depends on the fund decision' },
      { id: 'academic', title: 'Academic Support', state: 'Not needed', note: 'Steady at B+' },
      { id: 'behaviour', title: 'Behaviour Monitoring', state: 'Not needed', note: 'No incidents' },
      { id: 'finance', title: 'Financial Assistance', state: 'In progress', note: 'Hardship fund review' },
      { id: 'medical', title: 'Medical Review', state: 'Not needed', note: 'No health flags recorded' },
    ],
    progress: [
      { title: 'Risk detected', date: '10 Jul 2026', note: 'Score 71, high band.' },
      { title: 'Teacher assigned', date: '11 Jul 2026', note: 'Priya Sundaram.' },
      { title: 'Fund review opened', date: '14 Jul 2026', note: 'Application raised.' },
    ],
    reviews: [
      { week: 3, date: '31 Jul 2026', score: 71, verdict: 'On track' },
      { week: 2, date: '24 Jul 2026', score: 73, verdict: 'Slow' },
      { week: 1, date: '17 Jul 2026', score: 75, verdict: 'Slow' },
    ],
    completed: [
      { title: 'Teacher assigned', date: '11 Jul' },
      { title: 'Hardship application raised', date: '14 Jul' },
    ],
    audit: [
      { title: 'Fund review opened', date: '14 Jul 2026', by: 'Priya Sundaram' },
      { title: 'Case opened by nightly run', date: '10 Jul 2026', by: 'AI Risk Engine' },
    ],
  },

  {
    id: 'RSK-1487',
    student: 'Maria Fernandes',
    studentId: 'STU-1487',
    className: 'Class IX-C',
    image: 'assets/img/students/student-07.jpg',
    score: 63,
    confidence: 84,
    primaryRisk: 'Recurring health absence',
    status: 'Open',
    updatedNote: 'updated 2 days ago',
    daysOpen: 17,
    stage: 'Medical review',
    nextReview: '11 Aug 2026',
    openedOn: '14 Jul 2026',
    projectedClosure: '25 Aug 2026',
    successProbability: 81,
    teacher: 'Rakesh Sharma',
    teacherImage: 'assets/img/teachers/teacher-08.jpg',
    counselor: 'Ms. Kavita Menon',
    counselorImage: 'assets/img/profiles/avatar-12.jpg',
    trajectory: [30, 36, 42, 48, 54, 58, 61, 63],
    guardian: 'Mrs. Anita Fernandes',
    guardianPhone: '+91 98450 14876',
    predictedOutcome: 'Stable if timetable eases',
    suggestedIntervention: 'Medical check and afternoon timetable review',
    signals: [
      { group: 'Attendance', reading: '84% this term' },
      { group: 'Academics', reading: 'Holding at B+', clean: true },
      { group: 'Finance', reading: 'Up to date', clean: true },
      { group: 'Behaviour', reading: 'No incidents', clean: true },
      { group: 'Health', reading: '9 medical absences' },
      { group: 'Transport', reading: 'Route 2, on time', clean: true },
    ],
    observation: 'Nine medical absences, all with a certificate',
    observationDate: '14 Jul 2026 · confirmed on two runs',
    reasoning:
      'Every absence carries a certificate and the academic record has held, so this is not a disengagement pattern. The absences cluster on days with a double afternoon practical, which the medical notes are consistent with. The engine reads a timetable interaction rather than a worsening condition.',
    supportingSignals: [
      { label: 'Medical absences', value: '9' },
      { label: 'Certificates', value: '9 of 9' },
      { label: 'Clustered on', value: 'Double practical days' },
      { label: 'Academics', value: 'Holding at B+' },
    ],
    detection: [
      { title: 'Practical block added', date: '08 Jun 2026', note: 'Two afternoon doubles a week.' },
      { title: 'Absences began', date: '18 Jun 2026', note: 'All on practical days.' },
      { title: 'Guardian raised fatigue', date: '06 Jul 2026', note: 'Noted at the medical room.' },
      { title: 'Case opened', date: '14 Jul 2026', note: 'Ninth absence crossed the health threshold.' },
    ],
    evidence: [
      { source: 'Medical room log', scope: '9 visits' },
      { source: 'Certificates on file', scope: '9 of 9' },
      { source: 'Timetable', scope: 'Afternoon practicals' },
      { source: 'Attendance register', scope: 'Term 2' },
    ],
    related: [
      { name: 'Priya Nair', className: 'IX-A', note: 'Same signature · resolved by timetable change', match: 88 },
    ],
    recommendations: [
      {
        id: 'medical',
        title: 'Medical Review',
        urgency: 'High',
        confidence: 84,
        reasoning: 'Nine certified absences warrant a review before any timetable change is made.',
        outcome: 'Confirms the cause',
        timeline: '2 weeks',
      },
      {
        id: 'timetable',
        title: 'Afternoon Timetable Review',
        urgency: 'Medium',
        confidence: 80,
        reasoning: 'The one comparable case was resolved entirely by moving the practical block.',
        outcome: 'Removes the trigger',
        timeline: '3 weeks',
      },
    ],
    decisions: [
      {
        title: 'Medical review requested',
        date: '16 Jul 2026',
        by: 'Rakesh Sharma',
        note: 'Certificates collated and sent to the school doctor.',
      },
    ],
    actions: [
      { id: 'teacher', title: 'Assign Teacher', state: 'Assigned', note: 'Rakesh Sharma' },
      { id: 'counselor', title: 'Assign Counselor', state: 'Assigned', note: 'Ms. Kavita Menon' },
      { id: 'meeting', title: 'Schedule Parent Meeting', state: 'Pending', note: 'After the medical review' },
      { id: 'plan', title: 'Create Recovery Plan', state: 'Pending', note: 'Waiting on the review' },
      { id: 'academic', title: 'Academic Support', state: 'Not needed', note: 'Holding at B+' },
      { id: 'behaviour', title: 'Behaviour Monitoring', state: 'Not needed', note: 'No incidents' },
      { id: 'finance', title: 'Financial Assistance', state: 'Not needed', note: 'Account up to date' },
      { id: 'medical', title: 'Medical Review', state: 'In progress', note: 'With the school doctor' },
    ],
    progress: [
      { title: 'Risk detected', date: '14 Jul 2026', note: 'Score 63, medium band.' },
      { title: 'Teacher assigned', date: '15 Jul 2026', note: 'Rakesh Sharma.' },
      { title: 'Medical review requested', date: '16 Jul 2026', note: 'Certificates collated.' },
    ],
    reviews: [
      { week: 2, date: '28 Jul 2026', score: 63, verdict: 'On track' },
      { week: 1, date: '21 Jul 2026', score: 66, verdict: 'On track' },
    ],
    completed: [
      { title: 'Teacher assigned', date: '15 Jul' },
      { title: 'Medical review requested', date: '16 Jul' },
    ],
    audit: [
      { title: 'Medical review requested', date: '16 Jul 2026', by: 'Rakesh Sharma' },
      { title: 'Case opened by nightly run', date: '14 Jul 2026', by: 'AI Risk Engine' },
    ],
  },
];

/* ------------------------------- Derivations ------------------------------- */

/** The score the queue bands on. */
export const bandOf = (row: RiskCase): RiskBand =>
  (RISK_BANDS.find((step) => row.score >= step.floor) ?? RISK_BANDS[RISK_BANDS.length - 1]).band;

export const bandTint: Record<RiskBand, string> = {
  Critical: 'danger',
  High: 'warning',
  Medium: 'info',
  Low: 'success',
};

/** Where the case has actually got to, which is the score the workspace shows. */
export const liveScoreOf = (row: RiskCase) => row.currentScore ?? row.score;

export const scoreMovementOf = (row: RiskCase) => row.score - liveScoreOf(row);

/**
 * How far through its own plan a case is.
 *
 * Days open against the days from detection to the projected closure — which
 * is where the template's "70% recovery" on Liam Walker comes from: 29 days of
 * the 41 between 2 Jul and 12 Aug.
 */
export const recoveryPctOf = (row: RiskCase) => {
  if (!row.projectedClosure) return null;
  const total = daysBetween(row.openedOn, row.projectedClosure);
  return total <= 0 ? null : Math.min(100, Math.floor((row.daysOpen / total) * 100));
};

/**
 * Whole days between two `d MMM yyyy` dates.
 *
 * Re-exported from the shared clock so every AI page counts days the same way.
 */
export { daysBetween };

/**
 * The review chain, read pairwise.
 *
 * Each review moved the score from whatever the review before it closed at, so
 * the movement is the pair rather than a written figure — which is what stops
 * the last review claiming it undid every one before it.
 */
export const reviewMovementsOf = (row: RiskCase) => {
  const ordered = [...row.reviews].sort((a, b) => a.week - b.week);
  return ordered
    .map((review, index) => ({
      ...review,
      from: index === 0 ? row.score : ordered[index - 1].score,
      to: review.score,
    }))
    .reverse();
};

/** A case is eligible for closure once it sits under the threshold. */
export const isCloseableOf = (row: RiskCase) => liveScoreOf(row) < REOPEN_THRESHOLD;

export const statusTint: Record<CaseStatus, string> = {
  Open: 'warning',
  Recovering: 'success',
  Closed: 'secondary',
};

/* ------------------------------ Queue counting ----------------------------- */

export const countByBand = (rows: RiskCase[], band: RiskBand) =>
  rows.filter((row) => bandOf(row) === band).length;

/** How many of the six carry an open recommendation nobody has decided on. */
export const openRecommendationsOf = (rows: RiskCase[]) =>
  rows.reduce(
    (total, row) => total + row.recommendations.filter((item) => !item.decision).length,
    0,
  );

/** Interventions actually running across the queue. */
export const inProgressActionsOf = (rows: RiskCase[]) =>
  rows.reduce(
    (total, row) => total + row.actions.filter((action) => action.state === 'In progress').length,
    0,
  );

/** Cases the engine has explained — every one it has opened. */
export const explainedOf = (rows: RiskCase[]) => rows.filter((row) => row.reasoning).length;

/* -------------------------------- The filters ------------------------------- */

export const searchIndexOf = (row: RiskCase) =>
  [row.student, row.id, row.className, row.primaryRisk, row.teacher, row.counselor]
    .join(' ')
    .toLowerCase();

export const RISK_FILTERS = ['Attendance', 'Academics', 'Behaviour', 'Finance', 'Health', 'Dropout'];

/** Which of the filter's risk families this case belongs to. */
export const riskFamilyOf = (row: RiskCase) => {
  const risk = row.primaryRisk.toLowerCase();
  if (risk.includes('attendance')) return 'Attendance';
  if (risk.includes('academic')) return 'Academics';
  if (risk.includes('behaviour')) return 'Behaviour';
  if (risk.includes('fee') || risk.includes('financial')) return 'Finance';
  if (risk.includes('health')) return 'Health';
  if (risk.includes('dropout') || risk.includes('withdrawal')) return 'Dropout';
  return 'Attendance';
};

export const SORT_OPTIONS = ['Risk score', 'Last updated', 'AI confidence', 'Student name'];

export const STAGES = [
  { step: '01', name: 'Detect', note: 'flagged' },
  { step: '02', name: 'Understand', note: 'explained' },
  { step: '03', name: 'Decide', note: 'recommended' },
  { step: '04', name: 'Act', note: 'in progress' },
  { step: '05', name: 'Track', note: 'closed' },
];
