import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import AdmitCardDocument from './components/AdmitCardDocument';
import AdmitCardSkeleton from './components/AdmitCardSkeleton';
import AdmitCardToolbar from './components/AdmitCardToolbar';
import type { FilterChip, ToolbarMenu } from './components/AdmitCardToolbar';
import SelectionPanel from './components/SelectionPanel';
import type { SelectionDraft } from './components/SelectionPanel';
import StudentSidebar from './components/StudentSidebar';
import AdmitCardModals from './modals/AdmitCardModals';
import type {
  AdmitCardModalId,
  AdmitCardStudent,
  CardAction,
  CardStateId,
  CardTemplateId,
} from './data/admitCard.data';
import {
  academicYears,
  actionToasts,
  batchFilters,
  cardTemplates,
  classes,
  examinations,
  findSchedule,
  headerActions,
  headerMailActions,
  savedBatches,
  sections,
  strings,
  students,
} from './data/admitCard.data';

const routes = all_routes;

/** The template previews the card straight away; this is the beat before it appears. */
const REVEAL_MS = 650;
const REFRESH_MS = 600;

/** Everything the template ships `selected` (L1572, L1580, L1589, L1598, L1606). */
const DEFAULT_SELECTION: SelectionDraft = {
  academicYear: academicYears[0].id,
  examination: examinations[0].id,
  classId: classes[0].id,
  sectionId: sections[0].id,
  studentId: students[0].id,
};

/** The batch rail ships with "Generated" active (L1537). */
const DEFAULT_BATCH_FILTER: CardStateId = 'generated';

/** Saved batch matching the default class and section. */
const DEFAULT_SAVED_BATCH = savedBatches[0].id;

const sameSelection = (a: SelectionDraft, b: SelectionDraft) =>
  a.academicYear === b.academicYear &&
  a.examination === b.examination &&
  a.classId === b.classId &&
  a.sectionId === b.sectionId &&
  a.studentId === b.studentId;

