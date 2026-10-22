import type { TeacherFacet } from './teachers.data';

export type WorkspaceStageId =
  | 'tw_profile'
  | 'tw_analysis'
  | 'tw_insights'
  | 'tw_coaching'
  | 'tw_growth';

export interface WorkspaceStage {
  id: WorkspaceStageId;
  /** `.tch-crumb-n` — "01" through "05". */
  n: string;
  /** First line of the crumb: "Stage 01". */
  stage: string;
  /** Second line: the stage name. */
  label: string;
}

export const workspaceStages: WorkspaceStage[] = [
  { id: 'tw_profile', n: '01', stage: 'Stage 01', label: 'Teacher Profile' },
  { id: 'tw_analysis', n: '02', stage: 'Stage 02', label: 'Teaching Analysis' },
  { id: 'tw_insights', n: '03', stage: 'Stage 03', label: 'AI Insights' },
  { id: 'tw_coaching', n: '04', stage: 'Stage 04', label: 'Coaching Plan' },
  { id: 'tw_growth', n: '05', stage: 'Stage 05', label: 'Professional Growth' },
];

export interface WorkspaceLine {
  label: string;
  value: string;
}

export interface WorkspacePill {
  label: string;
  tone: 'is-high' | 'is-mid' | 'is-low' | 'is-ai' | '';
  icon?: string;
}

export interface WorkspaceBox {
  id: string;
  heading: string;
  /** The template uses an `h4`, an `h5` and `h6`s; each is kept. */
  headingTag: 'h4' | 'h5' | 'h6';
  headingClass?: string;
  pill?: WorkspacePill;
  /** Column classes on the wrapper. */
  col: string;
  /** A `.tch-quote` paragraph before the lines. */
  quote?: string;
  lines?: WorkspaceLine[];
  /** The profile box renders bars instead of lines. */
  facets?: TeacherFacet[];
  /** Trailing note under the bars. */
  note?: string;
}

/* -------------------------------- Stage 01 -------------------------------- */

export const profileBoxes: WorkspaceBox[] = [
  {
    id: 'teacher-record',
    heading: 'Teacher record',
    headingTag: 'h4',
    headingClass: 'fs-15 fw-medium',
    col: 'col-12 col-xl-4',
    lines: [
      { label: 'Staff ID', value: 'TCH-0141' },
      { label: 'Department', value: 'Mathematics' },
      { label: 'Subjects', value: 'Algebra, Geometry' },
      { label: 'Joined', value: '14 Jun 2021' },
      { label: 'Classes taught', value: '4' },
      { label: 'Teaching style', value: 'Worked example first' },
    ],
  },
  {
    id: 'workload',
    heading: 'Workload',
    headingTag: 'h5',
    headingClass: 'fs-15',
    pill: { label: 'Within policy', tone: 'is-high' },
    col: 'col-12 col-xl-4',
    lines: [
      { label: 'Periods per week', value: '22 of 26' },
      { label: 'Contact hours', value: '18.5' },
      { label: 'Non-contact load', value: '6 hours' },
      { label: 'Marking turnaround', value: '2 days' },
      { label: 'Free periods', value: '4' },
      { label: 'Capacity', value: 'Available' },
    ],
  },
  {
    id: 'teaching-profile',
    heading: 'Teaching profile',
    headingTag: 'h6',
    pill: { label: 'Top decile', tone: 'is-high' },
    col: 'col-12 col-xl-4',
    facets: [
      { label: 'Engagement', value: 95, tone: 'is-high' },
      { label: 'Lesson planning', value: 92, tone: 'is-high' },
      { label: 'Assessment', value: 90, tone: 'is-high' },
      { label: 'Consistency', value: 88, tone: '' },
      { label: 'Workload', value: 68, tone: '' },
    ],
    note: 'Engagement and planning both sit in the top decile. Workload has room, which is why she is the natural candidate to lead the department session.',
  },
];

/* -------------------------------- Stage 02 -------------------------------- */

