import { addDays, daysBetween } from '../../data/dates';
import { LAST_RUN, RUN_DATE } from '../../data/registers';

export { LAST_RUN, RUN_DATE };

const mean = (values: number[]) =>
  values.length ? Math.round(values.reduce((total, value) => total + value, 0) / values.length) : 0;

/* ------------------------------------------------------------------ *
 * The engine                                                         *
 * ------------------------------------------------------------------ */

/** Reports the engine has written since it was switched on. */
export const REPORTS_GENERATED = 1284;
/** Of those, the ones a person has signed. */
export const REPORTS_APPROVED = 1180;
/** Drafts still being worked on. */
export const DRAFTS_OPEN = 12;

/** Minutes a report of this kind took to write by hand. */
export const MINUTES_BY_HAND = 35;
/** Minutes it takes to review one the engine drafted. */
export const MINUTES_TO_REVIEW = 32;

/** Waiting for someone to read them. */
export const AWAITING_APPROVAL = REPORTS_GENERATED - REPORTS_APPROVED - DRAFTS_OPEN;

/** The share that has been signed. */
export const APPROVAL_RATE = Math.round((REPORTS_APPROVED / REPORTS_GENERATED) * 100);

/** Staff hours the engine has returned, rounded to the hour. */
export const HOURS_SAVED = Math.round(
  (REPORTS_APPROVED * (MINUTES_BY_HAND - MINUTES_TO_REVIEW)) / 60,
);

/** The engine's mean confidence across the queue. */
export const RUN_CONFIDENCE = 90;

/** How long the last pass took. */
export const RUN_DURATION = '2m 18s';

/* ------------------------------------------------------------------ *
 * The template library                                               *
 * ------------------------------------------------------------------ */

export interface Template {
  id: string;
  name: string;
  icon: string;
  audience: string;
  note: string;
  /** Reports drawn from it since it was published. */
  uses: number;
  /** Languages it has been translated into. */
  languages: string[];
  /** Sections it lays out. */
  sections: number;
}

export const TEMPLATES: Template[] = [
  {
    id: 'board',
    name: 'Board Pack',
    icon: 'ti ti-presentation',
    audience: 'Governors',
    note: 'Termly performance, finance and risk in one document, written for readers outside the school.',
    uses: 18,
    languages: ['English'],
    sections: 9,
  },
  {
    id: 'department',
    name: 'Department Summary',
    icon: 'ti ti-building',
    audience: 'Heads of department',
    note: 'One page per department, drawn from the same figures the leadership review uses.',
    uses: 216,
    languages: ['English'],
    sections: 6,
  },
  {
    id: 'parent-letter',
    name: 'Termly Parent Letter',
    icon: 'ti ti-mail-star',
    audience: 'Guardians',
    note: 'Plain language, one strength and one focus area, no score without the context around it.',
    uses: 742,
    languages: ['English', 'Hindi', 'Tamil', 'Malayalam', 'Kannada', 'Bengali'],
    sections: 4,
  },
  {
    id: 'attendance',
    name: 'Attendance Report',
    icon: 'ti ti-calendar-stats',
    audience: 'Leadership',
    note: 'Weekly register summary with the exceptions separated from the totals.',
    uses: 148,
    languages: ['English'],
    sections: 5,
  },
  {
    id: 'finance',
    name: 'Finance Summary',
    icon: 'ti ti-report-money',
    audience: 'Finance committee',
    note: 'Collection, exposure and forecast, with the reasoning behind each figure attached.',
    uses: 96,
    languages: ['English'],
    sections: 7,
  },
  {
    id: 'progress',
    name: 'Student Progress Report',
    icon: 'ti ti-file-certificate',
    audience: 'Guardians',
    note: 'Per-student, written from the record rather than from a comment bank.',
    uses: 64,
    languages: ['English', 'Hindi', 'Tamil'],
    sections: 5,
  },
];

/** Every language any template has been published in. */
export const LANGUAGES = [...new Set(TEMPLATES.flatMap((row) => row.languages))];

/**
 * Reports drawn from the library.
 *
 * Every report the engine has written came from a template, so this is the same
 * figure as `REPORTS_GENERATED` — and the page says so rather than printing two
 * totals that could drift apart.
 */
export const TEMPLATE_USES = TEMPLATES.reduce((total, row) => total + row.uses, 0);

/** The template the engine reaches for most. */
export const MOST_USED = [...TEMPLATES].sort((a, b) => b.uses - a.uses)[0];

/* ------------------------------------------------------------------ *
 * The queue                                                          *
 * ------------------------------------------------------------------ */

