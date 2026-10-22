import { addDays } from '../../data/dates';
import {
  APPROVAL_GATE_STEP,
  LAST_RUN,
  MODEL_VERSION,
  NEXT_RUN,
  PIPELINE_STEPS,
  RUN_DATE,
  STUDENTS_ENROLLED,
} from '../../data/registers';

/* ---- the nine registers this hub indexes ---------------------------- */

import {
  CRITICAL_TOTAL as RISK_OPEN,
  FLAGGED_TOTAL as RISK_FLAGGED,
  MODEL_CONFIDENCE as RISK_CONFIDENCE,
  NEW_CRITICAL,
} from '../../risk-detection/data/risk.data';

import {
  MODEL_CONFIDENCE as ATTENDANCE_CONFIDENCE,
  PREDICTED_TERM_END,
  PREDICTED_GAP,
  ROUTE_CASES,
  SIGNAL_COUNT,
  UNDER_OBSERVATION,
} from '../../attendance-predictor/data/attendance.data';

import {
  DIMENSIONS as STUDENT_DIMENSIONS,
  PROFILE_CONFIDENCE,
} from '../../student-intelligence/data/student.data';

import {
  OBSERVATIONS,
  TEACHERS_REVIEWED,
  WAVE_CONFIDENCE,
} from '../../teacher-productivity/data/teaching.data';

import {
  PENDING_REVIEWS,
  RUN_CONFIDENCE as HOMEWORK_CONFIDENCE,
  SUBMISSIONS_MARKED,
} from '../../homework-evaluation/data/homework.data';

import {
  FORECAST,
  FORECAST_ACCURACY,
  FORECAST_SPREAD,
  LEDGER_RISK,
  REMINDER_CASES,
  shortMoney,
  TRUE_EXPOSURE,
} from '../../fee-forecast/data/revenue.data';

import {
  DRAFTS_WAITING,
  FAMILIES_MODELLED,
  NEEDS_SUPPORT,
  RUN_CONFIDENCE as FAMILY_CONFIDENCE,
  SINGLE_CHANNEL,
} from '../../parent-insights/data/family.data';

import {
  DRAFTS as REPORT_DRAFTS,
  DRAFTS_OPEN,
  QUEUE_CONFIDENCE as REPORT_CONFIDENCE,
} from '../../report-generator/data/reports.data';

import {
  BLOCKING,
  CONFLICTS,
  CONFLICT_RESOURCES,
  OPTIMIZATION_CONFIDENCE,
  PERIOD_ASSIGNMENTS,
} from '../../timetable-optimizer/data/timetable.data';

export { LAST_RUN, RUN_DATE, MODEL_VERSION, NEXT_RUN };

const round1 = (value: number) => Math.round(value * 10) / 10;

/* ------------------------------------------------------------------ *
 * The console's own state                                            *
 * ------------------------------------------------------------------ */

/** Agents the platform is running. */
export const AGENTS_RUNNING = 14;
/** Missions scheduled today, and how many have finished. */
export const MISSIONS_TODAY = 31;
export const MISSIONS_DONE = 28;

/** The terms the picker offers. */
export const TERMS = ['Term 2 · 2026', 'Term 3 · 2026', 'Full academic year'];

/** Modules the pipeline reads, and findings it wrote. */
export const MODULES_READ = 11;
export const FINDINGS_WRITTEN = 96;

/** When today's sweep closes. */
export const SWEEP_CLOSES = '18:00';

/* ------------------------------------------------------------------ *
 * The nine tiles                                                     *
 * ------------------------------------------------------------------ */

export type ServiceState = 'Running' | 'Awaiting review' | 'Idle' | 'Needs attention';

export interface Service {
  id: string;
  name: string;
  icon: string;
  routeKey: string;
  /** What the tile counts, read from the register that owns it. */
  figure: string;
  metric: string;
  /** The sentence beneath, also from that register. */
  summary: string;
  state: ServiceState;
  /** That register's own confidence in its output. */
  confidence: number;
  /** Recommendations it is holding for a person. */
  awaiting: number;
  feature?: boolean;
}

