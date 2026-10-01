import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import DateField from '@components/ui/DateField';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { ActionLink } from '@components/workspace';
import type { Submission } from '../data/homework.data';
import {
  completionLabelOf,
  gradeFor,
  isFlaggedOf,
  PENDING_REVIEWS,
  PLAN,
  PLAN_REVIEW,
  punctualityOf,
  RELEASE_FLOOR,
  RUBRIC,
  scoreOf,
  SUBMISSIONS,
  SUBMISSIONS_MARKED,
} from '../data/homework.data';

export type HomeworkModalId =
  | 'run_evaluation'
  | 'generate_feedback'
  | 'learning_plan'
  | 'teacher_review'
  | 'export_evaluation'
  | 'parent_summary'
  | 'generate_practice'
  | 'compare_submissions'
  | 'all_submissions';

export interface HomeworkModalsProps {
  active: HomeworkModalId | null;
  onClose: () => void;
  row: Submission | null;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  onOpenRow: (row: Submission) => void;
  onOpenDialog: (id: HomeworkModalId) => void;
}

const Field = ({
  label,
  children,
  span = 'col-md-6',
}: {
  label: string;
  children: React.ReactNode;
  span?: string;
}) => (
  <div className={span}>
    <label className="form-label">{label}</label>
    {children}
  </div>
);

const Select = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
    {options.map((option) => (
      <option key={option}>{option}</option>
    ))}
  </select>
);

const Drafted = ({ row, note }: { row: Submission | null; note: string }) => (
  <div className="hwk-panel mb-3">
    <div className="hwk-panel-head">
      <h6 className="fs-14 mb-0">
        {row ? `${row.student} · ${row.assignment.split(' · ')[0]}` : 'The whole run'}
      </h6>
      <span className="hwk-tag is-ai">
        <i className="ti ti-sparkles" />
        {note}
      </span>
    </div>
  </div>
);

const Footer = ({ icon, label, onClose }: { icon: string; label: string; onClose: () => void }) => (
  <>
    <ActionLink className="btn btn-light me-2" onClick={onClose}>
      Cancel
    </ActionLink>
    <button type="submit" className="btn btn-primary d-inline-flex align-items-center">
      <i className={`${icon} me-1`} />
      {label}
    </button>
  </>
);

const useForm = <T extends Record<string, string>>(defaults: T, open: boolean) => {
  const [values, setValues] = useState<T>(defaults);
  // Serialised so the effect depends on the defaults' content, not their identity.
  const initial = JSON.stringify(defaults);

  useEffect(() => {
    if (open) setValues(JSON.parse(initial) as T);
  }, [open, initial]);

  const set = (key: keyof T) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  return [values, set] as const;
};