export type DraftState = 'Drafted' | 'In review' | 'Approved' | 'Generating';

export interface Draft {
  id: string;
  title: string;
  templateId: string;
  audience: string;
  /** Who has to sign it. */
  approver: string;
  state: DraftState;
  confidence: number;
  /** Words the engine wrote, and the sections it filled. */
  words: number;
  sections: number;
  /** Sources it drew on — the other AI registers, by name. */
  sources: string[];
  /** Days after the request that it was drafted. */
  requestedOn: string;
  /** What it is worth to whoever reads it, and the minutes review costs. */
  value: number;
  reviewMinutes: number;
  note: string;
}

const seeded: Draft[] = [
  {
    id: 'RPT-4120',
    title: 'Term 2 Board Pack',
    templateId: 'board',
    audience: 'Governors',
    approver: 'Principal',
    state: 'In review',
    confidence: 94,
    words: 3200,
    sections: 9,
    sources: ['Attendance', 'Revenue', 'Teaching', 'Risk'],
    requestedOn: '28 Jul 2026',
    value: 95,
    reviewMinutes: 45,
    note: 'Pulls the term-end attendance forecast, the collection figure and the teaching review into one document. Every figure carries the page it came from.',
  },
  {
    id: 'RPT-4118',
    title: 'Parent Letters · Class IV-B',
    templateId: 'parent-letter',
    audience: 'Guardians',
    approver: 'Teena Mathew',
    state: 'Drafted',
    confidence: 92,
    words: 180,
    sections: 4,
    sources: ['Student', 'Homework'],
    requestedOn: '30 Jul 2026',
    value: 88,
    reviewMinutes: 20,
    note: 'One letter per student, each opening on something specific that child did well. Nothing is sent until the class teacher signs the batch.',
  },
  {
    id: 'RPT-4115',
    title: 'Mathematics Department Summary',
    templateId: 'department',
    audience: 'Head of Mathematics',
    approver: 'Head of Mathematics',
    state: 'Approved',
    confidence: 91,
    words: 900,
    sections: 6,
    sources: ['Teaching', 'Homework'],
    requestedOn: '24 Jul 2026',
    value: 70,
    reviewMinutes: 15,
    note: 'Engagement, assessment design and workload for the department, from the same review the teaching page shows.',
  },
  {
    id: 'RPT-4111',
    title: 'Weekly Attendance Summary',
    templateId: 'attendance',
    audience: 'Leadership',
    approver: 'Deputy principal',
    state: 'Approved',
    confidence: 96,
    words: 620,
    sections: 5,
    sources: ['Attendance'],
    requestedOn: '27 Jul 2026',
    value: 62,
    reviewMinutes: 10,
    note: 'The register week in one page, with the fifty-eight students under observation separated from the totals.',
  },
  {
    id: 'RPT-4109',
    title: 'Finance Committee Summary',
    templateId: 'finance',
    audience: 'Finance committee',
    approver: 'Bursar',
    state: 'In review',
    confidence: 89,
    words: 1400,
    sections: 7,
    sources: ['Revenue'],
    requestedOn: '29 Jul 2026',
    value: 84,
    reviewMinutes: 30,
    note: 'States true exposure rather than the ledger figure, and shows the difference between the two.',
  },
  {
    id: 'RPT-4104',
    title: 'Student Progress Reports · Term 2',
    templateId: 'progress',
    audience: 'Guardians',
    approver: 'Class teachers',
    state: 'Generating',
    confidence: 87,
    words: 0,
    sections: 5,
    sources: ['Student', 'Homework', 'Attendance'],
    requestedOn: '31 Jul 2026',
    value: 78,
    reviewMinutes: 90,
    note: 'One per student across the year group. Still writing; the batch will hold for class teacher review when it finishes.',
  },
];

/** What a draft returns against the review it asks for. */
export const yieldOf = (row: Draft) => row.value / row.reviewMinutes;

/** The queue, in the order the page shows it: best return on review time first. */
export const DRAFTS = [...seeded].sort((a, b) => yieldOf(b) - yieldOf(a));

/** The draft the page explains in full. */
export const FEATURED = DRAFTS.find((row) => row.state === 'In review') ?? DRAFTS[0];

/** How a state is chipped. */
export const stateToneOf = (state: DraftState) =>
  state === 'Approved'
    ? 'is-ok'
    : state === 'In review'
      ? 'is-review'
      : state === 'Generating'
        ? 'is-ai'
        : 'is-draft';

