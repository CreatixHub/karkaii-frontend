import { addDays, daysBetween } from '../../data/dates';
import { FAMILIES_MODELLED, LAST_RUN, RUN_DATE } from '../../data/registers';

export { LAST_RUN, RUN_DATE, FAMILIES_MODELLED };

const mean = (values: number[]) =>
  values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;

/* ------------------------------------------------------------------ *
 * The school                                                         *
 * ------------------------------------------------------------------ */

/** Terms of meetings, messages and homework support behind every reading. */
export const TERMS_ON_RECORD = 3;

/** The engine's confidence across the run. */
export const RUN_CONFIDENCE = 92;

/** Drafts waiting for a name against them. */
export const DRAFTS_WAITING = 14;

/** Families the engine has flagged as needing someone to reach out. */
export const NEEDS_SUPPORT = 11;
/** Of those, the ones only ever tried on a single channel. */
export const SINGLE_CHANNEL = 9;

/** Families that answer within a day and attend what is offered. */
export const HIGHLY_ENGAGED = 22;

/** How much more often a message opening with praise is answered. */
export const RECOGNITION_MULTIPLE = 4;

/** Volunteering this year, against last. */
export const VOLUNTEERS_NOW = 23;
export const VOLUNTEERS_BEFORE = 9;
/** Of the current volunteers, those who came from a personal invitation. */
export const VOLUNTEERS_INVITED = 21;

/** Meeting attendance, and where it was. */
export const MEETING_ATTENDANCE = 61;
export const MEETING_ATTENDANCE_BEFORE = 84;

/** The median reply, across every family. */
export const MEDIAN_RESPONSE_DAYS = 2.4;

/* ------------------------------------------------------------------ *
 * The bands                                                          *
 * ------------------------------------------------------------------ */

/**
 * What a relationship score means, how it is chipped and how many rungs of the
 * level bar it lights.
 *
 * The template's own ladder skips rung three: no family on its roster sits
 * between fading and steady, and the bands below reproduce that exactly.
 */
export const ENGAGEMENT_BANDS = [
  { floor: 90, band: 'Highly engaged', tone: 'is-warm', level: 5 },
  { floor: 75, band: 'Steady', tone: 'is-cool', level: 4 },
  { floor: 55, band: 'Fading', tone: 'is-fading', level: 2 },
  { floor: 0, band: 'Needs attention', tone: 'is-cold', level: 1 },
];

export const bandOf = (score: number) =>
  ENGAGEMENT_BANDS.find((entry) => score >= entry.floor) ?? ENGAGEMENT_BANDS[3];

/** Rungs on a level bar. */
export const LEVEL_RUNGS = 5;

export const levelBarOf = (score: number) => {
  const lit = bandOf(score).level;
  return Array.from({ length: LEVEL_RUNGS }, (_, index) => (index < lit ? 'on' : ''));
};

/** Below this, the engine asks someone to reach out. */
export const ATTENTION_FLOOR = 75;

/* ------------------------------------------------------------------ *
 * A family                                                           *
 * ------------------------------------------------------------------ */

export interface Family {
  id: string;
  guardian: string;
  guardianImage: string;
  secondGuardian?: string;
  student: string;
  studentImage: string;
  className: string;
  /** How the engine reads the relationship, out of a hundred. */
  score: number;
  confidence: number;
  /** The channel that actually reaches them, and when. */
  prefers: string;
  /** Every channel the school has tried on this family. */
  channelsTried: string[];
  lastMeetingOn: string;
  /** Meetings offered, and how many were attended. */
  meetingsOffered: number;
  meetingsAttended: number;
  /** The line the card prints under the facts. */
  note: string;
}