const HomeworkModals = ({
  active,
  onClose,
  row,
  onToast,
  onOpenRow,
  onOpenDialog,
}: HomeworkModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const grade = row ? gradeFor(row) : null;
  const score = row ? scoreOf(row) : null;
  const firstName = row?.student.split(' ')[0] ?? 'the student';
  const assignment = row?.assignment.split(' · ')[0] ?? 'this set';

  const [evaluation, setEvaluation] = useForm(
    {
      scope: 'This submission',
      rubric: `Published rubric · ${RUBRIC.length} criteria`,
      originality: 'Full check',
      floor: `Flag below ${RELEASE_FLOOR}%`,
      onDone: 'Hold for teacher review',
    },
    active === 'run_evaluation',
  );

  const [feedback, setFeedback] = useForm(
    {
      audience: 'Student',
      tone: 'Encouraging',
      include: 'Strengths and one focus',
      attach: 'Practice questions',
      draft:
        'You set up every question correctly, which is the hard part — well done. Three answers stop at the same step, where you substitute a second time. Try the four practice questions attached; they only cover that one step.',
    },
    active === 'generate_feedback',
  );

  const [plan, setPlan] = useForm(
    {
      focus: PLAN.focus,
      duration: `${PLAN.weeks} weeks`,
      owner: `${PLAN.owner} · class teacher`,
      checkpoint: 'Weekly',
      target: PLAN.target,
      review: PLAN_REVIEW,
      plan: 'Week 1 substitution drill, four questions. Week 2 a full set using the layout sheet. Week 3 one reasoning sentence before each answer. Week 4 a timed set with no support.',
    },
    active === 'learning_plan',
  );

  const [review, setReview] = useForm(
    {
      decision: 'Confirm the AI grade',
      grade: grade?.grade ?? '—',
      score: score === null ? '' : String(score),
      criterion: 'Presentation only',
      release: 'Student and parent',
      note: 'Concept understanding is stronger than the score suggests. Marks were lost to three unfinished questions and to presentation, neither of which reflects understanding.',
    },
    active === 'teacher_review',
  );

  const [exportForm, setExportForm] = useForm(
    {
      contents: 'Full evaluation with evidence',
      format: 'PDF',
      attach: 'Yes, attach pages',
      deliver: 'Download',
    },
    active === 'export_evaluation',
  );

  const [parent, setParent] = useForm(
    {
      language: 'English',
      delivery: 'Email',
      include: 'Strengths and one focus',
      attach: 'Practice questions',
      summary: `${firstName} understands this topic well. The marks lost were to three unfinished questions rather than to misunderstanding. We have attached short practice on the one step causing difficulty, and we would welcome help with starting longer sets earlier.`,
    },
    active === 'parent_summary',
  );

  const [practice, setPractice] = useForm(
    {
      target: PLAN.focus,
      count: '4',
      difficulty: 'Matched to current band',
      format: 'Worked example then practice',
      deliver: 'Attach to feedback',
    },
    active === 'generate_practice',
  );

  const [compare, setCompare] = useForm(
    {
      compare: 'This submission against the class',
      criterion: `All ${RUBRIC.length} criteria`,
      cohort: row?.className ?? 'Class VIII-A',
      show: `Top ${SUBMISSIONS.length} matches`,
    },
    active === 'compare_submissions',
  );

  const [filter, setFilter] = useState('All submissions');

  useEffect(() => {
    if (active === 'all_submissions') setFilter('All submissions');
  }, [active]);

  const listed = SUBMISSIONS.filter((entry) => {
    if (filter === 'Flagged for review') return isFlaggedOf(entry);
    if (filter === 'Not submitted') return entry.marks === null;
    if (filter === 'Released') return !isFlaggedOf(entry);
    return true;
  });

  return (
    <>
      <Modal
        open={active === 'run_evaluation'}
        onClose={onClose}
        title="Run AI Evaluation"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Evaluation</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit('Evaluation queued. Scores are held until you confirm them.')}
        footer={<Footer icon="ti ti-player-play" label="Run evaluation" onClose={onClose} />}
      >
        <Drafted row={row} note={`${SUBMISSIONS_MARKED} submissions read on the last pass`} />
        <div className="row g-3">
          <Field label="Scope">
            <Select
              value={evaluation.scope}
              onChange={setEvaluation('scope')}
              options={[
                'This submission',
                `${assignment} · whole class`,
                'All pending submissions',
                'All subjects',
              ]}
            />
          </Field>
          <Field label="Rubric">
            <Select
              value={evaluation.rubric}
              onChange={setEvaluation('rubric')}
              options={[
                `Published rubric · ${RUBRIC.length} criteria`,
                'Department rubric',
                'Custom rubric',
              ]}
            />
          </Field>
          <Field label="Originality check">
            <Select
              value={evaluation.originality}
              onChange={setEvaluation('originality')}
              options={['Full check', 'Fast check', 'Skip']}
            />
          </Field>
          <Field label="Confidence floor">
            <Select
              value={evaluation.floor}
              onChange={setEvaluation('floor')}
              options={[`Flag below ${RELEASE_FLOOR}%`, 'Flag below 90%', 'Flag nothing']}
            />
          </Field>
          <Field label="On completion" span="col-12">
            <Select
              value={evaluation.onDone}
              onChange={setEvaluation('onDone')}
              options={['Hold for teacher review', 'Release scores automatically', 'Draft feedback too']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'generate_feedback'}
        onClose={onClose}
        title="Generate Feedback"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Feedback</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Feedback drafted for the ${feedback.audience.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-message-2" label="Generate feedback" onClose={onClose} />}
      >
        <Drafted row={row} note="Drafted against the published rubric" />
        <div className="row g-3">
          <Field label="Audience">
            <Select
              value={feedback.audience}
              onChange={setFeedback('audience')}
              options={['Student', 'Teacher record', 'Parent', 'All three']}
            />
          </Field>
          <Field label="Tone">
            <Select
              value={feedback.tone}
              onChange={setFeedback('tone')}
              options={['Encouraging', 'Neutral', 'Direct']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={feedback.include}
              onChange={setFeedback('include')}
              options={['Strengths and one focus', 'Full criterion breakdown', 'Focus area only']}
            />
          </Field>
          <Field label="Attach">
            <Select
              value={feedback.attach}
              onChange={setFeedback('attach')}
              options={['Practice questions', 'Layout sheet', 'Nothing']}
            />
          </Field>
          <Field label="Draft" span="col-12">
            <textarea
              rows={4}
              className="form-control"
              value={feedback.draft}
              onChange={(event) => setFeedback('draft')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'learning_plan'}
        onClose={onClose}
        title="Create Learning Plan"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Learning Plan</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Learning plan opened, reviewed ${plan.review}.`)}
        footer={<Footer icon="ti ti-route" label="Create plan" onClose={onClose} />}
      >
        <Drafted row={row} note="Built from this evaluation" />
        <div className="row g-3">
          <Field label="Focus">
            <Select
              value={plan.focus}
              onChange={setPlan('focus')}
              options={[
                'Second substitution',
                'Written justification',
                'Presentation',
                'Time management',
              ]}
            />
          </Field>
          <Field label="Duration">
            <Select
              value={plan.duration}
              onChange={setPlan('duration')}
              options={[`${PLAN.weeks} weeks`, '2 weeks', '6 weeks']}
            />
          </Field>
          <Field label="Owner">
            <Select
              value={plan.owner}
              onChange={setPlan('owner')}
              options={[`${PLAN.owner} · class teacher`, 'Mathematics department', 'Peer partner']}
            />
          </Field>
          <Field label="Checkpoint">
            <Select
              value={plan.checkpoint}
              onChange={setPlan('checkpoint')}
              options={['Weekly', 'Per assignment', 'Fortnightly']}
            />
          </Field>
          <Field label="Target">
            <input
              type="text"
              className="form-control"
              value={plan.target}
              onChange={(event) => setPlan('target')(event.target.value)}
            />
          </Field>
          <Field label="Review date">
            <DateField value={plan.review} onChange={setPlan('review')} />
          </Field>
          <Field label="Plan" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={plan.plan}
              onChange={(event) => setPlan('plan')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'teacher_review'}
        onClose={onClose}
        title="Teacher Review"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Evaluation</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Grade ${review.grade} confirmed and released to ${review.release.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-check" label="Confirm review" onClose={onClose} />}
      >
        <Drafted
          row={row}
          note={
            row && isFlaggedOf(row)
              ? `Held: confidence below ${RELEASE_FLOOR}%`
              : 'Confidence above the release floor'
          }
        />
        <div className="row g-3">
          <Field label="Decision">
            <Select
              value={review.decision}
              onChange={setReview('decision')}
              options={[
                'Confirm the AI grade',
                'Adjust the grade',
                'Remark from scratch',
                'Return for resubmission',
              ]}
            />
          </Field>
          <Field label="Final grade">
            <input
              type="text"
              className="form-control"
              value={review.grade}
              onChange={(event) => setReview('grade')(event.target.value)}
            />
          </Field>
          <Field label="Final score">
            <input
              type="text"
              className="form-control"
              value={review.score}
              onChange={(event) => setReview('score')(event.target.value)}
            />
          </Field>
          <Field label="Criterion to adjust">
            <Select
              value={review.criterion}
              onChange={setReview('criterion')}
              options={['Presentation only', 'Reasoning only', 'None', 'All criteria']}
            />
          </Field>
          <Field label="Release to" span="col-12">
            <Select
              value={review.release}
              onChange={setReview('release')}
              options={['Student and parent', 'Student only', 'Hold until revision']}
            />
          </Field>
          <Field label="Reviewer note" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={review.note}
              onChange={(event) => setReview('note')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'export_evaluation'}
        onClose={onClose}
        title="Export Evaluation"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Evaluation</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${exportForm.contents} exported as ${exportForm.format}.`)}
        footer={<Footer icon="ti ti-file-export" label="Export evaluation" onClose={onClose} />}
      >
        <Drafted row={row} note="Exports carry the evidence, not only the scores" />
        <div className="row g-3">
          <Field label="Contents">
            <Select
              value={exportForm.contents}
              onChange={setExportForm('contents')}
              options={[
                'Full evaluation with evidence',
                'Scores only',
                'Feedback drafts only',
                'Whole class',
              ]}
            />
          </Field>
          <Field label="Format">
            <Select
              value={exportForm.format}
              onChange={setExportForm('format')}
              options={['PDF', 'XLSX', 'CSV', 'Word']}
            />
          </Field>
          <Field label="Include the submission">
            <Select
              value={exportForm.attach}
              onChange={setExportForm('attach')}
              options={['Yes, attach pages', 'No']}
            />
          </Field>
          <Field label="Deliver to">
            <Select
              value={exportForm.deliver}
              onChange={setExportForm('deliver')}
              options={['Download', 'Email to me', 'Student record']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'parent_summary'}
        onClose={onClose}
        title="Share Parent Summary"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Feedback</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Parent summary sent by ${parent.delivery.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-mail-star" label="Share summary" onClose={onClose} />}
      >
        <Drafted row={row} note="No scores without the context around them" />
        <div className="row g-3">
          <Field label="Language">
            <Select
              value={parent.language}
              onChange={setParent('language')}
              options={['English', 'Hindi', 'Tamil', 'Malayalam']}
            />
          </Field>
          <Field label="Delivery">
            <Select
              value={parent.delivery}
              onChange={setParent('delivery')}
              options={['Email', 'Parent portal', 'Printed note']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={parent.include}
              onChange={setParent('include')}
              options={['Strengths and one focus', 'Full evaluation', 'Focus and practice only']}
            />
          </Field>
          <Field label="Attach">
            <Select
              value={parent.attach}
              onChange={setParent('attach')}
              options={['Practice questions', 'Nothing']}
            />
          </Field>
          <Field label="Summary" span="col-12">
            <textarea
              rows={4}
              className="form-control"
              value={parent.summary}
              onChange={(event) => setParent('summary')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'generate_practice'}
        onClose={onClose}
        title="Generate Practice Questions"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Learning Plan</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${practice.count} practice questions drafted on ${practice.target.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-math-symbols" label="Generate questions" onClose={onClose} />}
      >
        <Drafted row={row} note="Targeted at the step the working broke down on" />
        <div className="row g-3">
          <Field label="Target">
            <Select
              value={practice.target}
              onChange={setPractice('target')}
              options={[
                'Second substitution',
                'First substitution',
                'Simultaneous equations',
                'Word problems',
              ]}
            />
          </Field>
          <Field label="Number of questions">
            <input
              type="text"
              className="form-control"
              value={practice.count}
              onChange={(event) => setPractice('count')(event.target.value)}
            />
          </Field>
          <Field label="Difficulty">
            <Select
              value={practice.difficulty}
              onChange={setPractice('difficulty')}
              options={['Matched to current band', 'One band easier', 'Graduated across the set']}
            />
          </Field>
          <Field label="Format">
            <Select
              value={practice.format}
              onChange={setPractice('format')}
              options={['Worked example then practice', 'Practice only', 'With answer key']}
            />
          </Field>
          <Field label="Deliver" span="col-12">
            <Select
              value={practice.deliver}
              onChange={setPractice('deliver')}
              options={['Attach to feedback', 'Assign as homework', 'Download only']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'compare_submissions'}
        onClose={onClose}
        title="Compare Submissions"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Insights</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit('Matched submissions opened for comparison.')}
        footer={<Footer icon="ti ti-git-compare" label="Compare" onClose={onClose} />}
      >
        <Drafted row={row} note={`Against ${SUBMISSIONS_MARKED} marked submissions`} />
        <div className="row g-3">
          <Field label="Compare">
            <Select
              value={compare.compare}
              onChange={setCompare('compare')}
              options={[
                'This submission against the class',
                'Against students with the same gap',
                'Against top performers',
                'Against this student’s last set',
              ]}
            />
          </Field>
          <Field label="Criterion">
            <Select
              value={compare.criterion}
              onChange={setCompare('criterion')}
              options={[
                `All ${RUBRIC.length} criteria`,
                'Concept only',
                'Presentation only',
                'Completion only',
              ]}
            />
          </Field>
          <Field label="Cohort">
            <Select
              value={compare.cohort}
              onChange={setCompare('cohort')}
              options={[
                row?.className ?? 'Class VIII-A',
                'Whole year group',
                `All ${SUBMISSIONS_MARKED} submissions`,
              ]}
            />
          </Field>
          <Field label="Show">
            <Select
              value={compare.show}
              onChange={setCompare('show')}
              options={[`Top ${SUBMISSIONS.length} matches`, 'Top 15 matches', 'All matches']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'all_submissions'}
        onClose={onClose}
        title="All Submissions"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Submission</span>}
        dialogClassName="modal-dialog-centered modal-xl"
        footer={
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100">
            <span className="fs-13 text-muted">
              Showing <span className="fw-medium text-dark">{listed.length}</span> of{' '}
              <span className="fw-medium text-dark">{SUBMISSIONS_MARKED}</span> submissions ·{' '}
              {PENDING_REVIEWS} awaiting judgement
            </span>
            <ActionLink
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              onClick={() => onOpenDialog('export_evaluation')}
            >
              <i className="ti ti-file-export me-1" />
              Export queue
            </ActionLink>
          </div>
        }
      >
        <div className="row g-2 mb-3">
          <div className="col-lg-4 col-md-6">
            <select
              className="form-select lh-base"
              aria-label="Filter submissions"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              {['All submissions', 'Flagged for review', 'Released', 'Not submitted'].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-nowrap mb-0">
            <thead className="thead-light">
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Assignment</th>
                <th>Completion</th>
                <th>Grade</th>
                <th>Submission</th>
                <th>AI confidence</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {listed.map((entry) => {
                const entryGrade = gradeFor(entry);
                return (
                  <tr key={entry.id}>
                    <td>
                      <span className="d-inline-flex align-items-center gap-2">
                        <span className="avatar avatar-xs avatar-rounded flex-shrink-0">
                          <ImageWithBasePath src={entry.studentImage} alt={entry.student} />
                        </span>
                        <span className="fs-13 text-dark">{entry.student}</span>
                      </span>
                    </td>
                    <td>
                      <span className="fs-13 text-muted">{entry.className.replace('Class ', '')}</span>
                    </td>
                    <td>
                      <span className="fs-13 text-muted">{entry.assignment.split(' · ')[0]}</span>
                    </td>
                    <td>
                      <span className="fs-13 text-muted">{completionLabelOf(entry)}</span>
                    </td>
                    <td>
                      {entryGrade ? (
                        <span className={`hwk-tag ${entryGrade.seal}`}>{entryGrade.grade}</span>
                      ) : (
                        <span className="fs-13 text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <span className="fs-13 text-muted">{punctualityOf(entry)}</span>
                    </td>
                    <td>
                      {entry.confidence === null ? (
                        <span className="fs-13 text-muted">Not evaluated</span>
                      ) : (
                        <span className={`hwk-conf aix-p-${entry.confidence}`}>
                          <b>{entry.confidence}%</b>
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <ActionLink
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        onClick={() => {
                          onClose();
                          onOpenRow(entry);
                        }}
                      >
                        <i className="ti ti-eye me-1" />
                        Review
                      </ActionLink>
                    </td>
                  </tr>
                );
              })}
              {listed.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    No submission matches that filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
};

export default HomeworkModals;