/** The template a draft was written from. */
export const templateOf = (row: Draft) =>
  TEMPLATES.find((template) => template.id === row.templateId);

/** Days since the draft was asked for. */
export const ageOf = (row: Draft) => daysBetween(row.requestedOn, RUN_DATE);

/** Drafts waiting on a person, which is what the queue is about. */
export const WAITING = DRAFTS.filter((row) => row.state !== 'Approved');

/** Review time the queue is asking for, in minutes. */
export const REVIEW_BACKLOG = WAITING.reduce((total, row) => total + row.reviewMinutes, 0);

/** The same, said in hours and minutes. */
export const backlogLabel = () => {
  const hours = Math.floor(REVIEW_BACKLOG / 60);
  const minutes = REVIEW_BACKLOG % 60;
  return hours === 0 ? `${minutes} min` : `${hours} hr ${minutes} min`;
};

/** Words the engine has written across the open queue. */
export const WORDS_DRAFTED = DRAFTS.reduce((total, row) => total + row.words, 0);

/** The engine's confidence across the queue. */
export const QUEUE_CONFIDENCE = mean(DRAFTS.map((row) => row.confidence));

/* ------------------------------------------------------------------ *
 * Why the engine wrote what it wrote                                 *
 * ------------------------------------------------------------------ */

export interface Finding {
  id: string;
  icon: string;
  accent: string;
  observation: string;
  why: string;
  evidence: { label: string; value: string }[];
  confidence: number;
  action: string;
  modal: string;
}

export const FINDINGS: Finding[] = [
  {
    id: 'sources',
    icon: 'ti ti-link',
    accent: 'primary',
    observation: 'Every figure carries the page it came from',
    why: 'The board pack states 89.2% predicted attendance, $1.84M forecast collection and 42 teachers reviewed. None of those is retyped: each is read from the register that owns it, so correcting a figure on its own page corrects it here.',
    evidence: [
      { label: 'Registers read', value: '4' },
      { label: 'Figures restated by hand', value: 'None' },
      { label: 'Sources cited inline', value: 'Every figure' },
      { label: 'Drift possible', value: 'No' },
    ],
    confidence: 96,
    action: 'Open the board pack draft',
    modal: 'review_draft',
  },
  {
    id: 'tone',
    icon: 'ti ti-message-2',
    accent: 'success',
    observation: 'Parent letters open on something specific',
    why: 'Letters that open with one concrete thing the child did well are answered four times more often than those opening with a concern. The template enforces that order, so the engine cannot write a letter the other way round.',
    evidence: [
      { label: 'Reply rate, praise first', value: '4x' },
      { label: 'Letters in this batch', value: '28' },
      { label: 'Opening enforced by', value: 'The template' },
      { label: 'Scores without context', value: 'None' },
    ],
    confidence: 92,
    action: 'Read a sample letter',
    modal: 'preview_report',
  },
  {
    id: 'exposure',
    icon: 'ti ti-scale-outline',
    accent: 'warning',
    observation: 'The finance summary states two numbers, not one',
    why: 'The ledger carries $412K as risk and only $84K of it is real. A summary that printed one figure would mislead whichever way it went, so the template requires both and the difference between them.',
    evidence: [
      { label: 'Ledger risk', value: '$412K' },
      { label: 'True exposure', value: '$84K' },
      { label: 'Difference explained', value: 'Yes' },
      { label: 'Single-figure version', value: 'Rejected' },
    ],
    confidence: 89,
    action: 'Open the finance summary',
    modal: 'review_draft',
  },
  {
    id: 'language',
    icon: 'ti ti-language',
    accent: 'info',
    observation: 'Six languages, one source text',
    why: 'Each parent letter is written once and translated, rather than composed separately per language. That is why a correction to the English reaches all six, and why the reading level holds across them.',
    evidence: [
      { label: 'Languages published', value: '6' },
      { label: 'Source texts', value: '1 per letter' },
      { label: 'Reading level', value: 'Held across all six' },
      { label: 'Separate drafts', value: 'None' },
    ],
    confidence: 90,
    action: 'Check the translations',
    modal: 'translate',
  },
  {
    id: 'approval',
    icon: 'ti ti-signature',
    accent: 'danger',
    observation: 'Nothing has ever been sent unsigned',
    why: `Every one of the ${REPORTS_APPROVED.toLocaleString('en-US')} approved reports carries the name of whoever approved it and the time they did. The ${AWAITING_APPROVAL} waiting have not been sent anywhere, and the engine has no route that would let them be.`,
    evidence: [
      { label: 'Approved', value: REPORTS_APPROVED.toLocaleString('en-US') },
      { label: 'Awaiting a signature', value: String(AWAITING_APPROVAL) },
      { label: 'Sent unsigned', value: '0' },
      { label: 'Auto-send route', value: 'Does not exist' },
    ],
    confidence: 98,
    action: 'See the approval trail',
    modal: 'approve_report',
  },
  {
    id: 'time',
    icon: 'ti ti-clock-hour-4',
    accent: 'teal',
    observation: 'The saving is in reviewing, not in writing',
    why: `A report of this kind takes about ${MINUTES_BY_HAND} minutes to write and about ${MINUTES_TO_REVIEW} to review. The engine does not remove the reading — it removes the ${MINUTES_BY_HAND - MINUTES_TO_REVIEW} minutes of composition, which across ${REPORTS_APPROVED.toLocaleString('en-US')} reports is ${HOURS_SAVED} hours.`,
    evidence: [
      { label: 'Minutes to write by hand', value: String(MINUTES_BY_HAND) },
      { label: 'Minutes to review a draft', value: String(MINUTES_TO_REVIEW) },
      { label: 'Saved per report', value: `${MINUTES_BY_HAND - MINUTES_TO_REVIEW} min` },
      { label: 'Hours returned', value: String(HOURS_SAVED) },
    ],
    confidence: 94,
    action: 'See the usage breakdown',
    modal: 'export_reports',
  },
];

