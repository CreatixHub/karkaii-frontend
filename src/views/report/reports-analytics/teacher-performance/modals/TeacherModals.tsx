import { useEffect, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Rating, Teacher } from '../data/teacherPerformance.data';
import {
  ACADEMIC_YEAR,
  careerAverageOf,
  departmentOptions,
  leaveTakenOf,
  MAX_PERIODS,
  PERIOD,
  periodOptions,
  presentOf,
  ratingOf,
  ratingOptions,
  ratingPill,
  ratingTint,
  REGISTER_TOTAL,
  reviewerOptions,
  statusOf,
  trainingStatusOf,
  WORKING_DAYS,
  workloadIndexOf,
} from '../data/teacherPerformance.data';

export type TeacherModalId =
  | 'generate'
  | 'compare'
  | 'evaluation'
  | 'remarks'
  | 'plan'
  | 'export'
  | 'print'
  | 'share'
  | 'template'
  | 'schedule'
  | 'history';

export interface TeacherModalsProps {
  active: TeacherModalId | null;
  onClose: () => void;
  row: Teacher | null;
  rows: Teacher[];
  selected: Teacher[];
  panelOpen: boolean;
  onClosePanel: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  onSaveEvaluation: (id: string, score: number) => void;
  onOpenPlan: (id: string, goals: string[], mentor: string) => void;
}

/** The six competencies an appraisal scores, as the template lists them. */
const COMPETENCIES = [
  'Subject Knowledge',
  'Classroom Delivery',
  'Student Engagement',
  'Assessment Practice',
  'Punctuality',
  'Team Contribution',
];

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
  value?: string;
  onChange?: (value: string) => void;
}) =>
  onChange ? (
    <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  ) : (
    <select className="form-select" defaultValue={options[0]}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );

const Switch = ({ label, on = false, id }: { label: string; on?: boolean; id: string }) => (
  <div className="form-check form-switch mb-2">
    <input className="form-check-input" type="checkbox" role="switch" id={id} defaultChecked={on} />
    <label className="form-check-label fs-13" htmlFor={id}>
      {label}
    </label>
  </div>
);

const Radios = ({ name, options }: { name: string; options: string[] }) => (
  <div className="custom-btn-group custom-btn-group-fill custom-btn-group-sm" role="group">
    {options.map((option, index) => (
      <span key={option}>
        <input type="radio" className="btn-check" name={name} id={`${name}-${index}`} defaultChecked={index === 0} />
        <label className="btn" htmlFor={`${name}-${index}`}>
          {option}
        </label>
      </span>
    ))}
  </div>
);

const Confidential = () => (
  <div className="alert alert-soft-warning fs-12 d-flex align-items-center gap-2 mb-0 mt-3">
    <i className="ti ti-lock" />
    Appraisal data is confidential. Share only with staff authorised to see it.
  </div>
);

const TeacherStrip = ({ row }: { row: Teacher }) => (
  <div className="d-flex align-items-center gap-3 border rounded p-3 mb-3">
    <span className="avatar avatar-lg rounded flex-shrink-0">
      <ImageWithBasePath src={row.image} alt={row.name} className="rounded" />
    </span>
    <div className="flex-fill">
      <h6 className="fs-15 mb-0">{row.name}</h6>
      <span className="fs-12 text-muted">
        {row.id} · {row.department} · {row.classes} classes
      </span>
    </div>
    <span className={`dt-pill ${ratingPill[ratingOf(row)]}`}>
      <span className="dt-pill-dot" />
      {ratingOf(row)}
    </span>
  </div>
);

