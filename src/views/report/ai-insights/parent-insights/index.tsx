import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import FamilyWorkspace from './modals/FamilyWorkspace';
import FamilyModals from './modals/FamilyModals';
import type { FamilyModalId } from './modals/FamilyModals';
import type { Family } from './data/family.data';
import {
  bandOf,
  CALENDAR_WEEKS,
  COPILOT,
  DRAFTS_WAITING,
  ENGAGEMENT,
  ENGAGEMENT_HEALTH,
  FAMILIES,
  FAMILIES_MODELLED,
  FEATURED,
  FILTERS,
  FINDINGS,
  INSIGHTS,
  LAST_RUN,
  levelBarOf,
  matchesFilter,
  NEEDS_SUPPORT,
  noteOf,
  OPPORTUNITIES,
  priorityToneOf,
  recPriorityOf,
  RECOMMENDATIONS,
  RUN_CONFIDENCE,
  STORY,
  THREAD,
  THREAD_READING,
  TIMELINE,
} from './data/family.data';

/** A section heading in the template's own wording. */
const Head = ({ title, note }: { title: string; note: string }) => (
  <div className="fam-hd">
    <h2 className="fam-hd-title">{title}</h2>
    <p className="fam-hd-sub">{note}</p>
  </div>
);

const AiParentInsights = () => {
  const routes = all_routes;
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  const [dialog, setDialog] = useState<FamilyModalId | null>(null);
  const [openRow, setOpenRow] = useState<Family | null>(null);
  const [filter, setFilter] = useState(FILTERS[0]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const openDialog = useCallback((id: string) => setDialog(id as FamilyModalId), []);
  const showRow = useCallback((row: Family) => {
    setDialog(null);
    setOpenRow(row);
  }, []);

  const roster = FAMILIES.filter((row) => matchesFilter(row, filter));

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Parent Insights Center
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
                    Parent Insights
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
                  <i className="ti ti-users me-2" />
                  {filter}
                </ActionLink>
                <ul
                  className={`dropdown-menu dropdown-menu-end p-3 ${pickerOpen ? 'show' : ''}`.trim()}
                >
                  {FILTERS.map((option) => (
                    <li key={option}>
                      <ActionLink
                        className={`dropdown-item rounded-1 ${option === filter ? 'active' : ''}`.trim()}
                        onClick={() => {
                          setFilter(option);
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
                onClick={() => setOpenRow(FEATURED)}
              >
                <i className="ti ti-layout-sidebar-right-expand me-1" />
                Open Workspace
              </ActionLink>
            </div>
          </div>
          {/* /Page Header */}

          {/* Section 01 — the command centre */}
          <div className="fam-hero mb-5">
            <div className="fam-hero-inner">
              <div>
                <span className="fam-hero-badge">
                  <i className="ti ti-sparkles" />
                  Family Engagement Engine
                </span>
                <h1 className="fam-hero-title">
                  {FAMILIES_MODELLED} families, and the {NEEDS_SUPPORT} who have gone quiet are{' '}
                  <em>the ones we most need to hear from</em>.
                </h1>
                <p className="fs-14 text-muted lh-base mb-0">
                  The engine read three terms of meetings, messages and homework support for every
                  family, then wrote the reasoning behind each finding. It drafts; you decide what is
                  sent. No message leaves the school without a name against it.
                </p>
                <div className="fam-hero-strip">
                  <span className="fam-stat">
                    <span className="fam-lbl">Engagement health</span>
                    <b>
                      {ENGAGEMENT_HEALTH}
                      <small>/100</small>
                    </b>
                  </span>
                  <span className="fam-stat">
                    <span className="fam-lbl">Communication readiness</span>
                    <b>
                      Ready<small> · {DRAFTS_WAITING} drafts</small>
                    </b>
                  </span>
                  <span className="fam-stat">
                    <span className="fam-lbl">Families needing support</span>
                    <b>
                      {NEEDS_SUPPORT}
                      <small> of {FAMILIES_MODELLED}</small>
                    </b>
                  </span>
                  <span className="fam-stat">
                    <span className="fam-lbl">AI confidence</span>
                    <b>
                      {RUN_CONFIDENCE}
                      <small>% mean</small>
                    </b>
                  </span>
                  <span className="fam-stat">
                    <span className="fam-lbl">Last family insight</span>
                    <b>{LAST_RUN} today</b>
                  </span>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  <ActionLink
                    className="btn btn-primary d-inline-flex align-items-center"
                    onClick={() => setDialog('generate_insights')}
                  >
                    <i className="ti ti-sparkles me-1" />
                    Generate Parent Insights
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('parent_summary')}
                  >
                    <i className="ti ti-mail-star me-1" />
                    Generate Parent Summary
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setOpenRow(FEATURED)}
                  >
                    <i className="ti ti-bulb me-1" />
                    Explain AI Insights
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('export_family')}
                  >
                    <i className="ti ti-file-export me-1" />
                    Export Family Report
                  </ActionLink>
                </div>
              </div>

              <div className="fam-thread-panel">
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <span className="fam-lbl">
                    Recent exchange · {FEATURED.guardian.split(' ').slice(-1)[0]} family
                  </span>
                  <span className="fam-chip is-warm">Responsive</span>
                </div>
                <div className="fam-bubbles">
                  {THREAD.map((turn) => (
                    <div className={`fam-bubble ${turn.mine ? 'is-out' : 'is-in'}`} key={turn.id}>
                      <p className="fs-13 mb-1">{turn.text}</p>
                      <span className="fs-11 text-muted">
                        {turn.from} · {turn.at}
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <span className="fam-lbl mb-1">AI reading</span>
                  <p className="fs-12 text-muted mb-0">{THREAD_READING}</p>
                </div>
                <p className="fs-12 text-muted mb-0">
                  <i className="ti ti-info-circle me-1" />
                  Drafted replies always wait for a teacher to approve them.
                </p>
              </div>
            </div>
          </div>

          {/* Section 02 — the roster */}
          <Head
            title="Parent Intelligence Workspace"
            note="Every family the engine read, with the relationship it found rather than a ranking."
          />

          <div className="row g-4 mb-5">
            {roster.map((row) => {
              const band = bandOf(row.score);
              return (
                <div className="col-xl-4 col-md-6" key={row.id}>
                  <div className="fam-card">
                    <div className="fam-card-head">
                      <span className="fam-pair">
                        <span className="avatar avatar-lg avatar-rounded">
                          <ImageWithBasePath src={row.guardianImage} alt={row.guardian} />
                        </span>
                        <span className="avatar avatar-lg avatar-rounded border border-white border-2">
                          <ImageWithBasePath src={row.studentImage} alt={row.student} />
                        </span>
                      </span>
                      <div className="overflow-hidden">
                        <p className="fam-card-name text-truncate">{row.guardian}</p>
                        <p className="fs-12 text-muted mb-0 text-truncate">
                          {row.student} · {row.className}
                        </p>
                      </div>
                    </div>

                    <div className="fam-card-body">
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <span className={`fam-chip ${band.tone}`}>{band.band}</span>
                        <span className={`fam-level ${band.tone}`}>
                          {levelBarOf(row.score).map((state, index) => (
                            <i className={state} key={`${row.id}-l${index}`} />
                          ))}
                        </span>
                      </div>

                      <div className="fam-facts">
                        <span className="fam-cell">
                          <span className="fam-lbl">Prefers</span>
                          <span className="text-truncate">{row.prefers}</span>
                        </span>
                        <span className="fam-cell">
                          <span className="fam-lbl">Last meeting</span>
                          <span className="text-truncate">{row.lastMeetingOn}</span>
                        </span>
                        <span className="fam-cell">
                          <span className="fam-lbl">Relationship score</span>
                          <span>{row.score}/100</span>
                        </span>
                        <span className="fam-cell">
                          <span className="fam-lbl">AI confidence</span>
                          <span>{row.confidence}%</span>
                        </span>
                      </div>

                      <p className="fs-12 text-muted mb-0">
                        <i className="ti ti-sparkles me-1 text-primary" />
                        {noteOf(row)}
                      </p>
                    </div>

                    <div className="fam-card-foot">
                      <ActionLink
                        className="btn btn-sm btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
                        onClick={() => showRow(row)}
                      >
                        <i className="ti ti-layout-sidebar-right-expand me-1" />
                        Open Family Workspace
                      </ActionLink>
                      <span title="Generate parent summary">
                        <ActionLink
                          className="fam-ico"
                          ariaLabel="Generate parent summary"
                          onClick={() => {
                            setOpenRow(null);
                            setDialog('parent_summary');
                          }}
                        >
                          <i className="ti ti-mail-star" />
                        </ActionLink>
                      </span>
                      <span title="Schedule meeting">
                        <ActionLink
                          className="fam-ico"
                          ariaLabel="Schedule meeting"
                          onClick={() => setDialog('schedule_meeting')}
                        >
                          <i className="ti ti-calendar-plus" />
                        </ActionLink>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {roster.length === 0 ? (
              <div className="col-12">
                <div className="fam-empty">
                  <span className="fam-empty-ic">
                    <i className="ti ti-users" />
                  </span>
                  <p className="fs-14 fw-medium text-dark mb-1">No family matches that filter</p>
                  <p className="fs-13 text-muted mb-0">
                    {FAMILIES.length} families are on this roster; the engine models{' '}
                    {FAMILIES_MODELLED}.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Section 03 — the findings */}
          <Head
            title="Why the AI Reached These Findings"
            note={`${FINDINGS.length} findings across the whole roster, each with the reasoning and the evidence that produced it.`}
          />

          <div className="row g-4 mb-5">
            {FINDINGS.map((finding) => (
              <div className="col-12 col-xl-6" key={finding.id}>
                <div className="fam-note">
                  <div className="fam-note-head">
                    <span className={`fam-note-ic ${finding.tone}`}>
                      <i className={finding.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <p className="fam-note-obs">{finding.observation}</p>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className={`fam-chip ${finding.tone}`}>{finding.label}</span>
                        <span className="fam-chip is-warm">
                          <i className="ti ti-sparkles" />
                          {finding.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="fam-lbl mb-2">AI reasoning</span>
                  <p className="fs-13 text-muted lh-base mb-3">{finding.why}</p>

                  <span className="fam-lbl mb-1">Supporting evidence</span>
                  {finding.evidence.map((item) => (
                    <div className="fam-ev" key={item.label}>
                      <span>{item.label}</span>
                      <b>{item.value}</b>
                    </div>
                  ))}

                  <div className="mt-3">
                    <span className="fam-lbl mb-1">Suggested action</span>
                    <p className="fs-13 text-muted mb-3">{finding.action}</p>
                    <ActionLink
                      className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                      onClick={() => openDialog(finding.modal)}
                    >
                      <i className="ti ti-bolt me-1" />
                      Act on this
                    </ActionLink>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 04 — the engagement centre */}
          <Head
            title="Family Engagement Center"
            note={`${ENGAGEMENT.length} dimensions the engine models across every family, each with what it would change.`}
          />

          <div className="row g-4 mb-5">
            {ENGAGEMENT.map((entry) => (
              <div className="col-xl-4 col-md-6" key={entry.id}>
                <div className="fam-eng">
                  <div className="fam-eng-top">
                    <span className="fam-eng-ic">
                      <i className={entry.icon} />
                    </span>
                    <p className="fam-eng-title">{entry.title}</p>
                    <span className={`fam-chip ${priorityToneOf(entry.priority)} ms-auto`}>
                      {entry.priority} priority
                    </span>
                  </div>
                  <div className="fam-eng-body">
                    <span className="fam-lbl mb-1">AI finding</span>
                    <p className="fs-13 text-muted mb-3">{entry.finding}</p>
                    <span className="fam-lbl mb-1">Suggested improvement</span>
                    <p className="fs-13 text-muted mb-3">{entry.suggestion}</p>
                    <span className="fam-lbl mb-1">Expected outcome</span>
                    <p className="fs-13 fw-medium text-dark mb-0">{entry.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 05 — the recommendations */}
          <Head
            title="AI Recommendation Center"
            note="Ranked by families reached against the staff hours it asks for. Nothing is sent until someone puts their name to it."
          />

          <div className="row g-4 mb-5">
            {RECOMMENDATIONS.map((entry, index) => {
              const priority = recPriorityOf(index + 1);
              return (
                <div className="col-12 col-xl-6" key={entry.id}>
                  <div className="fam-rec">
                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                      <span className={`fam-chip ${priority.tone}`}>{priority.band}</span>
                      <span className="fam-chip is-warm">
                        <i className="ti ti-sparkles" />
                        {entry.confidence}%
                      </span>
                    </div>
                    <div className="fam-rec-body">
                      <p className="fam-rec-title">{entry.title}</p>
                      <p className="fs-13 text-muted mb-0">{entry.note}</p>
                    </div>
                    <div className="fam-rec-grid">
                      <span className="fam-cell">
                        <span className="fam-lbl">Reaches</span>
                        <span>
                          {entry.reach} {entry.reach === 1 ? 'family' : 'families'}
                        </span>
                      </span>
                      <span className="fam-cell">
                        <span className="fam-lbl">Impact</span>
                        <span className="text-truncate">{entry.impact}</span>
                      </span>
                      <span className="fam-cell">
                        <span className="fam-lbl">Timeline</span>
                        <span className="text-truncate">{entry.timeline}</span>
                      </span>
                    </div>
                    <ActionLink
                      className="btn btn-sm btn-primary d-inline-flex align-items-center"
                      onClick={() => openDialog(entry.modal)}
                    >
                      <i className="ti ti-bolt me-1" />
                      {entry.cta}
                    </ActionLink>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 06 — the student's story */}
          <Head
            title="Student Progress Story"
            note={`What the record says about ${FEATURED.student}, written for the family rather than for the file.`}
          />

          <div className="row g-4 mb-5">
            {STORY.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.id}>
                <div className="fam-story">
                  <p className="fam-story-title">
                    <i className={`${entry.icon} me-2`} />
                    {entry.title}
                  </p>
                  <p className="fam-story-txt">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section 07 — the copilot */}
          <Head
            title="Parent Communication Copilot"
            note={`${COPILOT.length} things the copilot can compose from the family record. Every one arrives as a draft addressed to a named recipient.`}
          />

          <div className="row g-3 mb-5">
            {COPILOT.map((entry) => (
              <div className="col-xl-4 col-md-6" key={entry.title}>
                <ActionLink className="fam-compose" onClick={() => openDialog(entry.modal)}>
                  <span className="fam-compose-ic">
                    <i className={entry.icon} />
                  </span>
                  <span className="flex-fill overflow-hidden">
                    <span className="fam-compose-title d-block">{entry.title}</span>
                    <span className="d-block fs-12 text-muted">{entry.note}</span>
                  </span>
                  <span className="fam-send">
                    <span className="fam-to">To</span> {entry.to}
                  </span>
                </ActionLink>
              </div>
            ))}
          </div>

          {/* Section 08 — the partnership timeline */}
          <Head
            title="Family Engagement Timeline"
            note={`Three years of the school's relationship with the ${FEATURED.guardian.split(' ').slice(-1)[0]} family, from admission to this month.`}
          />

          <div className="card mb-5">
            <div className="card-body">
              {TIMELINE.map((turn) => (
                <div className="fam-turn" key={turn.id}>
                  <span className="fam-turn-lbl">{turn.on}</span>
                  <div className="flex-fill overflow-hidden">
                    <p className="fs-14 fw-medium text-dark mb-1">{turn.title}</p>
                    <p className="fs-13 text-muted mb-0">{turn.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 09 — what families can join */}
          <Head
            title="Family Opportunity Center"
            note={`${OPPORTUNITIES.length} ways families can take part over the next ${CALENDAR_WEEKS} weeks.`}
          />

          <div className="row g-4 mb-5">
            {OPPORTUNITIES.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.id}>
                <div className="fam-mark">
                  <span className="fam-date">{entry.on}</span>
                  <div className="fam-mark-face">
                    <p className="fam-mark-title">{entry.kind}</p>
                    <p className="fs-13 fw-medium text-dark mb-1">{entry.title}</p>
                    <p className="fs-12 text-muted mb-0">{entry.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 10 — the conclusions */}
          <Head
            title="AI Insight Center"
            note={`${INSIGHTS.length} conclusions drawn across all ${FAMILIES_MODELLED} families, written as intelligence rather than as a report.`}
          />

          <div className="row g-4 mb-4">
            {INSIGHTS.map((entry) => (
              <div className="col-xl-4 col-md-6" key={entry.id}>
                <div className="fam-ins">
                  <span className="fam-ins-ic">
                    <i className={entry.icon} />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="fam-ins-title">{entry.title}</p>
                    <p className="fs-13 text-muted mb-0">{entry.text}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-xl-4 col-md-6">
              <div className="fam-ins">
                <span className="fam-ins-ic">
                  <i className="ti ti-list" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <p className="fam-ins-title">The whole roster</p>
                  <p className="fs-13 text-muted mb-3">
                    {FAMILIES.length} families are shown here. The engine models{' '}
                    {FAMILIES_MODELLED}.
                  </p>
                  <ActionLink
                    className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('all_families')}
                  >
                    <i className="ti ti-users me-1" />
                    All families
                  </ActionLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FamilyWorkspace
        open={openRow !== null}
        onClose={() => setOpenRow(null)}
        row={openRow}
        onOpenDialog={openDialog}
      />

      <FamilyModals
        active={dialog}
        onClose={() => setDialog(null)}
        row={openRow ?? FEATURED}
        onToast={pushToast}
        onOpenRow={showRow}
        onOpenDialog={setDialog}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default AiParentInsights;
