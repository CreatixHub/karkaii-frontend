import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import SuccessWorkspace from './modals/SuccessWorkspace';
import AssistantModals from './modals/AssistantModals';
import type { AssistantModalId } from './modals/AssistantModals';
import {
  BLOCKS,
  COACHING,
  COMPANION,
  DAYS_TO_EXAM,
  difficultyToneOf,
  FINDINGS,
  GOALS,
  LONGEST_STREAK,
  milestoneStateOf,
  MISSION,
  MISSION_DONE,
  MISSION_STEPS,
  OPPORTUNITIES,
  progressLabel,
  RANGES,
  STORY,
  STORY_DONE,
  storyBeats,
  STREAK,
  STREAK_DAYS,
  streakCells,
  STUDENT,
  TASKS,
  timeLeftLabel,
  TIPS,
} from './data/assistant.data';

/** A section heading, in the template's own wording. */
const Head = ({ icon, title, note }: { icon: string; title: string; note: string }) => (
  <div className="lrn-hd">
    <span className="lrn-hd-ic">
      <i className={icon} />
    </span>
    <div>
      <h2 className="lrn-hd-title">{title}</h2>
      <p className="lrn-hd-sub">{note}</p>
    </div>
  </div>
);

const AiStudentAssistant = () => {
  const routes = all_routes;
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  const [dialog, setDialog] = useState<AssistantModalId | null>(null);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [range, setRange] = useState(RANGES[0]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const openDialog = useCallback((id: string) => setDialog(id as AssistantModalId), []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Student Success Assistant
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
                    Student Assistant
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
                  <i className="ti ti-calendar me-2" />
                  {range}
                </ActionLink>
                <ul
                  className={`dropdown-menu dropdown-menu-end p-3 ${pickerOpen ? 'show' : ''}`.trim()}
                >
                  {RANGES.map((option) => (
                    <li key={option}>
                      <ActionLink
                        className={`dropdown-item rounded-1 ${option === range ? 'active' : ''}`.trim()}
                        onClick={() => {
                          setRange(option);
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
                onClick={() => setWorkspaceOpen(true)}
              >
                <i className="ti ti-player-play me-1" />
                Start Today’s Mission
              </ActionLink>
            </div>
          </div>
          {/* /Page Header */}

          {/* Section 01 — the success hub */}
          <div className="lrn-hub mb-5">
            <div className="lrn-hub-inner">
              <div>
                <p className="lrn-hub-hello">
                  Good morning, {STUDENT.firstName} · {STUDENT.className}
                </p>
                <h1 className="lrn-hub-title">
                  Two hours today, and <em>algebra stops being the hard one</em>.
                </h1>
                <p className="fs-14 text-muted lh-base mb-0">
                  Your assistant looked at what you finished this week, what is coming up, and where
                  you slow down. It built today around the one thing that would move the most — not
                  around everything at once.
                </p>

                <div className="lrn-mission">
                  <span className="lrn-frame">{MISSION_DONE}</span>
                  <div className="flex-fill overflow-hidden">
                    <span className="lrn-lbl mb-1">Today’s mission</span>
                    <p className="fs-14 fw-medium text-dark mb-1">{MISSION.title}</p>
                    <p className="fs-12 text-muted mb-0">
                      {MISSION_DONE} of {MISSION_STEPS} steps done · about {timeLeftLabel()} left
                    </p>
                  </div>
                  <ActionLink
                    className="btn btn-sm btn-primary flex-shrink-0 d-inline-flex align-items-center"
                    onClick={() => setWorkspaceOpen(true)}
                  >
                    <i className="ti ti-player-play me-1" />
                    Start
                  </ActionLink>
                </div>

                <div className="lrn-hub-facts">
                  <span className="lrn-fact">
                    <span className="lrn-lbl">Academic focus</span>
                    <b>{MISSION.focus}</b>
                  </span>
                  <span className="lrn-fact">
                    <span className="lrn-lbl">Learning readiness</span>
                    <b>{MISSION.readiness}</b>
                  </span>
                  <span className="lrn-fact">
                    <span className="lrn-lbl">AI guidance</span>
                    <b>Active</b>
                  </span>
                  <span className="lrn-fact">
                    <span className="lrn-lbl">Next exam</span>
                    <b>{DAYS_TO_EXAM} days</b>
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <ActionLink
                    className="btn btn-primary d-inline-flex align-items-center"
                    onClick={() => setWorkspaceOpen(true)}
                  >
                    <i className="ti ti-player-play me-1" />
                    Start Today’s Mission
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('study_plan')}
                  >
                    <i className="ti ti-calendar-plus me-1" />
                    Generate Study Plan
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('roadmap')}
                  >
                    <i className="ti ti-route me-1" />
                    Build Learning Roadmap
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setWorkspaceOpen(true)}
                  >
                    <i className="ti ti-bulb me-1" />
                    View Learning Insights
                  </ActionLink>
                </div>
              </div>

              <div className="lrn-streak-panel">
                <div className="lrn-flame">
                  <i className="ti ti-flame" />
                  <div>
                    <b>{STREAK}</b>
                    <span className="d-block fs-12 text-muted">day study streak</span>
                  </div>
                  {STREAK >= LONGEST_STREAK ? (
                    <span className="lrn-chip is-go ms-auto">
                      <i className="ti ti-trending-up" />
                      Best yet
                    </span>
                  ) : null}
                </div>

                <div>
                  <div className="lrn-streak-days mb-2">
                    {STREAK_DAYS.map((day, index) => (
                      <span key={`day-${index}`}>{day}</span>
                    ))}
                  </div>
                  <div className="lrn-streak">
                    {streakCells().map((state, index) => (
                      <i className={state} key={`cell-${index}`} />
                    ))}
                  </div>
                </div>

                <p className="lrn-say mb-0">
                  You have studied every weekday for {Math.floor(STREAK / 7)} weeks. Keep today and
                  you pass your longest run so far.
                </p>
                <p className="fs-12 text-muted mb-0">
                  Your best sessions start before 5pm. Today’s plan puts the hard part first.
                </p>
              </div>
            </div>
          </div>

          {/* Section 02 — what is on your plate */}
          <Head
            icon="ti ti-list-check"
            title="Your Learning Journey"
            note={`${TASKS.length} things on your plate right now, ordered by what would help you most rather than by what is due first.`}
          />

          <div className="row g-4 mb-5">
            {TASKS.map((task) => (
              <div className="col-xl-3 col-md-6" key={task.id}>
                <div className="lrn-card">
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <span className="lrn-frame is-sm">
                      <i className={task.icon} />
                    </span>
                    <span className={`lrn-chip ${task.statusTone}`}>{task.status}</span>
                  </div>
                  <p className="lrn-card-title">{task.title}</p>
                  <p className="fs-12 text-muted mb-0">{task.note}</p>
                  <div className="lrn-meta">
                    <span>
                      <i className="ti ti-clock me-1" />
                      {task.meta}
                    </span>
                    <span className={`lrn-diff ${difficultyToneOf(task.difficulty)}`}>
                      Difficulty {task.difficulty}
                    </span>
                  </div>
                  <ActionLink
                    className="btn btn-sm btn-outline-light bg-white w-100 mt-3 d-inline-flex align-items-center justify-content-center"
                    onClick={() => openDialog(task.modal)}
                  >
                    {task.cta}
                  </ActionLink>
                </div>
              </div>
            ))}
          </div>

          {/* Section 03 — why the assistant says this */}
          <Head
            icon="ti ti-bulb"
            title="Why the Assistant Suggests This"
            note={`${FINDINGS.length} findings, each showing what was noticed, the reasoning behind it, and what it actually looked at.`}
          />

          <div className="mb-5">
            {FINDINGS.map((finding) => (
              <div className="lrn-why" key={finding.id}>
                <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
                  <span className="lrn-frame is-sm">
                    <i className={finding.icon} />
                  </span>
                  <p className="lrn-why-obs mb-0">{finding.observation}</p>
                  <span className="lrn-chip is-ai ms-auto">
                    <i className="ti ti-sparkles" />
                    {finding.confidence}% confidence
                  </span>
                </div>

                <div className="row g-4">
                  <div className="col-12 col-lg-7">
                    <span className="lrn-lbl mb-2">Why the assistant says this</span>
                    <p className="lrn-say mb-0">{finding.why}</p>
                  </div>
                  <div className="col-12 col-lg-5">
                    <span className="lrn-lbl mb-2">What it looked at</span>
                    {finding.evidence.map((item) => (
                      <div className="lrn-ev" key={item}>
                        <i className="ti ti-point-filled" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lrn-why-foot">
                  <span className="d-flex flex-column">
                    <span className="lrn-lbl">Expected</span>
                    <span className="fs-13 fw-semibold text-dark">{finding.expected}</span>
                  </span>
                  <ActionLink
                    className="btn btn-sm btn-primary ms-auto d-inline-flex align-items-center"
                    onClick={() => openDialog(finding.modal)}
                  >
                    <i className="ti ti-player-play me-1" />
                    {finding.action}
                  </ActionLink>
                </div>
              </div>
            ))}
          </div>

          {/* Section 04 — today's plan */}
          <Head
            icon="ti ti-calendar-time"
            title="Today’s Plan"
            note={`${BLOCKS.length} blocks built around your day, with the hard work placed where you concentrate best.`}
          />

          <div className="card mb-5">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-end mb-3">
                <ActionLink
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => setDialog('study_plan')}
                >
                  <i className="ti ti-refresh me-1" />
                  Rebuild plan
                </ActionLink>
              </div>
              <div className="lrn-day">
                {BLOCKS.map((block) => (
                  <div className="lrn-slot" key={block.id}>
                    <div className="lrn-time">{block.at}</div>
                    <div className={`lrn-block-card ${block.done ? 'is-done' : ''}`.trim()}>
                      <span className={`lrn-frame is-sm aix-p-${block.done ? 100 : 0}`}>
                        <i className={block.icon} />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lrn-block-title">{block.title}</p>
                        <p className="fs-12 text-muted mb-2">{block.note}</p>
                        <span
                          className={`lrn-bar ${block.done ? 'is-go' : ''} aix-p-${block.done ? 100 : 0}`.replace(
                            /\s+/g,
                            ' ',
                          )}
                        />
                      </div>
                      <div className="d-flex flex-column align-items-end gap-2 flex-shrink-0">
                        <span className="fs-12 text-muted">{block.minutes} min</span>
                        <span className={`lrn-diff ${difficultyToneOf(block.difficulty)}`}>
                          {block.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 05 — the coach */}
          <Head
            icon="ti ti-compass"
            title="Your Learning Coach"
            note={`${COACHING.length} suggestions ranked by what each returns for the time it asks of you.`}
          />

          <div className="row g-4 mb-5">
            {COACHING.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.id}>
                <div className="lrn-coach">
                  <div className="lrn-coach-top">
                    <span className="lrn-coach-ic">
                      <i className={entry.icon} />
                    </span>
                    <span className={`lrn-chip ${entry.whenTone}`}>{entry.when}</span>
                  </div>
                  <div className="lrn-coach-body">
                    <p className="lrn-coach-title">{entry.title}</p>
                    <p className="fs-12 text-muted mb-0">{entry.note}</p>
                    <div className="lrn-coach-foot">
                      <span className="d-flex flex-column">
                        <span className="lrn-lbl">Expected</span>
                        <span className="fs-13 fw-semibold text-dark">{entry.expected}</span>
                      </span>
                      <span className="lrn-chip is-ai">
                        <i className="ti ti-sparkles" />
                        {entry.confidence}%
                      </span>
                    </div>
                    <ActionLink
                      className="btn btn-sm btn-primary w-100 mt-3 d-inline-flex align-items-center justify-content-center"
                      onClick={() => openDialog(entry.modal)}
                    >
                      Start now
                    </ActionLink>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 06 — the goals */}
          <Head
            icon="ti ti-flag-check"
            title="Goals in Progress"
            note={`${GOALS.length} goals, shown as journeys rather than percentages. The dot you are standing on is the one that matters.`}
          />

          <div className="mb-5">
            {GOALS.map((goal) => (
              <div className="lrn-goal" key={goal.id}>
                <div className="lrn-goal-head">
                  <div>
                    <p className="lrn-goal-title">{goal.kind}</p>
                    <p className="fs-12 text-muted mb-0">{goal.title}</p>
                  </div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="lrn-chip is-now">{progressLabel(goal)}</span>
                    <ActionLink
                      className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                      onClick={() => setDialog('create_goal')}
                    >
                      <i className="ti ti-adjustments me-1" />
                      Adjust
                    </ActionLink>
                  </div>
                </div>
                <div className={`lrn-track aix-p-${goal.progress}`}>
                  {goal.milestones.map((milestone, index) => (
                    <span className={`lrn-mile ${milestoneStateOf(goal, index)}`.trim()} key={milestone}>
                      {milestone}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Section 07 — the companion */}
          <Head
            icon="ti ti-robot"
            title="Learning Companion"
            note={`${COMPANION.length} things your assistant can build for you. Each one is yours to edit, keep or throw away.`}
          />

          <div className="row g-3 mb-5">
            {COMPANION.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.title}>
                <ActionLink className="lrn-do" onClick={() => openDialog(entry.modal)}>
                  <span className="lrn-do-ic">
                    <i className={entry.icon} />
                  </span>
                  <span className="flex-fill overflow-hidden">
                    <span className="d-block fs-14 fw-medium text-dark">{entry.title}</span>
                    <span className="d-block fs-12 text-muted">{entry.note}</span>
                  </span>
                  <i className="ti ti-arrow-right lrn-do-go" />
                </ActionLink>
              </div>
            ))}
          </div>

          {/* Section 08 — the growth story */}
          <Head
            icon="ti ti-timeline"
            title="Your Growth Story"
            note="How this term’s algebra goal has gone so far, from the day you set it."
          />

          <div className="card mb-5">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                <span className="lrn-lbl">
                  {STORY_DONE} of {STORY.length} steps behind you
                </span>
                <span className="lrn-chip is-go">Still running</span>
              </div>
              <div className="lrn-trail">
                {storyBeats().map((beat) => (
                  <div className={`lrn-beat ${beat.done ? 'is-done' : ''}`.trim()} key={beat.id}>
                    <span className="lrn-beat-ic">
                      <i className={beat.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <p className="lrn-beat-title">{beat.title}</p>
                      <p className="fs-12 text-muted mb-1">{beat.on}</p>
                      <p className="fs-13 text-muted mb-0">{beat.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 09 — the opportunities */}
          <Head
            icon="ti ti-stars"
            title="Opportunities for You"
            note="Chosen from what you are already good at, not from a list everyone gets."
          />

          <div className="row g-4 mb-5">
            {OPPORTUNITIES.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.id}>
                <div className="lrn-opp">
                  <span className="lrn-opp-ic">
                    <i className={entry.icon} />
                  </span>
                  <span className="lrn-lbl mb-1">{entry.kind}</span>
                  <p className="lrn-opp-title">{entry.title}</p>
                  <p className="fs-12 text-muted mb-0">{entry.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section 10 — worth knowing */}
          <Head
            icon="ti ti-sparkles"
            title="Worth Knowing"
            note={`${TIPS.length} things your assistant noticed about how you learn, written for you rather than about you.`}
          />

          <div className="row g-4 mb-4">
            {TIPS.map((tip) => (
              <div className="col-xl-3 col-md-6" key={tip.id}>
                <div className="lrn-tip">
                  <span className="lrn-tip-ic">
                    <i className={tip.icon} />
                  </span>
                  <p className="lrn-tip-title">{tip.title}</p>
                  <p className="fs-13 text-muted mb-0">{tip.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SuccessWorkspace
        open={workspaceOpen}
        onClose={() => setWorkspaceOpen(false)}
        onOpenDialog={openDialog}
      />

      <AssistantModals active={dialog} onClose={() => setDialog(null)} onToast={pushToast} />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default AiStudentAssistant;
