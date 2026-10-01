import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import ExamSelectionPanel from './components/ExamSelectionPanel';
import type { EntrySummary } from './components/ExamSelectionPanel';
import MarksEntryGrid from './components/MarksEntryGrid';
import type { EntryRow } from './components/MarksEntryGrid';
import MarksEntrySkeleton from './components/MarksEntrySkeleton';
import MarksEntryToolbar from './components/MarksEntryToolbar';
import ValidationPanel from './components/ValidationPanel';
import MarksEntryModals from './modals/MarksEntryModals';
import type {
  AttendanceState,
  ExamContext,
  ExamContextKey,
  MarksEntryModalId,
  RowMenuItem,
  StudentRow,
} from './data/marksEntry.data';
import {
  PAGE_SIZE,
  actionToasts,
  evaluateRow,
  examContextDefaults,
  examPaper,
  isPending,
  rosterKeys,
  selectorFields,
  strings,
  studentRows,
} from './data/marksEntry.data';

const routes = all_routes;

const REVEAL_MS = 650;
const RELOAD_MS = 650;

/** The clock the template froze into its "Last Saved 10:42 AM" and "Draft 10:42 AM" pills. */
const SHIPPED_LAST_SAVED = '10:42 AM';

interface RowSnapshot {
  marks: string;
  remarks: string;
  attendance: AttendanceState;
}

type Baseline = Record<string, RowSnapshot>;

/** The last saved state of the sheet — what "unsaved changes" is measured against. */
const snapshot = (rows: StudentRow[]): Baseline =>
  rows.reduce<Baseline>((acc, row) => {
    acc[row.id] = { marks: row.marks, remarks: row.remarks, attendance: row.attendance };
    return acc;
  }, {});

const isDirty = (row: StudentRow, baseline: Baseline) => {
  const saved = baseline[row.id];
  if (!saved) return true;
  return saved.marks !== row.marks || saved.remarks !== row.remarks || saved.attendance !== row.attendance;
};

