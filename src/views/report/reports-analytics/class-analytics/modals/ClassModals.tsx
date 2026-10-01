import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import type { ClassSection } from '../data/classAnalytics.data';
import {
  ACADEMIC_YEAR,
  attendanceBandOf,
  avgAbsentOf,
  avgPresentOf,
  belowPassOf,
  EXAM,
  EXAM_REF,
  gradeOf,
  gradeOptions,
  gradeTint,
  growthOf,
  isCompleteOf,
  labelOf,
  levelOf,
  levelPill,
  meanOf,
  papersAboveOf,
  passPctOf,
  PASS_MARK,
  sectionOptions,
  spreadOf,
  strongestOf,
  subjectGradeOf,
  teachingLostOf,
  teacherOptions,
  TOTAL_SECTIONS,
  trendOf,
  trendTint,
  weakestOf,
  WORKING_DAYS,
} from '../data/classAnalytics.data';

export type ClassModalId = 'generate' | 'compare' | 'export' | 'share' | 'remarks' | 'view';

export interface ClassModalsProps {
  active: ClassModalId | null;
  onClose: () => void;
  row: ClassSection | null;
  rows: ClassSection[];
  panelOpen: boolean;
  onClosePanel: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  onAddRemark: (id: string, author: string, role: string, body: string) => void;
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

const SectionStrip = ({ row }: { row: ClassSection }) => (
  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 border rounded p-3 mb-3">
    <div>
      <h6 className="fs-15 mb-0">{labelOf(row)}</h6>
      <span className="fs-12 text-muted">
        {row.teacher} · {row.students} students
      </span>
    </div>
    <span className={`dt-pill ${levelPill[levelOf(row)]}`}>
      <span className="dt-pill-dot" />
      {levelOf(row)}
    </span>
  </div>
);

/** The grade letter and its remark, from the shared scale. */
const gradeLabel = (mean: number) => {
  const step = gradeOf(mean);
  return `${step.grade} · ${step.remark}`;
};

const ClassModals = ({
  active,
  onClose,
  row,
  rows,
  panelOpen,
  onClosePanel,
  onToast,
  onAddRemark,
}: ClassModalsProps) => {
  const [firstId, setFirstId] = useState('');
  const [secondId, setSecondId] = useState('');
  const [remarkAuthor, setRemarkAuthor] = useState(teacherOptions[0]);
  const [remarkArea, setRemarkArea] = useState('Class Teacher');
  const [remarkBody, setRemarkBody] = useState('');

  const detail = row ?? rows[0] ?? null;
  const blocked = rows.find((item) => !isCompleteOf(item));
  const held = rows.find((item) => item.actions.some((action) => action.state === 'Proposed') && item.reportRef);
  const weakest = rows
    .filter(isCompleteOf)
    .reduce<ClassSection | null>((worst, item) => (worst && meanOf(worst) <= meanOf(item) ? worst : item), null);

  /* Compare opens on this section against the next one down the board. */
  useEffect(() => {
    if (active !== 'compare' || rows.length === 0) return;
    const first = row ?? rows[0];
    setFirstId(first.id);
    setSecondId((rows.find((item) => item.id !== first.id) ?? first).id);
  }, [active, row, rows]);

  useEffect(() => {
    if (active === 'remarks') setRemarkBody('');
  }, [active]);

  const first = rows.find((item) => item.id === firstId) ?? null;
  const second = rows.find((item) => item.id === secondId) ?? null;

  /** The subject-gap table: the same paper in both sections, biggest gap first. */
  const subjectGaps =
    first && second
      ? first.subjects
          .map((subject) => {
            const other = second.subjects.find((item) => item.subject === subject.subject);
            if (subject.mean === null || !other || other.mean === null) return null;
            return {
              subject: subject.subject,
              first: subject.mean,
              second: other.mean,
              gap: Math.round((subject.mean - other.mean) * 10) / 10,
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)
          .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
      : [];

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
      {/* --------------------------- Generate Analytics -------------------------- */}
      <Modal
        open={active === 'generate'}
        onClose={onClose}
        title="Generate Analytics"
        dialogClassName="modal-lg"
        footer={footerButtons('Run Analytics', 'ti ti-player-play', confirm('Section analytics rebuilt'))}
      >
        <p className="text-muted fs-13 mb-3">Rebuild the section means from the marks already closed</p>
        {blocked ? (
          <div className="alert alert-soft-warning fs-13 d-flex align-items-center gap-2">
            <i className="ti ti-alert-triangle" />
            {labelOf(blocked)} is skipped. {blocked.blockedBy} is still open.
          </div>
        ) : null}
        {weakest ? (
          <>
            <SectionStrip row={weakest} />
            <div className="row g-2 fs-13 mb-3">
              <div className="col-sm-4">
                <span className="text-muted">Section Mean</span>{' '}
                <span className="fw-medium">
                  {meanOf(weakest)} · rank {weakest.rank} of {TOTAL_SECTIONS}
                </span>
              </div>
              <div className="col-sm-4">
                <span className="text-muted">Pass Percentage</span>{' '}
                <span className="fw-medium">
                  {passPctOf(weakest)}% · {belowPassOf(weakest)} below the mark
                </span>
              </div>
              <div className="col-sm-4">
                <span className="text-muted">Weakest Paper</span>{' '}
                <span className="fw-medium">
                  {weakestOf(weakest)?.subject} {weakestOf(weakest)?.mean}
                </span>
              </div>
            </div>
          </>
        ) : null}
        <div className="row g-3">
          <Field label="Run scope" span="col-12">
            <Radios name="ca-scope" options={['This Section', 'Whole Grade', `All ${TOTAL_SECTIONS} Sections`]} />
          </Field>
          <Field label="Grade" span="col-md-4">
            <Select options={gradeOptions} />
          </Field>
          <Field label="Section" span="col-md-4">
            <Select options={[...sectionOptions, 'All sections']} />
          </Field>
          <Field label="Academic Year" span="col-md-4">
            <Select options={[ACADEMIC_YEAR, '2025-2026']} />
          </Field>
          <Field label="Exam / Term" span="col-12">
            <Select
              options={[`${EXAM} · ${EXAM_REF}`, 'Unit Test 1 · EXM-2026-011', 'Unit Test 2 · EXM-2026-017']}
            />
          </Field>
          <div className="col-12">
            <h6 className="fs-14 mb-2 mt-2">What the run places</h6>
          </div>
          <Field label="Subjects">
            <Select options={['All subjects in the scheme', 'Core subjects only', 'Selected subject']} />
          </Field>
          <Field label="Pass Mark">
            <input type="number" className="form-control" defaultValue={PASS_MARK} min={0} max={100} />
          </Field>
          <Field label="Ranking Basis" span="col-12">
            <Select options={['Section mean across all subjects', 'Core subject mean']} />
          </Field>
          <div className="col-12">
            <Switch id="ca-gen-skip" label="Skip any section with an open subject" on />
            <Switch id="ca-gen-notify" label="Notify the class teachers when the run finishes" on />
          </div>
        </div>
      </Modal>

      {/* ---------------------------- Compare Classes ---------------------------- */}
      <Modal
        open={active === 'compare'}
        onClose={onClose}
        title="Compare Classes"
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
          <Field label="Comparison basis" span="col-12">
            <Radios name="ca-basis" options={['Section vs Section', 'Within a Grade', 'Across Terms']} />
          </Field>
          <Field label="First Section">
            <Select
              options={rows.map((item) => `${labelOf(item)} · ${item.teacher}`)}
              value={first ? `${labelOf(first)} · ${first.teacher}` : ''}
              onChange={(value) => {
                const match = rows.find((item) => `${labelOf(item)} · ${item.teacher}` === value);
                if (match) setFirstId(match.id);
              }}
            />
          </Field>
          <Field label="Second Section">
            <Select
              options={rows.map((item) => `${labelOf(item)} · ${item.teacher}`)}
              value={second ? `${labelOf(second)} · ${second.teacher}` : ''}
              onChange={(value) => {
                const match = rows.find((item) => `${labelOf(item)} · ${item.teacher}` === value);
                if (match) setSecondId(match.id);
              }}
            />
          </Field>
        </div>

        <h6 className="fs-14 mb-2">Section Standings</h6>
        <div className="table-responsive border rounded mb-3">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Section</th>
                <th className="text-center">Students</th>
                <th className="text-center">Mean</th>
                <th className="text-center">Pass</th>
                <th className="text-center">Attendance</th>
                <th className="text-center">Rank</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {[first, second]
                .filter((item): item is ClassSection => item !== null)
                .map((item) => (
                  <tr key={item.id}>
                    <td className="fs-13 fw-medium">{labelOf(item)}</td>
                    <td className="text-center fs-13">{item.students}</td>
                    <td className="text-center fs-13">{meanOf(item)}</td>
                    <td className="text-center fs-13">{passPctOf(item) === null ? '—' : `${passPctOf(item)}%`}</td>
                    <td className="text-center fs-13">{item.attendancePct}%</td>
                    <td className="text-center fs-13">
                      {item.rank === null ? '—' : `${item.rank} of ${TOTAL_SECTIONS}`}
                    </td>
                    <td>
                      <span className="badge badge-soft-secondary">{levelOf(item)}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {first && second ? (
          <>
            <h6 className="fs-14 mb-2">
              Subject Gap — {labelOf(first)} against {labelOf(second)}
            </h6>
            {subjectGaps.length > 0 ? (
              <div className="table-responsive border rounded mb-0">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th className="text-center">{labelOf(first)}</th>
                      <th className="text-center">{labelOf(second)}</th>
                      <th className="text-center">Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectGaps.map((item) => (
                      <tr key={item.subject}>
                        <td className="fs-13">{item.subject}</td>
                        <td className="text-center fs-13">{item.first}</td>
                        <td className="text-center fs-13">{item.second}</td>
                        <td className="text-center">
                          <span className={`badge badge-soft-${item.gap >= 0 ? 'success' : 'danger'}`}>
                            {item.gap > 0 ? '+' : ''}
                            {item.gap}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="fs-13 text-muted mb-0">
                These two sections share no subject that has been marked in both.
              </p>
            )}
          </>
        ) : null}
      </Modal>

      {/* ---------------------------- Export Analytics --------------------------- */}
      <Modal
        open={active === 'export'}
        onClose={onClose}
        title="Export Report"
        footer={footerButtons('Export', 'ti ti-file-export', confirm(`${rows.length} sections exported`))}
      >
        <div className="row g-3">
          <Field label="Format" span="col-12">
            <Radios name="ca-format" options={['PDF', 'Excel', 'CSV']} />
          </Field>
          <Field label="Scope" span="col-12">
            <Radios
              name="ca-ex-scope"
              options={['This Section', `Filtered (${rows.length})`, `All (${TOTAL_SECTIONS})`]}
            />
          </Field>
          {detail ? (
            <div className="col-12">
              <ul className="list-unstyled fs-13 border rounded p-3 mb-0">
                <li className="d-flex align-items-center justify-content-between py-1">
                  <span className="text-muted">Section</span>
                  <span className="fw-medium">
                    {labelOf(detail)} · {detail.teacher}
                  </span>
                </li>
                <li className="d-flex align-items-center justify-content-between py-1">
                  <span className="text-muted">Exam / Term</span>
                  <span className="fw-medium">{EXAM}</span>
                </li>
                <li className="d-flex align-items-center justify-content-between py-1">
                  <span className="text-muted">Sections Skipped</span>
                  <span className="fw-medium">
                    {rows.filter((item) => !isCompleteOf(item)).length} · open marks entry
                  </span>
                </li>
              </ul>
            </div>
          ) : null}
          <Field label="File Name" span="col-md-4">
            <input type="text" className="form-control" defaultValue="class-analytics-term-1" />
          </Field>
          <Field label="Page Size" span="col-md-4">
            <Select options={['A4', 'Letter']} />
          </Field>
          <Field label="Orientation" span="col-md-4">
            <Select options={['Landscape', 'Portrait']} />
          </Field>
          <div className="col-12">
            <Switch id="ca-ex-subj" label="Include the subject-wise means" on />
            <Switch id="ca-ex-perf" label="Include the top and bottom performers" />
            <Switch id="ca-ex-act" label="Include the improvement actions" on />
            <Switch id="ca-ex-audit" label="Record the export in the audit history" on />
          </div>
        </div>
      </Modal>

      {/* ----------------------------- Share Analytics --------------------------- */}
      <Modal
        open={active === 'share'}
        onClose={onClose}
        title="Share Analytics"
        footer={footerButtons('Share', 'ti ti-share', confirm('Analytics shared'))}
      >
        {held ? (
          <div className="alert alert-soft-warning fs-13 d-flex align-items-center gap-2">
            <i className="ti ti-alert-triangle" />
            {labelOf(held)} is not shareable. {held.reportRef} is held until its proposed action is attached.
          </div>
        ) : null}
        {detail ? (
          <>
            <SectionStrip row={detail} />
            <div className="row g-2 fs-13 mb-3">
              <div className="col-sm-6">
                <span className="text-muted">Section Mean</span>{' '}
                <span className="fw-medium">
                  {meanOf(detail)}
                  {detail.rank !== null ? ` · rank ${detail.rank} of ${TOTAL_SECTIONS}` : ''}
                </span>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Evaluated</span>{' '}
                <span className="fw-medium">{detail.evaluatedOn ?? 'Blocked'}</span>
              </div>
            </div>
          </>
        ) : null}
        <div className="row g-3">
          <Field label="Send to">
            <Select options={['Class Teacher', 'Department', 'Principal']} />
          </Field>
          <Field label="Channel">
            <Select options={['Staff portal', 'Email']} />
          </Field>
          <Field label="Link Expiry">
            <Select options={['End of the term', '30 days', '7 days']} />
          </Field>
          <Field label="Include">
            <Select
              options={[
                'Section means, pass rate and attendance',
                'Section means only',
                'Full analytics with the performer lists',
              ]}
            />
          </Field>
          <Field label="Message" span="col-12">
            <textarea
              className="form-control"
              rows={3}
              defaultValue="Term 1 section analytics for the department meeting on 3 Aug. The Hindi clinic scope is in the improvement actions."
            />
          </Field>
          <div className="col-12">
            <Switch id="ca-sh-held" label="Leave out any section whose report is still held" on />
            <Switch id="ca-sh-names" label="Include student names in the performer lists" />
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Add Remarks ------------------------------ */}
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
          onAddRemark(detail.id, remarkAuthor, remarkArea, remarkBody.trim());
          onClose();
          onToast(`Remark added for ${labelOf(detail)}`);
        })}
      >
        {detail ? (
          <>
            <SectionStrip row={detail} />
            <div className="row g-2 fs-13 mb-3">
              <div className="col-sm-4">
                <span className="text-muted">Subjects In</span>{' '}
                <span className="fw-medium">
                  {detail.subjects.filter((subject) => subject.mean !== null).length} of{' '}
                  {detail.subjects.length}
                </span>
              </div>
              <div className="col-sm-4">
                <span className="text-muted">{isCompleteOf(detail) ? 'Section Mean' : 'Provisional Mean'}</span>{' '}
                <span className="fw-medium">{meanOf(detail)}</span>
              </div>
              <div className="col-sm-4">
                <span className="text-muted">{isCompleteOf(detail) ? 'Attendance' : 'Blocked By'}</span>{' '}
                <span className="fw-medium">
                  {isCompleteOf(detail) ? `${detail.attendancePct}%` : detail.blockedBy}
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
              options={['Class Teacher', 'Mathematics', 'Science', 'Hindi', 'Attendance', 'Marks Entry']}
              value={remarkArea}
              onChange={setRemarkArea}
            />
          </Field>
          <Field label="Exam / Term">
            <Select options={[`${EXAM} · ${EXAM_REF}`, 'Unit Test 1 · EXM-2026-011']} />
          </Field>
          <Field label="Date">
            <DateField value="31-07-2026" onChange={() => undefined} format="d-m-Y" id="ca-remark-date" />
          </Field>
          <Field label="Tone" span="col-12">
            <Radios name="ca-tone" options={['Concern', 'Neutral', 'Encouraging']} />
          </Field>
          <Field label="Remark" span="col-12">
            <textarea
              className="form-control"
              rows={3}
              value={remarkBody}
              onChange={(event) => setRemarkBody(event.target.value)}
              placeholder="What the department and the coordinator need to know about this section."
            />
          </Field>
          <div className="col-12">
            <Switch id="ca-rm-print" label="Print the remark on the section report" on />
            <Switch id="ca-rm-notify" label="Notify the Academic Coordinator" on />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- View Class ------------------------------ */}
      <Modal
        open={active === 'view' && detail !== null}
        onClose={onClose}
        title={detail ? labelOf(detail) : 'Class'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={confirm('Analytics exported')}>
              <i className="ti ti-file-export me-1" />
              Export
            </button>
          </>
        }
      >
        {detail ? (
          <>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 border-bottom pb-3 mb-3">
              <div>
                <h6 className="fs-15 mb-0">{labelOf(detail)}</h6>
                <span className="fs-12 text-muted">
                  {detail.teacher} · {detail.students} students · {EXAM} · {ACADEMIC_YEAR}
                </span>
              </div>
              <span className={`dt-pill ${levelPill[levelOf(detail)]}`}>
                <span className="dt-pill-dot" />
                {levelOf(detail)}
              </span>
            </div>

            <div className="row g-2 text-center mb-3">
              {[
                { label: 'Section Mean', value: `${meanOf(detail)}` },
                { label: 'Pass Rate', value: passPctOf(detail) === null ? '—' : `${passPctOf(detail)}%` },
                { label: 'Attendance', value: `${detail.attendancePct}%` },
                {
                  label: 'Grade',
                  value: isCompleteOf(detail)
                    ? `${gradeLabel(meanOf(detail))}`
                    : 'Withheld',
                },
              ].map((item) => (
                <div className="col-6 col-md-3" key={item.label}>
                  <div className="border rounded py-2">
                    <h6 className="fs-16 mb-0">{item.value}</h6>
                    <span className="fs-12 text-muted">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <h6 className="fs-14 mb-2">Subject-wise Means</h6>
            <div className="table-responsive border rounded mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th className="text-center">Section Mean</th>
                    <th className="text-center">Grade</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.subjects.map((subject) => {
                    const grade = subjectGradeOf(subject);
                    const isStrongest = strongestOf(detail)?.subject === subject.subject;
                    const isWeakest = weakestOf(detail)?.subject === subject.subject;
                    return (
                      <tr key={subject.subject}>
                        <td className="fs-13">{subject.subject}</td>
                        <td className="text-center fs-13">{subject.mean ?? 'Not entered'}</td>
                        <td className="text-center">
                          {grade ? (
                            <span className={`badge badge-soft-${gradeTint(grade)}`}>{grade}</span>
                          ) : (
                            <span className="text-muted fs-13">—</span>
                          )}
                        </td>
                        <td className="fs-12 text-muted">
                          {isStrongest ? 'Strongest' : isWeakest ? 'Weakest' : '—'}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="fw-semibold">
                    <td className="fs-13">Section Mean</td>
                    <td className="text-center fs-13">{meanOf(detail)}</td>
                    <td className="text-center fs-13">{gradeLabel(meanOf(detail))}</td>
                    <td className="fs-12 text-muted">Spread {spreadOf(detail)} marks</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fs-14 mb-2">Top of the Section</h6>
                <ul className="list-unstyled fs-13 mb-0">
                  {detail.top.map((performer) => (
                    <li className="d-flex align-items-center justify-content-between py-1" key={performer.name}>
                      <span>{performer.name}</span>
                      <span className="fw-medium">
                        {performer.score}%
                        {performer.rank !== null ? (
                          <span className="text-muted ms-1">Rank {performer.rank}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6">
                <h6 className="fs-14 mb-2">Term Movement</h6>
                <ul className="list-unstyled fs-13 mb-0">
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Unit Test 1</span>
                    <span className="fw-medium">
                      {detail.previousMean} · rank {detail.previousRank}
                    </span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">{EXAM}</span>
                    <span className="fw-medium">
                      {meanOf(detail)}
                      {detail.rank !== null ? ` · rank ${detail.rank}` : ' · provisional'}
                    </span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Change</span>
                    <span className="fw-medium">
                      {growthOf(detail) === null
                        ? 'Not placed'
                        : `${growthOf(detail)! > 0 ? '+' : ''}${growthOf(detail)} marks`}
                    </span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Students Below Pass</span>
                    <span className="fw-medium">
                      {belowPassOf(detail) === null
                        ? 'Placed with the section mean'
                        : `${belowPassOf(detail)} of ${detail.students}`}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* ------------------------- Analytics Details panel ----------------------- */}
      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title="Analytics Details"
        className="offcanvas-lg"
        titleAccessory={
          detail ? (
            <span className="fs-12 text-muted">
              {labelOf(detail)} · {detail.teacher} · {detail.students} students
            </span>
          ) : null
        }
      >
        {detail ? (
          <>
            <h6 className="fs-14 mb-2">Class Information</h6>
            <ul className="list-unstyled fs-13 mb-4">
              {[
                { label: 'Subjects', value: `${detail.subjects.length} in the scheme` },
                { label: 'Exam / Term', value: EXAM },
                { label: 'Marks Closed', value: detail.marksClosedOn },
                { label: 'Academic Year', value: ACADEMIC_YEAR },
                { label: 'Section Report', value: detail.reportRef ?? 'Not raised' },
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
                { label: 'Mean', value: `${meanOf(detail)}` },
                { label: 'Pass', value: passPctOf(detail) === null ? '—' : `${passPctOf(detail)}%` },
                {
                  label: 'Rank',
                  value: detail.rank === null ? 'Withheld' : `${detail.rank} / ${TOTAL_SECTIONS}`,
                },
                { label: 'Overall Grade', value: isCompleteOf(detail) ? gradeLabel(meanOf(detail)) : 'Withheld' },
                {
                  label: 'Strongest Paper',
                  value: `${strongestOf(detail)?.subject} ${strongestOf(detail)?.mean}`,
                },
                { label: 'Weakest Paper', value: `${weakestOf(detail)?.subject} ${weakestOf(detail)?.mean}` },
                { label: 'Spread', value: `${spreadOf(detail)} marks` },
                {
                  label: 'Students Below Pass',
                  value:
                    belowPassOf(detail) === null
                      ? 'Placed with the section mean'
                      : `${belowPassOf(detail)} of ${detail.students}`,
                },
              ].map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>

            <h6 className="fs-14 mb-2">Academic Trends</h6>
            <ul className="list-unstyled fs-13 mb-4">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Change Since Unit Test 1</span>
                <span className="fw-medium">
                  {growthOf(detail) === null
                    ? 'Not placed'
                    : `${growthOf(detail)! > 0 ? '+' : ''}${growthOf(detail)} marks`}
                </span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Rank Movement</span>
                <span className="fw-medium">
                  {detail.previousRank} to {detail.rank ?? 'withheld'}
                </span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Trend</span>
                <span className={`badge badge-soft-${trendTint[trendOf(detail)]}`}>{trendOf(detail)}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Papers Above Seventy Five</span>
                <span className="fw-medium">
                  {papersAboveOf(detail)} of {detail.subjects.filter((s) => s.mean !== null).length}
                </span>
              </li>
            </ul>

            <h6 className="fs-14 mb-2">Attendance Analysis</h6>
            <ul className="list-unstyled fs-13 mb-4">
              {[
                { label: 'Section Attendance', value: `${detail.attendancePct}%` },
                { label: 'Average Present', value: `${avgPresentOf(detail)} of ${WORKING_DAYS} days` },
                { label: 'Average Absent', value: `${avgAbsentOf(detail)} days` },
                { label: 'Teaching Lost', value: `${teachingLostOf(detail)} periods per student` },
                { label: 'Band', value: attendanceBandOf(detail) },
              ].map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>

            <h6 className="fs-14 mb-2">Improvement Actions</h6>
            <ul className="list-unstyled mb-0">
              {detail.actions.map((action) => (
                <li className="border rounded p-2 mb-2" key={action.title}>
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <h6 className="fs-13 mb-0 fw-medium">{action.title}</h6>
                    <span className="badge badge-soft-secondary">{action.state}</span>
                  </div>
                  <span className="fs-12 text-muted d-block">
                    {action.owner} · {action.opened}
                  </span>
                  <p className="fs-12 text-muted mb-0 mt-1">{action.note}</p>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Offcanvas>
    </>
  );
};

export default ClassModals;