const seeded: Family[] = [
  {
    id: 'FAM-0412',
    guardian: 'Mr. James Walker',
    guardianImage: 'assets/img/parents/parent-01.jpg',
    secondGuardian: 'Mrs. Ellen Walker',
    student: 'Liam Walker',
    studentImage: 'assets/img/students/student-04.jpg',
    className: 'Class IV-B',
    score: 94,
    confidence: 96,
    prefers: 'WhatsApp · evenings',
    channelsTried: ['WhatsApp', 'Email', 'Phone'],
    lastMeetingOn: '12 Jul 2026',
    meetingsOffered: 7,
    meetingsAttended: 6,
    note: 'Responds within twelve hours since the first positive message',
  },
  {
    id: 'FAM-0388',
    guardian: 'Mrs. Anita Sethi',
    guardianImage: 'assets/img/parents/parent-02.jpg',
    student: 'Kabir Sethi',
    studentImage: 'assets/img/students/student-02.jpg',
    className: 'Class VIII-A',
    score: 91,
    confidence: 94,
    prefers: 'Email · weekday mornings',
    channelsTried: ['Email', 'Phone'],
    lastMeetingOn: '08 Jul 2026',
    meetingsOffered: 7,
    meetingsAttended: 7,
    note: 'Attends every meeting and volunteers at two events a term',
  },
  {
    id: 'FAM-0294',
    guardian: 'Mr. Peter Kettut',
    guardianImage: 'assets/img/parents/parent-03.jpg',
    student: 'George Kettut',
    studentImage: 'assets/img/students/student-06.jpg',
    className: 'Class II-A',
    score: 83,
    confidence: 91,
    prefers: 'Phone call · after 6pm',
    channelsTried: ['Phone', 'Email'],
    lastMeetingOn: '24 Jun 2026',
    meetingsOffered: 7,
    meetingsAttended: 5,
    note: 'Prefers a call to a letter; replies same day when phoned',
  },
  {
    id: 'FAM-0231',
    guardian: 'Mrs. Carmen Reyes',
    guardianImage: 'assets/img/parents/parent-04.jpg',
    student: 'Sophia Reyes',
    studentImage: 'assets/img/students/student-03.jpg',
    className: 'Class VIII-A',
    score: 80,
    confidence: 90,
    prefers: 'Parent portal',
    channelsTried: ['Parent portal', 'Email'],
    lastMeetingOn: '19 Jun 2026',
    meetingsOffered: 7,
    meetingsAttended: 5,
    note: 'Reads everything, rarely replies. Silence here is not disengagement',
  },
  {
    id: 'FAM-0177',
    guardian: 'Mr. Ravi Menon',
    guardianImage: 'assets/img/parents/parent-05.jpg',
    student: 'Aarav Menon',
    studentImage: 'assets/img/students/student-05.jpg',
    className: 'Class VI-B',
    score: 61,
    confidence: 88,
    prefers: 'SMS · no preference set',
    channelsTried: ['SMS'],
    lastMeetingOn: '02 Mar 2026',
    meetingsOffered: 7,
    meetingsAttended: 2,
    note: 'Two messages unanswered, and no channel preference has ever been recorded',
  },
  {
    id: 'FAM-0104',
    guardian: 'Mrs. Lucia Fernandes',
    guardianImage: 'assets/img/parents/parent-06.jpg',
    student: 'Maria Fernandes',
    studentImage: 'assets/img/students/student-07.jpg',
    className: 'Class IX-C',
    score: 48,
    confidence: 86,
    prefers: 'Not established',
    channelsTried: ['Email'],
    lastMeetingOn: '14 Nov 2025',
    meetingsOffered: 7,
    meetingsAttended: 1,
    note: 'Every route tried has been email, and none has been opened',
  },
];

/** The roster, strongest relationship first. */
export const FAMILIES: Family[] = [...seeded].sort((a, b) => b.score - a.score);

/** The family the page's findings and workspace are written about. */
export const FEATURED = FAMILIES[0];

/** Average days in a month, for counting whole months elapsed. */
const DAYS_PER_MONTH = 30.44;

/** Whole months since the family was last in a room with the school. */
export const monthsSinceMeetingOf = (row: Family) =>
  Math.floor(daysBetween(row.lastMeetingOn, RUN_DATE) / DAYS_PER_MONTH);

/** Whether the school has only ever tried one way of reaching them. */
export const isSingleChannelOf = (row: Family) => row.channelsTried.length === 1;

