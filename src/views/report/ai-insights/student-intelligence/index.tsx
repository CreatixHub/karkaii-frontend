import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import StudentWorkspace from './modals/StudentWorkspace';
import StudentModals from './modals/StudentModals';
import type { StudentModalId } from './modals/StudentModals';
import {
  COHORT,
  COPILOT,
  CURRENT_PERCENTILE,
  DIMENSIONS,
  dotsAt,
  dotsFor,
  FEED,
  FEED_WEEKS,
  FINDINGS,
  FIRST_PERCENTILE,
  GROWTH_STORY,
  healthLabelOf,
  INTELLIGENCE_SCORE,
  JOURNEY,
  LAST_RUN,
  LEARNING,
  OPPORTUNITIES,
  ordinal,
  PERCENTILE_GROWTH,
  PROFILE_CONFIDENCE,
  priorityOf,
  RECOMMENDATIONS,
  SCORE_CHANGE,
  scoreColumn,
  strandOf,
  STUDENT,
  TERMS_ON_RECORD,
} from './data/student.data';

/** A numbered chapter heading, in the template's own wording. */
const Chapter = ({ n, title, note }: { n: string; title: string; note: string }) => (
  <div className="sdt-chapter">
    <span className="sdt-chapter-n">{n}</span>
    <div>
      <h2 className="sdt-chapter-title">{title}</h2>
      <p className="sdt-chapter-sub">{note}</p>
    </div>
  </div>
);

const Dots = ({ states, tone = '' }: { states: string[]; tone?: string }) => (
  <span className={`sdt-dots ${tone}`.trim()}>
    {states.map((state, index) => (
      <i className={state} key={`dot-${index}`} />
    ))}
  </span>
);