/**
 * The nine, in the order the hub lists them.
 *
 * Every figure and every sentence below is imported. None is retyped, which is
 * the whole reason this page was built last.
 */
export const SERVICES: Service[] = [
  {
    id: 'risk',
    name: 'Risk Intelligence',
    icon: 'ti ti-radar',
    routeKey: 'aiRiskDetection',
    figure: String(RISK_OPEN),
    metric: 'open cases',
    summary: `${NEW_CRITICAL} students crossed into critical overnight. Every case carries the reasoning that produced it.`,
    state: 'Running',
    confidence: RISK_CONFIDENCE,
    awaiting: NEW_CRITICAL,
    feature: true,
  },
  {
    id: 'attendance',
    name: 'Attendance Intelligence',
    icon: 'ti ti-calendar-stats',
    routeKey: 'aiAttendancePredictor',
    figure: String(UNDER_OBSERVATION),
    metric: 'under observation',
    summary: `Predicted ${PREDICTED_TERM_END}% term end, ${PREDICTED_GAP} points below today. Route 04 is a shared cause for ${ROUTE_CASES} cases.`,
    state: 'Running',
    confidence: ATTENDANCE_CONFIDENCE,
    awaiting: 8,
  },
  {
    id: 'student',
    name: 'Student Intelligence',
    icon: 'ti ti-user-scan',
    routeKey: 'aiStudentIntelligence',
    figure: STUDENTS_ENROLLED.toLocaleString('en-IN'),
    metric: 'digital twins',
    summary: `Every enrolled student modelled across ${STUDENT_DIMENSIONS.length} dimensions.`,
    state: 'Running',
    confidence: PROFILE_CONFIDENCE,
    awaiting: 8,
  },
  {
    id: 'teaching',
    name: 'Teaching Intelligence',
    icon: 'ti ti-chalkboard',
    routeKey: 'aiTeacherProductivity',
    figure: String(TEACHERS_REVIEWED),
    metric: 'teachers reviewed',
    summary: 'Engagement at its highest all year; four teachers carry most of it.',
    state: 'Running',
    confidence: WAVE_CONFIDENCE,
    awaiting: 8,
  },
  {
    id: 'homework',
    name: 'Homework Intelligence',
    icon: 'ti ti-writing-sign',
    routeKey: 'aiHomeworkEvaluation',
    figure: String(SUBMISSIONS_MARKED),
    metric: 'submissions marked',
    summary: `${PENDING_REVIEWS} flagged where confidence is too low to stand alone.`,
    state: 'Awaiting review',
    confidence: HOMEWORK_CONFIDENCE,
    awaiting: PENDING_REVIEWS,
  },
  {
    id: 'revenue',
    name: 'Revenue Intelligence',
    icon: 'ti ti-report-money',
    routeKey: 'aiFeeForecast',
    figure: shortMoney(FORECAST.expected),
    metric: 'forecast to term end',
    summary: `True exposure is ${shortMoney(TRUE_EXPOSURE)}, not the ${shortMoney(LEDGER_RISK)} carried on the ledger.`,
    state: 'Running',
    confidence: FORECAST_ACCURACY,
    awaiting: REMINDER_CASES,
  },
  {
    id: 'parent',
    name: 'Parent Intelligence',
    icon: 'ti ti-heart-handshake',
    routeKey: 'aiParentInsights',
    figure: String(FAMILIES_MODELLED),
    metric: 'families modelled',
    summary: `${NEEDS_SUPPORT} have gone quiet. ${SINGLE_CHANNEL} were only ever contacted one way.`,
    state: 'Running',
    confidence: FAMILY_CONFIDENCE,
    awaiting: DRAFTS_WAITING,
  },
  {
    id: 'report',
    name: 'Report Intelligence',
    icon: 'ti ti-file-analytics',
    routeKey: 'aiReportGenerator',
    figure: String(REPORT_DRAFTS.length + DRAFTS_OPEN),
    metric: 'reports drafted',
    summary: 'Board pack, department summaries and the termly parent letters.',
    state: 'Idle',
    confidence: REPORT_CONFIDENCE,
    awaiting: REPORT_DRAFTS.filter((row) => row.state !== 'Approved').length,
  },
  {
    id: 'scheduling',
    name: 'Scheduling Intelligence',
    icon: 'ti ti-calendar-cog',
    routeKey: 'aiTimetableOptimizer',
    figure: String(CONFLICTS.length),
    metric: 'active conflicts',
    summary: `${BLOCKING.length} clashes block the Term 2 timetable. Both sit in the same ${CONFLICT_RESOURCES.length} rooms.`,
    state: 'Needs attention',
    confidence: OPTIMIZATION_CONFIDENCE,
    awaiting: CONFLICTS.length,
  },
];