/** Whether the engine is asking someone to reach out. */
export const needsAttentionOf = (row: Family) => row.score < ATTENTION_FLOOR;

/** The card's own line, with the family's own figures written in. */
export const noteOf = (row: Family) => {
  const months = monthsSinceMeetingOf(row);
  if (needsAttentionOf(row)) return `${months} months since the last meeting. ${row.note}`;
  return row.note;
};

/**
 * Engagement health across all the families modelled — a population no page
 * ships in full, so it is stated rather than counted.
 */
export const ENGAGEMENT_HEALTH = 79;

/** The mean across the families this page does show. */
export const ROSTER_HEALTH = Math.round(mean(FAMILIES.map((row) => row.score)));

/** Families on the roster the engine has flagged. */
export const flaggedFamilies = () => FAMILIES.filter(needsAttentionOf);

/** The filters the picker offers. */
export const FILTERS = ['All families', 'Highly engaged', 'Needs attention', 'No contact this term'];

export const matchesFilter = (row: Family, filter: string) => {
  if (filter === 'Highly engaged') return bandOf(row.score).band === 'Highly engaged';
  if (filter === 'Needs attention') return needsAttentionOf(row);
  if (filter === 'No contact this term') return monthsSinceMeetingOf(row) >= 3;
  return true;
};

/* ------------------------------------------------------------------ *
 * The recent exchange                                                *
 * ------------------------------------------------------------------ */

export const THREAD = [
  {
    id: 'school',
    from: 'School',
    at: 'Mon 09:12',
    text: 'Liam finished every question this week — a first this term. Thought you would want to know.',
    mine: true,
  },
  {
    id: 'parent',
    from: 'Mr. Walker',
    at: 'Mon 18:40',
    text: 'That is lovely to hear. He has been getting the bus on time since the route changed.',
    mine: false,
  },
];

export const THREAD_READING =
  'Response time has fallen from four days to under twelve hours since the first positive message. Lead with progress, not with problems, for this family.';

/* ------------------------------------------------------------------ *
 * The findings                                                       *
 * ------------------------------------------------------------------ */

export interface Finding {
  id: string;
  icon: string;
  tone: 'is-warm' | 'is-cool' | 'is-fading' | 'is-cold';
  observation: string;
  label: string;
  confidence: number;
  why: string;
  evidence: { label: string; value: string }[];
  action: string;
  modal: string;
}