export const analysisBoxes: WorkspaceBox[] = [
  {
    id: 'teaching-behaviour',
    heading: 'Teaching behaviour',
    headingTag: 'h6',
    col: 'col-12 col-xl-4',
    lines: [
      { label: 'Structure', value: 'Worked example first' },
      { label: 'Adopted', value: 'Sep 2025' },
      { label: 'Pace', value: 'Slower start, faster finish' },
      { label: 'Seating', value: 'Groups of four' },
      { label: 'Questioning', value: 'Open, whole class' },
    ],
  },
  {
    id: 'classroom-engagement',
    heading: 'Classroom engagement',
    headingTag: 'h6',
    pill: { label: 'Highest in school', tone: 'is-high' },
    col: 'col-12 col-xl-4',
    lines: [
      { label: 'Volunteered contributions', value: '3x median' },
      { label: 'Held for', value: '19 weeks' },
      { label: 'Weakest class', value: 'VIII-C · 91' },
      { label: 'Strongest class', value: 'VII-A · 98' },
      { label: 'Class-to-class variance', value: '7 points' },
    ],
  },
  {
    id: 'lesson-planning',
    heading: 'Lesson planning',
    headingTag: 'h6',
    col: 'col-12 col-xl-4',
    lines: [
      { label: 'Plans filed ahead', value: 'Every cycle' },
      { label: 'Objectives stated', value: 'All plans' },
      { label: 'Differentiation noted', value: '11 of 12' },
      { label: 'Resources attached', value: 'All plans' },
      { label: 'Late filings', value: 'None' },
    ],
  },
  {
    id: 'assessment-quality',
    heading: 'Assessment quality',
    headingTag: 'h6',
    pill: { label: 'Benchmark', tone: 'is-high' },
    col: 'col-12 col-xl-4',
    lines: [
      { label: 'Papers built fresh', value: 'Every term' },
      { label: 'Question discrimination', value: 'Clean spread' },
      { label: 'Rubrics published ahead', value: 'Yes' },
      { label: 'Turnaround', value: '2 days' },
      { label: 'Reused papers', value: 'None' },
    ],
  },
  {
    id: 'student-feedback',
    heading: 'Student feedback',
    headingTag: 'h6',
    col: 'col-12 col-xl-4',
    lines: [
      { label: 'Named as clear', value: '3rd most often' },
      { label: 'Approachability', value: 'High' },
      { label: 'Pace comments', value: 'Two, both positive' },
      { label: 'Requests for more practice', value: '4' },
      { label: 'Negative themes', value: 'None recorded' },
    ],
  },
  {
    id: 'ai-confidence',
    heading: 'AI confidence by finding',
    headingTag: 'h6',
    pill: { label: 'Mean 94%', tone: 'is-ai', icon: 'ti ti-sparkles' },
    col: 'col-12 col-xl-4',
    lines: [
      { label: 'Engagement driver', value: '96%' },
      { label: 'Planning discipline', value: '94%' },
      { label: 'Assessment design', value: '92%' },
      { label: 'Workload headroom', value: '95%' },
      { label: 'Mentoring readiness', value: '91%' },
    ],
  },
];

/* -------------------------------- Stage 03 -------------------------------- */

export interface WorkspaceRecord {
  id: string;
  tone: 'is-high' | 'is-mid' | 'is-low';
  observation: string;
  confidence: number;
  body: string;
}

export const insightRecords: WorkspaceRecord[] = [
  {
    id: 'engagement',
    tone: 'is-high',
    observation: 'Excellent classroom engagement',
    confidence: 96,
    body: 'Volunteered student contributions in Teena Mathew’s classes run at three times the department median and have held for nineteen weeks. The rise began the week she moved to a worked-example-first structure, not at the start of a term, which rules out a calendar effect.',
  },
  {
    id: 'workload',
    tone: 'is-low',
    observation: 'Heavy teaching workload',
    confidence: 95,
    body: 'Meera Joshi holds 31 periods against a 26-period ceiling, and five of those fall in consecutive afternoon blocks. Her marking turnaround has lengthened from two days to six over the same period, while her engagement scores have not moved.',
  },
  {
    id: 'reviews',
    tone: 'is-mid',
    observation: 'Delayed assignment reviews',
    confidence: 92,
    body: 'Daniel Josua returns work an average of eight days after submission against a department norm of three. The delay is concentrated entirely in practical write-ups, which take him four times as long to mark as theory work.',
  },
  {
    id: 'participation',
    tone: 'is-high',
    observation: 'High student participation',
    confidence: 91,
    body: 'Across the four teachers using small-group seating, participation sits eighteen points above those using rows. The effect appears within three weeks of the change and is independent of subject or year group.',
  },
];

export const insightBoxes: WorkspaceBox[] = [
  {
    id: 'teaching-strengths',
    heading: 'Teaching strengths',
    headingTag: 'h6',
    pill: { label: '4 found', tone: 'is-high' },
    col: 'col-md-6',
    lines: [
      { label: 'Engagement', value: 'Top decile' },
      { label: 'Planning', value: 'Top decile' },
      { label: 'Assessment design', value: 'Benchmark' },
      { label: 'Consistency', value: 'Strong' },
    ],
  },
  {
    id: 'improvement-areas',
    heading: 'Improvement areas',
    headingTag: 'h6',
    pill: { label: '4 noted', tone: 'is-mid' },
    col: 'col-md-6',
    lines: [
      { label: 'Whole-class questioning', value: 'Could widen' },
      { label: 'Written feedback depth', value: 'Brief' },
      { label: 'Peer observation given', value: 'None yet' },
      { label: 'Digital resources', value: 'Minimal' },
    ],
  },
  {
    id: 'supporting-evidence',
    heading: 'Supporting evidence',
    headingTag: 'h6',
    col: 'col-12',
    lines: [
      { label: 'Observation cycles', value: '4' },
      { label: 'Lesson records reviewed', value: '96' },
      { label: 'Student feedback responses', value: '112' },
      { label: 'Assessment papers analysed', value: '11' },
      { label: 'Comparison cohort', value: '42 teachers' },
    ],
  },
  {
    id: 'similar-profiles',
    heading: 'Similar teaching profiles',
    headingTag: 'h6',
    col: 'col-12',
    lines: [
      { label: 'Daniel Josua · Science', value: 'Practical first, same lift' },
      { label: 'Leela Nambiar · Biology', value: 'Planning twin, lower engagement' },
      { label: 'Meera Joshi · English', value: 'Discussion led, higher load' },
      { label: 'Teachers with this structure', value: '4 of 42' },
    ],
  },
];

