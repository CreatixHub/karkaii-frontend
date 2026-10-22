import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import DateField from '@components/ui/DateField';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { ActionLink } from '@components/workspace';
import type { Teacher } from '../data/teaching.data';
import {
  CLASSES,
  DEPARTMENTS,
  GAIN_WEEKS,
  LAST_RUN,
  OBSERVATION_ON,
  OVER_CEILING,
  PERIOD_CEILING,
  periodsOf,
  PLAN_REVIEW,
  SHARE_THE_STRUCTURE,
  TEACHERS,
  TEACHERS_REVIEWED,
  TRAINING_COMPLETION_PCT,
  TRAINING_START,
  reviewedLabelOf,
} from '../data/teaching.data';

export type TeacherModalId =
  | 'run_analysis'
  | 'teaching_summary'
  | 'coaching_plan'
  | 'assign_training'
  | 'compare_teachers'
  | 'export_report'
  | 'observation'
  | 'development_plan'
  | 'all_teachers';

export interface TeacherModalsProps {
  active: TeacherModalId | null;
  onClose: () => void;
  teacher: Teacher | null;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  onOpenTeacher: (teacher: Teacher) => void;
  onOpenDialog: (id: TeacherModalId) => void;
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

/** Every dialog opens by naming the teacher and what the last pass found. */
const Drafted = ({ teacher, note }: { teacher: Teacher | null; note: string }) => (
  <div className="tch-box mb-3">
    <div className="tch-box-head">
      <h6 className="fs-14 mb-0">
        {teacher ? `${teacher.name} · ${teacher.department}` : 'All teachers'}
      </h6>
      <span className="tch-pill is-ai">
        <i className="ti ti-sparkles" />
        {note}
      </span>
    </div>
  </div>
);

const Footer = ({
  icon,
  label,
  onClose,
}: {
  icon: string;
  label: string;
  onClose: () => void;
}) => (
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
  // Serialised so the effect below depends on the defaults' *content* rather
  // than on the object identity, which changes on every render.
  const initial = JSON.stringify(defaults);

  useEffect(() => {
    if (open) setValues(JSON.parse(initial) as T);
  }, [open, initial]);

  const set = (key: keyof T) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  return [values, set] as const;
};

const TeacherModals = ({
  active,
  onClose,
  teacher,
  onToast,
  onOpenTeacher,
  onOpenDialog,
}: TeacherModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const department = teacher?.department ?? 'the department';

  const [analysis, setAnalysis] = useForm(
    {
      scope: `All ${TEACHERS_REVIEWED} teachers`,
      period: 'This term',
      signals: 'All signals',
      floor: 'Report above 85%',
      onDone: 'Hold for review',
    },
    active === 'run_analysis',
  );

  const [summary, setSummary] = useForm(
    {
      audience: 'Head of department',
      length: 'One page',
      include: 'Findings and reasoning',
      framing: 'Coaching',
      opening: teacher
        ? `${teacher.name} holds the highest classroom engagement in the school, sustained across ${GAIN_WEEKS} weeks. The engine attributes this to her ${teacher.style.toLowerCase()} structure rather than to class composition.`
        : '',
    },
    active === 'teaching_summary',
  );

  const [plan, setPlan] = useForm(
    {
      type: 'Lead and share · recommended',
      focus: 'Spread the worked-example structure',
      duration: 'One term',
      owner: `Head of ${department}`,
      review: PLAN_REVIEW,
      slots: '2',
      plan: 'Week 1 prepare a twenty-minute department session. Week 2 deliver it. Week 3 observe two adopting teachers. Week 4 gather feedback and adjust the guidance.',
    },
    active === 'coaching_plan',
  );

  const [training, setTraining] = useForm(
    {
      programme: 'Mentoring skills · 2 days',
      cohort: 'This teacher',
      start: TRAINING_START,
      protected: 'Three per term',
      cover: 'Yes, automatically',
    },
    active === 'assign_training',
  );

  const [compare, setCompare] = useForm(
    {
      on: 'Teaching method',
      against: 'Same department',
      period: 'This term',
      show: `Top ${SHARE_THE_STRUCTURE} matches`,
    },
    active === 'compare_teachers',
  );

  const [exportForm, setExportForm] = useForm(
    {
      contents: 'Full productivity report',
      format: 'PDF',
      reasoning: 'Yes, with evidence',
      deliver: 'Download',
    },
    active === 'export_report',
  );

  const [observation, setObservation] = useForm(
    {
      date: OBSERVATION_ON,
      period: 'Period 3',
      className: CLASSES[0],
      observer: `Head of ${department}`,
      framework: 'Standard review framework',
      focus:
        'Watch how the worked-example structure is introduced at the start of the lesson, and how quickly students move from the example to independent work.',
    },
    active === 'observation',
  );

  const [development, setDevelopment] = useForm(
    {
      horizon: 'One term',
      track: 'Mentoring and leadership',
      include: 'Training, mentoring and milestones',
      cadence: 'Termly',
      roadmap: `Now senior teacher. This term mentor. Twelve months assessment lead. Twenty-four months head of ${department.toLowerCase()}, subject to a second full review cycle.`,
    },
    active === 'development_plan',
  );

  /* ---------------------------------------------------------------- *
   * All teachers                                                     *
   * ---------------------------------------------------------------- */

  const [dept, setDept] = useState('All departments');
  const [style, setStyle] = useState('All teaching styles');
  const [sort, setSort] = useState('Sort: Productivity');

  useEffect(() => {
    if (active === 'all_teachers') {
      setDept('All departments');
      setStyle('All teaching styles');
      setSort('Sort: Productivity');
    }
  }, [active]);

  const listed = TEACHERS.filter(
    (row) =>
      (dept === 'All departments' || row.department === dept) &&
      (style === 'All teaching styles' || row.style === style),
  ).sort((a, b) => {
    if (sort === 'Sort: Engagement') return b.engagement - a.engagement;
    if (sort === 'Sort: Workload') return periodsOf(b) - periodsOf(a);
    return b.score - a.score;
  });

  return (
    <>
      <Modal
        open={active === 'run_analysis'}
        onClose={onClose}
        title="Run AI Analysis"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Analysis</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit('Analysis queued. The roster refreshes when it finishes.')}
        footer={<Footer icon="ti ti-player-play" label="Run analysis" onClose={onClose} />}
      >
        <Drafted
          teacher={teacher}
          note={`Last pass reviewed ${TEACHERS_REVIEWED} teachers at ${LAST_RUN} today`}
        />
        <div className="row g-3">
          <Field label="Scope">
            <Select
              value={analysis.scope}
              onChange={setAnalysis('scope')}
              options={[
                `All ${TEACHERS_REVIEWED} teachers`,
                `${department} department`,
                'Teachers above the period ceiling',
                'This teacher only',
              ]}
            />
          </Field>
          <Field label="Period">
            <Select
              value={analysis.period}
              onChange={setAnalysis('period')}
              options={['This term', 'This academic year', 'Last 24 weeks']}
            />
          </Field>
          <Field label="Signals">
            <Select
              value={analysis.signals}
              onChange={setAnalysis('signals')}
              options={['All signals', 'Engagement and planning', 'Workload only', 'Assessment only']}
            />
          </Field>
          <Field label="Confidence floor">
            <Select
              value={analysis.floor}
              onChange={setAnalysis('floor')}
              options={['Report above 85%', 'Report above 90%', 'Report everything']}
            />
          </Field>
          <Field label="On completion" span="col-12">
            <Select
              value={analysis.onDone}
              onChange={setAnalysis('onDone')}
              options={['Hold for review', 'Draft coaching plans too', 'Notify heads of department']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'teaching_summary'}
        onClose={onClose}
        title="Generate Teaching Summary"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Analysis</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Summary drafted for the ${summary.audience.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-file-text" label="Generate summary" onClose={onClose} />}
      >
        <Drafted teacher={teacher} note="Written from the observation and lesson record" />
        <div className="row g-3">
          <Field label="Audience">
            <Select
              value={summary.audience}
              onChange={setSummary('audience')}
              options={['Head of department', 'Principal', 'The teacher', 'Governors']}
            />
          </Field>
          <Field label="Length">
            <Select
              value={summary.length}
              onChange={setSummary('length')}
              options={['One page', 'Half page', 'Full report']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={summary.include}
              onChange={setSummary('include')}
              options={['Findings and reasoning', 'Findings only', 'Findings and coaching plan']}
            />
          </Field>
          <Field label="Framing">
            <Select
              value={summary.framing}
              onChange={setSummary('framing')}
              options={['Coaching', 'Neutral record', 'Recognition']}
            />
          </Field>
          <Field label="Opening paragraph" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={summary.opening}
              onChange={(event) => setSummary('opening')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'coaching_plan'}
        onClose={onClose}
        title="Create Coaching Plan"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Coaching</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Coaching plan opened, reviewed ${plan.review}.`)}
        footer={<Footer icon="ti ti-route" label="Create plan" onClose={onClose} />}
      >
        <Drafted teacher={teacher} note="A lead-others plan rather than an improve-yourself plan" />
        <div className="row g-3">
          <Field label="Plan type">
            <Select
              value={plan.type}
              onChange={setPlan('type')}
              options={[
                'Lead and share · recommended',
                'Targeted improvement',
                'Workload relief',
                'Professional development',
              ]}
            />
          </Field>
          <Field label="Focus">
            <Select
              value={plan.focus}
              onChange={setPlan('focus')}
              options={[
                'Spread the worked-example structure',
                'Widen whole-class questioning',
                'Deepen written feedback',
                'Digital resources',
              ]}
            />
          </Field>
          <Field label="Duration">
            <Select
              value={plan.duration}
              onChange={setPlan('duration')}
              options={['One term', 'Half term', 'Full year']}
            />
          </Field>
          <Field label="Owner">
            <Select
              value={plan.owner}
              onChange={setPlan('owner')}
              options={[`Head of ${department}`, 'Deputy principal', 'Peer mentor']}
            />
          </Field>
          <Field label="Review date">
            <DateField value={plan.review} onChange={setPlan('review')} />
          </Field>
          <Field label="Observation slots">
            <input
              type="text"
              className="form-control"
              value={plan.slots}
              onChange={(event) => setPlan('slots')(event.target.value)}
            />
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
        open={active === 'assign_training'}
        onClose={onClose}
        title="Assign Training"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Coaching</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${training.programme.split(' · ')[0]} assigned, starting ${training.start}.`)}
        footer={<Footer icon="ti ti-school" label="Assign training" onClose={onClose} />}
      >
        <Drafted teacher={teacher} note="Completion is blocked by workload, not by willingness" />
        <div className="row g-3">
          <Field label="Programme">
            <Select
              value={training.programme}
              onChange={setTraining('programme')}
              options={[
                'Mentoring skills · 2 days',
                'Assessment design lead · half day',
                'Digital resources · 1 day',
                'Leadership foundation · 4 days',
              ]}
            />
          </Field>
          <Field label="Cohort">
            <Select
              value={training.cohort}
              onChange={setTraining('cohort')}
              options={[
                'This teacher',
                `The ${OVER_CEILING} above the period ceiling`,
                'Whole department',
                `All teachers below ${TRAINING_COMPLETION_PCT}% completion`,
              ]}
            />
          </Field>
          <Field label="Start date">
            <DateField value={training.start} onChange={setTraining('start')} />
          </Field>
          <Field label="Protected periods">
            <Select
              value={training.protected}
              onChange={setTraining('protected')}
              options={['Three per term', 'Two per term', 'None — own time']}
            />
          </Field>
          <Field label="Cover arranged" span="col-12">
            <Select
              value={training.cover}
              onChange={setTraining('cover')}
              options={['Yes, automatically', 'Yes, manually', 'Not required']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'compare_teachers'}
        onClose={onClose}
        title="Compare Teachers"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Insights</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit('Matched profiles opened for comparison.')}
        footer={<Footer icon="ti ti-git-compare" label="Compare" onClose={onClose} />}
      >
        <Drafted
          teacher={teacher}
          note={`${SHARE_THE_STRUCTURE} teachers share the worked-example structure`}
        />
        <div className="row g-3">
          <Field label="Compare on">
            <Select
              value={compare.on}
              onChange={setCompare('on')}
              options={['Teaching method', 'Engagement profile', 'Workload', 'Assessment design']}
            />
          </Field>
          <Field label="Against">
            <Select
              value={compare.against}
              onChange={setCompare('against')}
              options={['Same department', 'Same method', 'Whole school', 'Same year group']}
            />
          </Field>
          <Field label="Period">
            <Select
              value={compare.period}
              onChange={setCompare('period')}
              options={['This term', 'This year', 'Since method change']}
            />
          </Field>
          <Field label="Show">
            <Select
              value={compare.show}
              onChange={setCompare('show')}
              options={[
                `Top ${SHARE_THE_STRUCTURE} matches`,
                'Top 10 matches',
                `All ${TEACHERS_REVIEWED} teachers`,
              ]}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'export_report'}
        onClose={onClose}
        title="Export Productivity Report"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Analysis</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${exportForm.contents} exported as ${exportForm.format}.`)}
        footer={<Footer icon="ti ti-file-export" label="Export report" onClose={onClose} />}
      >
        <Drafted teacher={teacher} note="Exports carry the reasoning behind every finding" />
        <div className="row g-3">
          <Field label="Contents">
            <Select
              value={exportForm.contents}
              onChange={setExportForm('contents')}
              options={[
                'Full productivity report',
                'This teacher only',
                'Department summary',
                'Workload report',
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
          <Field label="Include reasoning">
            <Select
              value={exportForm.reasoning}
              onChange={setExportForm('reasoning')}
              options={['Yes, with evidence', 'Yes, summary only', 'No, findings only']}
            />
          </Field>
          <Field label="Deliver to">
            <Select
              value={exportForm.deliver}
              onChange={setExportForm('deliver')}
              options={['Download', 'Email to me', 'Email to leadership']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'observation'}
        onClose={onClose}
        title="Schedule Classroom Observation"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Coaching</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Observation booked for ${observation.date}, ${observation.period}.`)}
        footer={<Footer icon="ti ti-eye" label="Schedule observation" onClose={onClose} />}
      >
        <Drafted teacher={teacher} note="Second observation cycle is under way" />
        <div className="row g-3">
          <Field label="Date">
            <DateField value={observation.date} onChange={setObservation('date')} />
          </Field>
          <Field label="Period">
            <input
              type="text"
              className="form-control"
              value={observation.period}
              onChange={(event) => setObservation('period')(event.target.value)}
            />
          </Field>
          <Field label="Class">
            <Select
              value={observation.className}
              onChange={setObservation('className')}
              options={CLASSES}
            />
          </Field>
          <Field label="Observer">
            <Select
              value={observation.observer}
              onChange={setObservation('observer')}
              options={[
                `Head of ${department}`,
                'Deputy principal',
                'Peer teacher',
                'External reviewer',
              ]}
            />
          </Field>
          <Field label="Framework" span="col-12">
            <Select
              value={observation.framework}
              onChange={setObservation('framework')}
              options={[
                'Standard review framework',
                'Engagement focus',
                'Assessment focus',
                'Informal drop-in',
              ]}
            />
          </Field>
          <Field label="Focus for this observation" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={observation.focus}
              onChange={(event) => setObservation('focus')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'development_plan'}
        onClose={onClose}
        title="Generate Professional Development Plan"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Growth</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Development plan drafted over ${development.horizon.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-stairs-up" label="Generate plan" onClose={onClose} />}
      >
        <Drafted teacher={teacher} note="Meets every published promotion criterion" />
        <div className="row g-3">
          <Field label="Horizon">
            <Select
              value={development.horizon}
              onChange={setDevelopment('horizon')}
              options={['One term', 'One year', 'Two years']}
            />
          </Field>
          <Field label="Track">
            <Select
              value={development.track}
              onChange={setDevelopment('track')}
              options={[
                'Mentoring and leadership',
                'Assessment specialism',
                'Subject leadership',
                'Classroom practice',
              ]}
            />
          </Field>
          <Field label="Include">
            <Select
              value={development.include}
              onChange={setDevelopment('include')}
              options={['Training, mentoring and milestones', 'Training only', 'Milestones only']}
            />
          </Field>
          <Field label="Review cadence">
            <Select
              value={development.cadence}
              onChange={setDevelopment('cadence')}
              options={['Termly', 'Half-termly', 'Annually']}
            />
          </Field>
          <Field label="Roadmap" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={development.roadmap}
              onChange={(event) => setDevelopment('roadmap')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'all_teachers'}
        onClose={onClose}
        title="All Teachers"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Workspace</span>}
        dialogClassName="modal-dialog-centered modal-xl"
        footer={
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100">
            <span className="fs-13 text-muted">
              Showing <span className="fw-medium text-dark">{listed.length}</span> of{' '}
              <span className="fw-medium text-dark">{TEACHERS_REVIEWED}</span> teachers
            </span>
            <ActionLink
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              onClick={() => onOpenDialog('export_report')}
            >
              <i className="ti ti-file-export me-1" />
              Export all
            </ActionLink>
          </div>
        }
      >
        <div className="row g-2 mb-3">
          <div className="col-lg-4 col-md-6">
            <select
              className="form-select lh-base"
              aria-label="Department"
              value={dept}
              onChange={(event) => setDept(event.target.value)}
            >
              {['All departments', ...DEPARTMENTS].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-4 col-md-6">
            <select
              className="form-select lh-base"
              aria-label="Teaching style"
              value={style}
              onChange={(event) => setStyle(event.target.value)}
            >
              {['All teaching styles', ...TEACHERS.map((row) => row.style)].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-4 col-md-6">
            <select
              className="form-select lh-base"
              aria-label="Sort order"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              {['Sort: Productivity', 'Sort: Engagement', 'Sort: Workload'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-nowrap mb-0">
            <thead className="thead-light">
              <tr>
                <th>Teacher</th>
                <th>Department</th>
                <th>Subjects</th>
                <th>Teaching style</th>
                <th>Score</th>
                <th>Engagement</th>
                <th>AI confidence</th>
                <th>Last review</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {listed.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className="d-inline-flex align-items-center gap-2">
                      <span className="avatar avatar-xs avatar-rounded flex-shrink-0">
                        <ImageWithBasePath src={row.image} alt={row.name} />
                      </span>
                      <span className="fs-13 text-dark">{row.name}</span>
                    </span>
                  </td>
                  <td>
                    <span className="fs-13 text-muted">{row.department}</span>
                  </td>
                  <td>
                    <span className="fs-13 text-muted">{row.subjects}</span>
                  </td>
                  <td>
                    <span className="fs-13 text-muted">{row.style}</span>
                  </td>
                  <td>
                    <span className="fs-13 fw-medium text-dark">{row.score}</span>
                  </td>
                  <td>
                    <span className="fs-13 fw-medium text-dark">{row.engagement}</span>
                  </td>
                  <td>
                    <span className="tch-pill is-ai">{row.confidence}%</span>
                  </td>
                  <td>
                    <span className="fs-13 text-muted">{reviewedLabelOf(row)}</span>
                  </td>
                  <td className="text-end">
                    <ActionLink
                      className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                      onClick={() => {
                        onClose();
                        onOpenTeacher(row);
                      }}
                    >
                      <i className="ti ti-layout-sidebar-right-expand me-1" />
                      Open
                    </ActionLink>
                  </td>
                </tr>
              ))}
              {listed.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-muted py-4">
                    No teacher matches those filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <p className="fs-12 text-muted mb-0 mt-3">
          <i className="ti ti-info-circle me-1" />
          The period ceiling is {PERIOD_CEILING}. Sorting by workload orders on periods carried.
        </p>
      </Modal>
    </>
  );
};

export default TeacherModals;