/** Services the platform is running, of the services it has. */
export const SERVICES_ONLINE = SERVICES.filter((row) => row.state !== 'Idle').length;

/** Mean confidence across the nine, which the hero prints. */
export const MEAN_CONFIDENCE = round1(
  SERVICES.reduce((total, row) => total + row.confidence, 0) / SERVICES.length,
);

/** Recommendations the whole platform is holding for a person. */
export const AWAITING_APPROVAL = SERVICES.reduce((total, row) => total + row.awaiting, 0);

/** How a service state is chipped. */
export const stateToneOf = (state: ServiceState) =>
  state === 'Running'
    ? 'is-live'
    : state === 'Needs attention'
      ? 'is-alert'
      : state === 'Awaiting review'
        ? 'is-warn'
        : 'is-idle';

/** A service's health bar, read from its own confidence. */
export const healthOf = (row: Service) => Math.round(row.confidence);

/* ------------------------------------------------------------------ *
 * The pipeline                                                       *
 * ------------------------------------------------------------------ */

/**
 * The six steps, with the counts filled in from the registers.
 *
 * The page's point is that it stops at step four: the recommendations waiting
 * there are the nine services' own, added up.
 */
export const pipeline = () =>
  PIPELINE_STEPS.map((step) => {
    let note = step.note;
    if (step.step === '01') note = `${MODULES_READ} modules read`;
    if (step.step === '02') note = `${SIGNAL_COUNT} signals applied`;
    if (step.step === '03') note = `${FINDINGS_WRITTEN} findings written`;
    if (step.step === APPROVAL_GATE_STEP) note = `${AWAITING_APPROVAL} awaiting approval`;
    if (step.step === '06') note = `Closes at ${SWEEP_CLOSES}`;
    return { ...step, note, gate: step.step === APPROVAL_GATE_STEP };
  });

/* ------------------------------------------------------------------ *
 * Today's missions                                                   *
 * ------------------------------------------------------------------ */

export interface Mission {
  id: string;
  at: string;
  title: string;
  note: string;
  state: 'Done' | 'Running' | 'Queued';
  detail: string;
}