export const FINDINGS: Finding[] = [
  {
    id: 'decreasing',
    icon: 'ti ti-trending-down',
    tone: 'is-fading',
    observation: 'Parent engagement decreasing',
    label: 'Attention',
    confidence: 94,
    why: 'The Menon family answered within a day for two terms and has not replied to the last two messages. Both went by SMS, and no communication preference was ever recorded for them. The change coincides with a change of contact number on the admission record, not with anything at school.',
    evidence: [
      { label: 'Messages unanswered', value: '2 of 2' },
      { label: 'Channels ever tried', value: 'SMS only' },
      { label: 'Preference on file', value: 'None' },
      { label: 'Contact number changed', value: 'Mar 2026' },
    ],
    action: 'Try a phone call and confirm the number on the admission record.',
    modal: 'schedule_meeting',
  },
  {
    id: 'homework',
    icon: 'ti ti-home-heart',
    tone: 'is-warm',
    observation: 'Homework support improving',
    label: 'Strength',
    confidence: 93,
    why: 'Liam Walker’s completion rose from 67% to 94% in four weeks. The rise begins the week after his father replied to the first positive message we sent, and it holds across every subject rather than only mathematics.',
    evidence: [
      { label: 'Completion', value: '67% to 94%' },
      { label: 'Weeks to change', value: '4' },
      { label: 'Subjects affected', value: 'All' },
      { label: 'Began after', value: 'First positive message' },
    ],
    action: 'Keep leading with progress for this family, and say so in the record.',
    modal: 'appreciation',
  },
  {
    id: 'meetings',
    icon: 'ti ti-calendar-x',
    tone: 'is-fading',
    observation: 'Meeting attendance declined',
    label: 'Attention',
    confidence: 91,
    why: 'Meeting attendance across the school fell from 84% to 61% this term. Every missed slot was offered between nine and eleven in the morning; the evening slots that remain are fully booked with a waiting list.',
    evidence: [
      { label: 'Attendance', value: '84% to 61%' },
      { label: 'Missed slots', value: 'All mornings' },
      { label: 'Evening slots', value: 'Fully booked' },
      { label: 'Waiting list', value: 'Yes' },
    ],
    action: 'Move a third of the slots into the 5pm to 7pm window.',
    modal: 'schedule_meeting',
  },
  {
    id: 'response',
    icon: 'ti ti-clock-exclamation',
    tone: 'is-cold',
    observation: 'Communication response delayed',
    label: 'Priority',
    confidence: 90,
    why: 'The Fernandes family has not responded in eight months. Every one of the eleven attempts was made by email, and the portal shows none has been opened. No other route has been tried.',
    evidence: [
      { label: 'Attempts', value: '11, all email' },
      { label: 'Opened in the portal', value: '0' },
      { label: 'Other routes tried', value: 'None' },
      { label: 'Months of silence', value: '8' },
    ],
    action: 'Try phone and post before anything is escalated.',
    modal: 'communication_plan',
  },
  {
    id: 'progress',
    icon: 'ti ti-trending-up',
    tone: 'is-warm',
    observation: 'Student progress improving',
    label: 'Strength',
    confidence: 92,
    why: 'Sophia Reyes moved sixteen percentile points across four terms. Her mother reads every portal message and rarely replies, which had been recorded as low engagement until the read receipts were examined.',
    evidence: [
      { label: 'Percentile movement', value: '+16' },
      { label: 'Portal messages read', value: 'Every one' },
      { label: 'Replies sent', value: 'Rarely' },
      { label: 'Previously recorded as', value: 'Low engagement' },
    ],
    action: 'Reclassify reading without replying as engagement, not silence.',
    modal: 'progress_letter',
  },
  {
    id: 'participation',
    icon: 'ti ti-users-group',
    tone: 'is-warm',
    observation: 'Family participation increased',
    label: 'Strength',
    confidence: 89,
    why: 'Volunteering rose from nine families to twenty-three this year. Twenty-one of the twenty-three joined after a personal invitation rather than a general notice, and the general notices produced almost nothing.',
    evidence: [
      { label: 'Volunteers', value: '9 to 23' },
      { label: 'From personal invitations', value: '21 of 23' },
      { label: 'From general notices', value: '2' },
      { label: 'Retention across events', value: '87%' },
    ],
    action: 'Replace general notices with named invitations.',
    modal: 'communication_plan',
  },
];

/* ------------------------------------------------------------------ *
 * The engagement centre                                              *
 * ------------------------------------------------------------------ */

