import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { PlanState, StudentPerformance } from '../data/performance.data';
import {
  ACADEMIC_YEAR,
  atPassMarkOf,
  attendanceBandOf,
  attendancePctOf,
  absentOf,
  bandTint,
  bestPaperOf,
  breakdownOf,
  classLabelOf,
  EXAM,
  EXAM_REF,
  gradeTint,
  growthOf,
  isCompleteOf,
  levelOf,
  levelPill,
  maximumOf,
  movementOf,
  obtainedOf,
  overallGradeOf,
  papersOf,
  periodsLostOf,
  previousScoreOf,
  PREVIOUS_EXAM,
  scoreOf,
  subjectGradeOf,
  teacherOptions,
  trendOf,
  trendTint,
  weakestPaperOf,
  WORKING_DAYS,
} from '../data/performance.data';

export type PerformanceModalId =
  | 'view'
  | 'compare'
  | 'remarks'
  | 'plan'
  | 'reportcard'
  | 'share';

export interface PerformanceModalsProps {
  active: PerformanceModalId | null;
  onClose: () => void;
  row: StudentPerformance | null;
  rows: StudentPerformance[];
  registerTotal: number;
  panelOpen: boolean;
  onClosePanel: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  onAddRemark: (id: string, author: string, role: string, body: string) => void;
  onSetPlan: (id: string, state: PlanState, target: string) => void;
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

const StudentStrip = ({ row }: { row: StudentPerformance }) => (
  <div className="d-flex align-items-center gap-3 border rounded p-3 mb-3">
    <span className="avatar avatar-lg rounded flex-shrink-0">
      <ImageWithBasePath src={row.image} alt={row.name} className="rounded" />
    </span>
    <div className="flex-fill">
      <h6 className="fs-15 mb-0">{row.name}</h6>
      <span className="fs-12 text-muted">
        {row.id} · {classLabelOf(row)} · Roll {row.roll}
      </span>
    </div>
    <span className={`dt-pill ${levelPill[levelOf(row)]}`}>
      <span className="dt-pill-dot" />
      {levelOf(row)}
    </span>
  </div>
);

const PerformanceModals = ({
  active,
  onClose,
  row,
  rows,
  panelOpen,
  onClosePanel,
  onToast,
  onAddRemark,
  onSetPlan,
}: PerformanceModalsProps) => {
  const [remarkAuthor, setRemarkAuthor] = useState(teacherOptions[3]);
  const [remarkArea, setRemarkArea] = useState('Class Teacher');
  const [remarkBody, setRemarkBody] = useState('');
  const [planState, setPlanState] = useState<PlanState>('Active');
  const [planTarget, setPlanTarget] = useState('');

  const detail = row ?? rows[0] ?? null;
  const withheld = rows.find((item) => !isCompleteOf(item));
  const planCandidate =
    row ?? rows.find((item) => item.plan.state === 'Active') ?? rows.find((item) => levelOf(item) === 'Needs Improvement') ?? rows[0] ?? null;

  /* The plan form opens on whatever the record already carries. */
  useEffect(() => {
    if (active === 'plan' && planCandidate) {
      setPlanState(planCandidate.plan.state === 'Not required' ? 'Proposed' : planCandidate.plan.state);
      setPlanTarget(planCandidate.plan.target ?? '');
    }
    if (active === 'remarks') setRemarkBody('');
  }, [active, planCandidate]);

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

  const movement = detail ? movementOf(detail) : [];
  const improvedPapers = movement.filter((item) => item.change > 0);
  const smallestGain = improvedPapers[improvedPapers.length - 1];

  return (
    <>
      {/* ---------------------------- View Performance --------------------------- */}
      <Modal
        open={active === 'view' && detail !== null}
        onClose={onClose}
        title={detail?.name ?? 'Performance'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={confirm('Performance exported')}>
              <i className="ti ti-file-export me-1" />
              Export
            </button>
          </>
        }
      >
        {detail ? (
          <>
            <StudentStrip row={detail} />

            <div className="row g-2 text-center mb-3">
              {[
                { label: 'Overall Score', value: `${scoreOf(detail)}%` },
                {
                  label: 'Grade',
                  value: overallGradeOf(detail)
                    ? `${overallGradeOf(detail)!.grade} · ${overallGradeOf(detail)!.remark}`
                    : 'Withheld',
                },
                {
                  label: 'Class Rank',
                  value: detail.rank === null ? 'Withheld' : `${detail.rank} of ${detail.sectionStrength}`,
                },
                { label: 'Attendance', value: `${attendancePctOf(detail)}%` },
              ].map((item) => (
                <div className="col-6 col-md-3" key={item.label}>
                  <div className="border rounded py-2">
                    <h6 className="fs-15 mb-0">{item.value}</h6>
                    <span className="fs-12 text-muted">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <h6 className="fs-14 mb-2">Subject-wise Performance</h6>
            <div className="table-responsive border rounded mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th className="text-center">Marks</th>
                    <th className="text-center">Max</th>
                    <th className="text-center">Grade</th>
                    <th className="text-center">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.subjects.map((subject) => {
                    const grade = subjectGradeOf(subject);
                    return (
                      <tr key={subject.subject}>
                        <td className="fs-13">{subject.subject}</td>
                        <td className="text-center fs-13">{subject.marks ?? 'Not entered'}</td>
                        <td className="text-center fs-13">{subject.marks === null ? '—' : 100}</td>
                        <td className="text-center">
                          {grade ? (
                            <span className={`badge badge-soft-${gradeTint(grade)}`}>{grade}</span>
                          ) : (
                            <span className="text-muted fs-13">—</span>
                          )}
                        </td>
                        <td className="text-center fs-13">
                          {subject.marks === null ? '—' : `${subject.marks.toFixed(1)}%`}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="fw-semibold">
                    <td className="fs-13">Total</td>
                    <td className="text-center fs-13">{obtainedOf(detail)}</td>
                    <td className="text-center fs-13">{maximumOf(detail)}</td>
                    <td className="text-center">
                      {overallGradeOf(detail) ? (
                        <span className={`badge badge-soft-${gradeTint(overallGradeOf(detail)!.grade)}`}>
                          {overallGradeOf(detail)!.grade}
                        </span>
                      ) : (
                        <span className="text-muted fs-13">Withheld</span>
                      )}
                    </td>
                    <td className="text-center fs-13">{scoreOf(detail)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fs-14 mb-2">Growth Since {PREVIOUS_EXAM}</h6>
                <ul className="list-unstyled fs-13 mb-0">
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">{PREVIOUS_EXAM}</span>
                    <span className="fw-medium">
                      {previousScoreOf(detail)}%
                      {detail.previousRank !== null ? ` · rank ${detail.previousRank}` : ''}
                    </span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">{EXAM}</span>
                    <span className="fw-medium">
                      {scoreOf(detail)}%{detail.rank !== null ? ` · rank ${detail.rank}` : ''}
                    </span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Change</span>
                    <span className="fw-medium">
                      {growthOf(detail) > 0 ? '+' : ''}
                      {growthOf(detail)} points
                    </span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Trend</span>
                    <span className={`badge badge-soft-${trendTint[trendOf(detail)]}`}>{trendOf(detail)}</span>
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <h6 className="fs-14 mb-2">Attendance Impact</h6>
                <ul className="list-unstyled fs-13 mb-0">
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Present</span>
                    <span className="fw-medium">
                      {detail.present} of {WORKING_DAYS} days
                    </span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Absent</span>
                    <span className="fw-medium">{absentOf(detail)} days</span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Teaching Lost</span>
                    <span className="fw-medium">{periodsLostOf(detail)} periods</span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Band</span>
                    <span className={`badge badge-soft-${bandTint[attendanceBandOf(detail)]}`}>
                      {attendanceBandOf(detail)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* --------------------------- Compare Performance ------------------------- */}
      <Modal
        open={active === 'compare' && detail !== null}
        onClose={onClose}
        title="Compare Performance"
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
        {detail ? (
          <>
            <div className="row g-3 mb-3">
              <Field label="Compare against">
                <Select options={['Previous Exam', 'Section Mean', 'Another Student']} />
              </Field>
              <Field label="Student">
                <Select options={rows.map((item) => `${item.name} · ${item.id}`)} />
              </Field>
            </div>

            <div className="table-responsive border rounded mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Assessment</th>
                    <th className="text-center">Percentage</th>
                    <th className="text-center">Grade</th>
                    <th className="text-center">Rank</th>
                    <th className="text-center">Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fs-13">{PREVIOUS_EXAM}</td>
                    <td className="text-center fs-13">{previousScoreOf(detail)}%</td>
                    <td className="text-center fs-13">—</td>
                    <td className="text-center fs-13">
                      {detail.previousRank === null ? '—' : `${detail.previousRank} of ${detail.sectionStrength}`}
                    </td>
                    <td className="text-center fs-13">—</td>
                  </tr>
                  <tr>
                    <td className="fs-13">{EXAM}</td>
                    <td className="text-center fs-13">{scoreOf(detail)}%</td>
                    <td className="text-center fs-13">{overallGradeOf(detail)?.grade ?? 'Withheld'}</td>
                    <td className="text-center fs-13">
                      {detail.rank === null ? '—' : `${detail.rank} of ${detail.sectionStrength}`}
                    </td>
                    <td className="text-center">
                      <span className={`badge badge-soft-${growthOf(detail) >= 0 ? 'success' : 'danger'}`}>
                        {growthOf(detail) > 0 ? '+' : ''}
                        {growthOf(detail)}
                      </span>
                    </td>
                  </tr>
                  <tr className="text-muted">
                    <td className="fs-13">Unit Test 2</td>
                    <td className="text-center fs-13" colSpan={4}>
                      Awaiting marks
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h6 className="fs-14 mb-2">Subject Movement</h6>
            {movement.length > 0 ? (
              <>
                <div className="table-responsive border rounded mb-3">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th className="text-center">{PREVIOUS_EXAM}</th>
                        <th className="text-center">{EXAM}</th>
                        <th className="text-center">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movement.map((item) => (
                        <tr key={item.subject}>
                          <td className="fs-13">{item.subject}</td>
                          <td className="text-center fs-13">{item.previous}</td>
                          <td className="text-center fs-13">{item.current}</td>
                          <td className="text-center">
                            <span className={`badge badge-soft-${item.change >= 0 ? 'success' : 'danger'}`}>
                              {item.change > 0 ? '+' : ''}
                              {item.change}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ul className="list-unstyled fs-13 mb-0">
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Papers Improved</span>
                    <span className="fw-medium">
                      {improvedPapers.length} of {movement.length}
                    </span>
                  </li>
                  {smallestGain ? (
                    <li className="d-flex align-items-center justify-content-between py-1">
                      <span className="text-muted">Smallest Gain</span>
                      <span className="fw-medium">
                        {smallestGain.subject} · {smallestGain.change} marks
                      </span>
                    </li>
                  ) : null}
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Overall Movement</span>
                    <span className="fw-medium">
                      {previousScoreOf(detail)}% to {scoreOf(detail)}%
                    </span>
                  </li>
                </ul>
              </>
            ) : (
              <p className="fs-13 text-muted mb-0">
                {detail.name} can be compared on totals only — the {PREVIOUS_EXAM} paper marks are not on this
                record. Overall movement is {previousScoreOf(detail)}% to {scoreOf(detail)}%.
              </p>
            )}
          </>
        ) : null}
      </Modal>

      {/* ----------------------------- Add Remarks ------------------------------- */}
      <Modal
        open={active === 'remarks'}
        onClose={onClose}
        title="Add Teacher Remarks"
        footer={footerButtons('Save Remark', 'ti ti-message-plus', () => {
          if (!detail) return;
          if (!remarkBody.trim()) {
            onToast('Write the remark before saving', 'warning');
            return;
          }
          onAddRemark(detail.id, remarkAuthor.split(' · ')[0], remarkArea, remarkBody.trim());
          onClose();
          onToast(`Remark added for ${detail.name}`);
        })}
      >
        {withheld && detail && !isCompleteOf(detail) ? (
          <div className="alert alert-soft-warning fs-13 d-flex align-items-center gap-2">
            <i className="ti ti-alert-triangle" />
            {detail.name} has no performance level yet. A subject is still open on this record.
          </div>
        ) : null}
        {detail ? (
          <>
            <StudentStrip row={detail} />
            <div className="row g-2 fs-13 mb-3">
              <div className="col-sm-4">
                <span className="text-muted">Subjects In</span>{' '}
                <span className="fw-medium">
                  {papersOf(detail)} of {detail.subjects.length}
                </span>
              </div>
              <div className="col-sm-4">
                <span className="text-muted">{isCompleteOf(detail) ? 'Score' : 'Provisional Score'}</span>{' '}
                <span className="fw-medium">{scoreOf(detail)}%</span>
              </div>
              <div className="col-sm-4">
                <span className="text-muted">Attendance</span>{' '}
                <span className="fw-medium">
                  {attendancePctOf(detail)}% · {attendanceBandOf(detail)}
                </span>
              </div>
            </div>
          </>
        ) : null}
        <div className="row g-3">
          <Field label="Teacher">
            <Select options={teacherOptions} value={remarkAuthor} onChange={setRemarkAuthor} />
          </Field>
          <Field label="Subject or Area">
            <Select
              options={['Class Teacher', 'Mathematics', 'Science', 'Hindi', 'Attendance', 'Conduct']}
              value={remarkArea}
              onChange={setRemarkArea}
            />
          </Field>
          <Field label="Exam / Term">
            <Select options={[`${EXAM} · ${EXAM_REF}`, `${PREVIOUS_EXAM} · EXM-2026-011`]} />
          </Field>
          <Field label="Date">
            <DateField value="31-07-2026" onChange={() => undefined} format="d-m-Y" id="sp-remark-date" />
          </Field>
          <Field label="Tone" span="col-12">
            <Radios name="sp-tone" options={['Encouraging', 'Neutral', 'Concern']} />
          </Field>
          <Field label="Remark" span="col-12">
            <textarea
              className="form-control"
              rows={3}
              value={remarkBody}
              onChange={(event) => setRemarkBody(event.target.value)}
              placeholder="What the guardian and the next teacher need to know."
            />
          </Field>
          <div className="col-12">
            <Switch id="sp-rm-print" label="Print this remark on the report card" on />
            <Switch id="sp-rm-notify" label="Notify the guardians on the portal" />
          </div>
        </div>
      </Modal>

      {/* -------------------------- Create Improvement Plan ---------------------- */}
      <Modal
        open={active === 'plan'}
        onClose={onClose}
        title="Create Improvement Plan"
        dialogClassName="modal-lg"
        footer={footerButtons('Save Plan', 'ti ti-target-arrow', () => {
          if (!planCandidate) return;
          if (!planTarget.trim()) {
            onToast('Set a target the plan can close on', 'warning');
            return;
          }
          onSetPlan(planCandidate.id, planState, planTarget.trim());
          onClose();
          onToast(`Plan ${planState.toLowerCase()} for ${planCandidate.name}`);
        })}
      >
        <p className="text-muted fs-13 mb-3">Set the targets that close the plan</p>
        {planCandidate ? (
          <>
            <StudentStrip row={planCandidate} />
            <div className="row g-2 fs-13 mb-3">
              <div className="col-sm-4">
                <span className="text-muted">Overall Score</span>{' '}
                <span className="fw-medium">
                  {scoreOf(planCandidate)}%
                  {planCandidate.rank !== null
                    ? ` · rank ${planCandidate.rank} of ${planCandidate.sectionStrength}`
                    : ''}
                </span>
              </div>
              <div className="col-sm-4">
                <span className="text-muted">Attendance</span>{' '}
                <span className="fw-medium">
                  {attendancePctOf(planCandidate)}% · {absentOf(planCandidate)} days missed
                </span>
              </div>
              <div className="col-sm-4">
                <span className="text-muted">Weakest Paper</span>{' '}
                <span className="fw-medium">
                  {weakestPaperOf(planCandidate)?.subject} {weakestPaperOf(planCandidate)?.marks}
                </span>
              </div>
            </div>
          </>
        ) : null}
        <div className="row g-3">
          <Field label="Plan state" span="col-12">
            <div className="custom-btn-group custom-btn-group-fill custom-btn-group-sm" role="group">
              {(['Active', 'Proposed', 'Closed'] as PlanState[]).map((state) => (
                <span key={state}>
                  <input
                    type="radio"
                    className="btn-check"
                    name="sp-plan-state"
                    id={`sp-plan-${state}`}
                    checked={planState === state}
                    onChange={() => setPlanState(state)}
                  />
                  <label className="btn" htmlFor={`sp-plan-${state}`}>
                    {state}
                  </label>
                </span>
              ))}
            </div>
          </Field>
          <Field label="Plan Reference">
            <input
              type="text"
              className="form-control"
              defaultValue={planCandidate?.plan.reference ?? 'IMP-2026-0091'}
            />
          </Field>
          <Field label="Owner">
            <Select
              options={[
                'Ms. Meera Nair · Class Teacher',
                'Mr. Ethan Brooks · Mathematics',
                'Mrs. Kalpana Menon · Academic Coordinator',
              ]}
            />
          </Field>
          <Field label="Target" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={planTarget}
              onChange={(event) => setPlanTarget(event.target.value)}
              placeholder="What has to be true for this plan to close."
            />
          </Field>
          <Field label="Review By">
            <DateField value="07-08-2026" onChange={() => undefined} format="d-m-Y" id="sp-plan-review" />
          </Field>
          <Field label="Measured At">
            <Select options={['Half Yearly Examination', 'Unit Test 2', 'End of Term 2']} />
          </Field>
          <Field label="Support Arranged" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue="Saturday problem clinic, a fortnightly attendance note to the guardians and a counsellor review on record."
            />
          </Field>
          <div className="col-12">
            <Switch id="sp-plan-meeting" label="Book a guardian meeting when the plan opens" on />
          </div>
        </div>
      </Modal>

      {/* --------------------------- Generate Report Card ------------------------ */}
      <Modal
        open={active === 'reportcard'}
        onClose={onClose}
        title="Generate Report Card"
        footer={footerButtons('Generate', 'ti ti-player-play', confirm('Report cards queued'))}
      >
        {withheld ? (
          <div className="alert alert-soft-warning fs-13 d-flex align-items-center gap-2">
            <i className="ti ti-alert-triangle" />
            A student with an open subject is skipped. {withheld.name} is the only one in this selection.
          </div>
        ) : null}
        <div className="row g-3">
          <Field label="Scope" span="col-12">
            <Radios name="sp-rc-scope" options={['This Student', `Selected (${rows.length})`, 'Whole Section']} />
          </Field>
          {detail ? (
            <div className="col-12">
              <ul className="list-unstyled fs-13 border rounded p-3 mb-0">
                <li className="d-flex align-items-center justify-content-between py-1">
                  <span className="text-muted">Student</span>
                  <span className="fw-medium">
                    {detail.name} · {detail.id}
                  </span>
                </li>
                <li className="d-flex align-items-center justify-content-between py-1">
                  <span className="text-muted">Overall Score</span>
                  <span className="fw-medium">
                    {scoreOf(detail)}% · {overallGradeOf(detail)?.grade ?? 'Withheld'}
                  </span>
                </li>
                <li className="d-flex align-items-center justify-content-between py-1">
                  <span className="text-muted">Existing Report</span>
                  <span className="fw-medium">
                    {detail.reportRef ? `${detail.reportRef} · ${detail.reportState}` : 'None'}
                  </span>
                </li>
              </ul>
            </div>
          ) : null}
          <Field label="Template" span="col-12">
            <Select
              options={[
                'Term report card, A4 portrait',
                'Junior progress report, A4 portrait',
                'Consolidated term report, A4 landscape',
              ]}
            />
          </Field>
          <Field label="Exam / Term">
            <Select options={[`${EXAM} · ${EXAM_REF}`, `${PREVIOUS_EXAM} · EXM-2026-011`]} />
          </Field>
          <Field label="Generated By">
            <Select options={['Mrs. Ellen Cruz · Class Teacher', 'Mrs. Kalpana Menon · Academic Coordinator']} />
          </Field>
          <div className="col-12">
            <Switch id="sp-rc-rank" label="Print the class rank and the movement" on />
            <Switch id="sp-rc-att" label="Print the attendance summary" on />
            <Switch id="sp-rc-rem" label="Print the teacher remarks" on />
            <Switch id="sp-rc-skip" label="Skip any student with an open subject" on />
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Share Report ----------------------------- */}
      <Modal
        open={active === 'share'}
        onClose={onClose}
        title="Share Performance Report"
        footer={footerButtons('Share', 'ti ti-share', confirm('Performance shared'))}
      >
        {detail ? (
          <>
            <StudentStrip row={detail} />
            <div className="row g-2 fs-13 mb-3">
              <div className="col-sm-6">
                <span className="text-muted">Overall Score</span>{' '}
                <span className="fw-medium">
                  {scoreOf(detail)}%
                  {detail.rank !== null ? ` · rank ${detail.rank} of ${detail.sectionStrength}` : ''}
                </span>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Report Card</span>{' '}
                <span className="fw-medium">
                  {detail.reportRef ? `${detail.reportRef} · ${detail.reportState}` : 'Not raised'}
                </span>
              </div>
            </div>
          </>
        ) : null}
        <div className="row g-3">
          <Field label="Send to">
            <Select options={['Guardians', 'Class Teacher', 'Coordinator']} />
          </Field>
          <Field label="Channel">
            <Select options={['Parent portal', 'Email', 'SMS link']} />
          </Field>
          <Field label="Link Expiry">
            <Select options={['30 days', '7 days', 'End of the term']} />
          </Field>
          <Field label="Include">
            <Select
              options={[
                'Score, grade, rank and attendance',
                'Score and grade only',
                'Full report card with remarks',
              ]}
            />
          </Field>
          <Field label="Message" span="col-12">
            <textarea
              className="form-control"
              rows={3}
              defaultValue="The Term 1 performance summary is ready. The report card follows once the Academic Coordinator has signed it off."
            />
          </Field>
          <div className="col-12">
            <Switch id="sp-sh-plan" label="Attach the improvement plan if one is open" on />
            <Switch id="sp-sh-ack" label="Ask the guardian to acknowledge" on />
          </div>
        </div>
      </Modal>

      {/* ------------------------ Performance Details panel ---------------------- */}
      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title="Performance Details"
        className="offcanvas-lg"
        titleAccessory={
          detail ? (
            <span className="fs-12 text-muted">
              {detail.name} · {detail.id} · {classLabelOf(detail)}
            </span>
          ) : null
        }
      >
        {detail ? (
          <>
            <h6 className="fs-14 mb-2">Student Information</h6>
            <ul className="list-unstyled fs-13 mb-4">
              {[
                { label: 'Roll Number', value: `${detail.roll}` },
                { label: 'Class Teacher', value: detail.classTeacher },
                { label: 'Section Strength', value: `${detail.sectionStrength} students` },
                { label: 'Academic Year', value: ACADEMIC_YEAR },
                { label: 'Performance Level', value: levelOf(detail) },
              ].map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>

            <h6 className="fs-14 mb-2">Performance Summary</h6>
            <ul className="list-unstyled fs-13 mb-4">
              {[
                { label: 'Score', value: `${scoreOf(detail)}%` },
                { label: 'Grade', value: overallGradeOf(detail)?.grade ?? 'Withheld' },
                {
                  label: 'Rank',
                  value: detail.rank === null ? 'Withheld' : `${detail.rank} / ${detail.sectionStrength}`,
                },
                { label: 'Marks Obtained', value: `${obtainedOf(detail)} of ${maximumOf(detail)}` },
                {
                  label: 'Best Paper',
                  value: `${bestPaperOf(detail)?.subject} ${bestPaperOf(detail)?.marks}`,
                },
                {
                  label: 'Weakest Paper',
                  value: `${weakestPaperOf(detail)?.subject} ${weakestPaperOf(detail)?.marks}`,
                },
                {
                  label: 'At Pass Mark',
                  value: `${atPassMarkOf(detail)} of ${papersOf(detail)}`,
                },
                {
                  label: 'Attendance',
                  value: `${attendancePctOf(detail)}% · ${attendanceBandOf(detail)}`,
                },
              ].map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>

            <h6 className="fs-14 mb-2">Grade Breakdown</h6>
            <ul className="list-unstyled fs-13 mb-4">
              {breakdownOf(detail).map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.grade}>
                  <span className={`badge badge-soft-${gradeTint(item.grade)}`}>{item.grade}</span>
                  <span className="text-muted">
                    {item.count} {item.count === 1 ? 'subject' : 'subjects'}
                  </span>
                </li>
              ))}
            </ul>

            <h6 className="fs-14 mb-2">Learning Progress</h6>
            <ul className="list-unstyled fs-13 mb-4">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Change Since {PREVIOUS_EXAM}</span>
                <span className="fw-medium">
                  {growthOf(detail) > 0 ? '+' : ''}
                  {growthOf(detail)} points
                </span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Rank Movement</span>
                <span className="fw-medium">
                  {detail.previousRank ?? '—'} to {detail.rank ?? 'withheld'}
                </span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Trend</span>
                <span className={`badge badge-soft-${trendTint[trendOf(detail)]}`}>{trendOf(detail)}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Improvement Plan</span>
                <span className="fw-medium">
                  {detail.plan.reference ? `${detail.plan.reference} · ${detail.plan.state}` : detail.plan.state}
                </span>
              </li>
            </ul>

            <h6 className="fs-14 mb-2">Parent Meeting History</h6>
            <ul className="list-unstyled mb-0">
              {detail.meetings.map((meeting) => (
                <li className="border rounded p-2 mb-2" key={meeting.title}>
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <h6 className="fs-13 mb-0 fw-medium">{meeting.title}</h6>
                    <span className={`badge badge-soft-${meeting.held === 'Held' ? 'success' : 'info'}`}>
                      {meeting.held}
                    </span>
                  </div>
                  <span className="fs-12 text-muted d-block">
                    {meeting.date} · {meeting.by}
                  </span>
                  <p className="fs-12 text-muted mb-0 mt-1">{meeting.note}</p>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Offcanvas>
    </>
  );
};

export default PerformanceModals;
