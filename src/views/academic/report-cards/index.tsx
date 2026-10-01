import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import ReportCardDocument from './components/ReportCardDocument';
import ReportCardsSkeleton from './components/ReportCardsSkeleton';
import ReportCardsToolbar from './components/ReportCardsToolbar';
import StudentSummary from './components/StudentSummary';
import SubjectPerformance from './components/SubjectPerformance';
import type { ClassId, ExamId, SectionId, YearId } from './data/reportCards.data';
import {
  actionToasts,
  classes,
  academicYears,
  defaultSelection,
  exams,
  formatStamp,
  initialStamp,
  labelOf,
  reportCards,
  sections,
  summarise,
} from './data/reportCards.data';

const routes = all_routes;

/** The template previews the card straight away; this is the beat before it appears. */
const REVEAL_MS = 650;

/** How long the Generate button spins before the fresh stamp lands. */
const GENERATE_MS = 700;

const ReportCards = () => {
  const [year, setYear] = useState<YearId>(defaultSelection.year);
  const [exam, setExam] = useState<ExamId>(defaultSelection.exam);
  const [classId, setClassId] = useState<ClassId>(defaultSelection.classId);
  const [sectionId, setSectionId] = useState<SectionId>(defaultSelection.sectionId);

  const [query, setQuery] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(reportCards[0]?.id ?? null);

  const [generatedAt, setGeneratedAt] = useState(initialStamp);
  const [generating, setGenerating] = useState(false);
  const [publishedIds, setPublishedIds] = useState<string[]>([]);

  const { toasts, push, dismiss } = useToasts();
  const { loading } = useReveal(REVEAL_MS);

  /* -------------------------------- Selection ------------------------------- */

  /** Everything generated for the current Year · Exam · Class · Section. */
  const scoped = useMemo(
    () =>
      reportCards.filter(
        (entry) =>
          entry.year === year &&
          entry.exam === exam &&
          entry.classId === classId &&
          entry.sectionId === sectionId,
      ),
    [year, exam, classId, sectionId],
  );

  /** The scope narrowed by whatever is typed in the Student box. */
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return scoped;
    return scoped.filter((entry) => entry.search.includes(needle));
  }, [scoped, query]);

  const student = useMemo(
    () => scoped.find((entry) => entry.id === selectedId) ?? scoped[0] ?? null,
    [scoped, selectedId],
  );

  const summary = useMemo(() => (student ? summarise(student) : null), [student]);

  // Changing the scope can strip the selected student out of it; fall back to the first
  // card in the new batch rather than leaving the document showing a record it no longer holds.
  useEffect(() => {
    if (scoped.length === 0) {
      setSelectedId(null);
      return;
    }
    setSelectedId((current) =>
      current && scoped.some((entry) => entry.id === current) ? current : scoped[0].id,
    );
  }, [scoped]);

  const yearLabel = labelOf(academicYears, year);
  const classLabel = labelOf(classes, classId);
  const sectionLabel = labelOf(sections, sectionId);
  const examOption = exams.find((option) => option.id === exam) ?? exams[0];

  const published = student ? publishedIds.includes(student.id) : false;

  /* --------------------------------- Actions -------------------------------- */

  const requireCard = useCallback(() => {
    if (student) return true;
    push(actionToasts.no_cards, 'warning');
    return false;
  }, [student, push]);

  const handlePrint = useCallback(() => {
    if (!requireCard()) return;
    push(actionToasts.print, 'info');
    // Let the toast paint before the print dialog blocks the main thread.
    window.setTimeout(() => window.print(), 60);
  }, [requireCard, push]);

  const handleDownload = useCallback(() => {
    if (!requireCard()) return;
    push(actionToasts.download);
  }, [requireCard, push]);

  const handleGenerate = useCallback(() => {
    if (!requireCard() || generating) return;
    setGenerating(true);
    window.setTimeout(() => {
      setGenerating(false);
      setGeneratedAt(formatStamp(new Date()));
      push(actionToasts.generate);
    }, GENERATE_MS);
  }, [requireCard, generating, push]);

  const handlePublish = useCallback(() => {
    if (!requireCard() || !student) return;
    if (publishedIds.includes(student.id)) {
      push(actionToasts.published_locked, 'warning');
      return;
    }
    setPublishedIds((current) => [...current, student.id]);
    push(actionToasts.publish);
  }, [requireCard, student, publishedIds, push]);

  const handleSelectStudent = useCallback((id: string) => {
    setSelectedId(id);
    setPickerOpen(false);
    setQuery('');
  }, []);

  /* --------------------------------- Render --------------------------------- */

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Report Cards</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Report Cards
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <span
                className={`badge ${
                  published ? 'badge-soft-primary' : 'badge-soft-success'
                } d-inline-flex align-items-center me-2 mb-2`}
              >
                <i className="ti ti-circle-filled fs-5 me-1" />
                {published ? 'Published · Locked for the term' : 'Generated · Awaiting publish'}
              </span>
            </div>
          </div>
          {/* /Page Header */}

          {loading ? (
            <ReportCardsSkeleton />
          ) : (
            <>
              <ReportCardsToolbar
                year={year}
                onYear={setYear}
                exam={exam}
                onExam={setExam}
                classId={classId}
                onClass={setClassId}
                sectionId={sectionId}
                onSection={setSectionId}
                query={query}
                onQuery={setQuery}
                matches={matches}
                pickerOpen={pickerOpen}
                onPickerOpen={setPickerOpen}
                selectedId={student?.id ?? null}
                onSelectStudent={handleSelectStudent}
                generatedAt={generatedAt}
                readyCount={scoped.length}
                totalCount={scoped.length}
                onPrint={handlePrint}
                onDownload={handleDownload}
                onGenerate={handleGenerate}
                generating={generating}
              />

              {student && summary ? (
                <>
                  {/* Student Information and the printable preview; each component
                      carries the template's own column classes. */}
                  <div className="row">
                    <StudentSummary
                      student={student}
                      summary={summary}
                      classLabel={classLabel}
                      sectionLabel={sectionLabel}
                    />
                    <ReportCardDocument
                      student={student}
                      summary={summary}
                      exam={examOption}
                      yearLabel={yearLabel}
                      classLabel={classLabel}
                      sectionLabel={sectionLabel}
                      published={published}
                    />
                  </div>

                  {/* Subject Performance */}
                  <SubjectPerformance student={student} summary={summary} />

                  {/* Bottom Action Panel */}
                  <div className="card">
                    <div className="card-body d-lg-flex align-items-center justify-content-between">
                      <p className="mb-3 mb-lg-0 fs-13 text-muted">
                        <i className="ti ti-info-circle me-1" />
                        Publishing releases the report card to the parent portal and locks further
                        edits for this term.
                      </p>
                      <div className="d-flex align-items-center flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                          onClick={handleGenerate}
                          disabled={generating}
                        >
                          <i className={`ti ${generating ? 'ti-loader-2' : 'ti-file-check'} me-1`} />
                          {generating ? 'Generating…' : 'Generate Report Card'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                          onClick={handlePrint}
                        >
                          <i className="ti ti-printer me-1" />
                          Print
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                          onClick={handleDownload}
                        >
                          <i className="ti ti-file-type-pdf me-1" />
                          Download PDF
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary d-inline-flex align-items-center"
                          onClick={handlePublish}
                          disabled={published}
                        >
                          <i className="ti ti-send me-1" />
                          {published ? 'Published' : 'Publish'}
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* /Bottom Action Panel */}
                </>
              ) : (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <span className="avatar avatar-lg bg-light text-muted rounded-circle mb-3 d-inline-flex align-items-center justify-content-center">
                      <i className="ti ti-file-off fs-24" />
                    </span>
                    <h6 className="mb-1">No report cards generated</h6>
                    <p className="fs-13 text-muted mb-0">{actionToasts.no_cards}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export default ReportCards;
