/** The school the whole engine reads. */
export const STUDENTS_ENROLLED = 3842;
export const TEACHERS_ON_ROLL = 186;
export const FAMILIES_MODELLED = 96;

/** The register clock every AI page is written against. */
export const RUN_DATE = '01 Aug 2026';
export const LAST_RUN = '06:15';
export const NEXT_RUN = '02 Aug 2026, 06:00';
export const MODEL_VERSION = 'v4.2';

/** One of the nine intelligences the hub indexes. */
export interface Intelligence {
  id: string;
  /** The hub's tile name, and the application's own title. */
  name: string;
  /** The route the tile opens. */
  routeKey: string;
  icon: string;
  accent: string;
  /** What the tile counts, and the noun beneath it. */
  metricLabel: string;
  /** The sentence the hub prints under the tile. */
  summary: string;
  /** When the engine last touched this application. */
  ranAt: string;
  /** The engine's own confidence in this application's output. */
  confidence: number;
}

/**
 * The nine, in the order the hub lists them.
 *
 * `metric` is filled by each application's own module — see `hubMetrics` — so
 * the tile cannot claim a number its page does not have.
 */
export const INTELLIGENCES: Intelligence[] = [
  {
    id: 'risk',
    name: 'Risk Intelligence',
    routeKey: 'aiRiskDetection',
    icon: 'ti ti-alert-triangle',
    accent: 'danger',
    metricLabel: 'open cases',
    summary:
      'Nine students crossed into critical overnight. Every case carries the reasoning that produced it.',
    ranAt: '06:22',
    confidence: 94.2,
  },
  {
    id: 'attendance',
    name: 'Attendance Intelligence',
    routeKey: 'aiAttendancePredictor',
    icon: 'ti ti-calendar-stats',
    accent: 'primary',
    metricLabel: 'under observation',
    summary:
      'Predicted 89.2% term end, 2.2 points below today. Route 04 is a shared cause for five cases.',
    ranAt: '06:15',
    confidence: 92.6,
  },
  {
    id: 'student',
    name: 'Student Intelligence',
    routeKey: 'aiStudentIntelligence',
    icon: 'ti ti-users',
    accent: 'info',
    metricLabel: 'digital twins',
    summary: 'Every enrolled student modelled across ten dimensions.',
    ranAt: '06:28',
    confidence: 91.4,
  },
  {
    id: 'teaching',
    name: 'Teaching Intelligence',
    routeKey: 'aiTeacherProductivity',
    icon: 'ti ti-chalkboard',
    accent: 'teal',
    metricLabel: 'teachers reviewed',
    summary: 'Engagement at its highest all year; four teachers carry most of it.',
    ranAt: '07:20',
    confidence: 90.8,
  },
  {
    id: 'homework',
    name: 'Homework Intelligence',
    routeKey: 'aiHomeworkEvaluation',
    icon: 'ti ti-notebook',
    accent: 'warning',
    metricLabel: 'submissions marked',
    summary: 'Nine flagged where confidence is too low to stand alone.',
    ranAt: '06:38',
    confidence: 88.4,
  },
  {
    id: 'revenue',
    name: 'Revenue Intelligence',
    routeKey: 'aiFeeForecast',
    icon: 'ti ti-report-money',
    accent: 'success',
    metricLabel: 'forecast to term end',
    summary: 'True exposure is $84K, not the $412K carried on the ledger.',
    ranAt: '07:04',
    confidence: 93.1,
  },
  {
    id: 'parent',
    name: 'Parent Intelligence',
    routeKey: 'aiParentInsights',
    icon: 'ti ti-users-group',
    accent: 'purple',
    metricLabel: 'families modelled',
    summary: 'Eleven have gone quiet. Nine were only ever contacted one way.',
    ranAt: '07:12',
    confidence: 89.6,
  },
  {
    id: 'report',
    name: 'Report Intelligence',
    routeKey: 'aiReportGenerator',
    icon: 'ti ti-report',
    accent: 'indigo',
    metricLabel: 'reports drafted',
    summary: 'Board pack, department summaries and the termly parent letters.',
    ranAt: '05:48',
    confidence: 90.2,
  },
  {
    id: 'scheduling',
    name: 'Scheduling Intelligence',
    routeKey: 'aiTimetableOptimizer',
    icon: 'ti ti-calendar-time',
    accent: 'slate',
    metricLabel: 'active conflicts',
    summary: 'Two clashes block the Term 2 timetable. Both sit in the same two rooms.',
    ranAt: '06:41',
    confidence: 87.9,
  },
];

/**
 * The pipeline every finding passes through.
 *
 * The template's own note is the point of the page: it stops at step five by
 * design, and nothing past that has been acted on.
 */
export const PIPELINE_STEPS = [
  { step: '01', name: 'Collect Data', note: 'modules read' },
  { step: '02', name: 'Analyze', note: 'signals applied' },
  { step: '03', name: 'Generate Intelligence', note: 'findings written' },
  { step: '04', name: 'Recommend Actions', note: 'awaiting approval' },
  { step: '05', name: 'Automate Workflow', note: 'held for approval' },
  { step: '06', name: 'Complete', note: 'closes at 18:00' },
];

/** Where the pipeline stops, and why. */
export const APPROVAL_GATE_STEP = '04';