export const ENGAGEMENT = [
  {
    id: 'quality',
    icon: 'ti ti-message-2',
    title: 'Communication Quality',
    priority: 'Low',
    finding:
      'Messages that open with something the child did well are answered four times more often than those that open with a concern.',
    suggestion: 'Lead every routine message with one specific thing that went well.',
    outcome: 'Reply rate rises without a single extra message.',
  },
  {
    id: 'meetings',
    icon: 'ti ti-calendar-event',
    title: 'Meeting Participation',
    priority: 'High',
    finding:
      'Attendance fell to 61%. Every missed slot was a morning slot; evening slots are oversubscribed.',
    suggestion: 'Move a third of slots into the 5pm to 7pm window.',
    outcome: 'Attendance recovers to its previous level.',
  },
  {
    id: 'homework',
    icon: 'ti ti-home-heart',
    title: 'Homework Support',
    priority: 'Low',
    finding:
      'Families who received one guidance sheet support homework twice as consistently as those who received none.',
    suggestion: 'Send the subject guidance sheet at the start of each unit.',
    outcome: 'Support consistency doubles at no cost.',
  },
  {
    id: 'environment',
    icon: 'ti ti-books',
    title: 'Learning Environment',
    priority: 'Normal',
    finding:
      'Nineteen families report no quiet study space at home. All nineteen have children in the lowest homework completion band.',
    suggestion: 'Open the library for supervised study after school.',
    outcome: 'Removes the constraint rather than the excuse.',
  },
  {
    id: 'activities',
    icon: 'ti ti-confetti',
    title: 'School Activities',
    priority: 'Low',
    finding:
      'Volunteering rose from nine families to twenty-three, almost entirely through personal invitations.',
    suggestion: 'Replace general notices with named invitations.',
    outcome: 'Participation keeps climbing.',
  },
  {
    id: 'response',
    icon: 'ti ti-clock',
    title: 'Parent Response Time',
    priority: 'High',
    finding:
      'Median response is 2.4 days, but the spread is enormous: some reply in an hour, eleven families never.',
    suggestion: 'Record a channel preference for every family without one.',
    outcome: 'The eleven silent families become reachable.',
  },
  {
    id: 'academic',
    icon: 'ti ti-school',
    title: 'Academic Support',
    priority: 'Normal',
    finding:
      'Parents ask what to do far more often than they ask how their child is doing. The questions are practical, not evaluative.',
    suggestion: 'Attach one concrete next step to every progress update.',
    outcome: 'Follow-up queries fall by half.',
  },
  {
    id: 'emotional',
    icon: 'ti ti-heart-handshake',
    title: 'Emotional Support',
    priority: 'Low',
    finding:
      'Where a counsellor made one call, families raised concerns two terms earlier than families where nobody called.',
    suggestion: 'Make one introductory call per family in the first term.',
    outcome: 'Concerns surface while they are still small.',
  },
  {
    id: 'community',
    icon: 'ti ti-users',
    title: 'Community Participation',
    priority: 'Normal',
    finding:
      'Attendance at community events clusters around families who already know one another; new families rarely attend twice.',
    suggestion: 'Pair each new family with an existing one for their first event.',
    outcome: 'New families come back.',
  },
];

/** How a priority is chipped. */
export const priorityToneOf = (priority: string) =>
  priority === 'High' ? 'is-cold' : priority === 'Normal' ? 'is-cool' : 'is-warm';

/* ------------------------------------------------------------------ *
 * The recommendations                                                *
 * ------------------------------------------------------------------ */

export interface Recommendation {
  id: string;
  title: string;
  note: string;
  confidence: number;
  /** Families it reaches. */
  reach: number;
  /** Hours of staff time it asks for. */
  hours: number;
  impact: string;
  timeline: string;
  cta: string;
  modal: string;
}

const recommendations: Recommendation[] = [
  {
    id: 'meeting',
    title: 'Schedule Parent Meeting',
    note: 'The Fernandes family has had no contact in eight months and every attempt was by email. Offer a phone slot.',
    confidence: 94,
    reach: 1,
    hours: 0.5,
    impact: 'Re-establish contact',
    timeline: 'This week',
    cta: 'Schedule meeting',
    modal: 'schedule_meeting',
  },
  {
    id: 'summary',
    title: 'Send Academic Summary',
    note: `${NEEDS_SUPPORT} families have had no progress update this term. All ${NEEDS_SUPPORT} have children whose scores are improving.`,
    confidence: 92,
    reach: 11,
    hours: 2,
    impact: '+18 reply rate',
    timeline: 'Within 3 days',
    cta: 'Send summary',
    modal: 'parent_summary',
  },
  {
    id: 'congratulate',
    title: 'Congratulate Student Achievement',
    note: `${VOLUNTEERS_NOW} students improved a band this term. Recognition messages are answered ${RECOGNITION_MULTIPLE} times more often.`,
    confidence: 93,
    reach: 23,
    hours: 1.5,
    impact: `${RECOGNITION_MULTIPLE}x reply rate`,
    timeline: 'Today',
    cta: 'Send congratulations',
    modal: 'appreciation',
  },
  {
    id: 'attendance',
    title: 'Share Attendance Update',
    note: 'Six families are unaware their child’s attendance recovered. Closing the loop keeps trust intact.',
    confidence: 91,
    reach: 6,
    hours: 1,
    impact: 'Trust maintained',
    timeline: 'This week',
    cta: 'Share update',
    modal: 'parent_summary',
  },
  {
    id: 'invite',
    title: 'Invite to School Event',
    note: 'Personal invitations outperform general notices ten to one. Twenty names are ready to invite.',
    confidence: 88,
    reach: 20,
    hours: 2.5,
    impact: '10x uptake',
    timeline: 'Two weeks',
    cta: 'Send invitations',
    modal: 'communication_plan',
  },
  {
    id: 'plan',
    title: 'Discuss Improvement Plan',
    note: 'Nine families have an open plan they have not seen. A plan not shared is a plan not supported.',
    confidence: 90,
    reach: 9,
    hours: 3,
    impact: 'Aligned support',
    timeline: 'Within a week',
    cta: 'Share the plan',
    modal: 'action_plan',
  },
  {
    id: 'guidance',
    title: 'Share Homework Guidance',
    note: 'Families with the subject guidance sheet support homework twice as consistently as those without.',
    confidence: 90,
    reach: 19,
    hours: 7,
    impact: '2x consistency',
    timeline: 'Start of unit',
    cta: 'Share guidance',
    modal: 'progress_letter',
  },
  {
    id: 'counselling',
    title: 'Recommend Counseling Session',
    note: 'Four families raised the same concern twice without a referral being made. Each is now overdue.',
    confidence: 89,
    reach: 4,
    hours: 2,
    impact: 'Earlier support',
    timeline: 'Within 5 days',
    cta: 'Refer to counsellor',
    modal: 'action_plan',
  },
];

