import { Fragment, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import { useToasts } from '@hooks/useToasts';
import AcademicModals from './modals/AcademicModals';
import type { AcademicModalId } from './modals/AcademicModals';
import type { SectionId, SettingCard as CardShape, SettingRow, Policy } from './data/academic.data';
import {
  ACTIVITY_ROWS,
  ASSESSMENT_CARDS,
  ATTENDANCE_CARDS,
  AUDIT_ENTRIES,
  AUDIT_TOTAL,
  bandPointOf,
  bandRangeOf,
  bandWidthOf,
  BANDS,
  CALENDAR_EVENTS,
  CALENDAR_MONTHS,
  cardFootOf,
  certificateFootOf,
  CERTIFICATE_CARDS,
  CERTIFICATE_TYPES,
  CURRICULUM_CARDS,
  DECISIONS,
  EXAM_CARDS,
  EXAM_CYCLES,
  GRADE_CARDS,
  GRADE_TREES,
  GRADING_CARDS,
  GENERAL_CARDS,
  HERO_FACTS,
  HOLIDAY_ROWS,
  HOMEWORK_RULES,
  isOverCapacity,
  NAV_GROUPS,
  PREFERENCE_GROUPS,
  PREVIEW_ATTENDANCE,
  PREVIEW_MARKS,
  PREVIEW_MAX,
  PREVIEW_PERCENT,
  PREVIEW_PERCENT_ATTENDANCE,
  PREVIEW_TOTAL,
  PROMOTION_RULES,
  RECOMMENDATIONS,
  REPORT_CARDS,
  RESTORE_NOTE,
  SECTIONS_LIST,
  sectionNumberOf,
  STAGES,
  SUBJECT_GROUPS,
  subjectNoteOf,
  subjectsOf,
  TERM_CARDS,
  TERMS,
  TIMETABLE_CARDS,
  TOTAL_HOLIDAYS,
  treeNoteOf,
  UNPUBLISHED_CHANGES,
  WORKING_DAYS,
  YEAR_SHORT,
  YEAR_TAIL,
  YEARS,
  yearBadge,
  YEAR_CARDS,
} from './data/academic.data';

/* ------------------------------ Small parts ------------------------------ */

const Row = ({ row, id }: { row: SettingRow; id: string }) => (
  <div className="acd-row">
    <span className="acd-row-key">
      {row.key}
      <small>{row.note}</small>
    </span>
    <span className="acd-row-fill" />
    <div className="acd-row-val">
      {row.kind === 'select' ? (
        <select className="acd-select" aria-label={row.key} defaultValue={row.options?.[0]}>
          {(row.options ?? []).map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : null}
      {row.kind === 'input' ? (
        <input type="text" className="acd-input" defaultValue={row.value} aria-label={row.key} />
      ) : null}
      {row.kind === 'text' ? <span className="acd-mono">{row.value}</span> : null}
      {row.kind === 'switch' ? (
        <div className="form-check form-switch mb-0">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={id}
            defaultChecked={row.on}
          />
          <label className="form-check-label visually-hidden" htmlFor={id}>
            Enable
          </label>
        </div>
      ) : null}
    </div>
  </div>
);

const Card = ({
  card,
  onOpen,
  children,
}: {
  card: CardShape;
  onOpen: (title: string) => void;
  children?: React.ReactNode;
}) => (
  <div className="acd-card">
    <div className="acd-card-head">
      <span className={`acd-card-ic${card.tone ? ` ${card.tone}` : ''}`}>
        <i className={card.icon} />
      </span>
      <div className="flex-fill overflow-hidden">
        <p className="acd-card-title">{card.title}</p>
        <p>{card.note}</p>
      </div>
      {card.badge ? <span className={`acd-badge ${card.badge.tone}`}>{card.badge.label}</span> : null}
    </div>
    <div className="acd-card-body">
      {children}
      {(card.rows ?? []).map((row, index) => (
        <Row key={row.key} row={row} id={`acd-${card.id}-${index}`} />
      ))}
    </div>
    <div className="acd-card-foot">
      <span className="fs-12 text-muted">{cardFootOf(card)}</span>
      <button
        type="button"
        className="btn btn-sm btn-outline-light bg-white"
        aria-label={`Open academic configuration workspace for ${card.title}`}
        onClick={() => onOpen(card.title)}
      >
        {card.action ?? 'Open'}
      </button>
    </div>
  </div>
);

const Cards = ({ cards, onOpen }: { cards: CardShape[]; onOpen: (title: string) => void }) => (
  <div className="row g-4">
    {cards.map((card) => (
      <div className="col-12" key={card.id}>
        <Card card={card} onOpen={onOpen} />
      </div>
    ))}
  </div>
);

const Policies = ({ rules, onOpen }: { rules: Policy[]; onOpen: (title: string) => void }) => (
  <>
    {rules.map((rule, index) => {
      const sentence = rule.parts.map((part) => part.text).join('');
      return (
        <div className={`acd-policy${rule.tone ? ` ${rule.tone}` : ''}`} key={sentence}>
          <span className="acd-policy-ic">
            <i className={rule.icon} />
          </span>
          <div className="acd-policy-body">
            <p className="acd-policy-rule">
              {rule.parts.map((part) =>
                part.strong ? <b key={part.text}>{part.text}</b> : <Fragment key={part.text}>{part.text}</Fragment>,
              )}
            </p>
            <p className="acd-policy-txt">{rule.note}</p>
          </div>
          <div className="acd-policy-act">
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id={`acd-policy-${index}`}
                defaultChecked={rule.on}
              />
              <label className="form-check-label visually-hidden" htmlFor={`acd-policy-${index}`}>
                Enable
              </label>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-light bg-white"
              onClick={() => onOpen(sentence)}
            >
              Open
            </button>
          </div>
        </div>
      );
    })}
  </>
);

const Events = ({ events, onOpen }: { events: typeof CALENDAR_EVENTS; onOpen: (title: string) => void }) => (
  <>
    {events.map((event) => (
      <div className="acd-event" key={`${event.day}-${event.month}-${event.title}`}>
        <span className="acd-event-date">
          <b>{event.day}</b>
          <span>{event.month}</span>
        </span>
        <div className="acd-event-body">
          <p className="fs-14 fw-medium mb-0">{event.title}</p>
          <p className="fs-12 text-muted mb-0">{event.note}</p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline-light bg-white"
          onClick={() => onOpen(event.title)}
        >
          Open
        </button>
      </div>
    ))}
  </>
);

/* -------------------------------- The page ------------------------------- */

const AcademicSettings = () => {
  const { toasts, push, dismiss } = useToasts();

  const [section, setSection] = useState<SectionId>('general');
  const [modal, setModal] = useState<AcademicModalId | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTitle, setPanelTitle] = useState<string | null>(null);

  const openWorkspace = (title: string) => {
    setPanelTitle(title);
    setPanelOpen(true);
  };

  const current = SECTIONS_LIST.find((entry) => entry.id === section) ?? SECTIONS_LIST[0];

  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          {/* ------------------------------ Hero ------------------------------ */}
          <div className="acd-hero">
            <div className="acd-hero-top">
              <span className="acd-yearmark">
                <b>
                  {YEAR_SHORT}
                  <br />
                  {YEAR_TAIL}
                </b>
                <span>Academic year</span>
              </span>
              <div className="flex-fill">
                <h1 className="acd-hero-title">Academic Settings</h1>
                <p className="acd-hero-sub">
                  The shape of the school year: its terms, grades and sections, what is taught in
                  each, how it is marked, and the rules that decide who moves up. Everything on this
                  page is scoped to the year above.
                </p>
              </div>
              <span className="acd-badge is-draft">
                <i className="ti ti-pencil" />
                {UNPUBLISHED_CHANGES} unpublished changes
              </span>
            </div>
            <div className="acd-hero-facts">
              {HERO_FACTS.map((fact) => (
                <div className="acd-hero-fact" key={fact.label}>
                  <span>{fact.label}</span>
                  <strong>
                    {fact.value}
                    {fact.badge ? <span className="acd-badge is-live">{fact.badge}</span> : null}
                  </strong>
                </div>
              ))}
            </div>
            <div className="acd-hero-actions">
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => setModal('year')}
              >
                <i className="ti ti-device-floppy me-1" />
                Save changes
              </button>
              <button
                type="button"
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => setModal('calendar')}
              >
                <i className="ti ti-rocket me-1" />
                Publish academic settings
              </button>
              <button
                type="button"
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => setModal('export')}
              >
                <i className="ti ti-download me-1" />
                Export configuration
              </button>
              <button
                type="button"
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => openWorkspace('Academic policies')}
              >
                <i className="ti ti-book-2 me-1" />
                View academic policies
              </button>
            </div>
          </div>

          <div className="row g-4">
            {/* --------------------------- The rail -------------------------- */}
            <div className="col-xxl-3 col-lg-4">
              <div className="acd-nav nav flex-column" role="tablist" aria-label="Academic settings sections">
                {NAV_GROUPS.map((group) => (
                  <Fragment key={group.group}>
                    <span className="acd-nav-hdr">{group.group}</span>
                    {group.sections.map((entry) => (
                      <button
                        key={entry.id}
                        className={`acd-nav-link${section === entry.id ? ' active' : ''}`}
                        type="button"
                        role="tab"
                        aria-selected={section === entry.id}
                        onClick={() => setSection(entry.id)}
                      >
                        <span className="acd-nav-txt">{entry.label}</span>
                        {entry.tag ? <span className="acd-nav-n">{entry.tag}</span> : null}
                      </button>
                    ))}
                  </Fragment>
                ))}
                <div className="acd-nav-foot">
                  <span className="acd-lbl">Configuration</span>
                  <p className="fs-12 text-muted mb-2">
                    Four changes are held as drafts. Nothing reaches a teacher, a student or a report
                    card until the year is published.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm w-100 d-inline-flex align-items-center justify-content-center"
                    onClick={() => setModal('restore')}
                  >
                    <i className="ti ti-rotate-2 me-1" />
                    Restore defaults
                  </button>
                </div>
              </div>
            </div>

            {/* ------------------------- The workspace ----------------------- */}
            <div className="col-xxl-9 col-lg-8">
              <div className="tab-content">
                <div className="tab-pane fade show active" role="tabpanel" tabIndex={0}>
                  <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                    <div>
                      <span className="acd-lbl">Section {sectionNumberOf(current.id)}</span>
                      <h2 className="acd-hero-title fs-20 mb-1">{current.title}</h2>
                      <p className="fs-13 text-muted mb-0">{current.sub}</p>
                    </div>
                  </div>

                  {section === 'general' ? (
                    <Cards cards={GENERAL_CARDS} onOpen={openWorkspace} />
                  ) : null}

                  {section === 'year' ? (
                    <>
                      <Cards cards={YEAR_CARDS} onOpen={openWorkspace} />
                      <span className="acd-lbl d-block mt-4 mb-2">Years on record</span>
                      {YEARS.map((entry) => (
                        <div className="acd-tree mb-2" key={entry.short}>
                          <div className="acd-tree-head">
                            <span className="acd-tree-grade">{entry.short}</span>
                            <div className="flex-fill overflow-hidden">
                              <p className="acd-tree-name">{entry.label}</p>
                              <p>{entry.note}</p>
                            </div>
                            <span className={`acd-badge ${yearBadge(entry.state)}`}>
                              {entry.state}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light bg-white ms-2"
                              onClick={() => openWorkspace(entry.label)}
                            >
                              Open
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : null}

                  {section === 'terms' ? (
                    <>
                      <p className="fs-13 text-muted">
                        Three terms rather than two semesters, which is what the board expects and
                        what the report card is laid out for. Changing this is a between-years
                        decision.
                      </p>
                      {TERMS.map((term) => (
                        <div className="acd-term" key={term.number}>
                          <div className="acd-term-top">
                            <span className="acd-term-n">{term.number}</span>
                            <div className="flex-fill overflow-hidden">
                              <p className="acd-term-name">{term.name}</p>
                              <p className="fs-12 text-muted mb-0">{term.dates}</p>
                            </div>
                          </div>
                          <div className="acd-card-body">
                            <div className="acd-row">
                              <span className="acd-row-key">Weeks</span>
                              <span className="acd-row-fill" />
                              <div className="acd-row-val">
                                <span className="acd-mono">{term.weeks}</span>
                              </div>
                            </div>
                            <div className="acd-row">
                              <span className="acd-row-key">Working days</span>
                              <span className="acd-row-fill" />
                              <div className="acd-row-val">
                                <span className="acd-mono">{term.workingDays}</span>
                              </div>
                            </div>
                            <div className="acd-row">
                              <span className="acd-row-key">Assessments</span>
                              <span className="acd-row-fill" />
                              <div className="acd-row-val">{term.assessments}</div>
                            </div>
                          </div>
                          <div className="acd-term-foot">
                            <span className="fs-12 text-muted">{term.standing}</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light bg-white"
                              onClick={() => openWorkspace(term.name)}
                            >
                              Open
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="mt-4">
                        <Cards cards={TERM_CARDS} onOpen={openWorkspace} />
                      </div>
                    </>
                  ) : null}

                  {section === 'grades' ? (
                    <>
                      <Cards cards={GRADE_CARDS} onOpen={openWorkspace} />
                      <span className="acd-lbl d-block mt-4 mb-2">Grade levels</span>
                      <p className="fs-13 text-muted">
                        Twelve grades in four stages. Each stage carries its own assessment pattern
                        and promotion rule, which is why the stage matters more than the grade
                        number.
                      </p>
                      {STAGES.map((stage) => (
                        <div className="acd-tree mb-2" key={stage.grades}>
                          <div className="acd-tree-head">
                            <span className="acd-tree-grade">{stage.grades}</span>
                            <div className="flex-fill overflow-hidden">
                              <p className="acd-tree-name">{stage.name}</p>
                              <p>{stage.note}</p>
                            </div>
                            <span className="acd-badge is-accent">{stage.sections} sections</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light bg-white ms-2"
                              onClick={() => openWorkspace(stage.name)}
                            >
                              Open
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : null}

                  {section === 'sections' ? (
                    <>
                      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                        <p className="fs-13 text-muted mb-0">
                          Thirty-eight sections across twelve grades. The two shown in amber are
                          above the 40-student ceiling; a third section in each would bring them back
                          inside it.
                        </p>
                        <button
                          type="button"
                          className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                          onClick={() => openWorkspace('Add a section')}
                        >
                          <i className="ti ti-plus me-1" />
                          Add a section
                        </button>
                      </div>
                      {GRADE_TREES.map((tree) => (
                        <div className="acd-tree" key={tree.grade}>
                          <div className="acd-tree-head">
                            <span className="acd-tree-grade">{tree.grade}</span>
                            <div className="flex-fill overflow-hidden">
                              <p className="acd-tree-name">{tree.name}</p>
                              <p>{treeNoteOf(tree)}</p>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light bg-white"
                              onClick={() => openWorkspace(tree.name)}
                            >
                              Open
                            </button>
                          </div>
                          <div className="acd-tree-body">
                            {tree.sections.map((entry) => (
                              <span
                                className={`acd-section${isOverCapacity(entry) ? ' is-full' : ''}`}
                                key={entry.name}
                              >
                                <b>{entry.name}</b>
                                <span>{entry.students} students</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : null}

                  {section === 'subjects' ? (
                    <div className="row g-4">
                      {SUBJECT_GROUPS.map((group) => (
                        <div className="col-12" key={group.kind}>
                          <div className="acd-card">
                            <div className="acd-card-head">
                              <span className={`acd-card-ic${group.tone ? ` ${group.tone}` : ''}`}>
                                <i className={group.icon} />
                              </span>
                              <div className="flex-fill overflow-hidden">
                                <p className="acd-card-title">{group.title}</p>
                                <p>{subjectNoteOf(group.kind)}</p>
                              </div>
                            </div>
                            <div className="acd-card-body">
                              <div className="acd-subjects">
                                {subjectsOf(group.kind).map((subject) => (
                                  <span
                                    className={`acd-subject${
                                      group.kind === 'non-scholastic' ? '' : ` is-${group.kind}`
                                    }`}
                                    key={subject.name}
                                  >
                                    {subject.name}
                                    <span className="acd-subject-cr">{subject.credits}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="acd-card-foot">
                              <span className="fs-12 text-muted">
                                The number beside each subject is its credit weight
                              </span>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light bg-white"
                                onClick={() => openWorkspace(group.title)}
                              >
                                Open
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {section === 'curriculum' ? (
                    <Cards cards={CURRICULUM_CARDS} onOpen={openWorkspace} />
                  ) : null}

                  {section === 'grading' ? (
                    <>
                      <div className="acd-card mb-4">
                        <div className="acd-card-head">
                          <span className="acd-card-ic">
                            <i className="ti ti-chart-arrows-vertical" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="acd-card-title">Grading scale</p>
                            <p>
                              {BANDS.length} bands · nine-point grade scale · applied from Class VI
                              upwards
                            </p>
                          </div>
                          <span className="acd-badge is-live">Published</span>
                        </div>
                        <div className="acd-card-body">
                          <div className="acd-ladder mt-2">
                            {BANDS.map((band, index) => (
                              <div className="acd-band" key={band.letter}>
                                <span className="acd-band-letter">{band.letter}</span>
                                <span className="acd-band-range">{bandRangeOf(index)}</span>
                                <span
                                  className={`acd-band-track acd-p-${band.from} acd-q-${bandWidthOf(index)}`}
                                >
                                  <span />
                                </span>
                                <span className="acd-band-point">{bandPointOf(band)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="acd-card-foot">
                          <span className="fs-12 text-muted">
                            Grade points are used for the cumulative average on the transcript
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            onClick={() => setModal('grading')}
                          >
                            Update grading
                          </button>
                        </div>
                      </div>
                      <Cards cards={GRADING_CARDS} onOpen={openWorkspace} />
                    </>
                  ) : null}

                  {section === 'assessment' ? (
                    <Cards cards={ASSESSMENT_CARDS} onOpen={openWorkspace} />
                  ) : null}

                  {section === 'exams' ? (
                    <>
                      <div className="acd-card mb-4">
                        <div className="acd-card-head">
                          <span className="acd-card-ic">
                            <i className="ti ti-clipboard-list" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="acd-card-title">Examination types</p>
                            <p>
                              {EXAM_CYCLES.length} cycles across the year · two completed
                            </p>
                          </div>
                          <span className="acd-badge is-draft">2 in progress</span>
                        </div>
                        <div className="acd-card-body">
                          <Events events={EXAM_CYCLES} onOpen={openWorkspace} />
                        </div>
                        <div className="acd-card-foot">
                          <span className="fs-12 text-muted">
                            Only the final examination decides promotion; the rest inform it
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            onClick={() => openWorkspace('Examination types')}
                          >
                            Open
                          </button>
                        </div>
                      </div>
                      <Cards cards={EXAM_CARDS} onOpen={openWorkspace} />
                    </>
                  ) : null}

                  {section === 'promotion' ? (
                    <>
                      <p className="fs-13 text-muted">
                        {PROMOTION_RULES.length} rules, applied in this order. They are written as
                        statements rather than switches because a promotion rule is a policy the
                        school has to be able to explain to a parent.
                      </p>
                      <Policies rules={PROMOTION_RULES} onOpen={openWorkspace} />
                    </>
                  ) : null}

                  {section === 'attendance' ? (
                    <Cards cards={ATTENDANCE_CARDS} onOpen={openWorkspace} />
                  ) : null}

                  {section === 'timetable' ? (
                    <Cards cards={TIMETABLE_CARDS} onOpen={openWorkspace} />
                  ) : null}

                  {section === 'homework' ? (
                    <>
                      <p className="fs-13 text-muted">
                        {HOMEWORK_RULES.length} policies. They are unusually specific because
                        homework load was the most common complaint in the 2025 parent survey, and
                        vague guidance had not changed it.
                      </p>
                      <Policies rules={HOMEWORK_RULES} onOpen={openWorkspace} />
                    </>
                  ) : null}

                  {section === 'calendar' ? (
                    <div className="row g-4">
                      <div className="col-12">
                        <div className="acd-card">
                          <div className="acd-card-head">
                            <span className="acd-card-ic">
                              <i className="ti ti-calendar-month" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <p className="acd-card-title">The year, month by month</p>
                              <p>
                                {WORKING_DAYS} working days · {TERMS.length} terms ·{' '}
                                {EXAM_CYCLES.length} examination cycles · {TOTAL_HOLIDAYS} holidays
                              </p>
                            </div>
                            <span className="acd-badge is-live">Published 04 Mar 2026</span>
                          </div>
                          <div className="acd-card-body">
                            <div className="acd-months">
                              {CALENDAR_MONTHS.map((month) => (
                                <span
                                  className={`acd-month${month.current ? ' is-now' : ''}`}
                                  key={month.month}
                                >
                                  <b>{month.month}</b>
                                  <span>{month.label}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="acd-card-foot">
                            <span className="fs-12 text-muted">
                              The calendar is published once and amended only by the Principal
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light bg-white"
                              onClick={() => setModal('calendar')}
                            >
                              Edit calendar
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="acd-card">
                          <div className="acd-card-head">
                            <span className="acd-card-ic is-pass">
                              <i className="ti ti-calendar-event" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <p className="acd-card-title">Dated entries</p>
                              <p>{CALENDAR_EVENTS.length} fixed points in the year</p>
                            </div>
                          </div>
                          <div className="acd-card-body">
                            <Events events={CALENDAR_EVENTS} onOpen={openWorkspace} />
                          </div>
                          <div className="acd-card-foot">
                            <span className="fs-12 text-muted">
                              Optional activities and club days are held separately
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light bg-white"
                              onClick={() => openWorkspace('Dated entries')}
                            >
                              Open
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <Card
                          card={{
                            id: 'holidays',
                            title: 'Holidays',
                            note: 'What closes the school',
                            icon: 'ti ti-beach',
                            badge: { tone: 'is-accent', label: `${TOTAL_HOLIDAYS} days` },
                            rows: HOLIDAY_ROWS,
                            foot: `${TOTAL_HOLIDAYS} days · excluded from working days`,
                          }}
                          onOpen={openWorkspace}
                        />
                      </div>
                      <div className="col-12">
                        <Card
                          card={{
                            id: 'activities',
                            title: 'Activity calendar',
                            note: 'What runs alongside teaching',
                            icon: 'ti ti-confetti',
                            tone: 'is-alt',
                            badge: { tone: 'is-draft', label: 'Term 3 pending' },
                            rows: ACTIVITY_ROWS,
                            foot: 'Term 3 entries are still open',
                          }}
                          onOpen={openWorkspace}
                        />
                      </div>
                    </div>
                  ) : null}

                  {section === 'certificates' ? (
                    <>
                      <Cards cards={CERTIFICATE_CARDS} onOpen={openWorkspace} />
                      <div className="row g-4 mt-0">
                        {CERTIFICATE_TYPES.map((type) => (
                          <div className="col-xl-6 col-md-6" key={type.name}>
                            <div className="acd-card h-100">
                              <div className="acd-card-head">
                                <span className={`acd-card-ic${type.draft ? ' is-watch' : ''}`}>
                                  <i className={type.icon} />
                                </span>
                                <div className="flex-fill overflow-hidden">
                                  <p className="acd-card-title">{type.name}</p>
                                  <p>{type.note}</p>
                                </div>
                                <span
                                  className={`acd-badge ${type.draft ? 'is-draft' : 'is-live'}`}
                                >
                                  {type.draft ? 'Draft' : 'Active'}
                                </span>
                              </div>
                              <div className="acd-card-foot">
                                <span className="fs-12 text-muted">{certificateFootOf(type)}</span>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-light bg-white"
                                  onClick={() => openWorkspace(type.name)}
                                >
                                  Open
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}

                  {section === 'reportcards' ? (
                    <>
                      <Cards cards={REPORT_CARDS} onOpen={openWorkspace} />
                      <span className="acd-lbl d-block mt-4 mb-2">Preview — Term 2, Class IX</span>
                      <div className="acd-preview">
                        <div className="acd-preview-head">
                          <strong>KARKAII INTERNATIONAL SCHOOL</strong>
                          <span className="fs-12 text-muted d-block">
                            Report Card · Term 2 · 2026 – 27
                          </span>
                          <span className="fs-12 text-muted d-block">
                            Aarav Krishnan · IX-B · Roll 14
                          </span>
                        </div>
                        {PREVIEW_MARKS.map((entry) => (
                          <div className="acd-preview-line" key={entry.subject}>
                            <span>{entry.subject}</span>
                            <strong>
                              {entry.mark} · {entry.band}
                            </strong>
                          </div>
                        ))}
                        <div className="acd-preview-line">
                          <span>Total · percentage</span>
                          <strong>
                            {PREVIEW_TOTAL} / {PREVIEW_MAX} · {PREVIEW_PERCENT}%
                          </strong>
                        </div>
                        <div className="acd-preview-line">
                          <span>Cumulative grade point</span>
                          <strong>8.0</strong>
                        </div>
                        <div className="acd-preview-line">
                          <span>Attendance</span>
                          <strong>
                            {PREVIEW_ATTENDANCE.present} / {PREVIEW_ATTENDANCE.of} ·{' '}
                            {PREVIEW_PERCENT_ATTENDANCE}%
                          </strong>
                        </div>
                        <div className="acd-preview-line">
                          <span>Work experience · art · discipline</span>
                          <strong>A · B · A</strong>
                        </div>
                        <div className="acd-preview-line">
                          <span>Class teacher</span>
                          <strong>Mrs. S. Ramesh</strong>
                        </div>
                      </div>
                      <p className="fs-12 text-muted mt-2 mb-0">
                        Rank is calculated but does not appear, which is the current policy.
                        Non-scholastic areas are graded, never added to the total.
                      </p>
                    </>
                  ) : null}

                  {section === 'preferences' ? (
                    <>
                      {PREFERENCE_GROUPS.map((group) => (
                        <div className="acd-card mb-4" key={group.title}>
                          <div className="acd-card-head">
                            <span className="acd-card-ic">
                              <i className="ti ti-adjustments-alt" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <p className="acd-card-title">{group.title}</p>
                              <p>
                                {group.rows.length} {group.rows.length === 1 ? 'choice' : 'choices'}
                              </p>
                            </div>
                          </div>
                          <div className="acd-card-body">
                            {group.rows.map((row, index) => (
                              <Row
                                key={row.key}
                                row={row}
                                id={`acd-pref-${group.title.replace(/\s+/g, '-').toLowerCase()}-${index}`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="acd-check is-watch">
                        <i className="ti ti-rotate-2" />
                        <div>
                          Restore defaults
                          <span>{RESTORE_NOTE}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-light bg-white btn-sm mt-3 d-inline-flex align-items-center"
                        onClick={() => setModal('restore')}
                      >
                        <i className="ti ti-rotate-2 me-1" />
                        Restore default settings
                      </button>
                    </>
                  ) : null}

                  {section === 'audit' ? (
                    <>
                      <div className="acd-card mb-4">
                        <div className="acd-card-head">
                          <span className="acd-card-ic">
                            <i className="ti ti-file-search" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="acd-card-title">Audit history</p>
                            <p>
                              Every change to academic configuration, retained for 3 academic years
                            </p>
                          </div>
                          <span className="acd-badge is-accent">
                            {AUDIT_ENTRIES.length} of {AUDIT_TOTAL} entries
                          </span>
                        </div>
                        <div className="acd-card-body">
                          {AUDIT_ENTRIES.map((entry) => (
                            <div className="acd-audit" key={`${entry.date}-${entry.time}`}>
                              <span className="acd-audit-when">
                                <b>{entry.date}</b>
                                <span>{entry.time}</span>
                              </span>
                              <div className="acd-audit-what">
                                <p className="fs-13 fw-medium mb-0">{entry.what}</p>
                                <p className="fs-12 text-muted mb-0">{entry.who}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="acd-card-foot">
                          <span className="fs-12 text-muted">
                            Entries cannot be edited or removed
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            onClick={() => setModal('export')}
                          >
                            Export history
                          </button>
                        </div>
                      </div>

                      <span className="acd-lbl d-block mb-1">How this configuration came to be</span>
                      <p className="fs-13 text-muted">
                        {DECISIONS.length} decisions, in the order they were taken.
                      </p>
                      <div className="acd-track">
                        {DECISIONS.map((decision, index) => (
                          <div className="acd-track-card" key={decision.title}>
                            <span className="acd-track-n">{index + 1}</span>
                            <div className="acd-track-step">
                              <p className="fs-14 fw-medium mb-0">{decision.title}</p>
                              <p className="fs-12 text-muted mb-1">{decision.when}</p>
                              <p className="fs-13 text-muted mb-0">{decision.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* --------------------- Notes & recommendations ---------------- */}
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mt-5 mb-3">
                <div>
                  <h2 className="acd-hero-title fs-20 mb-1">Notes &amp; recommendations</h2>
                  <p className="fs-13 text-muted mb-0">
                    What the configuration suggests looking at, and what is worth leaving alone.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                {RECOMMENDATIONS.map((entry) => (
                  <div className="col-xl-6 col-md-6" key={entry.title}>
                    <div className="acd-folder h-100">
                      <span className="acd-folder-tab">{entry.tag}</span>
                      <p className="acd-folder-title">{entry.title}</p>
                      <p className="acd-folder-txt">{entry.text}</p>
                      <div className="acd-folder-foot">
                        <span className="fs-12 text-muted">{entry.tag}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          onClick={() => openWorkspace(entry.title)}
                        >
                          {entry.action}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AcademicModals
        active={modal}
        onClose={() => setModal(null)}
        panelOpen={panelOpen}
        onClosePanel={() => setPanelOpen(false)}
        panelTitle={panelTitle}
        onToast={push}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="academicSettingsToasts" />
    </>
  );
};

export default AcademicSettings;