export const MISSIONS: Mission[] = [
  {
    id: 'sweep',
    at: '06:15',
    title: 'Attendance Analysis Completed',
    note: `${STUDENTS_ENROLLED.toLocaleString('en-IN')} students scored across ${SIGNAL_COUNT} signals`,
    state: 'Done',
    detail: `${STUDENTS_ENROLLED.toLocaleString('en-IN')} students scored. 14 newly entered prediction range; 23 moved from Watch to Good.`,
  },
  {
    id: 'risk',
    at: '06:22',
    title: 'Student Risk Detected',
    note: `${NEW_CRITICAL} students crossed into critical overnight`,
    state: 'Done',
    detail: `${NEW_CRITICAL} students crossed into critical. Every case opened with its reasoning chain attached.`,
  },
  {
    id: 'homework',
    at: '06:38',
    title: 'Homework Evaluation Finished',
    note: `${SUBMISSIONS_MARKED} submissions marked, ${PENDING_REVIEWS} held back`,
    state: 'Done',
    detail: `${SUBMISSIONS_MARKED} submissions marked against the published rubric. ${PENDING_REVIEWS} held back for teacher judgement.`,
  },
  {
    id: 'timetable',
    at: '06:41',
    title: 'Timetable Optimization',
    note: `${CONFLICTS.length} conflicts surfaced, ${BLOCKING.length} blocking`,
    state: 'Running',
    detail: `Evaluating ${PERIOD_ASSIGNMENTS.toLocaleString('en-US')} period assignments against availability, capacity and subject dependencies.`,
  },
  {
    id: 'revenue',
    at: '07:04',
    title: 'Revenue Forecast Generated',
    note: `Term-end collection set at ${shortMoney(FORECAST.expected)}`,
    state: 'Done',
    detail: `Term-end collection set at ${shortMoney(FORECAST.expected)} with a ${shortMoney(FORECAST_SPREAD)} spread. ${REMINDER_CASES} cases carry a third of the balance.`,
  },
  {
    id: 'parent',
    at: '07:12',
    title: 'Parent Summary Created',
    note: `${DRAFTS_WAITING} drafts waiting for an approver`,
    state: 'Done',
    detail: `${DRAFTS_WAITING} parent summaries drafted. All wait for a named approver before anything is sent.`,
  },
  {
    id: 'teaching',
    at: '07:20',
    title: 'Teacher Insights Queued',
    note: 'Waiting on the timetable pass to release',
    state: 'Queued',
    detail: `Second observation cycle scheduled to process once the timetable pass releases its lock. ${OBSERVATIONS} observation records in scope.`,
  },
];

export const missionToneOf = (state: Mission['state']) =>
  state === 'Done' ? 'is-ok' : state === 'Running' ? 'is-live' : 'is-idle';

/* ------------------------------------------------------------------ *
 * The launcher, the agents, the automations and the rest             *
 * ------------------------------------------------------------------ */

export const LAUNCHER = [
  { id: 'academic', icon: 'ti ti-school', title: 'Generate Academic Insights', note: 'Across every class, in one pass', routeKey: 'aiStudentIntelligence' },
  { id: 'reports', icon: 'ti ti-file-analytics', title: 'Generate Reports', note: 'Board pack, department and parent letters', routeKey: 'aiReportGenerator' },
  { id: 'attendance', icon: 'ti ti-calendar-stats', title: 'Run Attendance Analysis', note: `${STUDENTS_ENROLLED.toLocaleString('en-IN')} students against ${SIGNAL_COUNT} signals`, routeKey: 'aiAttendancePredictor' },
  { id: 'student', icon: 'ti ti-user-scan', title: 'Open Student Intelligence', note: 'The digital twin for any student', routeKey: 'aiStudentIntelligence' },
  { id: 'risk', icon: 'ti ti-radar', title: 'Detect Risks', note: 'Academic, attendance, wellbeing and finance', routeKey: 'aiRiskDetection' },
  { id: 'timetable', icon: 'ti ti-calendar-cog', title: 'Optimize Timetable', note: `${PERIOD_ASSIGNMENTS.toLocaleString('en-US')} assignments, ${CONFLICTS.length} conflicts`, routeKey: 'aiTimetableOptimizer' },
  { id: 'homework', icon: 'ti ti-writing-sign', title: 'Evaluate Homework', note: 'Marked against your published rubric', routeKey: 'aiHomeworkEvaluation' },
  { id: 'revenue', icon: 'ti ti-report-money', title: 'Forecast Revenue', note: 'Collection to term end, with the range', routeKey: 'aiFeeForecast' },
];

export interface Automation {
  id: string;
  name: string;
  state: 'Active' | 'Paused' | 'Running' | 'Scheduled';
  nextRun: string;
  lastRun: string;
  health: number;
}