const clockNow = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const MarksEntry = () => {
  /* ---------------------------------- State --------------------------------- */
  const [context, setContext] = useState<ExamContext>(examContextDefaults);
  const [rows, setRows] = useState<StudentRow[]>(studentRows);
  const [baseline, setBaseline] = useState<Baseline>(() => snapshot(studentRows));

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [locked, setLocked] = useState(false);
  const [saveState, setSaveState] = useState<'Draft' | 'Published'>('Draft');
  const [lastSaved, setLastSaved] = useState(SHIPPED_LAST_SAVED);

  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<MarksEntryModalId | null>(null);
  const [modalRow, setModalRow] = useState<StudentRow | null>(null);

  const [reloading, setReloading] = useState(false);

  const { toasts, push, dismiss } = useToasts();
  const { loading: booting } = useReveal(REVEAL_MS);
  const loading = booting || reloading;

  useEffect(() => {
    if (!rowMenuOpen) return;
    const handlePointerDown = () => setRowMenuOpen(null);
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [rowMenuOpen]);

  useEffect(() => setPage(1), [search]);

  /* ------------------------------- Derived rows ------------------------------ */

  const evaluated = useMemo<EntryRow[]>(
    () =>
      rows.map((row) => ({
        row,
        evaluation: evaluateRow(row, examPaper.maxMarks, examPaper.passMarks, isDirty(row, baseline), locked),
      })),
    [rows, baseline, locked],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? evaluated.filter(({ row }) => row.search.includes(term)) : evaluated;
  }, [evaluated, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const rangeTo = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const summary = useMemo<EntrySummary>(
    () =>
      evaluated.reduce<EntrySummary>(
        (acc, { evaluation }) => {
          if (evaluation.numeric !== null) acc.entered += 1;
          if (isPending(evaluation.status)) acc.pending += 1;
          if (evaluation.status === 'Absent') acc.absent += 1;
          return acc;
        },
        { students: evaluated.length, entered: 0, pending: 0, absent: 0 },
      ),
    [evaluated],
  );

  const dirtyCount = useMemo(
    () => rows.filter((row) => isDirty(row, baseline)).length,
    [rows, baseline],
  );

  const modalEvaluation = evaluated.find(({ row }) => row.id === modalRow?.id)?.evaluation ?? null;

  /* --------------------------------- Handlers ------------------------------- */

  const updateRow = (id: string, patch: Partial<StudentRow>) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  /**
   * Year and teacher only relabel the sheet; the four keys that identify a paper pull a
   * fresh roster, which drops any unsaved edits along with the previous paper's lock.
   */
  const changeContext = (key: ExamContextKey, value: string) => {
    const next = { ...context, [key]: value };
    setContext(next);
    if (!rosterKeys.includes(key)) return;

    setReloading(true);
    window.setTimeout(() => {
      setRows(studentRows);
      setBaseline(snapshot(studentRows));
      setLocked(false);
      setSaveState('Draft');
      setLastSaved(SHIPPED_LAST_SAVED);
      setSearch('');
      setPage(1);
      setReloading(false);
      push(`${strings.loading}${next.subject} · ${next.className} · ${next.section}.`, 'info');
    }, RELOAD_MS);
  };

  /** Refresh re-reads the sheet, so anything typed since the last save is discarded. */
  const refresh = () => {
    setReloading(true);
    window.setTimeout(() => {
      setRows((current) => current.map((row) => ({ ...row, ...baseline[row.id] })));
      setReloading(false);
      push(actionToasts.refresh);
    }, RELOAD_MS);
  };

  const print = () => {
    push(actionToasts.print, 'info');
    window.print();
  };

  const saveDraft = () => {
    if (dirtyCount === 0) {
      push(actionToasts.already_saved, 'info');
      return;
    }
    setBaseline(snapshot(rows));
    setLastSaved(clockNow());
    setSaveState('Draft');
    push(actionToasts.save_draft);
  };

  const publish = () => {
    if (summary.pending > 0) {
      push(`${summary.pending}${strings.publishBlocked}`, 'warning');
      return;
    }
    setBaseline(snapshot(rows));
    setLastSaved(clockNow());
    setSaveState('Published');
    setLocked(true);
    push(actionToasts.publish);
  };

  const reset = () => {
    setRows(studentRows);
    setBaseline(snapshot(studentRows));
    setLocked(false);
    setSaveState('Draft');
    setLastSaved(SHIPPED_LAST_SAVED);
    push(actionToasts.reset);
  };

  const handleRowAction = (item: RowMenuItem, row: StudentRow) => {
    setModalRow(row);
    setActiveModal(item.modal);
  };

  const saveRemark = (id: string, remark: string) => {
    updateRow(id, { remarks: remark });
    push(actionToasts.remark);
  };

  const headerPill = summary.pending > 0 ? 'badge-soft-warning' : 'badge-soft-success';

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Marks Entry</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Marks Entry
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <span className={`badge ${headerPill} d-inline-flex align-items-center me-2 mb-2`}>
                <i className="ti ti-circle-filled fs-5 me-1" />
                {saveState} · {summary.pending} entries pending
              </span>
            </div>
          </div>
          {/* /Page Header */}

          {/* Sticky Entry Toolbar */}
          <MarksEntryToolbar
            fields={selectorFields}
            context={context}
            onContext={changeContext}
            search={search}
            onSearch={setSearch}
            onRefresh={refresh}
            onPrint={print}
            onSaveDraft={saveDraft}
            onPublish={publish}
            locked={locked}
          />
          {/* /Sticky Entry Toolbar */}

          {loading ? (
            <div className="card">
              <div className="data-workspace" data-density="default">
                <MarksEntrySkeleton />
              </div>
            </div>
          ) : (
            <>
              <ExamSelectionPanel
                context={context}
                maxMarks={examPaper.maxMarks}
                passMarks={examPaper.passMarks}
                markingType={examPaper.markingType}
                gradingMethod={examPaper.gradingMethod}
                summary={summary}
                lastSaved={lastSaved}
              />

              {/* Marks Entry Table */}
              <MarksEntryGrid
                rows={pageRows}
                className={context.className}
                section={context.section}
                subject={context.subject}
                maxMarks={examPaper.maxMarks}
                dirtyCount={dirtyCount}
                locked={locked}
                onAttendance={(id, value) => updateRow(id, { attendance: value })}
                onMark={(id, value) => updateRow(id, { marks: value })}
                onRemark={(id, value) => updateRow(id, { remarks: value })}
                openMenu={rowMenuOpen}
                onOpenMenu={setRowMenuOpen}
                onRowAction={handleRowAction}
                rangeTo={rangeTo}
                total={filtered.length}
                page={currentPage}
                pageCount={pageCount}
                onPage={(next) => {
                  setPage(next);
                  setRowMenuOpen(null);
                }}
              />
              {/* /Marks Entry Table */}

              {/* Validation & Save Panel */}
              <ValidationPanel
                summary={summary}
                saveState={saveState}
                lastSaved={lastSaved}
                locked={locked}
                onReset={reset}
                onPrint={print}
                onSaveDraft={saveDraft}
                onPublish={publish}
              />
              {/* /Validation & Save Panel */}
            </>
          )}
        </div>
      </div>

      <MarksEntryModals
        active={activeModal}
        student={modalRow}
        evaluation={modalEvaluation}
        context={context}
        maxMarks={examPaper.maxMarks}
        passMarks={examPaper.passMarks}
        saveState={saveState}
        lastSaved={lastSaved}
        onClose={() => setActiveModal(null)}
        onSaveRemark={saveRemark}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="meToasts" />
    </>
  );
};

export default MarksEntry;