/* ------------------------------------------------------------------ *
 * What to draft next                                                 *
 * ------------------------------------------------------------------ */

export interface Suggestion {
  id: string;
  icon: string;
  title: string;
  note: string;
  confidence: number;
  /** Readers it reaches, and the minutes drafting costs. */
  reach: number;
  minutes: number;
  due: string;
  modal: string;
}

const suggestions: Suggestion[] = [
  {
    id: 'weekly',
    icon: 'ti ti-news',
    title: 'Weekly Leadership Summary',
    note: 'The week in one page, drawn from all nine registers. It has not been drafted since the 24th.',
    confidence: 94,
    reach: 12,
    minutes: 4,
    due: 'Today',
    modal: 'generate_report',
  },
  {
    id: 'letters',
    icon: 'ti ti-mail-star',
    title: 'Parent Letters · remaining classes',
    note: 'Twenty-eight letters are drafted for IV-B. Seventeen classes have had none this term.',
    confidence: 92,
    reach: 480,
    minutes: 25,
    due: 'This week',
    modal: 'generate_report',
  },
  {
    id: 'governors',
    icon: 'ti ti-presentation',
    title: 'Governor Briefing Note',
    note: 'Two pages ahead of the board meeting, summarising what the full pack says.',
    confidence: 90,
    reach: 9,
    minutes: 6,
    due: 'Within 3 days',
    modal: 'generate_report',
  },
  {
    id: 'department',
    icon: 'ti ti-building',
    title: 'Department Summaries · remaining five',
    note: 'Mathematics is done. The other five departments are waiting on the same template.',
    confidence: 91,
    reach: 5,
    minutes: 8,
    due: 'This week',
    modal: 'generate_report',
  },
  {
    id: 'newsletter',
    icon: 'ti ti-file-text',
    title: 'Termly Newsletter',
    note: 'Achievements, events and the term ahead, for every family on the roll.',
    confidence: 88,
    reach: 96,
    minutes: 20,
    due: 'Two weeks',
    modal: 'generate_report',
  },
  {
    id: 'inspection',
    icon: 'ti ti-clipboard-check',
    title: 'Inspection Evidence Pack',
    note: 'Everything an inspector would ask for, assembled from the registers rather than gathered by hand.',
    confidence: 86,
    reach: 4,
    minutes: 35,
    due: 'This term',
    modal: 'generate_report',
  },
];

/** Readers reached per minute of drafting. */
export const suggestionYieldOf = (row: Suggestion) => row.reach / row.minutes;

export const SUGGESTIONS = [...suggestions].sort(
  (a, b) => suggestionYieldOf(b) - suggestionYieldOf(a),
);

export const PRIORITY_BANDS = [
  { upTo: 2, band: 'High', accent: 'danger' },
  { upTo: 4, band: 'Normal', accent: 'warning' },
  { upTo: Infinity, band: 'Low', accent: 'info' },
];

export const priorityOf = (rank: number) =>
  PRIORITY_BANDS.find((entry) => rank <= entry.upTo) ?? PRIORITY_BANDS[2];

