import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import TeacherWorkspace from './modals/TeacherWorkspace';
import TeacherModals from './modals/TeacherModals';
import type { TeacherModalId } from './modals/TeacherModals';
import type { Teacher } from './data/teaching.data';
import {
  BADGES,
  COACHING,
  COACHING_PLANS_OPEN,
  coachingTextOf,
  COPILOT,
  DEPARTMENTS,
  DIMENSIONS,
  dimensionReadingOf,
  EFFECTIVENESS_MEAN,
  ENGAGEMENT_MEAN,
  evidenceOf,
  facetsOf,
  FEATURED_TEACHER,
  fillIn,
  FINDINGS,
  headlineOf,
  journeyLegs,
  LAST_RUN,
  LESSON_RECORDS,
  NOTES,
  OBSERVATIONS,
  PRODUCTIVITY_HEALTH,
  priorityOf,
  reviewedLabelOf,
  ringToneOf,
  TEACHERS,
  TEACHERS_REVIEWED,
  TILES,
  waveAxis,
  waveBars,
  WAVE_CHANGE,
  WAVE_CONFIDENCE,
  wavePeaks,
  waveDips,
  ENGAGEMENT_WAVE,
} from './data/teaching.data';

/** A numbered band heading, in the template's own wording. */
const Band = ({
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
  <div className="tch-band">
    <span className="tch-band-n">{n}</span>
    <div>
      <h2 className="tch-band-title">{title}</h2>
      <p className="tch-band-sub">{note}</p>
    </div>
    {action ? <div className="ms-auto d-flex align-items-center gap-2 flex-wrap">{action}</div> : null}
  </div>
);

const AiTeacherProductivity = () => {
  const routes = all_routes;
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  const [dialog, setDialog] = useState<TeacherModalId | null>(null);
  const [openTeacher, setOpenTeacher] = useState<Teacher | null>(null);
  const [department, setDepartment] = useState('All departments');
  const [pickerOpen, setPickerOpen] = useState(false);

  const openDialog = useCallback((id: string) => setDialog(id as TeacherModalId), []);

  const showTeacher = useCallback((teacher: Teacher) => {
    setDialog(null);
    setOpenTeacher(teacher);
  }, []);

  const roster =
    department === 'All departments'
      ? TEACHERS
      : TEACHERS.filter((row) => row.department === department);

  const bars = waveBars();
  const axis = waveAxis();
  const peaks = wavePeaks().length;
  const dips = waveDips().length;

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Teacher Productivity Center
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
                    Teacher Productivity
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className={`dropdown me-2 mb-2 ${pickerOpen ? 'show' : ''}`.trim()}>
                <ActionLink
                  className="dropdown-toggle btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  onClick={() => setPickerOpen((current) => !current)}
                >
                  <i className="ti ti-building me-2" />
                  {department}
                </ActionLink>
                <ul
                  className={`dropdown-menu dropdown-menu-end p-3 ${pickerOpen ? 'show' : ''}`.trim()}
                >
                  {['All departments', ...DEPARTMENTS].map((option) => (
                    <li key={option}>
                      <ActionLink
                        className={`dropdown-item rounded-1 ${
                          option === department ? 'active' : ''
                        }`.trim()}
                        onClick={() => {
                          setDepartment(option);
                          setPickerOpen(false);
                        }}
                      >
                        {option}
                      </ActionLink>
                    </li>
                  ))}
                </ul>
              </div>
              <ActionLink
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => setOpenTeacher(FEATURED_TEACHER)}
              >
                <i className="ti ti-layout-sidebar-right-expand me-1" />
                Open Workspace
              </ActionLink>
            </div>
          </div>
          {/* /Page Header */}

          {/* Section 01 — the command centre */}
          <div className="tch-stage mb-5">
            <div className="tch-stage-inner">
              <div>
                <span className="tch-stage-badge">
                  <i className="ti ti-sparkles" />
                  Teaching Intelligence Engine
                </span>
                <h1 className="tch-stage-title">
                  Engagement is the strongest it has been all year.{' '}
                  <em>Four teachers are carrying it alone.</em>
                </h1>
                <p className="fs-14 text-muted lh-base mb-0">
                  The engine reviewed {TEACHERS_REVIEWED} teaching timetables,{' '}
                  {LESSON_RECORDS.toLocaleString('en-IN')} lesson records and {OBSERVATIONS}{' '}
                  classroom observations, then wrote the reasoning behind every finding. It coaches;
                  it does not appraise. Nothing here reaches a personnel file.
                </p>
                <div className="tch-stage-strip">
                  <span className="tch-stat">
                    <span className="tch-lbl">Productivity health</span>
                    <b>
                      {PRODUCTIVITY_HEALTH}
                      <small>/100</small>
                    </b>
                  </span>
                  <span className="tch-stat">
                    <span className="tch-lbl">Teaching effectiveness</span>
                    <b>
                      {EFFECTIVENESS_MEAN}
                      <small>% mean</small>
                    </b>
                  </span>
                  <span className="tch-stat">
                    <span className="tch-lbl">Classroom engagement</span>
                    <b>
                      {ENGAGEMENT_MEAN}
                      <small>% mean</small>
                    </b>
                  </span>
                  <span className="tch-stat">
                    <span className="tch-lbl">AI coaching</span>
                    <b>
                      {COACHING_PLANS_OPEN}
                      <small> plans open</small>
                    </b>
                  </span>
                  <span className="tch-stat">
                    <span className="tch-lbl">Last AI review</span>
                    <b>
                      {LAST_RUN}
                      <small> today</small>
                    </b>
                  </span>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  <ActionLink
                    className="btn btn-primary d-inline-flex align-items-center"
                    onClick={() => setDialog('run_analysis')}
                  >
                    <i className="ti ti-player-play me-1" />
                    Run AI Analysis
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('teaching_summary')}
                  >
                    <i className="ti ti-file-text me-1" />
                    Generate Teaching Summary
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setOpenTeacher(FEATURED_TEACHER)}
                  >
                    <i className="ti ti-bulb me-1" />
                    Explain AI Insights
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('export_report')}
                  >
                    <i className="ti ti-file-export me-1" />
                    Export Productivity Report
                  </ActionLink>
                </div>
              </div>

              <div className="tch-panel">
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <span className="tch-lbl">
                    Classroom engagement · {ENGAGEMENT_WAVE.length} weeks
                  </span>
                  <span className={`tch-pill ${WAVE_CHANGE >= 0 ? 'is-high' : 'is-low'}`}>
                    <i className={`ti ti-trending-${WAVE_CHANGE >= 0 ? 'up' : 'down'}`} />
                    {WAVE_CHANGE >= 0 ? '+' : ''}
                    {WAVE_CHANGE} pts
                  </span>
                </div>
                <div className="tch-wave">
                  {bars.map((bar, index) => (
                    <i
                      className={`${bar.tone} aix-p-${bar.value}`.trim()}
                      key={`wave-${axis[0] + index}`}
                    />
                  ))}
                </div>
                <div className="tch-wave-axis">
                  {axis.map((week) => (
                    <span key={week}>Wk {String(week).padStart(2, '0')}</span>
                  ))}
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <span className="tch-pill is-high">
                    <i className="ti ti-arrow-up" />
                    {peaks} peaks
                  </span>
                  <span className="tch-pill is-mid">
                    <i className="ti ti-arrow-down" />
                    {dips} dips
                  </span>
                  <span className="tch-pill is-ai">
                    <i className="ti ti-sparkles" />
                    {WAVE_CONFIDENCE}% confidence
                  </span>
                </div>
                <p className="fs-12 text-muted mb-0">
                  Every dip falls in the week after a public holiday. The pattern is calendar-driven
                  and recovers without intervention.
                </p>
              </div>
            </div>
          </div>

          {/* Section 02 — the roster */}
          <Band
            n="02"
            title="Teacher Intelligence Workspace"
            note="Every teacher the engine reviewed, with the profile it built rather than a ranking."
            action={
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => setDialog('compare_teachers')}
              >
                <i className="ti ti-git-compare me-1" />
                Compare teachers
              </ActionLink>
            }
          />

          <div className="row g-4">
            {roster.map((row) => (
              <div className="col-xl-4 col-md-6" key={row.id}>
                <div className="tch-card">
                  <div className="tch-card-head">
                    <span className="avatar avatar-xl avatar-rounded flex-shrink-0">
                      <ImageWithBasePath src={row.image} alt={row.name} />
                    </span>
                    <div className="overflow-hidden">
                      <p className="tch-card-name text-truncate">{row.name}</p>
                      <p className="fs-12 text-muted mb-0">{row.department}</p>
                    </div>
                    <span className="tch-card-score">
                      <b>
                        {row.score}
                        <small>/100</small>
                      </b>
                    </span>
                  </div>
                  <div className="tch-card-body">
                    <div className="d-flex flex-wrap gap-2">
                      <span className="tch-pill">
                        <i className="ti ti-book" />
                        {row.subjects}
                      </span>
                      <span className="tch-pill is-note">
                        <i className="ti ti-bulb" />
                        {row.style}
                      </span>
                    </div>
                    <div>
                      <span className="tch-lbl mb-1">Teaching profile</span>
                      {facetsOf(row).map((facet) => (
                        <span className="tch-facet" key={facet.label}>
                          <span>{facet.label}</span>
                          <span
                            className={`tch-facet-bar ${facet.tone} aix-p-${facet.value}`.replace(
                              /\s+/g,
                              ' ',
                            )}
                          />
                          <b>{facet.value}</b>
                        </span>
                      ))}
                    </div>
                    <p className="fs-12 text-muted mb-0">
                      <i className="ti ti-sparkles me-1 text-primary" />
                      {headlineOf(row)}
                    </p>
                    <div className="d-flex align-items-center justify-content-between gap-2 pt-3 border-top">
                      <span className="tch-pill is-ai">
                        <i className="ti ti-sparkles" />
                        {row.confidence}% confidence
                      </span>
                      <span className="fs-12 text-muted">Reviewed {reviewedLabelOf(row)}</span>
                    </div>
                  </div>
                  <div className="tch-card-foot">
                    <ActionLink
                      className="btn btn-sm btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
                      onClick={() => showTeacher(row)}
                    >
                      <i className="ti ti-layout-sidebar-right-expand me-1" />
                      Open AI Workspace
                    </ActionLink>
                    <span title="View teaching insights">
                      <ActionLink
                        className="tch-ico"
                        ariaLabel="View teaching insights"
                        onClick={() => showTeacher(row)}
                      >
                        <i className="ti ti-bulb" />
                      </ActionLink>
                    </span>
                    <span title="Generate coaching plan">
                      <ActionLink
                        className="tch-ico"
                        ariaLabel="Generate coaching plan"
                        onClick={() => {
                          setOpenTeacher(null);
                          setDialog('coaching_plan');
                        }}
                      >
                        <i className="ti ti-route" />
                      </ActionLink>
                    </span>
                    <span title="Compare teachers">
                      <ActionLink
                        className="tch-ico"
                        ariaLabel="Compare teachers"
                        onClick={() => setDialog('compare_teachers')}
                      >
                        <i className="ti ti-git-compare" />
                      </ActionLink>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 03 — the findings */}
          <Band
            n="03"
            title="Why the AI Reached These Findings"
            note={`${FINDINGS.length} findings, each recorded the way an appraisal note would be: reasoning, evidence, impact, then what to do.`}
          />

          <div className="mb-5">
            {FINDINGS.map((finding) => (
              <div className={`tch-record ${finding.tone}`} key={finding.id}>
                <div className="tch-record-head">
                  <p className="tch-record-obs">
                    <i className={`${finding.icon} me-2 text-muted`} />
                    {finding.observation}
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className={`tch-pill ${finding.tone}`}>{finding.label}</span>
                    <span className="tch-pill is-ai">
                      <i className="ti ti-sparkles" />
                      {finding.confidence}% confidence
                    </span>
                  </div>
                </div>
                <div className="tch-dl">
                  <div className="tch-dt">AI reasoning</div>
                  <p className="tch-dd">{finding.why}</p>
                  <div className="tch-dt">Supporting evidence</div>
                  <div className="tch-dd">
                    {evidenceOf(finding).map((line) => (
                      <span className="tch-ev" key={line}>
                        <i className="ti ti-point-filled" />
                        <span>{line}</span>
                      </span>
                    ))}
                  </div>
                  <div className="tch-dt">Impact</div>
                  <p className="tch-dd">{finding.impact}</p>
                  <div className="tch-dt">Suggested improvement</div>
                  <div className="tch-dd">
                    <p className="mb-3">{finding.action}</p>
                    <ActionLink
                      className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                      onClick={() => setDialog('coaching_plan')}
                    >
                      <i className="ti ti-plus me-1" />
                      Add to coaching plan
                    </ActionLink>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 04 — the nine dimensions */}
          <Band
            n="04"
            title="Teaching Intelligence Center"
            note={`${DIMENSIONS.length} dimensions the engine models school-wide. The ring shows where each currently stands.`}
          />

          <div className="row g-4 mb-5">
            {DIMENSIONS.map((dimension) => {
              const reading = dimensionReadingOf(dimension);
              return (
                <div className="col-xl-4 col-md-6" key={dimension.id}>
                  <div className="tch-facet-card">
                    <div className={`tch-ring ${ringToneOf(reading)} aix-p-${reading}`}>
                      <b>{reading}</b>
                    </div>
                    <p className="tch-facet-title">{dimension.title}</p>
                    <div className="tch-mini">
                      <div className="tch-dt">AI finding</div>
                      <p className="tch-dd">{dimension.finding}</p>
                      <div className="tch-dt">Improvement suggestion</div>
                      <p className="tch-dd">{dimension.suggestion}</p>
                      <div className="tch-dt">Teaching impact</div>
                      <p className="tch-dd">{dimension.impact}</p>
                      <div className="tch-dt">Expected outcome</div>
                      <p className="tch-dd mb-0">{dimension.outcome}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 05 — the coaching centre */}
          <Band
            n="05"
            title="AI Coaching Center"
            note="Coaching, not appraisal. Ranked by what each returns against the time it asks of a teacher."
          />

          <div className="row g-4 mb-5">
            {COACHING.map((entry, index) => {
              const priority = priorityOf(index + 1);
              return (
                <div className="col-12 col-xl-6" key={entry.id}>
                  <div className="tch-coach">
                    <span className={`tch-coach-ic ${priority.pill}`}>
                      <i className={entry.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <p className="tch-coach-title">{entry.title}</p>
                      <p className="fs-13 text-muted mb-0">{coachingTextOf(entry, 'note')}</p>
                      <div className="tch-coach-foot">
                        <span className={`tch-pill ${priority.pill}`}>{priority.band}</span>
                        <span className="tch-pill is-ai">
                          <i className="ti ti-sparkles" />
                          {entry.confidence}%
                        </span>
                        <span className="fs-12 text-muted">
                          Expected <b className="text-dark">{coachingTextOf(entry, 'expected')}</b>
                        </span>
                        <span className="fs-12 text-muted">
                          Timeline <b className="text-dark">{entry.timeline}</b>
                        </span>
                        <ActionLink
                          className="btn btn-sm btn-outline-light bg-white ms-auto d-inline-flex align-items-center"
                          onClick={() => openDialog(entry.modal)}
                        >
                          <i className="ti ti-bolt me-1" />
                          Apply coaching
                        </ActionLink>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 06 — what no single observation shows */}
          <Band
            n="06"
            title="Classroom Intelligence"
            note="What the engine noticed across every classroom that no single observation would show."
          />

          <div className="row g-4 mb-5">
            {TILES.map((tile) => (
              <div className="col-xl-3 col-md-6" key={tile.id}>
                <div className="tch-tile">
                  <span className="tch-tile-ic">
                    <i className={tile.icon} />
                  </span>
                  <p className="tch-tile-title">{tile.title}</p>
                  <p className="fs-13 text-muted mb-0">{fillIn(tile.text)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section 07 — the copilot */}
          <Band
            n="07"
            title="AI Teaching Copilot"
            note={`${COPILOT.length} things the copilot can draft from the review record. Everything arrives as a draft for you to edit.`}
          />

          <div className="row g-3 mb-5">
            {COPILOT.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.n}>
                <ActionLink className="tch-do" onClick={() => openDialog(entry.modal)}>
                  <span className="tch-do-n">{entry.n}</span>
                  <span className="flex-fill overflow-hidden">
                    <span className="d-block fs-14 fw-medium text-dark">{entry.title}</span>
                    <span className="d-block fs-12 text-muted">{entry.note}</span>
                  </span>
                  <i className="ti ti-arrow-right tch-do-go" />
                </ActionLink>
              </div>
            ))}
          </div>

          {/* Section 08 — the coaching case */}
          <Band
            n="08"
            title="Teaching Journey"
            note="The full arc of one coaching case, from the first engine review to the point it closes."
          />

          <div className="card mb-5">
            <div className="card-body">
              {journeyLegs().map((leg) => (
                <div className={`tch-leg ${leg.state}`.trim()} key={leg.id}>
                  <span className="tch-leg-n">{leg.n}</span>
                  <div className="flex-fill overflow-hidden">
                    <p className="tch-leg-title">{leg.title}</p>
                    <p className="fs-12 text-muted mb-1">{leg.on}</p>
                    <p className="fs-13 text-muted mb-0">{leg.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 09 — where the staff stands */}
          <Band
            n="09"
            title="Professional Growth Center"
            note="Where the teaching staff stands on development, credentials and readiness."
          />

          <div className="row g-4 mb-5">
            {BADGES.map((badge) => (
              <div className="col-xl-3 col-md-6" key={badge.id}>
                <div className="tch-badge">
                  <span className="tch-medal">
                    <i className={badge.icon} />
                  </span>
                  <span className="tch-badge-fig">{badge.figure}</span>
                  <p className="tch-badge-title">{badge.title}</p>
                  <p className="fs-12 text-muted mb-0">{badge.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section 10 — the conclusions */}
          <Band
            n="10"
            title="AI Insight Center"
            note={`${NOTES.length} conclusions drawn across all ${TEACHERS_REVIEWED} teachers, written as intelligence rather than as figures.`}
          />

          <div className="row g-4 mb-4">
            {NOTES.map((note) => (
              <div className="col-xl-4 col-md-6" key={note.id}>
                <div className="tch-note">
                  <p className="tch-note-title">
                    <i className={`${note.icon} me-2`} />
                    {note.title}
                  </p>
                  <p className="fs-13 text-muted mb-0">{fillIn(note.text)}</p>
                </div>
              </div>
            ))}
            <div className="col-xl-4 col-md-6">
              <div className="tch-note">
                <p className="tch-note-title">
                  <i className="ti ti-users me-2" />
                  The whole roster
                </p>
                <p className="fs-13 text-muted mb-3">
                  {TEACHERS.length} profiles are shown here. The review covered {TEACHERS_REVIEWED}.
                </p>
                <ActionLink
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => setDialog('all_teachers')}
                >
                  <i className="ti ti-list me-1" />
                  All teachers
                </ActionLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TeacherWorkspace
        open={openTeacher !== null}
        onClose={() => setOpenTeacher(null)}
        teacher={openTeacher}
        onOpenDialog={openDialog}
      />

      <TeacherModals
        active={dialog}
        onClose={() => setDialog(null)}
        teacher={openTeacher ?? FEATURED_TEACHER}
        onToast={pushToast}
        onOpenTeacher={showTeacher}
        onOpenDialog={setDialog}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default AiTeacherProductivity;