/** Families reached per hour of staff time. */
export const yieldOf = (row: Recommendation) => row.reach / row.hours;

export const RECOMMENDATIONS = [...recommendations].sort((a, b) => yieldOf(b) - yieldOf(a));

export const PRIORITY_BANDS = [
  { upTo: 2, band: 'Critical', tone: 'is-cold' },
  { upTo: 5, band: 'High', tone: 'is-fading' },
  { upTo: Infinity, band: 'Normal', tone: 'is-cool' },
];

export const recPriorityOf = (rank: number) =>
  PRIORITY_BANDS.find((entry) => rank <= entry.upTo) ?? PRIORITY_BANDS[2];

/* ------------------------------------------------------------------ *
 * The story, the copilot, the calendar and the insights              *
 * ------------------------------------------------------------------ */

export const STORY = [
  {
    id: 'academic',
    icon: 'ti ti-school',
    title: 'Academic Journey',
    text: 'Liam arrived in Class IV-B two years ago placed in the third band for mathematics and the first for reading. He has since closed most of that gap without ever being moved to a different set — the change came from how he was taught, not from where he sat.',
  },
  {
    id: 'attendance',
    icon: 'ti ti-calendar-check',
    title: 'Attendance Story',
    text: 'Attendance fell to 71% in June and recovered to 96% within six weeks. The cause was a bus route, not a reluctance to come to school, and it was his father who identified it before the school did.',
  },
  {
    id: 'behaviour',
    icon: 'ti ti-mood-smile',
    title: 'Behaviour Progress',
    text: 'No behaviour concern has been recorded in four terms. Teachers describe him as quiet in whole-class settings and noticeably more forthcoming in a group of four, which is where he now sits.',
  },
  {
    id: 'achievements',
    icon: 'ti ti-award',
    title: 'Achievements',
    text: 'Second place in the inter-house science exhibition with an entry of his own design, and a place in the extension reading set held for four consecutive terms without a drop.',
  },
  {
    id: 'strengths',
    icon: 'ti ti-star',
    title: 'Strengths',
    text: 'Comprehension, retention and practical science. He remembers what he was taught six weeks ago as reliably as most of his class remembers last week, which makes revision unusually efficient for him.',
  },
  {
    id: 'improvement',
    icon: 'ti ti-alert-circle',
    title: 'Improvement Areas',
    text: 'Symbolic algebra remains the single open gap. He solves the same problems correctly when they are written in words, so this is about notation rather than about mathematics.',
  },
  {
    id: 'goals',
    icon: 'ti ti-target-arrow',
    title: 'Upcoming Goals',
    text: 'Close the notation gap by term end, secure a nomination for the regional STEM scholarship, and take one role that requires speaking on behalf of a group rather than recording for it.',
  },
  {
    id: 'support',
    icon: 'ti ti-home-heart',
    title: 'Family Support Opportunities',
    text: 'Nothing at home needs to change. The most useful thing this family can do is keep doing what began in June: telling us early when something outside school is affecting attendance.',
  },
];

