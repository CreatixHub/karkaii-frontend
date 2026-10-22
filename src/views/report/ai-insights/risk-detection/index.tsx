import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import CaseWorkspace from './modals/CaseWorkspace';
import RiskModals from './modals/RiskModals';
import type { RiskModalId } from './modals/RiskModals';
import type { RiskBand, RiskCase } from './data/risk.data';
import {
  bandOf,
  countByBand,
  CRITICAL_TOTAL,
  explainedOf,
  FLAGGED_TOTAL,
  IN_CARE_TOTAL,
  inProgressActionsOf,
  LAST_RUN,
  liveScoreOf,
  MODEL_CONFIDENCE,
  MONITORED,
  NEW_CRITICAL,
  NEXT_RUN,
  openRecommendationsOf,
  RECOVERED_TOTAL,
  riskCases as seededCases,
  riskFamilyOf,
  RISK_FILTERS,
  RUN_DURATION,
  searchIndexOf,
  SORT_OPTIONS,
  STAGES,
} from './data/risk.data';
import { MODEL_VERSION } from '../data/registers';

const routes = all_routes;

/**
 * The severity modifier the `aix-*` library expects on a chip or an accent.
 *
 * The library defines critical, high and medium only, so a low-band case takes
 * the medium treatment rather than a class that would not resolve.
 */
const severityClass: Record<RiskBand, string> = {
  Critical: 'is-critical',
  High: 'is-high',
  Medium: 'is-medium',
  Low: 'is-medium',
};

/** The icon each workflow stage carries in the template. */
const stageIcons = ['ti ti-search', 'ti ti-bulb', 'ti ti-checklist', 'ti ti-heart-handshake', 'ti ti-chart-line'];