const AdmitCard = () => {
  /* ---------------------------------- State --------------------------------- */

  const [roster, setRoster] = useState<AdmitCardStudent[]>(students);

  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState<CardStateId | null>(DEFAULT_BATCH_FILTER);
  const [savedBatch, setSavedBatch] = useState<string | null>(DEFAULT_SAVED_BATCH);
  const [template, setTemplate] = useState<CardTemplateId>('standard');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [draft, setDraft] = useState<SelectionDraft>(DEFAULT_SELECTION);
  const [applied, setApplied] = useState<SelectionDraft>(DEFAULT_SELECTION);

  const [activeModal, setActiveModal] = useState<AdmitCardModalId | null>(null);

  const { toasts, push, dismiss } = useToasts();
  const { loading: booting } = useReveal(REVEAL_MS);
  const loading = booting || refreshing;

  /* -------------------------------- Candidates ------------------------------ */

  /** Class, section, the search box and the batch rail all narrow the Student select. */
  const candidatesIn = useCallback(
    (classId: string, sectionId: string) => {
      const term = search.trim().toLowerCase();
      return roster.filter((candidate) => {
        if (candidate.classId !== classId) return false;
        if (candidate.sectionId !== sectionId) return false;
        if (term && !candidate.search.includes(term)) return false;
        if (batchFilter && !candidate.states.includes(batchFilter)) return false;
        return true;
      });
    },
    [roster, search, batchFilter],
  );

  const draftCandidates = useMemo(
    () => candidatesIn(draft.classId, draft.sectionId),
    [candidatesIn, draft.classId, draft.sectionId],
  );

  // Narrowing the list can strand the drafted student; fall back to the first on offer.
  useEffect(() => {
    setDraft((current) => {
      if (draftCandidates.some((candidate) => candidate.id === current.studentId)) return current;
      return { ...current, studentId: draftCandidates[0]?.id ?? '' };
    });
  }, [draftCandidates]);

  const student = useMemo(
    () => roster.find((candidate) => candidate.id === applied.studentId) ?? null,
    [roster, applied.studentId],
  );

  const examination = useMemo(
    () => examinations.find((item) => item.id === applied.examination) ?? examinations[0],
    [applied.examination],
  );

  const academicYear = useMemo(
    () => academicYears.find((item) => item.id === applied.academicYear) ?? academicYears[0],
    [applied.academicYear],
  );

  const activeTemplate = useMemo(
    () => cardTemplates.find((item) => item.id === template) ?? cardTemplates[0],
    [template],
  );

  const activeBatch = useMemo(
    () => savedBatches.find((item) => item.id === savedBatch) ?? savedBatches[0],
    [savedBatch],
  );

  const schedule = useMemo(
    () => findSchedule(applied.examination, applied.classId),
    [applied.examination, applied.classId],
  );

  const dirty = !sameSelection(draft, applied);

  /* ----------------------------------- Chips -------------------------------- */

  const chips: FilterChip[] = useMemo(() => {
    const appliedClass = classes.find((item) => item.id === applied.classId);
    const appliedSection = sections.find((item) => item.id === applied.sectionId);
    return [
      { id: 'examination', label: `Examination: ${examination.chip}` },
      {
        id: 'class',
        label: `Class: ${appliedClass?.label ?? ''} · ${
          appliedSection?.label.replace('Section ', '') ?? ''
        }`,
      },
    ];
  }, [applied.classId, applied.sectionId, examination.chip]);

  /* --------------------------------- Handlers ------------------------------- */

  const patchDraft = useCallback(
    (patch: Partial<SelectionDraft>) => setDraft((current) => ({ ...current, ...patch })),
    [],
  );

  const applySelection = useCallback(() => {
    setApplied(draft);
    const picked = roster.find((candidate) => candidate.id === draft.studentId);
    push(picked ? `Admit card loaded for ${picked.name}.` : actionToasts.apply);
  }, [draft, roster, push]);

  const resetSelection = useCallback(() => {
    setDraft(DEFAULT_SELECTION);
    setApplied(DEFAULT_SELECTION);
    setSearch('');
    setBatchFilter(DEFAULT_BATCH_FILTER);
    setSavedBatch(DEFAULT_SAVED_BATCH);
    push(actionToasts.reset, 'info');
  }, [push]);

  const clearChip = useCallback(
    (id: string) => {
      const patch: Partial<SelectionDraft> =
        id === 'examination'
          ? { examination: DEFAULT_SELECTION.examination }
          : { classId: DEFAULT_SELECTION.classId, sectionId: DEFAULT_SELECTION.sectionId };
      setDraft((current) => ({ ...current, ...patch }));
      setApplied((current) => ({ ...current, ...patch }));
      push('Filter removed.', 'info');
    },
    [push],
  );

  const clearChips = useCallback(() => {
    setDraft(DEFAULT_SELECTION);
    setApplied(DEFAULT_SELECTION);
    push(actionToasts.clearFilters, 'info');
  }, [push]);

  const chooseBatch = useCallback(
    (id: string) => {
      const batch = savedBatches.find((item) => item.id === id);
      if (!batch) return;
      setSavedBatch(id);
      const patch = { classId: batch.classId, sectionId: batch.sectionId };
      setDraft((current) => ({ ...current, ...patch }));
      setApplied((current) => ({ ...current, ...patch }));
      push(`${batch.label} loaded · ${batch.count} admit cards.`);
    },
    [push],
  );

  const chooseTemplate = useCallback(
    (id: CardTemplateId) => {
      setTemplate(id);
      const picked = cardTemplates.find((item) => item.id === id);
      push(`${picked?.label ?? 'Standard'} template applied to the preview.`, 'info');
    },
    [push],
  );

  const toggleBatchFilter = useCallback(
    (id: CardStateId) => {
      const next = batchFilter === id ? null : id;
      setBatchFilter(next);
      const label = batchFilters.find((item) => item.id === id)?.label ?? '';
      push(next ? `Batch filtered to ${label} cards.` : 'Batch filter cleared.', 'info');
    },
    [batchFilter, push],
  );

  const handlePrint = useCallback(() => {
    push(actionToasts.print, 'info');
    window.print();
  }, [push]);

  const handleDownload = useCallback(() => push(actionToasts.download), [push]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      setRoster(students);
      push(actionToasts.refresh);
    }, REFRESH_MS);
  }, [push]);

  // Fullscreen is the browser's, so Escape leaves it without any handling of our own.
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }, []);

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement !== null);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  // Close the header's Quick Actions menu on an outside click, as Bootstrap's dropdown does.
  useEffect(() => {
    if (!headerMenuOpen) return;
    const close = () => setHeaderMenuOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [headerMenuOpen]);

  const verifyCard = useCallback(() => {
    if (!student) return;
    setRoster((current) =>
      current.map((candidate) =>
        candidate.id === student.id
          ? {
              ...candidate,
              verification: { label: 'Verified', badge: 'badge-soft-success' },
              states: candidate.states.includes('verified')
                ? candidate.states
                : [...candidate.states, 'verified'],
            }
          : candidate,
      ),
    );
    push(actionToasts.verify);
  }, [student, push]);

  const handleAction = useCallback(
    (action: CardAction) => {
      switch (action.effect) {
        case 'print':
          handlePrint();
          return;
        case 'download':
          handleDownload();
          return;
        case 'preview':
          push(actionToasts.preview, 'info');
          return;
        case 'verify':
          verifyCard();
          return;
        case 'mail':
        case 'share':
          setActiveModal('sendMail');
          return;
        case 'bulkMail':
          setActiveModal('sendBulkMail');
          return;
        default:
          push(action.label);
      }
    },
    [handleDownload, handlePrint, push, verifyCard],
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Admit Card</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Admit Card
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-primary mb-2 me-2 d-inline-flex align-items-center"
                onClick={() => push(actionToasts.generate)}
              >
                <i className="ti ti-file-check me-1" />
                Generate Admit Card
              </button>
              <div className="dropdown mb-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white btn-icon"
                  aria-expanded={headerMenuOpen}
                  aria-label="Quick actions"
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={() => setHeaderMenuOpen((open) => !open)}
                >
                  <i className="ti ti-dots-vertical" />
                </Link>
                <ul
                  className={`dropdown-menu dropdown-menu-end p-2${headerMenuOpen ? ' show' : ''}`}
                >
                  <li>
                    <h4 className="dropdown-header fs-15 fw-medium">Quick Actions</h4>
                  </li>
                  {headerActions.map((action) => (
                    <li key={action.id}>
                      <Link
                        className="dropdown-item rounded-1"
                        to="#"
                        onClick={() => {
                          setHeaderMenuOpen(false);
                          handleAction(action);
                        }}
                      >
                        <i className={`${action.icon} me-2`} />
                        {action.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  {headerMailActions.map((action) => (
                    <li key={action.id}>
                      <Link
                        className="dropdown-item rounded-1"
                        to="#"
                        onClick={() => {
                          setHeaderMenuOpen(false);
                          handleAction(action);
                        }}
                      >
                        <i className={`${action.icon} me-2`} />
                        {action.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {loading ? <AdmitCardSkeleton /> : null}

          {!loading ? (
            <div className="live-content">
              {/* Top Toolbar */}
              <AdmitCardToolbar
                search={search}
                onSearch={setSearch}
                savedBatch={savedBatch}
                onSavedBatch={chooseBatch}
                onSaveBatch={() => push(actionToasts.saveBatch)}
                template={template}
                onTemplate={chooseTemplate}
                batchFilter={batchFilter}
                onBatchFilter={toggleBatchFilter}
                chips={chips}
                onClearChip={clearChip}
                onClearChips={clearChips}
                onPrint={handlePrint}
                onDownload={handleDownload}
                onRefresh={refresh}
                fullscreen={fullscreen}
                onToggleFullscreen={toggleFullscreen}
                openMenu={openMenu}
                onOpenMenu={setOpenMenu}
              />
              {/* /Top Toolbar */}

              {/* Student & Exam Filters */}
              <SelectionPanel
                draft={draft}
                onDraft={patchDraft}
                candidates={draftCandidates}
                dirty={dirty}
                onApply={applySelection}
                onReset={resetSelection}
              />
              {/* /Student & Exam Filters */}

              {student ? (
                <div className="row">
                  {/* Admit Card Preview */}
                  <div className="col-12 col-xxl-8 col-xl-7 d-flex">
                    <AdmitCardDocument
                      student={student}
                      examination={examination}
                      academicYear={academicYear.label}
                      template={activeTemplate}
                      schedule={schedule}
                      onPrint={handlePrint}
                      onDownload={handleDownload}
                    />
                  </div>

                  {/* Student Information + Quick Actions */}
                  <div className="col-12 col-xxl-4 col-xl-5 d-flex">
                    <StudentSidebar student={student} onAction={handleAction} />
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-body">
                    <div className="workspace-empty-state show">
                      <div className="workspace-empty-art">
                        <i className="ti ti-id-off" />
                      </div>
                      <h5>{strings.emptyTitle}</h5>
                      <p>{strings.emptyBody}</p>
                      <button type="button" className="btn btn-primary" onClick={resetSelection}>
                        <i className="ti ti-rotate me-1" />
                        Reset selection
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
      {/* /Page Wrapper */}

      {student ? (
        <AdmitCardModals
          active={activeModal}
          student={student}
          examination={examination}
          batch={activeBatch}
          onClose={() => setActiveModal(null)}
          onSend={(message) => push(message)}
        />
      ) : null}

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export default AdmitCard;
