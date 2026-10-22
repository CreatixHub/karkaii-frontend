import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import AttendanceWorkspace from './modals/AttendanceWorkspace';
import AttendanceModals from './modals/AttendanceModals';
import type { AttendanceModalId } from './modals/AttendanceModals';
import type { AttendanceCase } from './data/attendance.data';
import {
  ATTENDANCE_CHAMPIONS,
  attendanceCases,
  bandOf,
  bandPill,
  BEST_CLASS,
  CHRONIC_MONTHS,
  CLOSED_CASES,
  COPILOT,
  CRITICAL_CASES,
  dropOf,
  EARLY_START_ADVANTAGE,
  EARLY_START_DAYS,
  FAST_CLOSE_HOURS,
  FAST_CLOSING_TEACHERS,
  FEATURED_CASE,
  gainPerHourOf,
  HEALTH_CHANGE,
  HEALTH_SCALE,
  healthBand,
  heatOf,
  HIDDEN_PATTERNS,
  IMPROVED_THIS_MONTH,
  LAST_RUN,
  LATE_STARTS,
  MEDIAN_GAIN,
  MEDIAN_GAIN_DAYS,
  MODEL_CONFIDENCE,
  MONDAY_SIGNATURE,
  NEWLY_FLAGGED,
  NEXT_RUN_IN,
  PLAN_SUCCESS_RATE,
  PREDICTED_GAP,
  PREDICTED_TERM_END,
  PREDICTION_WINDOW_DAYS,
  reasoningOf,
  RECOMMENDATIONS,
  recommendationNoteOf,
  RECOVERY_TRACK,
  RESOURCES,
  ROUTE,
  ROUTE_CASES,
  SCHOOL_HEALTH,
  SIGNAL_COUNT,
  stationStateOf,
  STUDENTS_SCORED,
  SUCCESSFUL_PLANS,
  TOP_THREE_REACH,
  timelineOf,
  trendNoteOf,
  UNDER_OBSERVATION,
  WAITING_STATION,
} from './data/attendance.data';

/** A numbered section heading, with the template's own wording. */
const SectionHead = ({
  n,
  title,
  note,
  action,
}: {
  n: string;
  title: string;
  note: string;
  action?: React.ReactNode;
}) => (
  <div className="atn-sec">
    <div>
      <span className="atn-sec-n">Section {n}</span>
      <h2 className="atn-sec-title">{title}</h2>
      <p className="atn-sec-sub">{note}</p>
    </div>
    {action ? <div className="d-flex align-items-center gap-2 flex-wrap">{action}</div> : null}
  </div>
);