/* -------------------------------- Stage 04 -------------------------------- */

export const coachingPlanBox: WorkspaceBox = {
  id: 'ai-coaching-plan',
  heading: 'AI coaching plan',
  headingTag: 'h6',
  pill: { label: 'Drafted', tone: 'is-ai' },
  col: 'col-12 col-xl-5',
  quote:
    'This is a lead-others plan rather than an improve-yourself plan. The engine found nothing to correct; it found something to spread. The ask is twenty minutes at the department meeting and two observation slots.',
  lines: [
    { label: 'Focus', value: 'Lead, not improve' },
    { label: 'Duration', value: 'One term' },
    { label: 'Ask', value: '20 min department session' },
    { label: 'Observation slots', value: '2' },
    { label: 'Owner', value: 'Head of Mathematics' },
    { label: 'Review', value: '30 Sep 2026' },
  ],
};

export const coachingBoxes: WorkspaceBox[] = [
  {
    id: 'professional-development',
    heading: 'Professional development',
    headingTag: 'h6',
    col: 'col-md-6',
    lines: [
      { label: 'Mentoring certification', value: 'Eligible now' },
      { label: 'Assessment design lead', value: 'Recommended' },
      { label: 'Digital resources course', value: 'Optional' },
      { label: 'Completed this year', value: '3 of 3' },
    ],
  },
  {
    id: 'weekly-goals',
    heading: 'Weekly goals',
    headingTag: 'h6',
    col: 'col-md-6',
    lines: [
      { label: 'Week 1', value: 'Prepare department session' },
      { label: 'Week 2', value: 'Deliver session' },
      { label: 'Week 3', value: 'Observe two adopters' },
      { label: 'Week 4', value: 'Feedback and adjust' },
    ],
  },
  {
    id: 'leadership-recommendations',
    heading: 'Leadership recommendations',
    headingTag: 'h6',
    pill: { label: 'Ready', tone: 'is-high' },
    col: 'col-md-6',
    lines: [
      { label: 'Mentoring pair', value: 'Recommended' },
      { label: 'Department lead', value: 'Ready in 1 year' },
      { label: 'Assessment working group', value: 'Recommended' },
      { label: 'Promotion criteria met', value: '5 of 5' },
    ],
  },
  {
    id: 'training-suggestions',
    heading: 'Training suggestions',
    headingTag: 'h6',
    col: 'col-md-6',
    lines: [
      { label: 'Mentoring skills', value: '2 days' },
      { label: 'Digital resources', value: '1 day, optional' },
      { label: 'Assessment design lead', value: 'Half day' },
      { label: 'Protected periods needed', value: '3' },
    ],
  },
];

/* -------------------------------- Stage 05 -------------------------------- */

export const growthBoxes: WorkspaceBox[] = [
  {
    id: 'completed-goals',
    heading: 'Completed goals',
    headingTag: 'h6',
    col: 'col-md-6',
    lines: [
      { label: 'Method change embedded', value: '19 weeks' },
      { label: 'Engagement target', value: 'Exceeded' },
      { label: 'Planning discipline', value: 'Maintained' },
      { label: 'Training this year', value: '3 of 3' },
    ],
  },
  {
    id: 'teaching-improvements',
    heading: 'Teaching improvements',
    headingTag: 'h6',
    col: 'col-md-6',
    lines: [
      { label: 'Engagement', value: '78 to 95' },
      { label: 'Assessment', value: '84 to 90' },
      { label: 'Class variance', value: '19 to 7 points' },
      { label: 'Marking turnaround', value: '4 days to 2' },
    ],
  },
  {
    id: 'success-indicators',
    heading: 'Success indicators',
    headingTag: 'h6',
    pill: { label: 'On track', tone: 'is-high' },
    col: 'col-md-6',
    lines: [
      { label: 'Adopters above previous best', value: '3 of 4' },
      { label: 'Gain held', value: '19 weeks' },
      { label: 'Student feedback', value: 'Improving' },
      { label: 'Open concerns', value: 'None' },
    ],
  },
  {
    id: 'career-roadmap',
    heading: 'Career roadmap',
    headingTag: 'h6',
    col: 'col-md-6',
    lines: [
      { label: 'Now', value: 'Senior teacher' },
      { label: 'Next', value: 'Mentor, this term' },
      { label: '12 months', value: 'Assessment lead' },
      { label: '24 months', value: 'Head of department' },
    ],
  },
];