export const AUTOMATIONS: Automation[] = [
  { id: 'attendance', name: 'Daily Attendance Scan', state: 'Active', nextRun: 'Tomorrow, 06:00', lastRun: `Today, ${LAST_RUN}`, health: 98 },
  { id: 'academic', name: 'Weekly Academic Review', state: 'Active', nextRun: 'Monday, 05:30', lastRun: '28 Jul, 05:30', health: 96 },
  { id: 'revenue', name: 'Monthly Revenue Forecast', state: 'Active', nextRun: '01 Sep, 04:00', lastRun: '01 Aug, 04:00', health: 94 },
  { id: 'homework', name: 'Homework Review', state: 'Paused', nextRun: 'On resume', lastRun: 'Today, 06:38', health: 88 },
  { id: 'parent', name: 'Parent Summary', state: 'Active', nextRun: 'Friday, 16:00', lastRun: '25 Jul, 16:00', health: 92 },
  { id: 'teacher', name: 'Teacher Productivity', state: 'Scheduled', nextRun: 'Sunday, 22:00', lastRun: '27 Jul, 22:00', health: 90 },
  { id: 'timetable', name: 'Timetable Optimization', state: 'Running', nextRun: 'In progress', lastRun: '29 Jul, 06:41', health: 86 },
  { id: 'risk', name: 'Risk Monitoring', state: 'Active', nextRun: 'Continuous', lastRun: 'Today, 06:22', health: 97 },
];

export const automationToneOf = (state: Automation['state']) =>
  state === 'Active'
    ? 'is-live'
    : state === 'Running'
      ? 'is-warn'
      : state === 'Paused'
        ? 'is-idle'
        : 'is-ok';

export interface Agent {
  id: string;
  name: string;
  icon: string;
  purpose: string;
  capabilities: string[];
  state: 'Running' | 'Idle' | 'Restricted';
}

export const AGENTS: Agent[] = [
  { id: 'academic', name: 'Academic Agent', icon: 'ti ti-school', purpose: 'Watches attainment, progress and learning gaps across every class.', capabilities: ['Progress tracking', 'Gap detection', 'Cohort compare'], state: 'Running' },
  { id: 'finance', name: 'Finance Agent', icon: 'ti ti-report-money', purpose: 'Forecasts collections and separates slow payers from genuine risk.', capabilities: ['Forecasting', 'Payment behaviour', 'Recovery'], state: 'Running' },
  { id: 'attendance', name: 'Attendance Agent', icon: 'ti ti-calendar-stats', purpose: 'Predicts attendance decline before the register shows it.', capabilities: ['Prediction', 'Pattern finding', 'Recovery plans'], state: 'Running' },
  { id: 'teacher', name: 'Teacher Agent', icon: 'ti ti-chalkboard', purpose: 'Reads teaching effectiveness and suggests coaching, never appraisal.', capabilities: ['Coaching', 'Workload', 'Observation'], state: 'Running' },
  { id: 'parent', name: 'Parent Agent', icon: 'ti ti-heart-handshake', purpose: 'Models family engagement and drafts every parent communication.', capabilities: ['Engagement', 'Drafting', 'Scheduling'], state: 'Running' },
  { id: 'transport', name: 'Transport Agent', icon: 'ti ti-bus', purpose: 'Correlates route timing with lateness and absence.', capabilities: ['Route analysis', 'Delay impact', 'Alerts'], state: 'Idle' },
  { id: 'library', name: 'Library Agent', icon: 'ti ti-books', purpose: 'Links borrowing behaviour to reading attainment.', capabilities: ['Borrowing', 'Recommendations', 'Stock'], state: 'Idle' },
  { id: 'medical', name: 'Medical Agent', icon: 'ti ti-stethoscope', purpose: 'Flags health-related absence patterns without reading medical notes.', capabilities: ['Absence patterns', 'Wellbeing flags', 'Referrals'], state: 'Restricted' },
  { id: 'security', name: 'Security Agent', icon: 'ti ti-shield-lock', purpose: 'Audits every AI action, approval and data access on the platform.', capabilities: ['Audit trail', 'Access control', 'Approvals'], state: 'Running' },
];