/* ------------------------------------------------------------------ *
 * The copilot, the timeline and the insights                         *
 * ------------------------------------------------------------------ */

export const COPILOT = [
  { icon: 'ti ti-file-text', title: 'Draft From a Prompt', note: 'Describe what you need and the engine picks the template', modal: 'generate_report' },
  { icon: 'ti ti-template', title: 'Build a New Template', note: 'A section layout the engine will reuse from then on', modal: 'new_template' },
  { icon: 'ti ti-language', title: 'Translate a Report', note: 'One source text, up to six published languages', modal: 'translate' },
  { icon: 'ti ti-git-compare', title: 'Compare Two Versions', note: 'What changed between drafts, and who changed it', modal: 'compare_versions' },
  { icon: 'ti ti-signature', title: 'Send for Approval', note: 'Routes a draft to whoever has to sign it', modal: 'approve_report' },
  { icon: 'ti ti-file-export', title: 'Export the Library', note: 'Every approved report with its approval trail', modal: 'export_reports' },
  { icon: 'ti ti-calendar-time', title: 'Schedule a Report', note: 'Weekly, termly or on a date you choose', modal: 'schedule_report' },
];

export interface Step {
  id: string;
  title: string;
  icon: string;
  /** Days after the report was requested, or null when it has not happened. */
  offsetDays: number | null;
  note: string;
}

export const LIFECYCLE: Step[] = [
  { id: 'requested', title: 'Report Requested', icon: 'ti ti-message-2', offsetDays: 0, note: 'The principal asked for the term board pack ahead of the September meeting.' },
  { id: 'sources', title: 'Sources Read', icon: 'ti ti-link', offsetDays: 0, note: 'Four registers read: attendance, revenue, teaching and risk. Nothing retyped.' },
  { id: 'drafted', title: 'Draft Written', icon: 'ti ti-file-text', offsetDays: 1, note: 'Nine sections, 3,200 words, every figure cited to the page that owns it.' },
  { id: 'checked', title: 'Self-checked', icon: 'ti ti-checkbox', offsetDays: 1, note: 'The engine flagged two figures whose sources had changed since the first pass.' },
  { id: 'review', title: 'In Review', icon: 'ti ti-eye', offsetDays: 3, note: 'With the principal. Forty-five minutes of reading time estimated.' },
  { id: 'approved', title: 'Approved', icon: 'ti ti-signature', offsetDays: null, note: 'Awaiting a signature. Nothing is distributed before this step.' },
  { id: 'distributed', title: 'Distributed', icon: 'ti ti-send', offsetDays: null, note: 'Goes to the governors once signed, with the approval trail attached.' },
];

/** The lifecycle, dated from the day the report was asked for. */
export const lifecycleSteps = (row: Draft) =>
  LIFECYCLE.map((step) => ({
    ...step,
    on: step.offsetDays === null ? 'Pending' : addDays(row.requestedOn, step.offsetDays),
    done: step.offsetDays !== null,
  }));

export const INSIGHTS = [
  { id: 'volume', figure: REPORTS_GENERATED.toLocaleString('en-US'), title: 'Reports Generated', text: `Written since the engine was switched on, across ${TEMPLATES.length} templates and ${LANGUAGES.length} languages.` },
  { id: 'approval', figure: `${APPROVAL_RATE}%`, title: 'Approval Rate', text: `${REPORTS_APPROVED.toLocaleString('en-US')} signed, ${AWAITING_APPROVAL} waiting and ${DRAFTS_OPEN} still being drafted. Nothing has been sent unsigned.` },
  { id: 'time', figure: `${HOURS_SAVED}h`, title: 'Time Returned', text: `The saving is in composition, not in reading: ${MINUTES_BY_HAND - MINUTES_TO_REVIEW} minutes a report, across everything approved.` },
  { id: 'templates', figure: String(TEMPLATES.length), title: 'Templates in Use', text: `${MOST_USED.name} accounts for ${Math.round((MOST_USED.uses / TEMPLATE_USES) * 100)}% of everything drawn from the library.` },
  { id: 'languages', figure: String(LANGUAGES.length), title: 'Languages Published', text: 'Each letter is written once and translated, so a correction to the source reaches every version.' },
  { id: 'backlog', figure: backlogLabel(), title: 'Review Backlog', text: `${WAITING.length} drafts are waiting on a person. That is the whole queue, in reading time.` },
];

/** The dates the dialogs propose. */
export const SCHEDULE_ON = addDays(RUN_DATE, 7);
export const DUE_ON = addDays(RUN_DATE, 3);