const TeacherModals = ({
  active,
  onClose,
  row,
  rows,
  selected,
  panelOpen,
  onClosePanel,
  onToast,
  onSaveEvaluation,
  onOpenPlan,
}: TeacherModalsProps) => {
  const [scores, setScores] = useState<number[]>(COMPETENCIES.map(() => 4));
  const [firstId, setFirstId] = useState('');
  const [secondId, setSecondId] = useState('');
  const [goals, setGoals] = useState(['', '', '']);
  const [mentor, setMentor] = useState('');

  const detail = row ?? rows[0] ?? null;
  const pending = row ?? rows.find((item) => statusOf(item) === 'Pending') ?? rows[0] ?? null;
  const needsPlan =
    row ?? rows.find((item) => ratingOf(item) === 'Needs Improvement') ?? rows[0] ?? null;
  const pendingSignOffs = rows.filter((item) => statusOf(item) !== 'Completed').length;

  /* Compare opens on the strongest record against the weakest. */
  useEffect(() => {
    if (active !== 'compare' || rows.length === 0) return;
    const best = rows.reduce((top, item) => (item.score > top.score ? item : top));
    const worst = rows.reduce((low, item) => (item.score < low.score ? item : low));
    setFirstId((row ?? best).id);
    setSecondId((row && row.id !== worst.id ? worst : row === worst ? best : worst).id);
  }, [active, row, rows]);

  useEffect(() => {
    if (active === 'plan' && needsPlan) {
      setGoals(needsPlan.plan.goals.length === 3 ? needsPlan.plan.goals : ['', '', '']);
      setMentor(needsPlan.plan.mentor ?? '');
    }
    if (active === 'evaluation') setScores(COMPETENCIES.map(() => 4));
  }, [active, needsPlan]);

  /** The appraisal score is the mean of the six competency scores. */
  const evaluationScore = useMemo(
    () => Math.round((scores.reduce((total, value) => total + value, 0) / scores.length) * 10) / 10,
    [scores],
  );

  const evaluationRating = useMemo<Rating>(() => {
    if (evaluationScore >= 4.5) return 'Outstanding';
    if (evaluationScore >= 4.3) return 'Exceeds Expectations';
    if (evaluationScore >= 3.5) return 'Meets Expectations';
    if (evaluationScore >= 2) return 'Needs Improvement';
    return 'Unsatisfactory';
  }, [evaluationScore]);

  /* ------------------------------- Comparison ------------------------------- */

  const first = rows.find((item) => item.id === firstId) ?? null;
  const second = rows.find((item) => item.id === secondId) ?? null;

  const comparisonRows = useMemo(() => {
    if (!first || !second) return [];
    const metrics: { label: string; a: number; b: number; suffix?: string }[] = [
      { label: 'Performance score', a: first.score, b: second.score },
      { label: 'Student average', a: first.classAverage, b: second.classAverage, suffix: '%' },
      { label: 'Pass rate', a: first.passRate, b: second.passRate, suffix: '%' },
      { label: 'Attendance', a: first.attendancePct, b: second.attendancePct, suffix: '%' },
      { label: 'Periods a week', a: first.periods, b: second.periods },
      { label: 'Classes assigned', a: first.classes, b: second.classes },
      { label: 'Training hours', a: first.trainingHours, b: second.trainingHours },
    ];
    return metrics.map((metric) => ({
      ...metric,
      gap: Math.round(Math.abs(metric.a - metric.b) * 10) / 10,
    }));
  }, [first, second]);

  const widestGap = useMemo(() => {
    if (comparisonRows.length === 0) return null;
    /* Compared on the share of the larger figure, so scores and percentages sit
       on the same footing. */
    return comparisonRows.reduce((widest, metric) => {
      const share = metric.gap / Math.max(metric.a, metric.b, 1);
      const best = widest.gap / Math.max(widest.a, widest.b, 1);
      return share > best ? metric : widest;
    });
  }, [comparisonRows]);

  /* -------------------------------- Analytics -------------------------------- */

  const departments = useMemo(
    () =>
      [...new Set(rows.map((item) => item.department))].map((department) => {
        const group = rows.filter((item) => item.department === department);
        return {
          department,
          staff: group.length,
          score: Math.round((group.reduce((t, i) => t + i.score, 0) / group.length) * 100) / 100,
          studentAverage:
            Math.round((group.reduce((t, i) => t + i.classAverage, 0) / group.length) * 10) / 10,
        };
      }).sort((a, b) => b.score - a.score),
    [rows],
  );

  const ratingSplit = useMemo(
    () =>
      ratingOptions.map((rating) => {
        const count = rows.filter((item) => ratingOf(item) === rating).length;
        return {
          rating,
          count,
          share: rows.length === 0 ? 0 : Math.round((count / rows.length) * 1000) / 10,
        };
      }),
    [rows],
  );

  const footerButtons = (label: string, icon: string, onConfirm: () => void) => (
    <>
      <button type="button" className="btn btn-light me-2" onClick={onClose}>
        Cancel
      </button>
      <button type="button" className="btn btn-primary" onClick={onConfirm}>
        <i className={`${icon} me-1`} />
        {label}
      </button>
    </>
  );

  const confirm = (message: string) => () => {
    onClose();
    onToast(message);
  };

  return (
    <>
      {/* ---------------------------- Generate Report ---------------------------- */}
      <Modal
        open={active === 'generate'}
        onClose={onClose}
        title="Generate Performance Report"
        dialogClassName="modal-lg"
        footer={footerButtons('Generate Report', 'ti ti-player-play', confirm('Performance report generated'))}
      >
        <p className="text-muted fs-13 mb-3">
          Build a teacher performance report for the selected evaluation period
        </p>
        <div className="border rounded p-3 mb-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
            <div>
              <h6 className="fs-14 mb-0">{PERIOD}</h6>
              <span className="fs-12 text-muted">
                {rows.length} teachers · {rows.reduce((total, item) => total + item.classes, 0)} classes
                handled
              </span>
            </div>
            <span className="badge badge-soft-warning">
              <i className="ti ti-clock me-1" />
              {pendingSignOffs} sign offs pending
            </span>
          </div>
          <div className="row g-2 fs-13">
            <div className="col-sm-6">
              <span className="text-muted">Average Score</span>{' '}
              <span className="fw-medium">
                {rows.length === 0
                  ? '—'
                  : Math.round((rows.reduce((t, i) => t + i.score, 0) / rows.length) * 100) / 100}{' '}
                of 5.0
              </span>
            </div>
            <div className="col-sm-6">
              <span className="text-muted">Needs Improvement</span>{' '}
              <span className="fw-medium">
                {rows.filter((item) => ratingOf(item) === 'Needs Improvement').length} teachers ·{' '}
                {rows.filter((item) => item.plan.state === 'Active').length} on a plan
              </span>
            </div>
          </div>
        </div>
        <div className="row g-3">
          <Field label="Report Name" span="col-12">
            <input type="text" className="form-control" defaultValue="Teacher Performance Report" />
          </Field>
          <Field label="Report Type">
            <Select
              options={[
                'Performance Summary',
                'Teaching Effectiveness',
                'Attendance Report',
                'Workload Report',
                'Professional Development',
                'Improvement Plan Tracker',
              ]}
            />
          </Field>
          <Field label="Academic Year">
            <Select options={[ACADEMIC_YEAR, '2025-2026']} />
          </Field>
          <Field label="Evaluation Period">
            <Select options={periodOptions} />
          </Field>
          <Field label="Department">
            <Select options={['All departments', ...departmentOptions]} />
          </Field>
        </div>
      </Modal>

      {/* ---------------------------- Compare Teachers --------------------------- */}
      <Modal
        open={active === 'compare'}
        onClose={onClose}
        title="Compare Teachers"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={confirm('Comparison exported')}>
              <i className="ti ti-file-export me-1" />
              Export Comparison
            </button>
          </>
        }
      >
        <div className="row g-3 mb-3">
          <Field label="Teacher A">
            <Select
              options={rows.map((item) => `${item.name} · ${item.subject}`)}
              value={first ? `${first.name} · ${first.subject}` : ''}
              onChange={(value) => {
                const match = rows.find((item) => `${item.name} · ${item.subject}` === value);
                if (match) setFirstId(match.id);
              }}
            />
          </Field>
          <Field label="Teacher B">
            <Select
              options={rows.map((item) => `${item.name} · ${item.subject}`)}
              value={second ? `${second.name} · ${second.subject}` : ''}
              onChange={(value) => {
                const match = rows.find((item) => `${item.name} · ${item.subject}` === value);
                if (match) setSecondId(match.id);
              }}
            />
          </Field>
          <Field label="Evaluation Period" span="col-12">
            <Select options={periodOptions} />
          </Field>
        </div>

        {first && second ? (
          <>
            <div className="table-responsive border rounded mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th className="text-center">{first.name}</th>
                    <th className="text-center">{second.name}</th>
                    <th className="text-center">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((metric) => (
                    <tr key={metric.label}>
                      <td className="fs-13">{metric.label}</td>
                      <td className="text-center fs-13">
                        {metric.a}
                        {metric.suffix ?? ''}
                      </td>
                      <td className="text-center fs-13">
                        {metric.b}
                        {metric.suffix ?? ''}
                      </td>
                      <td className="text-center">
                        <span className="badge badge-soft-secondary">{metric.gap}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {widestGap ? (
              <p className="fs-12 text-muted mb-0">
                The widest gap is {widestGap.label.toLowerCase()}, at {widestGap.gap}
                {widestGap.suffix ?? ''}.
              </p>
            ) : null}
          </>
        ) : null}
      </Modal>

      {/* ----------------------------- Add Evaluation ---------------------------- */}
      <Modal
        open={active === 'evaluation'}
        onClose={onClose}
        title="Add Evaluation"
        dialogClassName="modal-lg"
        footer={footerButtons('Save Evaluation', 'ti ti-clipboard-check', () => {
          if (!pending) return;
          onSaveEvaluation(pending.id, evaluationScore);
          onClose();
          onToast(`${pending.name} evaluated at ${evaluationScore} of 5.0`);
        })}
      >
        <p className="text-muted fs-13 mb-3">Record a performance evaluation for the selected teacher</p>
        {pending ? <TeacherStrip row={pending} /> : null}

        <div className="row g-3 mb-3">
          <Field label="Evaluation Period">
            <Select options={periodOptions} />
          </Field>
          <Field label="Evaluation Date">
            <DateField value="31-07-2026" onChange={() => undefined} format="d-m-Y" id="tp-eval-date" />
          </Field>
        </div>

        <h6 className="fs-14 mb-2">Scores out of 5</h6>
        <div className="row g-3 mb-3">
          {COMPETENCIES.map((competency, index) => (
            <div className="col-md-6" key={competency}>
              <div className="d-flex align-items-center justify-content-between mb-1">
                <label className="form-label mb-0 fs-13" htmlFor={`tp-score-${index}`}>
                  {competency}
                </label>
                <span className="fs-13 fw-semibold">{scores[index].toFixed(1)}</span>
              </div>
              <input
                type="range"
                className="form-range"
                id={`tp-score-${index}`}
                min={1}
                max={5}
                step={0.1}
                value={scores[index]}
                onChange={(event) =>
                  setScores((current) =>
                    current.map((value, position) =>
                      position === index ? Number(event.target.value) : value,
                    ),
                  )
                }
              />
            </div>
          ))}
        </div>

        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 border rounded p-3 mb-3">
          <div>
            <span className="fs-12 text-muted d-block">Overall score</span>
            <h5 className="fs-18 mb-0">{evaluationScore.toFixed(1)} of 5.0</h5>
          </div>
          <span className={`dt-pill ${ratingPill[evaluationRating]}`}>
            <span className="dt-pill-dot" />
            {evaluationRating}
          </span>
        </div>

        <div className="row g-3">
          <Field label="Evaluated By" span="col-12">
            <Select options={reviewerOptions} />
          </Field>
          <Field label="Strengths" span="col-12">
            <textarea className="form-control" rows={2} placeholder="What went well this cycle." />
          </Field>
          <Field label="Areas To Develop" span="col-12">
            <textarea className="form-control" rows={2} placeholder="What the next cycle should address." />
          </Field>
        </div>
      </Modal>

      {/* --------------------------- Principal Remarks --------------------------- */}
      <Modal
        open={active === 'remarks'}
        onClose={onClose}
        title="Add Principal Remarks"
        footer={footerButtons('Save Remarks', 'ti ti-message-plus', confirm('Remarks saved'))}
      >
        {detail ? (
          <>
            <TeacherStrip row={detail} />
            <div className="row g-2 fs-13 mb-3">
              <div className="col-sm-6">
                <span className="text-muted">Score</span>{' '}
                <span className="fw-medium">{detail.score.toFixed(1)} of 5.0</span>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Status</span>{' '}
                <span className="fw-medium">{statusOf(detail)}</span>
              </div>
            </div>
          </>
        ) : null}
        <div className="row g-3">
          <Field label="Remark Type">
            <Select options={['Appraisal remark', 'Commendation', 'Counselling note', 'Warning']} />
          </Field>
          <Field label="Recorded By">
            <Select options={reviewerOptions} />
          </Field>
          <Field label="Remarks" span="col-12">
            <textarea className="form-control" rows={3} defaultValue={detail?.remark ?? ''} />
          </Field>
          <Field label="Recommendation" span="col-12">
            <Select
              options={[
                'Continue as is',
                'Recommended for promotion',
                'Recommended for increment',
                'Place on improvement plan',
              ]}
            />
          </Field>
          <div className="col-12">
            <Switch id="tp-rm-share" label="Share the remark with the teacher" on />
            <Switch id="tp-rm-record" label="Attach to the permanent service record" on />
          </div>
        </div>
      </Modal>

      {/* ------------------------- Create Improvement Plan ----------------------- */}
      <Modal
        open={active === 'plan'}
        onClose={onClose}
        title="Create Improvement Plan"
        dialogClassName="modal-lg"
        footer={footerButtons('Save Plan', 'ti ti-target-arrow', () => {
          if (!needsPlan) return;
          const filled = goals.filter((goal) => goal.trim());
          if (filled.length === 0) {
            onToast('Set at least one measurable goal', 'warning');
            return;
          }
          onOpenPlan(needsPlan.id, filled, mentor || 'Dr. Anita Krishnan');
          onClose();
          onToast(`Improvement plan opened for ${needsPlan.name}`);
        })}
      >
        <p className="text-muted fs-13 mb-3">Set measurable goals, a mentor and review points</p>
        {needsPlan ? (
          <>
            <TeacherStrip row={needsPlan} />
            <div className="row g-2 fs-13 mb-3">
              <div className="col-sm-4">
                <span className="text-muted">Score</span>{' '}
                <span className="fw-medium">{needsPlan.score.toFixed(1)} of 5.0</span>
              </div>
              <div className="col-sm-4">
                <span className="text-muted">Student Average</span>{' '}
                <span className="fw-medium">{needsPlan.classAverage}%</span>
              </div>
              <div className="col-sm-4">
                <span className="text-muted">Attendance</span>{' '}
                <span className="fw-medium">{needsPlan.attendancePct}%</span>
              </div>
            </div>
          </>
        ) : null}
        <div className="row g-3">
          <Field label="Plan Type">
            <Select options={['Formal improvement plan', 'Development plan', 'Probation support plan']} />
          </Field>
          <Field label="Mentor">
            <Select
              options={rows
                .filter((item) => ratingOf(item) === 'Outstanding')
                .map((item) => `${item.name} · ${item.department}`)}
              value={mentor}
              onChange={setMentor}
            />
          </Field>
          <Field label="Start Date">
            <DateField value="01-08-2026" onChange={() => undefined} format="d-m-Y" id="tp-plan-start" />
          </Field>
          <Field label="End Date">
            <DateField value="30-11-2026" onChange={() => undefined} format="d-m-Y" id="tp-plan-end" />
          </Field>
          {goals.map((goal, index) => (
            <Field label={`Goal ${index + 1}`} span="col-12" key={`goal-${index}`}>
              <input
                type="text"
                className="form-control"
                value={goal}
                onChange={(event) =>
                  setGoals((current) =>
                    current.map((value, position) => (position === index ? event.target.value : value)),
                  )
                }
                placeholder={
                  index === 0
                    ? 'Class average to 78%'
                    : index === 1
                      ? 'Observation score to 3.8'
                      : 'Complete 3 training modules'
                }
              />
            </Field>
          ))}
          <Field label="Review Frequency">
            <Select options={['Fortnightly', 'Monthly', 'Every term']} />
          </Field>
          <Field label="Reviewed By">
            <Select options={reviewerOptions} />
          </Field>
          <Field label="Support Provided" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue="Weekly co-planning with the mentor, two peer observations a month and a fortnightly progress note."
            />
          </Field>
        </div>
      </Modal>

      {/* ------------------------------ Export Report ---------------------------- */}
      <Modal
        open={active === 'export'}
        onClose={onClose}
        title="Export Report"
        footer={footerButtons('Export', 'ti ti-file-export', confirm(`${rows.length} appraisals exported`))}
      >
        <div className="row g-3">
          <Field label="Format" span="col-12">
            <Radios name="tp-format" options={['PDF', 'Excel', 'CSV']} />
          </Field>
          <div className="col-12">
            <ul className="list-unstyled fs-13 border rounded p-3 mb-0">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Report</span>
                <span className="fw-medium">Teacher Performance Report</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Period</span>
                <span className="fw-medium">{PERIOD}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Teachers</span>
                <span className="fw-medium">
                  {selected.length} selected of {REGISTER_TOTAL}
                </span>
              </li>
            </ul>
          </div>
          <Field label="Rows To Export">
            <Select
              options={['Selected teachers only', 'Current page', 'All filtered teachers', 'All teachers']}
            />
          </Field>
          <Field label="Columns">
            <Select options={['Visible columns', 'All columns', 'Scores only']} />
          </Field>
          <Field label="Page Size" span="col-md-4">
            <Select options={['A4', 'Letter', 'Legal']} />
          </Field>
          <Field label="Orientation" span="col-md-4">
            <Select options={['Landscape', 'Portrait']} />
          </Field>
          <Field label="File Name" span="col-md-4">
            <input type="text" className="form-control" defaultValue="teacher-performance-term-1" />
          </Field>
          <div className="col-12">
            <Switch id="tp-ex-strip" label="Include the performance summary strip" on />
            <Switch id="tp-ex-remarks" label="Include principal remarks and improvement plans" />
            <Switch id="tp-ex-head" label="Print on the school letterhead" on />
          </div>
        </div>
        <Confidential />
      </Modal>

      {/* ------------------------------ Print Report ----------------------------- */}
      <Modal
        open={active === 'print'}
        onClose={onClose}
        title="Print Report"
        footer={footerButtons('Print', 'ti ti-printer', () => {
          onClose();
          window.print();
        })}
      >
        <ul className="list-unstyled fs-13 border rounded p-3 mb-3">
          {[
            { label: 'Document', value: 'Teacher Performance Report' },
            { label: 'Period', value: PERIOD },
            { label: 'Estimated Pages', value: `${Math.max(1, Math.ceil(rows.length / 2))} pages` },
          ].map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
              <span className="text-muted">{item.label}</span>
              <span className="fw-medium">{item.value}</span>
            </li>
          ))}
        </ul>
        <div className="row g-3">
          <Field label="Print Range" span="col-12">
            <Radios name="tp-range" options={['Selected teachers only', 'Current page', 'All filtered teachers']} />
          </Field>
          <Field label="Layout" span="col-12">
            <Select options={['Summary table', 'One appraisal per page', 'Department scorecard']} />
          </Field>
          <Field label="Page Size" span="col-md-4">
            <Select options={['A4', 'Letter', 'Legal']} />
          </Field>
          <Field label="Orientation" span="col-md-4">
            <Select options={['Landscape', 'Portrait']} />
          </Field>
          <Field label="Copies" span="col-md-4">
            <input type="number" className="form-control" defaultValue={1} min={1} />
          </Field>
          <Field label="Printer" span="col-12">
            <Select options={['Principal office · HP LaserJet', 'Staff room · Canon', 'Save as PDF']} />
          </Field>
          <div className="col-12">
            <Switch id="tp-pr-head" label="Print the school letterhead on every page" on />
            <Switch id="tp-pr-sign" label="Add signature lines for the teacher and the principal" on />
            <Switch id="tp-pr-conf" label="Stamp each page as confidential" on />
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Share Report ----------------------------- */}
      <Modal
        open={active === 'share'}
        onClose={onClose}
        title="Share Report"
        footer={footerButtons('Share', 'ti ti-share', confirm('Report shared'))}
      >
        <div className="row g-3">
          <Field label="Share With" span="col-12">
            <Select
              options={[
                'School Management Committee',
                'HR Department',
                'Department heads',
                'The teacher',
                'Trustee board',
              ]}
            />
          </Field>
          <Field label="Method">
            <Select options={['Email attachment', 'Secure link', 'Internal notice board']} />
          </Field>
          <Field label="Access Expires">
            <Select options={['7 days', '14 days', '30 days', 'No expiry']} />
          </Field>
          <Field label="Message" span="col-12">
            <textarea
              className="form-control"
              rows={3}
              defaultValue={`Term 1 teacher performance report attached. Sign offs for ${pendingSignOffs} teachers are still pending.`}
            />
          </Field>
          <div className="col-12">
            <Switch id="tp-sh-pass" label="Protect the file with a password" on />
            <Switch id="tp-sh-remarks" label="Include principal remarks in the shared copy" />
            <Switch id="tp-sh-log" label="Log this share in the audit history" on />
          </div>
        </div>
        <Confidential />
      </Modal>

      {/* --------------------------- Save Report Template ------------------------ */}
      <Modal
        open={active === 'template'}
        onClose={onClose}
        title="Save Report Template"
        footer={footerButtons('Save Template', 'ti ti-bookmark-plus', confirm('Template saved'))}
      >
        <div className="border rounded p-3 mb-3">
          <span className="fs-12 text-muted d-block mb-2">Current setup</span>
          <div className="d-flex flex-wrap gap-1">
            {['Performance', PERIOD, 'All departments', 'All ratings', `${rows.length} teachers`].map((chip) => (
              <span className="badge badge-soft-secondary" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="row g-3">
          <Field label="Template Name" span="col-12">
            <input type="text" className="form-control" defaultValue="End of term appraisal view" />
          </Field>
          <Field label="Visibility">
            <Select
              options={[
                'Only me',
                'Principal and Vice Principal',
                'Department heads',
                'Everyone with report access',
              ]}
            />
          </Field>
          <Field label="Category">
            <Select options={['Appraisal', 'Attendance', 'Workload', 'Development']} />
          </Field>
          <Field label="Description" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue="Standard end of term appraisal view with scores, attendance and evaluation status."
            />
          </Field>
          <div className="col-12">
            <Switch id="tp-tpl-filters" label="Save the current filters" on />
            <Switch id="tp-tpl-cols" label="Save the column layout and sort order" on />
            <Switch id="tp-tpl-default" label="Make this my default view" />
          </div>
        </div>
      </Modal>

      {/* -------------------------- Schedule Performance Review ------------------ */}
      <Modal
        open={active === 'schedule'}
        onClose={onClose}
        title="Schedule Performance Review"
        footer={footerButtons('Schedule Review', 'ti ti-calendar-plus', confirm('Review scheduled'))}
      >
        <ul className="list-unstyled fs-13 border rounded p-3 mb-3">
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Teachers Selected</span>
            <span className="fw-medium">
              {selected.length} of {REGISTER_TOTAL}
            </span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Sign Offs Pending</span>
            <span className="fw-medium">{pendingSignOffs} in this report</span>
          </li>
        </ul>
        <div className="row g-3">
          <Field label="Review Type" span="col-12">
            <Select
              options={[
                'Term 1 appraisal meeting',
                'Improvement plan review',
                'Probation review',
                'Classroom observation',
              ]}
            />
          </Field>
          <Field label="Reviewer">
            <Select options={reviewerOptions} />
          </Field>
          <Field label="Date">
            <DateField value="05-08-2026" onChange={() => undefined} format="d-m-Y" id="tp-review-date" />
          </Field>
          <Field label="Time">
            <input type="text" className="form-control" defaultValue="10:30 AM" />
          </Field>
          <Field label="Duration">
            <Select options={['30 minutes', '45 minutes', '1 hour']} />
          </Field>
          <Field label="Venue" span="col-12">
            <Select options={['Principal office', 'Conference room', 'Staff room', 'Online meeting']} />
          </Field>
          <Field label="Agenda" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue="Term 1 scores, student results, workload rebalancing and development goals for Term 2."
            />
          </Field>
          <div className="col-12">
            <Switch id="tp-sc-invite" label="Send a calendar invite to each teacher" on />
            <Switch id="tp-sc-pack" label="Attach the individual appraisal pack" on />
            <Switch id="tp-sc-remind" label="Remind everyone a day before" on />
          </div>
        </div>
      </Modal>

      {/* --------------------------- Performance History ------------------------- */}
      <Modal
        open={active === 'history' && detail !== null}
        onClose={onClose}
        title={detail?.name ?? 'History'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={confirm('History exported')}>
              <i className="ti ti-file-export me-1" />
              Export
            </button>
          </>
        }
      >
        {detail ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {detail.id} · {detail.department} · {detail.subject} · {detail.experienceHere} years here
            </p>
            <div className="row g-2 text-center mb-3">
              {[
                { label: 'Current Score', value: detail.score.toFixed(1) },
                { label: 'Career Average', value: `${careerAverageOf(detail) ?? '—'}` },
                { label: 'Evaluations', value: `${detail.history.filter((e) => e.score !== null).length}` },
                { label: 'Awards', value: `${detail.awards.length}` },
              ].map((item) => (
                <div className="col-6 col-md-3" key={item.label}>
                  <div className="border rounded py-2">
                    <h6 className="fs-16 mb-0">{item.value}</h6>
                    <span className="fs-12 text-muted">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <h6 className="fs-14 mb-2">Evaluation history</h6>
            <div className="table-responsive border rounded mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th className="text-center">Score</th>
                    <th>Rating</th>
                    <th className="text-center">Student Avg</th>
                    <th className="text-center">Attendance</th>
                    <th>Reviewer</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.history.map((entry) => (
                    <tr key={entry.period}>
                      <td className="fs-13">{entry.period}</td>
                      <td className="text-center fs-13">{entry.score === null ? '—' : entry.score.toFixed(1)}</td>
                      <td>
                        <span className="badge badge-soft-secondary">{entry.rating}</span>
                      </td>
                      <td className="text-center fs-13">
                        {entry.studentAverage === undefined ? '—' : `${entry.studentAverage}%`}
                      </td>
                      <td className="text-center fs-13">
                        {entry.attendance === undefined ? '—' : `${entry.attendance}%`}
                      </td>
                      <td className="fs-12 text-muted">{entry.reviewer ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h6 className="fs-14 mb-2">Career milestones</h6>
            <ul className="list-unstyled mb-0">
              {detail.awards.map((award) => (
                <li className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={award.title}>
                  <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                    <i className="ti ti-award" />
                  </span>
                  <div>
                    <h6 className="fs-13 mb-0 fw-medium">{award.title}</h6>
                    <span className="fs-12 text-muted">{award.detail}</span>
                  </div>
                </li>
              ))}
              {detail.awards.length === 0 ? (
                <li className="fs-13 text-muted">No awards on record.</li>
              ) : null}
            </ul>
          </>
        ) : null}
      </Modal>

      {/* ------------------------ Performance Analysis panel --------------------- */}
      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title="Performance Analysis"
        className="offcanvas-lg"
        titleAccessory={
          <span className="fs-12 text-muted">
            {PERIOD} · {ACADEMIC_YEAR} · {rows.length} teachers
          </span>
        }
      >
        <h6 className="fs-14 mb-2">Performance Overview</h6>
        <ul className="list-unstyled fs-13 mb-4">
          {[
            {
              label: 'Average Score',
              value:
                rows.length === 0
                  ? '—'
                  : `${Math.round((rows.reduce((t, i) => t + i.score, 0) / rows.length) * 100) / 100} of 5.0`,
            },
            {
              label: 'Reviewed',
              value: `${rows.filter((item) => statusOf(item) === 'Completed').length} of ${rows.length}`,
            },
            { label: 'Pending', value: `${rows.filter((item) => statusOf(item) === 'Pending').length}` },
            {
              label: 'On A Plan',
              value: `${rows.filter((item) => item.plan.state === 'Active').length}`,
            },
            {
              label: 'Average Attendance',
              value:
                rows.length === 0
                  ? '—'
                  : `${Math.round((rows.reduce((t, i) => t + i.attendancePct, 0) / rows.length) * 10) / 10}%`,
            },
          ].map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
              <span className="text-muted">{item.label}</span>
              <span className="fw-medium">{item.value}</span>
            </li>
          ))}
        </ul>

        <h6 className="fs-14 mb-2">Rating Split</h6>
        <ul className="list-unstyled mb-4">
          {ratingSplit
            .filter((item) => item.count > 0)
            .map((item) => (
              <li className="mb-3" key={item.rating}>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fs-13">{item.rating}</span>
                  <span className="fs-12 text-muted">
                    {item.count} · {item.share}%
                  </span>
                </div>
                <div className={`meter meter-${ratingTint[item.rating]}`}>
                  <span style={{ width: `${item.share}%` }} />
                </div>
              </li>
            ))}
        </ul>

        <h6 className="fs-14 mb-2">Department Comparison</h6>
        <div className="table-responsive border rounded mb-4">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Department</th>
                <th className="text-center">Staff</th>
                <th className="text-center">Avg Score</th>
                <th className="text-center">Student Avg</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((item) => (
                <tr key={item.department}>
                  <td className="fs-13">{item.department}</td>
                  <td className="text-center fs-13">{item.staff}</td>
                  <td className="text-center fs-13">{item.score}</td>
                  <td className="text-center fs-13">{item.studentAverage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {detail ? (
          <>
            <h6 className="fs-14 mb-2">This Teacher</h6>
            <ul className="list-unstyled fs-13 mb-0">
              {[
                { label: 'Score', value: `${detail.score.toFixed(1)} of 5.0` },
                { label: 'Rating', value: ratingOf(detail) },
                { label: 'Workload', value: `${detail.periods} of ${MAX_PERIODS} · ${workloadIndexOf(detail)}` },
                {
                  label: 'Attendance',
                  value: `${detail.attendancePct}% · ${presentOf(detail)} of ${WORKING_DAYS} days`,
                },
                { label: 'Leave Taken', value: `${leaveTakenOf(detail)} days` },
                { label: 'Development', value: trainingStatusOf(detail) },
              ].map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Offcanvas>
    </>
  );
};

export default TeacherModals;