export const COPILOT = [
  { icon: 'ti ti-mail-star', title: 'Generate Parent Summary', note: 'One paragraph on where the child stands, in plain language', to: 'Mr. James Walker', modal: 'parent_summary' },
  { icon: 'ti ti-list-check', title: 'Generate Meeting Agenda', note: 'Three items and a suggested order, drawn from the record', to: 'Both guardians', modal: 'schedule_meeting' },
  { icon: 'ti ti-file-text', title: 'Generate Student Progress Letter', note: 'A termly letter with one strength and one focus area', to: 'Mr. & Mrs. Walker', modal: 'progress_letter' },
  { icon: 'ti ti-confetti', title: 'Generate Positive Feedback', note: 'A short note recognising something specific this week', to: 'Mr. James Walker', modal: 'appreciation' },
  { icon: 'ti ti-clipboard-check', title: 'Generate Improvement Plan', note: 'What the school will do and what the family can do', to: 'Both guardians', modal: 'action_plan' },
  { icon: 'ti ti-news', title: 'Generate Weekly Parent Update', note: 'The week in five lines, for every family at once', to: `All ${FAMILIES_MODELLED} families`, modal: 'communication_plan' },
  { icon: 'ti ti-certificate', title: 'Generate School Recommendation', note: 'A reference or nomination written from the record', to: 'Scholarship panel', modal: 'progress_letter' },
];

export interface Turn {
  id: string;
  title: string;
  on: string;
  note: string;
}

export const TIMELINE: Turn[] = [
  { id: 'admitted', title: 'Student Admitted', on: '12 Apr 2023', note: 'Liam joined Class II-B on transfer. Both guardians attended the admission interview.' },
  { id: 'welcome', title: 'Welcome Communication', on: '18 Apr 2023', note: 'Welcome pack sent by email and acknowledged the same day. Channel preference not recorded at this point.' },
  { id: 'first-meeting', title: 'First Parent Meeting', on: '06 Jun 2023', note: 'Mr. Walker attended alone. Raised transport as a concern for the first time; no action was taken.' },
  { id: 'insight', title: 'AI Family Insight', on: '18 Jun 2026', note: 'Engine linked the June attendance dip to the Route 04 schedule rather than to anything at home.' },
  { id: 'update', title: 'Academic Update', on: '24 Jun 2026', note: 'Progress letter sent leading with reading improvement. First reply within twelve hours in two years.' },
  { id: 'intervention', title: 'Intervention Meeting', on: '02 Jul 2026', note: 'Teena Mathew, both guardians and the transport office. Route corrected the same week.' },
  { id: 'celebration', title: 'Achievement Celebration', on: '29 Jul 2026', note: 'Attendance recovery confirmed and the science exhibition placing shared with the family.' },
];

/** The calendar of what families can join, dated from the register clock. */
const opportunities = [
  { id: 'open-evening', offsetDays: 13, kind: 'Upcoming Events', title: 'Open evening for Classes IV to VI', note: '5pm – 7pm · 62 places' },
  { id: 'volunteer', offsetDays: 20, kind: 'Volunteer Opportunities', title: 'Library reading partners', note: 'Two hours weekly · 8 places' },
  { id: 'workshop', offsetDays: 27, kind: 'Parent Workshops', title: 'Supporting mathematics at home', note: 'Evening session · 40 places' },
  { id: 'counselling', offsetDays: 34, kind: 'Counseling Sessions', title: 'Drop-in with the school counsellor', note: 'No appointment needed' },
  { id: 'careers', offsetDays: 41, kind: 'Career Guidance Programs', title: 'Pathways evening for Classes VIII and IX', note: 'With six local employers' },
  { id: 'competition', offsetDays: 48, kind: 'Competitions', title: 'Regional science exhibition', note: 'Nominations close 12 Sep' },
  { id: 'community', offsetDays: 55, kind: 'Community Activities', title: 'Neighbourhood clean-up morning', note: 'Families welcome · all ages' },
  { id: 'induction', offsetDays: 62, kind: 'School Programs', title: 'Extension reading set induction', note: 'For newly placed students' },
];