const AiRiskDetection = () => {
  const [rows, setRows] = useState<RiskCase[]>(seededCases);
  const [band, setBand] = useState<'All' | RiskBand>('All');
  const [risk, setRisk] = useState('All primary risks');
  const [owner, setOwner] = useState('All owners');
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [search, setSearch] = useState('');
  const [activeModal, setActiveModal] = useState<RiskModalId | null>(null);
  const [modalRow, setModalRow] = useState<RiskCase | null>(null);
  const [workspaceRow, setWorkspaceRow] = useState<RiskCase | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: RiskCase | null, modal: RiskModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const openCase = useCallback((row: RiskCase) => {
    setModalRow(row);
    setWorkspaceRow(row);
  }, []);

  /* --------------------------------- The queue ------------------------------ */

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = rows.filter((row) => {
      if (row.status === 'Closed') return false;
      if (term && !searchIndexOf(row).includes(term)) return false;
      if (band !== 'All' && bandOf(row) !== band) return false;
      if (risk !== 'All primary risks' && riskFamilyOf(row) !== risk) return false;
      if (owner === 'Overdue review' && row.daysOpen < 20) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case 'Last updated':
          return a.updatedNote.localeCompare(b.updatedNote);
        case 'AI confidence':
          return b.confidence - a.confidence;
        case 'Student name':
          return a.student.localeCompare(b.student);
        default:
          return b.score - a.score;
      }
    });
  }, [rows, search, band, risk, owner, sort]);

  const closedCount = rows.filter((row) => row.status === 'Closed').length;

  /**
   * What each stage of the workflow holds.
   *
   * Detect keeps the register's flagged total — the queue ships six of the 128.
   * The other four count what the cases have actually reached.
   */
  const stageCounts = useMemo(
    () => [
      FLAGGED_TOTAL,
      explainedOf(rows),
      openRecommendationsOf(rows),
      inProgressActionsOf(rows),
      closedCount + RECOVERED_TOTAL,
    ],
    [rows, closedCount],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const decide = useCallback(
    (caseId: string, recommendationId: string, decision: 'Applied' | 'Dismissed') => {
      const stamp = (row: RiskCase) => ({
        ...row,
        recommendations: row.recommendations.map((item) =>
          item.id === recommendationId ? { ...item, decision } : item,
        ),
        decisions: [
          {
            title: `${row.recommendations.find((r) => r.id === recommendationId)?.title ?? 'Recommendation'} ${decision.toLowerCase()}`,
            date: '01 Aug 2026',
            by: 'Leela Nambiar',
            note:
              decision === 'Applied'
                ? 'Accepted the engine’s recommendation.'
                : 'Dismissed with a reason recorded in the audit trail.',
          },
          ...row.decisions,
        ],
      });
      setRows((current) => current.map((row) => (row.id === caseId ? stamp(row) : row)));
      setWorkspaceRow((current) => (current && current.id === caseId ? stamp(current) : current));
      push(`Recommendation ${decision.toLowerCase()}`);
    },
    [push],
  );

  const closeCase = useCallback((id: string) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, status: 'Closed' as const } : row)));
    setWorkspaceRow(null);
  }, []);

  const addNote = useCallback((id: string, title: string) => {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? { ...row, audit: [{ title, date: '01 Aug 2026', by: 'Leela Nambiar' }, ...row.audit] }
          : row,
      ),
    );
  }, []);

  const resetFilters = () => {
    setSearch('');
    setBand('All');
    setRisk('All primary risks');
    setOwner('All owners');
    setSort(SORT_OPTIONS[0]);
  };

  /* ---------------------------------- Render -------------------------------- */

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Risk Detection
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
                    Risk Detection
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <ActionLink
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal(null, 'weekly_review')}
                >
                  <i className="ti ti-clipboard-check me-2" />
                  Weekly Review
                </ActionLink>
              </div>
              <div className="mb-2">
                <ActionLink
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal(null, 'view_all_cases')}
                >
                  <i className="ti ti-list me-2" />
                  All Open Cases
                </ActionLink>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* ------------------------------- The hero ------------------------------ */}
          <div className="aix-hero mb-4">
            <span className="aix-orb aix-orb-1" />
            <span className="aix-orb aix-orb-2" />
            <span className="aix-orb aix-orb-3" />

            <div className="aix-hero-body">
              <div className="row g-4 align-items-center">
                <div className="col-12 col-xl-7">
                  <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                    <span className="aix-status text-success">
                      <span className="aix-dot aix-dot-live" />
                      AI Risk Intelligence Engine · Live
                    </span>
                    <span className="aix-badge is-ai">
                      <i className="ti ti-sparkles" />
                      Model {MODEL_VERSION}
                    </span>
                  </div>

                  <h1 className="aix-hero-title">
                    {NEW_CRITICAL} students crossed into critical overnight
                  </h1>
                  <p className="fs-14 text-muted lh-base mb-0">
                    Attendance, academics, behaviour, finance and wellbeing, read for every student and
                    explained. Nothing acts on its own — every recommendation waits for your decision.
                  </p>

                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <ActionLink
                      className="btn btn-primary d-inline-flex align-items-center"
                      onClick={() => openModal(null, 'run_analysis')}
                    >
                      <i className="ti ti-sparkles me-2" />
                      Run AI Analysis
                    </ActionLink>
                    <ActionLink
                      className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                      onClick={() => (visible[0] ? openCase(visible[0]) : undefined)}
                    >
                      <i className="ti ti-bulb me-2" />
                      Explain AI Decisions
                    </ActionLink>
                    <ActionLink
                      className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                      onClick={() => openModal(null, 'export_summary')}
                    >
                      <i className="ti ti-file-export me-2" />
                      Export AI Summary
                    </ActionLink>
                  </div>

                  <div className="aix-hero-rail">
                    {[
                      { label: 'AI Confidence', value: `${MODEL_CONFIDENCE}`, unit: '%' },
                      { label: 'Being Monitored', value: MONITORED.toLocaleString(), unit: 'students' },
                      { label: 'Critical Cases', value: `${CRITICAL_TOTAL}`, unit: `${NEW_CRITICAL} new` },
                      { label: 'Last Analysis', value: LAST_RUN, unit: RUN_DURATION },
                    ].map((stat) => (
                      <div className="aix-hero-stat" key={stat.label}>
                        <span className="aix-label">{stat.label}</span>
                        <p className="aix-hero-val">
                          {stat.value}
                          <small>{stat.unit}</small>
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="fs-12 text-muted mb-0 mt-2">
                    <i className="ti ti-clock me-1" />
                    Next scheduled analysis · {NEXT_RUN} · runs nightly
                  </p>
                </div>

                <div className="col-12 col-xl-5">
                  <div className="aix-hero-art">
                    <span className="aix-hero-art-ring r3" />
                    <span className="aix-hero-art-ring r2" />
                    <span className="aix-hero-art-ring r1" />
                    <span className="aix-hero-art-core">
                      <i className="ti ti-radar-2" />
                    </span>
                    <span className="aix-hero-chip c1">
                      <i className="ti ti-alert-triangle text-danger" />
                      {CRITICAL_TOTAL} critical
                    </span>
                    <span className="aix-hero-chip c2">
                      <i className="ti ti-heart-handshake text-primary" />
                      {IN_CARE_TOTAL} in care
                    </span>
                    <span className="aix-hero-chip c3">
                      <i className="ti ti-shield-check text-success" />
                      {RECOVERED_TOTAL + closedCount} recovered
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="aix-wf">
              <span className="aix-label aix-wf-title">
                Case workflow — stages 02 to 05 open inside the case workspace
              </span>
              <div className="aix-wf-rail">
                {STAGES.map((stage, index) => (
                  <ActionLink
                    className="aix-wf-step"
                    key={stage.step}
                    onClick={() => (index === 0 ? undefined : visible[0] ? openCase(visible[0]) : undefined)}
                  >
                    <span className="aix-wf-ic">
                      <i className={stageIcons[index]} />
                    </span>
                    <span className="aix-wf-txt">
                      <span className="aix-wf-step-n">Stage {stage.step}</span>
                      <span className="aix-wf-lbl">{stage.name}</span>
                      <span className="aix-wf-sub">
                        {stageCounts[index]} {stage.note}
                      </span>
                    </span>
                  </ActionLink>
                ))}
              </div>
            </div>
          </div>

          {/* --------------------------- Stage 01 · the queue ---------------------- */}
          <div className="aix-sec" id="stage-detect">
            <div className="d-flex align-items-center gap-3">
              <span className="aix-sec-ic">
                <i className="ti ti-inbox" />
              </span>
              <div>
                <span className="aix-eyebrow">Stage 01 · Detect</span>
                <h2 className="mb-1 fs-18 fw-semibold">AI Case Queue</h2>
                <p className="fs-13 text-muted mb-0">
                  Every flagged student is a case. Open one to work through the full AI workflow.
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-2">
              <span className="aix-sev is-critical">{countByBand(visible, 'Critical')} critical</span>
              <span className="aix-sev is-high">{countByBand(visible, 'High')} high</span>
              <span className="aix-sev is-medium">{countByBand(visible, 'Medium')} medium</span>
              <ActionLink
                className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => openModal(visible[0] ?? null, 'compare_students')}
              >
                <i className="ti ti-arrows-shuffle me-1" />
                Compare
              </ActionLink>
            </div>
          </div>

          {/* queue filters */}
          <div className="aix-block mb-4">
            <div className="aix-block-body p-3">
              <div className="row g-2 align-items-center">
                <div className="col-xl-4 col-md-6">
                  <div className="input-icon-start position-relative">
                    <span className="icon-addon">
                      <i className="ti ti-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search by student, class or case ID"
                      aria-label="Search by student, class or case ID"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </div>
                </div>
                <div className="col-xl-2 col-md-6">
                  <select
                    className="form-select lh-base"
                    aria-label="All risk levels"
                    value={band}
                    onChange={(event) => setBand(event.target.value as 'All' | RiskBand)}
                  >
                    <option value="All">All risk levels</option>
                    <option value="Critical">Critical · {countByBand(rows, 'Critical')}</option>
                    <option value="High">High · {countByBand(rows, 'High')}</option>
                    <option value="Medium">Medium · {countByBand(rows, 'Medium')}</option>
                  </select>
                </div>
                <div className="col-xl-2 col-md-6">
                  <select
                    className="form-select lh-base"
                    aria-label="All primary risks"
                    value={risk}
                    onChange={(event) => setRisk(event.target.value)}
                  >
                    <option>All primary risks</option>
                    {RISK_FILTERS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="col-xl-2 col-md-6">
                  <select
                    className="form-select lh-base"
                    aria-label="All owners"
                    value={owner}
                    onChange={(event) => setOwner(event.target.value)}
                  >
                    <option>All owners</option>
                    <option>Assigned to me</option>
                    <option value="Overdue review">
                      Overdue review · {rows.filter((row) => row.daysOpen >= 20).length}
                    </option>
                  </select>
                </div>
                <div className="col-xl-2 col-md-6">
                  <select
                    className="form-select lh-base"
                    aria-label="Sort"
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option}>Sort: {option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------- The cases ----------------------------- */}
          {visible.length === 0 ? (
            <div className="aix-empty mb-4">
              <span className="aix-empty-art">
                <i className="ti ti-shield-check" />
              </span>
              <p className="aix-empty-title">No cases match this view</p>
              <p className="fs-13 text-muted mb-3">
                Clear a filter, or widen the risk level to see the rest of the queue.
              </p>
              <button type="button" className="btn btn-sm btn-outline-light bg-white" onClick={resetFilters}>
                <i className="ti ti-restore me-1" />
                Reset filters
              </button>
            </div>
          ) : (
            visible.map((row) => {
              const level = bandOf(row);
              const severity = severityClass[level];
              return (
                <div className={`aix-profile aix-explain-accent ${severity} mb-4`} key={row.id}>
                  <div className="aix-profile-media">
                    <div className="d-flex align-items-center gap-3">
                      <span className="avatar avatar-xl avatar-rounded flex-shrink-0">
                        <ImageWithBasePath src={row.image} alt={row.student} />
                      </span>
                      <div className="overflow-hidden">
                        <p className="aix-profile-name text-truncate">{row.student}</p>
                        <p className="fs-12 text-muted mb-0">
                          {row.className} · {row.id}
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-end justify-content-between gap-2">
                      <div>
                        <span className="aix-label">Risk Score</span>
                        <span className="aix-score">
                          {liveScoreOf(row)}
                          <small>/100</small>
                        </span>
                      </div>
                      <span className={`aix-sev ${severity}`}>{level}</span>
                    </div>

                    <div>
                      <span className="aix-label mb-1">AI Confidence</span>
                      <span className="aix-conf">
                        <span className={`aix-conf-track aix-p-${row.confidence}`}>
                          <span className="aix-conf-fill" />
                        </span>
                        <span className="aix-conf-val">{row.confidence}%</span>
                      </span>
                    </div>
                  </div>

                  <div className="aix-profile-main">
                    <div className="row g-4">
                      <div className="col-md-6">
                        <span className="aix-label mb-1">Primary Risk</span>
                        <p className="fs-15 fw-medium text-dark mb-3">{row.primaryRisk}</p>

                        <span className="aix-label mb-2">
                          Risk Timeline · {row.trajectory.length} weeks
                        </span>
                        <span className="aix-mini mb-2">
                          {row.trajectory.map((point, index) => (
                            <i
                              className={`${severity} aix-v-${Math.max(10, Math.round(point / 10) * 10)}`}
                              key={`${row.id}-w${index}`}
                            />
                          ))}
                        </span>
                        <p className="fs-12 text-muted mb-0">
                          Wk 20 → Wk 27 · {row.updatedNote}
                        </p>
                      </div>

                      <div className="col-md-6">
                        <span className="aix-label mb-1">Predicted Outcome</span>
                        <span className={`aix-badge ${severity} mb-3`}>
                          <i className="ti ti-target-arrow" />
                          {row.predictedOutcome}
                        </span>

                        <span className="aix-label mb-1">Suggested Intervention</span>
                        <p className="fs-13 text-muted mb-0">{row.suggestedIntervention}</p>
                      </div>
                    </div>

                    <div className="row g-3 mt-1">
                      {[
                        { label: 'Teacher', name: row.teacher, image: row.teacherImage },
                        { label: 'Counselor', name: row.counselor, image: row.counselorImage },
                      ].map((person) => (
                        <div className="col-sm-6" key={person.label}>
                          <div className="aix-fact">
                            <span className="fs-12 text-muted">{person.label}</span>
                            <span className="aix-person">
                              <span className="avatar avatar-xs avatar-rounded flex-shrink-0">
                                <ImageWithBasePath src={person.image} alt={person.name} />
                              </span>
                              <span className="fs-13 text-dark text-truncate">{person.name}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="aix-caseline">
                      {[
                        { icon: 'ti ti-clock-hour-4', label: 'Case open', value: `${row.daysOpen} days` },
                        { icon: 'ti ti-route', label: 'Current stage', value: row.stage },
                        { icon: 'ti ti-calendar-event', label: 'Next review', value: row.nextReview },
                      ].map((item) => (
                        <div className="aix-caseline-item" key={item.label}>
                          <i className={item.icon} />
                          <span className="aix-caseline-txt">
                            <span>{item.label}</span>
                            <span>{item.value}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="aix-profile-side">
                    <ActionLink
                      className="btn btn-primary btn-sm w-100 d-inline-flex align-items-center justify-content-center"
                      onClick={() => openCase(row)}
                    >
                      <i className="ti ti-brain me-1" />
                      View Intelligence
                    </ActionLink>
                    <ActionLink
                      className="btn btn-outline-light bg-white btn-sm w-100 d-inline-flex align-items-center justify-content-center"
                      onClick={() => openModal(row, 'create_intervention')}
                    >
                      <i className="ti ti-heart-handshake me-1" />
                      Start Intervention
                    </ActionLink>
                    <ActionLink
                      className="btn btn-outline-light bg-white btn-sm w-100 d-inline-flex align-items-center justify-content-center"
                      onClick={() => openModal(row, 'generate_parent_summary')}
                    >
                      <i className="ti ti-mail me-1" />
                      Parent Summary
                    </ActionLink>
                    <ActionLink
                      className="btn btn-outline-light bg-white btn-sm w-100 d-inline-flex align-items-center justify-content-center"
                      onClick={() => openModal(row, 'compare_students')}
                    >
                      <i className="ti ti-arrows-shuffle me-1" />
                      Compare Similar
                    </ActionLink>

                    <span className="aix-label mt-2">Quick actions</span>
                    <div className="aix-quick-grid">
                      {[
                        { id: 'schedule_meeting' as const, icon: 'ti ti-calendar-plus', title: 'Schedule parent meeting' },
                        { id: 'assign_teacher' as const, icon: 'ti ti-user-check', title: 'Assign teacher' },
                        { id: 'assign_counselor' as const, icon: 'ti ti-user-heart', title: 'Assign counselor' },
                        { id: 'generate_teacher_notes' as const, icon: 'ti ti-notes', title: 'Generate teacher notes' },
                        { id: 'add_case_note' as const, icon: 'ti ti-message-plus', title: 'Add case note' },
                        { id: 'export_summary' as const, icon: 'ti ti-file-export', title: 'Export case summary' },
                      ].map((action) => (
                        <ActionLink
                          className="aix-quick-btn"
                          key={action.id}
                          title={action.title}
                          ariaLabel={action.title}
                          onClick={() => openModal(row, action.id)}
                        >
                          <i className={action.icon} />
                        </ActionLink>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <span className="fs-12 text-muted">
              Showing {visible.length} of {FLAGGED_TOTAL} flagged cases ·{' '}
              {countByBand(rows, 'Critical')} critical in this queue
            </span>
            <ActionLink
              className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
              onClick={() => openModal(null, 'view_all_cases')}
            >
              <i className="ti ti-list me-1" />
              View all cases
            </ActionLink>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      <CaseWorkspace
        open={workspaceRow !== null}
        onClose={() => setWorkspaceRow(null)}
        row={workspaceRow}
        onDecide={decide}
        onOpenDialog={(id) => openModal(workspaceRow, id as RiskModalId)}
      />

      <RiskModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        row={modalRow}
        rows={rows}
        onToast={push}
        onCloseCase={closeCase}
        onAddNote={addNote}
        onOpenCase={openCase}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="aiRiskToasts" />
    </>
  );
};

export default AiRiskDetection;