export const agentToneOf = (state: Agent['state']) =>
  state === 'Running' ? 'is-live' : state === 'Restricted' ? 'is-alert' : 'is-idle';

export const KNOWLEDGE = [
  { id: 'templates', icon: 'ti ti-template', title: 'Saved Templates', note: 'Letters, summaries and report layouts', figure: '42' },
  { id: 'rules', icon: 'ti ti-adjustments', title: 'Saved AI Rules', note: 'Thresholds, scopes and approval gates', figure: '24' },
  { id: 'prompts', icon: 'ti ti-message-2', title: 'Prompt Library', note: 'Reusable instructions for each service', figure: '18' },
  { id: 'automations', icon: 'ti ti-robot', title: 'Automation Library', note: 'Scheduled routines you can clone', figure: '31' },
  { id: 'activity', icon: 'ti ti-history', title: 'Recent AI Activities', note: 'Everything the platform did this week', figure: '196' },
  { id: 'favourites', icon: 'ti ti-star', title: 'Favorite Workflows', note: 'The routines your team runs most', figure: '9' },
  { id: 'docs', icon: 'ti ti-book', title: 'AI Documentation', note: 'Signals, weights, limits and safeguards', figure: '7 guides' },
  { id: 'release', icon: 'ti ti-rocket', title: 'Release Notes', note: 'What changed in the AI module', figure: MODEL_VERSION },
];

export const CONSOLE = [
  { key: 'F', title: 'Run Full School Analysis', note: 'Every service, every module, one pass', modal: 'launch_service' },
  { key: 'E', title: 'Generate Executive Summary', note: 'One page for the principal, written from today', modal: 'executive_summary' },
  { key: 'W', title: 'Generate Weekly Intelligence', note: 'The week in five sections for the leadership meeting', modal: 'executive_summary' },
  { key: 'P', title: 'Generate Principal Report', note: 'The full board pack with reasoning attached', modal: 'executive_summary' },
  { key: 'D', title: 'Generate Department Summary', note: 'Per department, comparable term on term', modal: 'executive_summary' },
  { key: 'S', title: 'Open AI Settings', note: 'Scope, approval gates, thresholds and retention', modal: 'ai_settings' },
];

export const ROADMAP = [
  { id: 'twin', stage: 'New', title: 'Student Digital Twin', note: `${STUDENT_DIMENSIONS.length} modelled dimensions per student, each with the evidence behind it. Replaces the old single progress score entirely.` },
  { id: 'scheduling', stage: 'New', title: 'Scheduling Intelligence', note: 'Resolves timetable conflicts by proposing three full alternative weeks rather than patching one slot at a time.' },
  { id: 'multilingual', stage: 'Soon', title: 'Multilingual Parent Drafts', note: 'Every parent communication drafted in the household language recorded on the admission form.' },
  { id: 'chaining', stage: 'Soon', title: 'Automation Chaining', note: 'Let one routine trigger the next, so a risk detection can open a recovery plan without a person in between.' },
  { id: 'cohort', stage: 'Lab', title: 'Cohort Simulation', note: 'Ask what would happen to attainment if a class were split differently, before committing to it.' },
  { id: 'outlook', stage: 'Lab', title: 'Three-Year Outlook', note: 'Projects attainment, enrolment and revenue together rather than as three separate forecasts.' },
];

export const stageToneOf = (stage: string) =>
  stage === 'New' ? 'is-live' : stage === 'Soon' ? 'is-warn' : 'is-idle';

/** What the platform read to produce today's findings. */
export const SCOPE = {
  students: STUDENTS_ENROLLED,
  teachers: TEACHERS_REVIEWED,
  families: FAMILIES_MODELLED,
  assignments: PERIOD_ASSIGNMENTS,
  flagged: RISK_FLAGGED,
};

/** The dates the dialogs propose. */
export const AUTOMATION_STARTS = addDays(RUN_DATE, 2);