const AiAttendancePredictor = () => {
  const routes = all_routes;
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  const [dialog, setDialog] = useState<AttendanceModalId | null>(null);
  const [openCase, setOpenCase] = useState<AttendanceCase | null>(null);
  const [window, setWindow] = useState(`Next ${PREDICTION_WINDOW_DAYS} Days`);
  const [windowOpen, setWindowOpen] = useState(false);

  const rows = attendanceCases;
  const featured = FEATURED_CASE;

  const reasoning = useMemo(() => reasoningOf(featured), [featured]);
  const timeline = useMemo(() => timelineOf(featured), [featured]);
  const band = useMemo(() => healthBand(), []);

  const openDialog = useCallback((id: string) => setDialog(id as AttendanceModalId), []);

  const showCase = useCallback((row: AttendanceCase) => {
    setDialog(null);
    setOpenCase(row);
  }, []);

  /** The engine's log from this morning's run, written from the register. */
  const feed = [
    {
      at: '06:15',
      body: (
        <>
          Nightly run finished. {STUDENTS_SCORED.toLocaleString('en-IN')} students scored across{' '}
          {SIGNAL_COUNT} signals.
        </>
      ),
    },
    {
      at: '06:18',
      body: (
        <>
          <b>{NEWLY_FLAGGED} students</b> newly entered prediction range.
        </>
      ),
    },
    {
      at: '06:22',
      body: (
        <>
          {ROUTE.name} flagged as a shared cause for {ROUTE_CASES} open cases.
        </>
      ),
    },
    {
      at: '07:04',
      body: (
        <>
          <b>{IMPROVED_THIS_MONTH} students</b> moved from Watch to Good after parent contact.
        </>
      ),
    },
  ];

  /** What the engine noticed this week, most of it counted off the register. */
  const notes = [
    {
      tone: 'is-bad',
      label: 'Newly Flagged Students',
      figure: NEWLY_FLAGGED,
      text: `${NEWLY_FLAGGED} students crossed into prediction range overnight. ${MONDAY_SIGNATURE} share a Monday absence signature, which points at a weekend routine rather than at school conditions.`,
    },
    {
      tone: 'is-good',
      label: 'Improving Attendance',
      figure: IMPROVED_THIS_MONTH,
      text: `${IMPROVED_THIS_MONTH} students gained ground after a parent contact. The median gain was ${MEDIAN_GAIN} points within ${MEDIAN_GAIN_DAYS} days of the first letter.`,
    },
    {
      tone: 'is-bad',
      label: 'Chronic Absentees',
      figure: CRITICAL_CASES,
      text: `${CRITICAL_CASES} students have held below the statutory floor for ${CHRONIC_MONTHS} consecutive months. Each has an open plan; none has had a face-to-face parent meeting yet.`,
    },
    {
      tone: 'is-good',
      label: 'Attendance Recovery',
      figure: `${PLAN_SUCCESS_RATE}%`,
      text: `${PLAN_SUCCESS_RATE}% of opened plans reached their target. Plans that began within ${EARLY_START_DAYS} days of detection outperformed late starts by ${EARLY_START_ADVANTAGE} points.`,
    },
    {
      tone: 'is-warn',
      label: 'Hidden Attendance Patterns',
      figure: HIDDEN_PATTERNS.length,
      text: `${HIDDEN_PATTERNS.length} patterns were not visible in the class registers: ${HIDDEN_PATTERNS.join(', ')}.`,
    },
    {
      tone: '',
      label: 'Teacher Insights',
      figure: FAST_CLOSING_TEACHERS,
      text: `${FAST_CLOSING_TEACHERS} teachers close their loops within ${FAST_CLOSE_HOURS} hours and their classes recover fastest. Their contact templates are worth copying across ${ROUTE.block}.`,
    },
    {
      tone: 'is-warn',
      label: 'Transport Insights',
      figure: `${ROUTE.shareOfLateMarks}%`,
      text: `${ROUTE.name} carries ${ROUTE.shareOfLateMarks}% of late marks in ${ROUTE.block} despite serving ${ROUTE.shareOfStudents}% of students. A schedule review would lift ${ROUTE_CASES} separate cases at once.`,
    },
    {
      tone: '',
      label: 'Recommended Actions',
      figure: RECOMMENDATIONS.length,
      text: `${RECOMMENDATIONS.length} actions are queued for approval. Applying the top three would cover ${TOP_THREE_REACH} of the ${UNDER_OBSERVATION} students currently under observation.`,
    },
  ];

  /** Where the interventions worked. */
  const wins = [
    {
      icon: 'ti ti-trophy',
      label: 'Attendance Champions',
      figure: ATTENDANCE_CHAMPIONS,
      note: 'students held 100% for the full term',
      faces: ['student-01', 'student-02', 'student-03'],
    },
    {
      icon: 'ti ti-trending-up',
      label: 'Most Improved Students',
      figure: IMPROVED_THIS_MONTH,
      note: `gained ${MEDIAN_GAIN} points or more this month`,
      faces: ['student-04', 'student-05', 'student-06'],
    },
    {
      icon: 'ti ti-checkbox',
      label: 'Successful Recovery Plans',
      figure: SUCCESSFUL_PLANS,
      note: 'plans reached their target figure',
      faces: ['student-07', 'student-08', 'student-09'],
    },
    {
      icon: 'ti ti-school',
      label: 'Best Performing Classes',
      figure: BEST_CLASS.name,
      note: `holds ${BEST_CLASS.reading}% across the whole term`,
      faces: ['student-10', 'student-11', 'student-12'],
    },
    {
      icon: 'ti ti-archive',
      label: 'Closed Cases',
      figure: CLOSED_CASES,
      note: 'cases closed after sustained recovery',
      faces: ['student-13', 'student-01', 'student-05'],
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Attendance Intelligence Center
              </h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.aiCommandCenter}>AI</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Attendance Intelligence
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className={`dropdown me-2 mb-2 ${windowOpen ? 'show' : ''}`.trim()}>
                <ActionLink
                  className="dropdown-toggle btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  onClick={() => setWindowOpen((current) => !current)}
                >
                  <i className="ti ti-calendar me-2" />
                  {window}
                </ActionLink>
                <ul className={`dropdown-menu dropdown-menu-end p-3 ${windowOpen ? 'show' : ''}`.trim()}>
                  {[`Next ${PREDICTION_WINDOW_DAYS / 4} Days`, `Next ${PREDICTION_WINDOW_DAYS} Days`].map(
                    (option) => (
                      <li key={option}>
                        <ActionLink
                          className={`dropdown-item rounded-1 ${window === option ? 'active' : ''}`.trim()}
                          onClick={() => {
                            setWindow(option);
                            setWindowOpen(false);
                          }}
                        >
                          {option}
                        </ActionLink>
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => setDialog('run_analysis')}
              >
                <i className="ti ti-refresh me-1" />
                Re-run Model
              </button>
              <ActionLink className="btn btn-primary mb-2" onClick={() => setDialog('export_summary')}>
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
            </div>
          </div>
          {/* /Page Header */}

          {/* Section 01 — the command center */}
          <div className="atn-hero mb-5">
            <div className="atn-hero-inner">
              <div>
                <span className="atn-hero-eyebrow">
                  <span className="atn-live" />
                  Attendance Intelligence Engine · Live
                </span>

                <h1 className="atn-hero-title">
                  Attendance health is <em>holding at {SCHOOL_HEALTH}%</em>, but {UNDER_OBSERVATION}{' '}
                  students are drifting toward the threshold.
                </h1>
                <p className="fs-14 text-muted lh-base mb-0">
                  The engine scored every enrolled student against {SIGNAL_COUNT} attendance signals
                  and explained each prediction. Nothing is sent and no case is opened until you
                  approve it.
                </p>

                <div className="atn-meter">
                  <div className="atn-meter-head">
                    <div>
                      <span className="atn-lbl mb-1">Attendance health</span>
                      <b>
                        {SCHOOL_HEALTH}
                        <small>% school-wide</small>
                      </b>
                    </div>
                    <span className={`atn-pill ${HEALTH_CHANGE >= 0 ? 'is-good' : 'is-critical'}`}>
                      <i className={`ti ti-trending-${HEALTH_CHANGE >= 0 ? 'up' : 'down'}`} />
                      {HEALTH_CHANGE >= 0 ? '+' : ''}
                      {HEALTH_CHANGE} pts this month
                    </span>
                  </div>
                  <div className="atn-meter-band">
                    {band.map((state, index) => (
                      <span className={state} key={`seg-${index}`} />
                    ))}
                  </div>
                  <div className="atn-meter-scale">
                    {[...HEALTH_SCALE].reverse().map((entry) => (
                      <span key={entry.label}>
                        {entry.label} · {entry.note}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="atn-hero-facts">
                  <span>
                    <b>{UNDER_OBSERVATION}</b> under observation
                  </span>
                  <span>
                    <b>{CRITICAL_CASES}</b> critical cases
                  </span>
                  <span>
                    <b>{MODEL_CONFIDENCE}%</b> AI confidence
                  </span>
                  <span>
                    Last prediction <b>{LAST_RUN} today</b>
                  </span>
                  <span>
                    Next prediction <b>{NEXT_RUN_IN}</b>
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <ActionLink
                    className="btn btn-primary d-inline-flex align-items-center"
                    onClick={() => setDialog('run_analysis')}
                  >
                    <i className="ti ti-player-play me-1" />
                    Run Attendance Analysis
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('explain_prediction')}
                  >
                    <i className="ti ti-bulb me-1" />
                    Explain AI Prediction
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('export_summary')}
                  >
                    <i className="ti ti-file-export me-1" />
                    Export AI Summary
                  </ActionLink>
                </div>
              </div>

              <div className="atn-hero-panel">
                <span className="atn-lbl text-center">Predicted term-end attendance</span>
                <div className={`atn-gauge aix-p-${Math.round(PREDICTED_TERM_END)}`}>
                  <span className="atn-gauge-val">
                    {PREDICTED_TERM_END}
                    <small>Projected</small>
                  </span>
                </div>
                <p className="fs-12 text-muted text-center mb-0">
                  {PREDICTED_GAP} points below today, driven by {UNDER_OBSERVATION} drifting
                  students.
                </p>

                <div className="atn-feed">
                  {feed.map((entry) => (
                    <div className="atn-feed-row" key={entry.at}>
                      <time>{entry.at}</time>
                      <p>{entry.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 02 — the case queue */}
          <SectionHead
            n="02"
            title="Attendance Case Queue"
            note="Every student the engine placed under observation, ordered by how far the prediction sits below today’s figure."
            action={
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => setDialog('export_summary')}
              >
                <i className="ti ti-file-export me-1" />
                Export queue
              </ActionLink>
            }
          />

          <div className="row g-4">
            {rows.map((row) => {
              const rowBand = bandOf(row.predicted);
              return (
                <div className="col-xl-4 col-md-6" key={row.id}>
                  <div className="atn-case">
                    <div className={`atn-case-band ${bandPill(rowBand)}`}>
                      <span className="atn-case-delta">
                        <span>{row.current}%</span>
                        <i className="ti ti-arrow-narrow-right" />
                        <span>{row.predicted}%</span>
                      </span>
                      <span className="ms-auto text-end">
                        <span className="d-block fs-11 fw-semibold text-uppercase opacity-75">
                          Predicted
                        </span>
                        <span className="d-block fs-12 fw-medium">
                          -{dropOf(row)} pts in {PREDICTION_WINDOW_DAYS} days
                        </span>
                      </span>
                    </div>

                    <div className="atn-case-body">
                      <div className="d-flex align-items-center gap-3">
                        <span className="avatar avatar-lg avatar-rounded flex-shrink-0">
                          <ImageWithBasePath src={row.studentImage} alt={row.student} />
                        </span>
                        <div className="overflow-hidden">
                          <p className="atn-case-name text-truncate">{row.student}</p>
                          <p className="fs-12 text-muted mb-0">
                            {row.className} · {row.id}
                          </p>
                        </div>
                        <span className={`atn-pill ${bandPill(rowBand)} ms-auto flex-shrink-0`}>
                          {rowBand}
                        </span>
                      </div>

                      <div>
                        <span className="atn-lbl mb-2">
                          Attendance trend · {row.weekly.length} weeks
                        </span>
                        <span className="atn-heat">
                          {heatOf(row).map((cls, index) => (
                            <i className={cls} key={`${row.id}-heat-${row.weekFrom + index}`} />
                          ))}
                        </span>
                        <p className="fs-12 text-muted mb-0 mt-2">{trendNoteOf(row)}</p>
                      </div>

                      <div className="atn-case-grid">
                        <div>
                          <span className="atn-lbl mb-1">AI confidence</span>
                          <span className={`atn-conf aix-p-${row.confidence}`}>
                            <b>{row.confidence}%</b>
                          </span>
                        </div>
                        <div>
                          <span className="atn-lbl mb-1">Teacher</span>
                          <span className="fs-13 fw-medium text-dark d-block text-truncate">
                            {row.teacher}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <span className="fs-12 text-muted">
                          <i className="ti ti-refresh me-1" />
                          {row.updated}
                        </span>
                        <ActionLink
                          className="fs-12 fw-medium text-primary"
                          onClick={() => {
                            setOpenCase(null);
                            setDialog('generate_summary');
                          }}
                        >
                          Generate summary
                        </ActionLink>
                      </div>
                    </div>

                    <div className="atn-case-foot">
                      <ActionLink
                        className="btn btn-sm btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
                        onClick={() => showCase(row)}
                      >
                        <i className="ti ti-brain me-1" />
                        View AI Case
                      </ActionLink>
                      <span title="Start recovery plan">
                        <ActionLink
                          className="atn-ico-btn"
                          ariaLabel="Start recovery plan"
                          onClick={() => setDialog('recovery_plan')}
                        >
                          <i className="ti ti-route" />
                        </ActionLink>
                      </span>
                      <span title="Notify parent">
                        <ActionLink
                          className="atn-ico-btn"
                          ariaLabel="Notify parent"
                          onClick={() => setDialog('notify_parent')}
                        >
                          <i className="ti ti-mail-fast" />
                        </ActionLink>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 03 — the reasoning chain */}
          <SectionHead
            n="03"
            title="Why the AI Predicts a Decline"
            note={`The reasoning chain behind case ${featured.id}, in the order the engine followed it. Each link is evidence, not a chart.`}
          />

          <div className="atn-spine mb-5">
            {reasoning.map((node) => (
              <div className={`atn-node ${bandPill(node.band)}`} key={node.id}>
                <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-1">
                  <p className="atn-node-obs">
                    <i className={`${node.icon} me-2 text-muted`} />
                    {node.observation}
                  </p>
                  <span className={`atn-pill ${bandPill(node.band)}`}>{node.band}</span>
                </div>
                <p className="atn-node-why">{node.why}</p>

                <span className="atn-lbl mb-2">Supporting signals</span>
                <div className="atn-sigs">
                  {node.signals.map((signal) => (
                    <span key={signal.text}>
                      <i className={signal.icon} />
                      {signal.text}
                    </span>
                  ))}
                </div>

                <div className="atn-node-foot">
                  <div className="d-flex align-items-center gap-4 flex-wrap">
                    <div>
                      <span className="atn-lbl mb-1">Confidence</span>
                      <span className={`atn-conf aix-p-${node.confidence}`}>
                        <b>{node.confidence}%</b>
                      </span>
                    </div>
                    <div>
                      <span className="atn-lbl mb-1">Expected improvement</span>
                      <span className="atn-gain">
                        +{node.gain} pts<small>attendance</small>
                      </span>
                    </div>
                  </div>
                  <ActionLink
                    className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('recovery_plan')}
                  >
                    <i className="ti ti-player-play me-1" />
                    {node.action}
                  </ActionLink>
                </div>
              </div>
            ))}
          </div>

          {/* Section 04 — the recommendation center */}
          <SectionHead
            n="04"
            title="Attendance Recommendation Center"
            note="Ranked by expected attendance gained per hour of staff time. Nothing is applied until you approve it."
          />

          <div className="row g-4 mb-5">
            {RECOMMENDATIONS.map((entry, index) => (
              <div className="col-12 col-xl-6" key={entry.id}>
                <div className="atn-rec">
                  <span className="atn-rec-rank">{String(index + 1).padStart(2, '0')}</span>
                  <div className="flex-fill overflow-hidden">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <p className="atn-rec-title">{entry.title}</p>
                      <span className={`atn-pill ${bandPill(entry.band)}`}>
                        {entry.band} priority
                      </span>
                    </div>
                    <p className="fs-13 text-muted mb-0">
                      {recommendationNoteOf(entry, ROUTE.shareOfLateMarks)}
                    </p>
                    <div className="atn-rec-meta">
                      <span>
                        Confidence <b>{entry.confidence}%</b>
                      </span>
                      <span>
                        Expected <b>+{entry.gain} pts</b>
                      </span>
                      <span>
                        Per staff hour <b>{gainPerHourOf(entry).toFixed(1)} pts</b>
                      </span>
                      <span>
                        Timeline <b>{entry.timeline}</b>
                      </span>
                    </div>
                    <ActionLink
                      className="btn btn-sm btn-outline-light bg-white mt-3 d-inline-flex align-items-center"
                      onClick={() => openDialog(entry.modal)}
                    >
                      <i className="ti ti-bolt me-1" />
                      Apply recommendation
                    </ActionLink>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 05 — the recovery workspace */}
          <SectionHead
            n="05"
            title="Attendance Recovery Workspace"
            note={`Where the ${UNDER_OBSERVATION} open cases sit on the recovery track this morning.`}
          />

          <div className="card mb-5">
            <div className="card-body">
              <div className="atn-rail">
                {RECOVERY_TRACK.map((station) => (
                  <div
                    className={`atn-station ${stationStateOf(station.n)}`.trim()}
                    data-n={station.n}
                    key={station.n}
                  >
                    <span className="atn-station-lbl">{station.label}</span>
                    <span className="atn-station-sub">
                      {station.count} {station.note}
                    </span>
                  </div>
                ))}
              </div>
              <div className="atn-alert mt-4">
                <span className="atn-alert-ic">
                  <i className="ti ti-bolt" />
                </span>
                <div className="flex-fill">
                  <p className="fs-14 fw-medium text-dark mb-1">
                    {WAITING_STATION.count} cases are waiting at {WAITING_STATION.label}
                  </p>
                  <p className="fs-13 text-muted mb-0">
                    Plans opened within {EARLY_START_DAYS} days of detection recover{' '}
                    {EARLY_START_ADVANTAGE} points faster than late starts. {LATE_STARTS} of these
                    were detected more than {EARLY_START_DAYS} days ago.
                  </p>
                </div>
                <ActionLink
                  className="btn btn-sm btn-primary flex-shrink-0 d-inline-flex align-items-center"
                  onClick={() => setDialog('recovery_plan')}
                >
                  <i className="ti ti-route me-1" />
                  Open plans
                </ActionLink>
              </div>
            </div>
          </div>

          {/* Section 06 — the copilot */}
          <SectionHead
            n="06"
            title="Attendance Copilot"
            note={`${COPILOT.length} things the copilot can draft for you. Everything it produces arrives as a draft for review.`}
          />

          <div className="row g-4 mb-5">
            {COPILOT.map((entry) => (
              <div className="col-xl-4 col-md-6" key={entry.title}>
                <ActionLink className="atn-launch" onClick={() => openDialog(entry.modal)}>
                  <span className="atn-launch-ic">
                    <i className={entry.icon} />
                  </span>
                  <p className="atn-launch-title">{entry.title}</p>
                  <p className="fs-12 text-muted mb-0 position-relative">{entry.note}</p>
                </ActionLink>
              </div>
            ))}
          </div>

          {/* Section 07 — what the engine noticed */}
          <SectionHead
            n="07"
            title="Attendance Intelligence"
            note="What the engine noticed this week that the registers do not show on their own."
          />

          <div className="row g-4 mb-5">
            {notes.map((note) => (
              <div className="col-xl-3 col-md-6" key={note.label}>
                <div className={`atn-note ${note.tone}`.trim()}>
                  <div className="atn-note-head">
                    <span className="atn-lbl">{note.label}</span>
                    <span className="atn-pill is-ai">
                      <i className="ti ti-sparkles" />
                      AI
                    </span>
                  </div>
                  <span className="atn-note-fig">{note.figure}</span>
                  <p className="atn-note-txt">{note.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section 08 — where it worked */}
          <SectionHead
            n="08"
            title="Success Center"
            note="Where the interventions worked. These are the patterns worth repeating next term."
          />

          <div className="row g-4 mb-5">
            {wins.map((win) => (
              <div className="col-xl col-md-6" key={win.label}>
                <div className="atn-win">
                  <span className="atn-win-ic">
                    <i className={win.icon} />
                  </span>
                  <span className="atn-lbl mb-2">{win.label}</span>
                  <span className="atn-win-fig mb-2">{win.figure}</span>
                  <p className="fs-12 text-muted mb-3">{win.note}</p>
                  <div className="avatar-list-stacked avatar-group-sm mb-0">
                    {win.faces.map((face) => (
                      <span className="avatar avatar-sm avatar-rounded" key={`${win.label}-${face}`}>
                        <ImageWithBasePath
                          className="border border-white"
                          src={`assets/img/students/${face}.jpg`}
                          alt="Student"
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 09 — the audit timeline */}
          <SectionHead
            n="09"
            title="Case Audit Timeline"
            note={`The full history of case ${featured.id}, from the first flagged decline to closure. Every AI action is recorded alongside the human decision that followed it.`}
          />

          <div className="card mb-5">
            <div className="card-body">
              <div className="atn-tl">
                {timeline.map((event) => (
                  <div className={`atn-tl-item ${event.tone}`.trim()} key={event.id}>
                    <div className="atn-tl-card">
                      <p className="atn-tl-title">
                        <i className={`${event.icon} me-2 text-muted`} />
                        {event.title}
                        {event.projected ? (
                          <span className="atn-pill is-watch ms-2">Projected</span>
                        ) : null}
                      </p>
                      <p className="fs-12 text-muted mb-2">
                        {event.on} · {event.at}
                      </p>
                      <p className="fs-13 text-muted mb-0">{event.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 10 — the resource center */}
          <SectionHead
            n="10"
            title="Resource Center"
            note="The templates, rules and documentation behind everything on this page."
          />

          <div className="row g-4 mb-4">
            {RESOURCES.map((resource) => (
              <div className="col-xl-4 col-md-6" key={resource.title}>
                <ActionLink
                  className="atn-res"
                  onClick={() =>
                    pushToast(`${resource.title} opens from the AI settings area.`, 'info')
                  }
                >
                  <span className="atn-res-ic">
                    <i className={resource.icon} />
                  </span>
                  <span className="flex-fill overflow-hidden">
                    <span className="d-block fs-14 fw-medium text-dark">{resource.title}</span>
                    <span className="d-block fs-12 text-muted">{resource.note}</span>
                  </span>
                  <i className="ti ti-arrow-right atn-res-go" />
                </ActionLink>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AttendanceWorkspace
        open={openCase !== null}
        onClose={() => setOpenCase(null)}
        row={openCase}
        onOpenDialog={openDialog}
      />

      <AttendanceModals
        active={dialog}
        onClose={() => setDialog(null)}
        row={openCase ?? featured}
        rows={rows}
        onToast={pushToast}
        onOpenCase={showCase}
        onOpenDialog={setDialog}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default AiAttendancePredictor;