const AiStudentIntelligence = () => {
  const routes = all_routes;
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  const [dialog, setDialog] = useState<StudentModalId | null>(null);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [selected, setSelected] = useState(COHORT[0]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const openDialog = useCallback((id: string) => setDialog(id as StudentModalId), []);

  const health = `${healthLabelOf(INTELLIGENCE_SCORE)} · ${INTELLIGENCE_SCORE}`;

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Student Intelligence Center
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
                    Student Intelligence
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
                  <i className="ti ti-user me-2" />
                  {selected.name}
                </ActionLink>
                <ul
                  className={`dropdown-menu dropdown-menu-end p-3 ${pickerOpen ? 'show' : ''}`.trim()}
                >
                  {COHORT.map((entry) => (
                    <li key={entry.name}>
                      <ActionLink
                        className={`dropdown-item rounded-1 ${
                          entry.name === selected.name ? 'active' : ''
                        }`.trim()}
                        onClick={() => {
                          setSelected(entry);
                          setPickerOpen(false);
                          if (entry.name !== STUDENT.name) {
                            pushToast(
                              `${entry.name} · ${entry.className} — only ${STUDENT.name}’s twin is modelled in this build.`,
                              'info',
                            );
                          }
                        }}
                      >
                        {entry.name} · {entry.className}
                      </ActionLink>
                    </li>
                  ))}
                </ul>
              </div>
              <ActionLink
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => setWorkspaceOpen(true)}
              >
                <i className="ti ti-layout-sidebar-right-expand me-1" />
                Open Workspace
              </ActionLink>
            </div>
          </div>
          {/* /Page Header */}

          {/* Section 01 — the hero */}
          <div className="sdt-hero mb-5">
            <div className="sdt-hero-inner">
              <div>
                <div className={`sdt-medallion aix-p-${INTELLIGENCE_SCORE}`}>
                  <ImageWithBasePath src={STUDENT.image} alt={STUDENT.name} />
                  <span className="sdt-medallion-badge">
                    <i className="ti ti-sparkles" />
                    Digital Twin
                  </span>
                </div>
              </div>

              <div>
                <span className="sdt-tag is-ai mb-2">
                  <i className="ti ti-id-badge-2" />
                  {STUDENT.id} · Class {STUDENT.className} · Roll {STUDENT.roll}
                </span>
                <h1 className="sdt-hero-name">{STUDENT.name}</h1>
                <div className="d-flex flex-wrap gap-2">
                  <span className="sdt-tag is-up">
                    <i className="ti ti-trending-up" />
                    Growing steadily
                  </span>
                  <span className="sdt-tag is-flat">
                    <i className="ti ti-book" />
                    Visual–practical learner
                  </span>
                  <span className="sdt-tag is-down">
                    <i className="ti ti-alert-circle" />
                    Mathematics needs attention
                  </span>
                </div>

                <p className="sdt-hero-lede">
                  {STUDENT.name.split(' ')[0]} has moved from the{' '}
                  <b>
                    {ordinal(FIRST_PERCENTILE)} to the {ordinal(CURRENT_PERCENTILE)} percentile
                  </b>{' '}
                  across {TERMS_ON_RECORD} terms. Reading and science are compounding; mathematics
                  has stalled since the algebra unit and is now the single constraint on her overall
                  standing. Attendance slipped in June and has since recovered.
                </p>

                <div className="sdt-hero-strip">
                  <span className="sdt-hero-fact">
                    <span className="sdt-lbl">Academic health</span>
                    <span>{health}</span>
                  </span>
                  <span className="sdt-hero-fact">
                    <span className="sdt-lbl">Learning status</span>
                    <span>On track</span>
                  </span>
                  <span className="sdt-hero-fact">
                    <span className="sdt-lbl">Growth trend</span>
                    <span>+{PERCENTILE_GROWTH} percentile</span>
                  </span>
                  <span className="sdt-hero-fact">
                    <span className="sdt-lbl">Last AI review</span>
                    <span>Today, {LAST_RUN}</span>
                  </span>
                  <span className="sdt-hero-fact">
                    <span className="sdt-lbl">AI confidence</span>
                    <span>{PROFILE_CONFIDENCE}%</span>
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <ActionLink
                    className="btn btn-primary d-inline-flex align-items-center"
                    onClick={() => setWorkspaceOpen(true)}
                  >
                    <i className="ti ti-layout-sidebar-right-expand me-1" />
                    Open Intelligence Workspace
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('student_summary')}
                  >
                    <i className="ti ti-file-text me-1" />
                    Generate Student Summary
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('compare_students')}
                  >
                    <i className="ti ti-users-group me-1" />
                    Compare Student
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('parent_report')}
                  >
                    <i className="ti ti-mail-star me-1" />
                    Parent Summary
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('export_intelligence')}
                  >
                    <i className="ti ti-file-export me-1" />
                    Export Intelligence
                  </ActionLink>
                </div>
              </div>

              <div className="sdt-score">
                <span className="sdt-lbl text-center">AI Intelligence Score</span>
                <span className="sdt-score-col">
                  {scoreColumn().map((state, index) => (
                    <i className={state} key={`score-${index}`} />
                  ))}
                </span>
                <span className="sdt-score-val">
                  {INTELLIGENCE_SCORE}
                  <small>/100</small>
                </span>
                <span className="sdt-tag is-up">
                  <i className="ti ti-arrow-up-right" />+{SCORE_CHANGE} this term
                </span>
              </div>
            </div>
          </div>

          {/* Section 02 — the digital twin */}
          <Chapter
            n="02"
            title="Student Digital Twin"
            note={`${DIMENSIONS.length} dimensions the engine models for every student. Each is a reading of behaviour over four terms, not a score for this week.`}
          />

          <div className="row g-3 mb-5">
            {DIMENSIONS.map((dimension) => (
              <div className="col-xl-3 col-md-6" key={dimension.id}>
                <div className="sdt-dna">
                  <span className={`sdt-strand ${dimension.tone}`.trim()}>
                    {strandOf(dimension).map((state, index) => (
                      <i className={state} key={`${dimension.id}-strand-${index}`} />
                    ))}
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="sdt-dna-title">{dimension.title}</p>
                    <span className="sdt-dna-val">{dimension.verdict}</span>
                    <p className="sdt-dna-txt">{dimension.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 03 — the findings */}
          <Chapter
            n="03"
            title="Why the AI Reached These Conclusions"
            note="Every insight, with the reasoning and the evidence behind it. Read the left face for what changed and the right for why the engine believes it."
          />

          <div className="row g-4 mb-5">
            {FINDINGS.map((finding) => (
              <div className="col-12 col-xl-6" key={finding.id}>
                <div className="sdt-lens">
                  <div className="sdt-lens-face">
                    <span className={`sdt-lens-ic ${finding.tone}`}>
                      <i className={finding.icon} />
                    </span>
                    <p className="sdt-lens-obs">{finding.observation}</p>
                    <span className={`sdt-tag ${finding.statusTag}`}>{finding.status}</span>
                  </div>
                  <div className="sdt-lens-body">
                    <span className="sdt-lbl mb-2">AI reasoning</span>
                    <p className="sdt-lens-why">{finding.why}</p>
                    <span className="sdt-lbl mb-1">Supporting evidence</span>
                    {finding.evidence.map((item) => (
                      <div className="sdt-ev" key={item.text}>
                        <i className={item.icon} />
                        <span>{item.text}</span>
                      </div>
                    ))}
                    <div className="sdt-lens-foot">
                      <div>
                        <span className="sdt-lbl mb-1">Confidence</span>
                        <div className="d-flex align-items-center gap-2">
                          <Dots states={dotsFor(finding.confidence)} />
                          <span className="fs-13 fw-semibold text-dark">
                            {finding.confidence}%
                          </span>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="sdt-lbl mb-1">Expected outcome</span>
                        <span className="fs-13 fw-medium text-dark">{finding.outcome}</span>
                      </div>
                    </div>
                    <ActionLink
                      className="btn btn-sm btn-outline-light bg-white mt-3 d-inline-flex align-items-center"
                      onClick={() => openDialog(finding.modal)}
                    >
                      <i className="ti ti-player-play me-1" />
                      {finding.action}
                    </ActionLink>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 04 — the journey */}
          <Chapter
            n="04"
            title="Academic Journey"
            note={`Three years and ${TERMS_ON_RECORD} terms, from transfer admission to today.`}
          />

          <div className="card mb-5">
            <div className="card-body">
              <div className="sdt-journey">
                {JOURNEY.map((leg) => (
                  <div className={`sdt-leg ${leg.tone}`.trim()} key={leg.id}>
                    <div className="sdt-leg-date">
                      <span>{leg.on}</span>
                      <span>{leg.term}</span>
                    </div>
                    <div className="sdt-leg-rule" />
                    <div className="sdt-leg-card">
                      <p className="sdt-leg-title">
                        <i className={`${leg.icon} me-2 text-muted`} />
                        {leg.title}
                      </p>
                      <p className="fs-13 text-muted mb-0">{leg.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 05 — how she learns */}
          <Chapter
            n="05"
            title="Learning Intelligence"
            note="How she learns, described rather than scored. The dots indicate strength; the words carry the finding."
          />

          <div className="row g-4 mb-5">
            {LEARNING.map((read) => (
              <div className="col-xl-4 col-md-6" key={read.id}>
                <div className="sdt-learn">
                  <div className="sdt-learn-head">
                    <span className="sdt-learn-ic">
                      <i className={read.icon} />
                    </span>
                    <p className="sdt-learn-title">{read.title}</p>
                  </div>
                  <span className="sdt-learn-verdict">{read.verdict}</span>
                  <p className="sdt-learn-txt">{read.note}</p>
                  <div className="d-flex align-items-center justify-content-between">
                    <Dots states={dotsAt(read.level)} tone={read.tone} />
                    <span className="sdt-tag is-ai">
                      <i className="ti ti-sparkles" />
                      AI reading
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 06 — what to do about it */}
          <Chapter
            n="06"
            title="AI Recommendations"
            note="Ranked by expected gain against the effort required. Nothing is applied until a teacher approves it."
          />

          <div className="row g-4 mb-5">
            {RECOMMENDATIONS.map((entry, index) => {
              const priority = priorityOf(index + 1);
              return (
                <div className="col-12 col-xl-6" key={entry.id}>
                  <div className={`sdt-rec ${priority.card}`}>
                    <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
                      <p className="sdt-rec-title">{entry.title}</p>
                      <span className={`sdt-tag ${priority.tag}`}>{priority.band} priority</span>
                    </div>
                    <p className="fs-13 text-muted mb-0">{entry.note}</p>
                    <div className="sdt-rec-grid">
                      <span className="sdt-cell">
                        <span className="sdt-lbl">Confidence</span>
                        <span>{entry.confidence}%</span>
                      </span>
                      <span className="sdt-cell">
                        <span className="sdt-lbl">Expected</span>
                        <span>{entry.expected}</span>
                      </span>
                      <span className="sdt-cell">
                        <span className="sdt-lbl">Timeline</span>
                        <span>{entry.timeline}</span>
                      </span>
                      <span className="sdt-cell">
                        <span className="sdt-lbl">Owner</span>
                        <span>{entry.owner}</span>
                      </span>
                    </div>
                    <ActionLink
                      className="btn btn-sm btn-primary d-inline-flex align-items-center"
                      onClick={() => openDialog(entry.modal)}
                    >
                      <i className="ti ti-bolt me-1" />
                      Apply recommendation
                    </ActionLink>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 07 — the story the record tells */}
          <Chapter
            n="07"
            title="Academic Growth Story"
            note="The narrative the record tells, written out rather than plotted."
          />

          <div className="row g-4 mb-5">
            {GROWTH_STORY.map((entry) => (
              <div className="col-xl-4 col-md-6" key={entry.id}>
                <div className={`sdt-story ${entry.tone}`.trim()}>
                  <p className="sdt-story-title">
                    <i className={`${entry.icon} me-2`} />
                    {entry.title}
                  </p>
                  <p className="sdt-story-txt">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section 08 — the copilot */}
          <Chapter
            n="08"
            title="Student Copilot"
            note={`${COPILOT.length} things the copilot can draft from this record. Everything arrives as a draft for review.`}
          />

          <div className="row g-3 mb-5">
            {COPILOT.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.title}>
                <ActionLink className="sdt-do" onClick={() => openDialog(entry.modal)}>
                  <span className="sdt-do-ic">
                    <i className={entry.icon} />
                  </span>
                  <span className="flex-fill overflow-hidden">
                    <span className="d-block fs-14 fw-medium text-dark">{entry.title}</span>
                    <span className="d-block fs-12 text-muted">{entry.note}</span>
                  </span>
                  <i className="ti ti-arrow-right sdt-do-go" />
                </ActionLink>
              </div>
            ))}
          </div>

          {/* Section 09 — the feed */}
          <Chapter
            n="09"
            title="Intelligence Feed"
            note={`Everything the engine and the staff recorded against this student in the last ${FEED_WEEKS} weeks.`}
          />

          <div className="sdt-feed mb-5">
            {FEED.map((entry) => (
              <div className="sdt-feed-row" key={entry.id}>
                <div className="sdt-feed-when">
                  <b>{entry.when}</b>
                  {entry.at}
                </div>
                <span className={`sdt-feed-ic ${entry.tone}`.trim()}>
                  <i className={entry.icon} />
                </span>
                <div className="sdt-feed-txt">
                  <p>{entry.title}</p>
                  <small>{entry.note}</small>
                </div>
              </div>
            ))}
          </div>

          {/* Section 10 — where it could lead */}
          <Chapter
            n="10"
            title="Opportunity Center"
            note="Where her strongest signals could take her next. Matched to the record, not to the calendar."
          />

          <div className="row g-4 mb-4">
            {OPPORTUNITIES.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.id}>
                <div className="sdt-opp">
                  <div className={`sdt-opp-cap ${entry.cap}`.trim()}>
                    <i className={entry.icon} />
                  </div>
                  <div className="sdt-opp-body">
                    <span className="sdt-lbl mb-2">{entry.kind}</span>
                    <p className="sdt-opp-title">{entry.title}</p>
                    <p className="fs-12 text-muted mb-3">{entry.note}</p>
                    <ActionLink
                      className="btn btn-sm btn-outline-light bg-white mt-auto align-self-start d-inline-flex align-items-center"
                      onClick={() => setDialog('student_summary')}
                    >
                      <i className="ti ti-arrow-right me-1" />
                      Review fit
                    </ActionLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StudentWorkspace
        open={workspaceOpen}
        onClose={() => setWorkspaceOpen(false)}
        onOpenDialog={openDialog}
      />

      <StudentModals active={dialog} onClose={() => setDialog(null)} onToast={pushToast} />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default AiStudentIntelligence;