export const OPPORTUNITIES = opportunities.map((entry) => ({
  ...entry,
  on: addDays(RUN_DATE, entry.offsetDays).split(' ').slice(0, 2).join(' '),
}));

/** How far ahead the calendar reaches, in whole weeks. */
export const CALENDAR_WEEKS = Math.floor(
  Math.max(...opportunities.map((entry) => entry.offsetDays)) / 7,
);

export const INSIGHTS = [
  { id: 'engaged', icon: 'ti ti-heart', title: 'Highly Engaged Families', text: `${HIGHLY_ENGAGED} families reply within a day and attend everything offered. Nineteen of them received a personal invitation to their first event rather than a general notice.` },
  { id: 'attention', icon: 'ti ti-alert-circle', title: 'Families Requiring Attention', text: `${NEEDS_SUPPORT} families have gone quiet. ${SINGLE_CHANNEL} were only ever contacted through one channel, and for four of those the channel was email that has never been opened.` },
  { id: 'trends', icon: 'ti ti-message-2', title: 'Positive Communication Trends', text: `Messages that open with something specific the child did well are answered ${RECOGNITION_MULTIPLE} times more often. The effect holds regardless of what the message goes on to say.` },
  { id: 'participation', icon: 'ti ti-users-group', title: 'Parent Participation Opportunities', text: `Volunteering rose from ${VOLUNTEERS_BEFORE} families to ${VOLUNTEERS_NOW} this year, and retention across events is 87%. The constraint is invitations, not willingness.` },
  { id: 'academic', icon: 'ti ti-school', title: 'Academic Support Suggestions', text: 'Parents ask what to do far more often than how their child is doing. Attaching one concrete next step to each update cuts follow-up queries by half.' },
  { id: 'upcoming', icon: 'ti ti-calendar', title: 'Upcoming Engagement Activities', text: `${opportunities.length} activities in the next ${CALENDAR_WEEKS} weeks. Evening sessions are oversubscribed while morning slots go unfilled, in every category.` },
  { id: 'success', icon: 'ti ti-trophy', title: 'Family Success Stories', text: 'The Walker family identified a bus route problem the school had not spotted, and their son’s attendance recovered twenty-two points. Early contact from home is the most valuable signal we receive.' },
];

/* ------------------------------------------------------------------ *
 * The featured family's workspace                                    *
 * ------------------------------------------------------------------ */

export const FINDING_CONFIDENCE = [
  { label: 'Engagement reading', value: 96 },
  { label: 'Channel preference', value: 94 },
  { label: 'Homework support', value: 93 },
  { label: 'Response pattern', value: 95 },
  { label: 'Recognition effect', value: 92 },
];

export const FINDING_CONFIDENCE_MEAN = Math.round(
  mean(FINDING_CONFIDENCE.map((entry) => entry.value)),
);

/** Where the relationship started, and where it stands. */
export const RELATIONSHIP_BEFORE = 71;
export const RELATIONSHIP_GROWTH = FEATURED.score - RELATIONSHIP_BEFORE;

export const SIMILAR = [
  { name: 'Sethi family', note: 'Same responsiveness, email led' },
  { name: 'Kettut family', note: 'Phone preferred, same pattern' },
  { name: 'Cole family', note: 'Recovered from the same dip' },
];

/** The dates the dialogs propose, offset from the register clock. */
export const MEETING_ON = addDays(RUN_DATE, 13);
export const PLAN_REVIEW = addDays(RUN_DATE, 60);
export const ACTION_REVIEW = addDays(RUN_DATE, 35);
