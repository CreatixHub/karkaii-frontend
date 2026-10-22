import { Fragment, useState } from 'react';
import DateField from '@components/ui/DateField';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Modal from '@components/ui/Modal';
import CommonSelect from '@core/common/commonSelect';
import type { DetailStat, PerformanceModalId } from '../data/studentPerformance.data';
import type { RadioOption, SwitchField } from '../data/performanceDialogs.data';
import {
  compareBasisOptions,
  compareRows,
  compareStudents,
  compareSummary,
  compareWithOptions,
  planMeasuredAt,
  planOwners,
  planStateOptions,
  planStudent,
  planSupport,
  planSwitches,
  remarkAreas,
  remarkExams,
  remarkStudent,
  remarkSwitches,
  remarkTeachers,
  remarkTones,
  reportGeneratedBy,
  reportScopeOptions,
  reportSummary,
  reportSwitches,
  reportTemplates,
  shareAudienceOptions,
  shareChannels,
  shareExpiry,
  shareInclude,
  shareMessage,
  shareStudent,
  shareSwitches,
  subjectMovementRows,
  viewAttendanceStats,
  viewGrowthStats,
  viewHeader,
  viewNote,
  viewRemarkRows,
  viewSubjectRows,
  viewTiles,
} from '../data/performanceDialogs.data';

dayjs.extend(customParseFormat);


const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

const initialSwitches = (fields: SwitchField[]) =>
  fields.reduce<Record<string, boolean>>((all, field) => {
    all[field.id] = field.checked;
    return all;
  }, {});

/** The `label / value` rows the dialogs share with the expanded grid rows. */
const StatRows = ({ stats }: { stats: DetailStat[] }) => (
  <>
    {stats.map((stat, index) => (
      <div
        className={`d-flex align-items-center justify-content-between ${
          index === stats.length - 1 ? 'mb-0' : 'mb-2'
        }`}
        key={stat.label}
      >
        <span className="fs-13 text-muted">{stat.label}</span>
        {stat.badge ? (
          <span className={stat.badge}>
            {stat.badgeIcon ? <i className={`${stat.badgeIcon} me-1`} /> : null}
            {stat.value}
          </span>
        ) : (
          <span className="fs-13 fw-medium">{stat.value}</span>
        )}
      </div>
    ))}
  </>
);

const RadioGroup = ({
  name,
  label,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (id: string) => void;
}) => (
  <div className="custom-btn-group custom-btn-group-fill mb-3" role="group" aria-label={label}>
    {options.map((option) => (
      <Fragment key={option.id}>
        <input
          type="radio"
          className="btn-check"
          name={name}
          id={option.id}
          checked={value === option.id}
          onChange={() => onChange(option.id)}
        />
        <label className="btn" htmlFor={option.id}>
          {option.label}
        </label>
      </Fragment>
    ))}
  </div>
);

const Switches = ({
  fields,
  values,
  onToggle,
}: {
  fields: SwitchField[];
  values: Record<string, boolean>;
  onToggle: (id: string) => void;
}) => (
  <>
    {fields.map((field, index) => (
      <div
        className={`form-check form-switch ${index === fields.length - 1 ? 'mb-0' : 'mb-2'}`}
        key={field.id}
      >
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={field.id}
          checked={values[field.id] ?? false}
          onChange={() => onToggle(field.id)}
        />
        <label className="form-check-label fs-13" htmlFor={field.id}>
          {field.label}
        </label>
      </div>
    ))}
  </>
);

/** The student summary block the remark, plan and share dialogs open with. */
const StudentCard = ({
  tint,
  badge,
  name,
  meta,
  level,
  stats,
  footLabel,
  footValue,
  footClass,
}: {
  tint: string;
  badge: string;
  name: string;
  meta: string;
  level: string;
  stats: DetailStat[];
  footLabel: string;
  footValue: string;
  footClass: string;
}) => (
  <div className="border rounded p-3 mb-3">
    <div className="d-flex align-items-center mb-3">
      <span className={`avatar avatar-md ${tint} rounded flex-shrink-0`}>
        <i className="ti ti-user" />
      </span>
      <div className="ms-2">
        <h5 className="fs-14 mb-0">{name}</h5>
        <span className="fs-12 text-muted">{meta}</span>
      </div>
      <div className="ms-auto text-end">
        <span className="fs-12 text-muted d-block">Level</span>
        <span className={badge}>{level}</span>
      </div>
    </div>
    {stats.map((stat) => (
      <div className="d-flex align-items-center justify-content-between mb-2" key={stat.label}>
        <span className="fs-13 text-muted">{stat.label}</span>
        <span className="fs-13 fw-medium">{stat.value}</span>
      </div>
    ))}
    <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
      <span className="fs-13 fw-medium">{footLabel}</span>
      <span className={`fs-13 fw-semibold ${footClass}`}>{footValue}</span>
    </div>
  </div>
);

export interface PerformanceModalsProps {
  active: PerformanceModalId | null;
  onClose: () => void;
  onOpen: (modal: PerformanceModalId) => void;
  onOpenPanel: () => void;
  onToast: (message: string) => void;
}

const PerformanceModals = ({
  active,
  onClose,
  onOpen,
  onOpenPanel,
  onToast,
}: PerformanceModalsProps) => {
  /* Compare */
  const [compareBasis, setCompareBasis] = useState('cmpExam');
  const [compareStudent, setCompareStudent] = useState(compareStudents[0]);
  const [compareWith, setCompareWith] = useState(compareWithOptions[0]);

  /* Add Teacher Remarks */
  const [remarkTeacher, setRemarkTeacher] = useState(remarkTeachers[0]);
  const [remarkArea, setRemarkArea] = useState(remarkAreas[0]);
  const [remarkExam, setRemarkExam] = useState(remarkExams[0]);
  const [remarkDate, setRemarkDate] = useState('31-07-2026');
  const [remarkTone, setRemarkTone] = useState(remarkTones[0]);
  const [remarkText, setRemarkText] = useState('');
  const [remarkFlags, setRemarkFlags] = useState(() => initialSwitches(remarkSwitches));

  /* Improvement Plan */
  const [planState, setPlanState] = useState('planActive');
  const [planReference, setPlanReference] = useState('IMP-2026-0074');
  const [planOwner, setPlanOwner] = useState(planOwners[0]);
  const [planFocus, setPlanFocus] = useState('Mathematics, Hindi and attendance');
  const [subjectTarget, setSubjectTarget] = useState('Mathematics 55');
  const [attendanceTarget, setAttendanceTarget] = useState('85%');
  const [reviewBy, setReviewBy] = useState('07-08-2026');
  const [openedOn, setOpenedOn] = useState('26-06-2026');
  const [measuredAt, setMeasuredAt] = useState(planMeasuredAt[0]);
  const [support, setSupport] = useState(planSupport);
  const [planFlags, setPlanFlags] = useState(() => initialSwitches(planSwitches));

  /* Generate Report Card */
  const [reportScope, setReportScope] = useState('rcOne');
  const [reportTemplate, setReportTemplate] = useState(reportTemplates[0]);
  const [reportExam, setReportExam] = useState(remarkExams[0]);
  const [generatedBy, setGeneratedBy] = useState(reportGeneratedBy[0]);
  const [runDate, setRunDate] = useState('31-07-2026');
  const [reportFlags, setReportFlags] = useState(() => initialSwitches(reportSwitches));

  /* Share Performance Report */
  const [shareAudience, setShareAudience] = useState('shpGuard');
  const [shareChannel, setShareChannel] = useState(shareChannels[0]);
  const [shareLinkExpiry, setShareLinkExpiry] = useState(shareExpiry[0]);
  const [shareIncludes, setShareIncludes] = useState(shareInclude[0]);
  const [shareText, setShareText] = useState(shareMessage);
  const [shareFlags, setShareFlags] = useState(() => initialSwitches(shareSwitches));

  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message);
    onClose();
  };

  const cancel = (label: string) => (
    <button type="button" className="btn btn-light me-2" onClick={onClose}>
      {label}
    </button>
  );

  return (
    <>
      {/* ---------------------------- View Performance ---------------------------- */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title={viewHeader.name}
        dialogClassName="modal-lg"
        titleAccessory={<p className="mb-0 fs-12 text-muted ms-2">{viewHeader.meta}</p>}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('compare')}>
              <i className="ti ti-git-compare me-1" />
              Compare
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onOpenPanel();
              }}
            >
              <i className="ti ti-chart-arrows me-1" />
              Open Performance Panel
            </button>
          </>
        }
      >
        <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
          <span className="avatar avatar-lg bg-success-transparent text-success rounded flex-shrink-0">
            <i className="ti ti-user-star fs-20" />
          </span>
          <div>
            <h5 className="mb-0 fs-15">{viewHeader.roll}</h5>
            <span className="fs-12 text-muted">{viewHeader.evaluated}</span>
          </div>
          <span className="badge badge-soft-success ms-auto">{viewHeader.level}</span>
        </div>
        <div className="row g-3 mb-3">
          {viewTiles.map((tile) => (
            <div className="col-md-3" key={tile.id}>
              <div className="d-flex align-items-center gap-2 border rounded p-3 h-100">
                <span className={`avatar avatar-md ${tile.tint} rounded flex-shrink-0`}>
                  <i className={tile.icon} />
                </span>
                <div className="overflow-hidden">
                  <span className="fs-12 text-muted d-block">{tile.label}</span>
                  <h6 className="fs-14 mb-0 text-truncate">{tile.value}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
        <h6 className="fs-13 mb-2">Subject-wise Performance</h6>
        <div className="table-responsive border rounded mb-3">
          <table className="table table-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th className="fs-13">Subject</th>
                <th className="fs-13">Marks</th>
                <th className="fs-13">Max</th>
                <th className="fs-13">Grade</th>
                <th className="fs-13">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {viewSubjectRows.map((row) => (
                <tr className={row.total ? 'table-light' : undefined} key={row.subject}>
                  <td className={row.total ? 'fs-13 fw-semibold' : 'fs-13'}>{row.subject}</td>
                  <td className={row.total ? 'fs-13 fw-semibold' : 'fs-13'}>{row.marks}</td>
                  <td className={row.total ? 'fs-13 fw-semibold' : 'fs-13'}>{row.max}</td>
                  <td>
                    <span className={row.gradeBadge}>{row.grade}</span>
                  </td>
                  <td className={row.total ? 'fs-13 fw-semibold' : 'fs-13'}>{row.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <h6 className="fs-13 mb-2">Growth Since Unit Test 1</h6>
            <div className="border rounded p-3">
              <StatRows stats={viewGrowthStats} />
            </div>
          </div>
          <div className="col-md-6">
            <h6 className="fs-13 mb-2">Attendance Impact</h6>
            <div className="border rounded p-3">
              <StatRows stats={viewAttendanceStats} />
            </div>
          </div>
        </div>
        <h6 className="fs-13 mb-2">Teacher Remarks</h6>
        <div className="table-responsive border rounded mb-3">
          <table className="table table-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th className="fs-13">Date</th>
                <th className="fs-13">Teacher</th>
                <th className="fs-13">Subject</th>
              </tr>
            </thead>
            <tbody>
              {viewRemarkRows.map((row) => (
                <tr key={row.date}>
                  <td className="fs-13">{row.date}</td>
                  <td className="fs-13">{row.teacher}</td>
                  <td className="fs-13">{row.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h6 className="fs-13 mb-1">Internal Notes</h6>
        <p className="fs-13 text-muted mb-0">{viewNote}</p>
      </Modal>

      {/* ---------------------------- Compare Performance ---------------------------- */}
      <Modal
        open={active === 'compare'}
        onClose={onClose}
        title="Compare Performance"
        dialogClassName="modal-lg"
        onSubmit={submit('Comparison exported')}
        footer={
          <>
            {cancel('Close')}
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-download me-1" />
              Export Comparison
            </button>
          </>
        }
      >
        <p className="mb-2 fs-13 text-muted">Compare against</p>
        <RadioGroup
          name="cmp_basis"
          label="Comparison basis"
          options={compareBasisOptions}
          value={compareBasis}
          onChange={setCompareBasis}
        />
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <div className="mb-0">
              <label className="form-label" htmlFor="student">
                Student
              </label>
              <CommonSelect
                inputId="student"
                className="select"
                options={toOptions(compareStudents)}
                value={{ value: compareStudent, label: compareStudent }}
                onChange={(option) => setCompareStudent(option?.value ?? compareStudents[0])}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-0">
              <label className="form-label" htmlFor="compare-with">
                Compare With
              </label>
              <CommonSelect
                inputId="compare-with"
                className="select"
                options={toOptions(compareWithOptions)}
                value={{ value: compareWith, label: compareWith }}
                onChange={(option) => setCompareWith(option?.value ?? compareWithOptions[0])}
              />
            </div>
          </div>
        </div>
        <div className="table-responsive border rounded mb-3">
          <table className="table table-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th className="fs-13">Assessment</th>
                <th className="fs-13">Percentage</th>
                <th className="fs-13">Grade</th>
                <th className="fs-13">Rank</th>
                <th className="fs-13">Change</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.assessment}>
                  <td className="fs-13">{row.assessment}</td>
                  <td className={row.percentageMuted ? 'fs-13 text-muted' : 'fs-13'}>
                    {row.percentage}
                  </td>
                  {row.gradeMuted ? (
                    <td className="fs-13 text-muted">{row.grade}</td>
                  ) : (
                    <td>
                      <span className={row.gradeBadge}>{row.grade}</span>
                    </td>
                  )}
                  <td className={row.rankMuted ? 'fs-13 text-muted' : 'fs-13'}>{row.rank}</td>
                  {row.changeBadge ? (
                    <td>
                      <span className={row.changeBadge}>
                        {row.changeIcon ? <i className={`${row.changeIcon} me-1`} /> : null}
                        {row.change}
                      </span>
                    </td>
                  ) : (
                    <td className="fs-13 text-muted">{row.change}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h5 className="fs-13 mb-2">Subject Movement</h5>
        <div className="table-responsive border rounded mb-3">
          <table className="table table-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th className="fs-13">Subject</th>
                <th className="fs-13">Unit Test 1</th>
                <th className="fs-13">Term 1 Exam</th>
                <th className="fs-13">Change</th>
              </tr>
            </thead>
            <tbody>
              {subjectMovementRows.map((row) => (
                <tr key={row.subject}>
                  <td className="fs-13">{row.subject}</td>
                  <td className="fs-13">{row.unitTest}</td>
                  <td className="fs-13">{row.term}</td>
                  <td>
                    <span className="badge badge-soft-success">
                      <i className="ti ti-trending-up me-1" />
                      {row.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border rounded p-3">
          <StatRows stats={compareSummary} />
        </div>
      </Modal>

      {/* ---------------------------- Add Teacher Remarks ---------------------------- */}
      <Modal
        open={active === 'remarks'}
        onClose={onClose}
        title="Add Teacher Remarks"
        onSubmit={submit('Remark saved')}
        footer={
          <>
            {cancel('Cancel')}
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-writing me-1" />
              Save Remark
            </button>
          </>
        }
      >
        <div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
          <i className="ti ti-alert-triangle me-2" />
          <span className="fs-13">
            Kabir Shah has no performance level yet. Science is still open on MRK-2026-0218.
          </span>
        </div>
        <StudentCard
          tint="bg-secondary-transparent text-secondary"
          badge="badge badge-soft-secondary"
          name={remarkStudent.name}
          meta={remarkStudent.meta}
          level={remarkStudent.level}
          stats={remarkStudent.stats}
          footLabel={remarkStudent.footLabel}
          footValue={remarkStudent.footValue}
          footClass="text-danger"
        />
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="teacher">
                Teacher
              </label>
              <CommonSelect
                inputId="teacher"
                className="select"
                options={toOptions(remarkTeachers)}
                value={{ value: remarkTeacher, label: remarkTeacher }}
                onChange={(option) => setRemarkTeacher(option?.value ?? remarkTeachers[0])}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="subject-or-area">
                Subject or Area
              </label>
              <CommonSelect
                inputId="subject-or-area"
                className="select"
                options={toOptions(remarkAreas)}
                value={{ value: remarkArea, label: remarkArea }}
                onChange={(option) => setRemarkArea(option?.value ?? remarkAreas[0])}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="exam-term-2">
                Exam / Term
              </label>
              <CommonSelect
                inputId="exam-term-2"
                className="select"
                options={toOptions(remarkExams)}
                value={{ value: remarkExam, label: remarkExam }}
                onChange={(option) => setRemarkExam(option?.value ?? remarkExams[0])}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="date">
                Date
              </label>
              <DateField
                id="date"
                value={remarkDate}
                onChange={(dateString) => setRemarkDate(dateString as string)}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="tone">
                Tone
              </label>
              <CommonSelect
                inputId="tone"
                className="select"
                options={toOptions(remarkTones)}
                value={{ value: remarkTone, label: remarkTone }}
                onChange={(option) => setRemarkTone(option?.value ?? remarkTones[0])}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="remark">
                Remark
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Printed on the report card and visible to the guardians"
                id="remark"
                value={remarkText}
                onChange={(event) => setRemarkText(event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-12">
            <Switches
              fields={remarkSwitches}
              values={remarkFlags}
              onToggle={(id) => setRemarkFlags((flags) => ({ ...flags, [id]: !flags[id] }))}
            />
          </div>
        </div>
      </Modal>

      {/* ---------------------------- Create Improvement Plan ---------------------------- */}
      <Modal
        open={active === 'plan'}
        onClose={onClose}
        title="Create Improvement Plan"
        dialogClassName="modal-lg"
        titleAccessory={
          <p className="mb-0 fs-12 text-muted ms-2">Set the targets that close the plan</p>
        }
        onSubmit={submit('Improvement plan saved')}
        footer={
          <>
            {cancel('Cancel')}
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-target me-1" />
              Save Plan
            </button>
          </>
        }
      >
        <StudentCard
          tint="bg-danger-transparent text-danger"
          badge="badge badge-soft-danger"
          name={planStudent.name}
          meta={planStudent.meta}
          level={planStudent.level}
          stats={planStudent.stats}
          footLabel={planStudent.footLabel}
          footValue={planStudent.footValue}
          footClass="text-danger"
        />
        <p className="mb-2 fs-13 text-muted">Plan state</p>
        <RadioGroup
          name="plan_state"
          label="Plan state"
          options={planStateOptions}
          value={planState}
          onChange={setPlanState}
        />
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="plan-reference">
                Plan Reference
              </label>
              <input
                type="text"
                className="form-control"
                id="plan-reference"
                value={planReference}
                onChange={(event) => setPlanReference(event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="owner">
                Owner
              </label>
              <CommonSelect
                inputId="owner"
                className="select"
                options={toOptions(planOwners)}
                value={{ value: planOwner, label: planOwner }}
                onChange={(option) => setPlanOwner(option?.value ?? planOwners[0])}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="focus-areas">
                Focus Areas
              </label>
              <input
                type="text"
                className="form-control"
                id="focus-areas"
                value={planFocus}
                onChange={(event) => setPlanFocus(event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-12">
            <hr className="my-2" />
            <p className="fs-13 fw-medium mb-2">Targets</p>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="subject-target">
                Subject Target
              </label>
              <input
                type="text"
                className="form-control"
                id="subject-target"
                value={subjectTarget}
                onChange={(event) => setSubjectTarget(event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="attendance-target">
                Attendance Target
              </label>
              <input
                type="text"
                className="form-control"
                id="attendance-target"
                value={attendanceTarget}
                onChange={(event) => setAttendanceTarget(event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="review-by">
                Review By
              </label>
              <DateField
                id="review-by"
                value={reviewBy}
                onChange={(dateString) => setReviewBy(dateString as string)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="opened-on">
                Opened On
              </label>
              <DateField
                id="opened-on"
                value={openedOn}
                onChange={(dateString) => setOpenedOn(dateString as string)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="measured-at">
                Measured At
              </label>
              <CommonSelect
                inputId="measured-at"
                className="select"
                options={toOptions(planMeasuredAt)}
                value={{ value: measuredAt, label: measuredAt }}
                onChange={(option) => setMeasuredAt(option?.value ?? planMeasuredAt[0])}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="support-arranged">
                Support Arranged
              </label>
              <textarea
                className="form-control"
                rows={2}
                id="support-arranged"
                value={support}
                onChange={(event) => setSupport(event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-12">
            <Switches
              fields={planSwitches}
              values={planFlags}
              onToggle={(id) => setPlanFlags((flags) => ({ ...flags, [id]: !flags[id] }))}
            />
          </div>
        </div>
      </Modal>

      {/* ---------------------------- Generate Report Card ---------------------------- */}
      <Modal
        open={active === 'reportCard'}
        onClose={onClose}
        title="Generate Report Card"
        onSubmit={submit('Report card generated')}
        footer={
          <>
            {cancel('Cancel')}
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-report me-1" />
              Generate
            </button>
          </>
        }
      >
        <div className="alert alert-info d-flex align-items-center mb-3" role="alert">
          <i className="ti ti-info-circle me-2" />
          <span className="fs-13">
            A student with an open subject is skipped. Kabir Shah is the only one in this selection.
          </span>
        </div>
        <p className="mb-2 fs-13 text-muted">Scope</p>
        <RadioGroup
          name="rc_scope"
          label="Report scope"
          options={reportScopeOptions}
          value={reportScope}
          onChange={setReportScope}
        />
        <div className="border rounded p-3 mb-3">
          <StatRows stats={reportSummary} />
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="template">
                Template
              </label>
              <CommonSelect
                inputId="template"
                className="select"
                options={toOptions(reportTemplates)}
                value={{ value: reportTemplate, label: reportTemplate }}
                onChange={(option) => setReportTemplate(option?.value ?? reportTemplates[0])}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="exam-term-3">
                Exam / Term
              </label>
              <CommonSelect
                inputId="exam-term-3"
                className="select"
                options={toOptions(remarkExams)}
                value={{ value: reportExam, label: reportExam }}
                onChange={(option) => setReportExam(option?.value ?? remarkExams[0])}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="generated-by">
                Generated By
              </label>
              <CommonSelect
                inputId="generated-by"
                className="select"
                options={toOptions(reportGeneratedBy)}
                value={{ value: generatedBy, label: generatedBy }}
                onChange={(option) => setGeneratedBy(option?.value ?? reportGeneratedBy[0])}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="run-date">
                Run Date
              </label>
              <DateField
                id="run-date"
                value={runDate}
                onChange={(dateString) => setRunDate(dateString as string)}
              />
            </div>
          </div>
          <div className="col-md-12">
            <Switches
              fields={reportSwitches}
              values={reportFlags}
              onToggle={(id) => setReportFlags((flags) => ({ ...flags, [id]: !flags[id] }))}
            />
          </div>
        </div>
      </Modal>

      {/* ---------------------------- Share Performance Report ---------------------------- */}
      <Modal
        open={active === 'share'}
        onClose={onClose}
        title="Share Performance Report"
        onSubmit={submit('Performance report shared')}
        footer={
          <>
            {cancel('Cancel')}
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-share me-1" />
              Share
            </button>
          </>
        }
      >
        <StudentCard
          tint="bg-warning-transparent text-warning"
          badge="badge badge-soft-warning"
          name={shareStudent.name}
          meta={shareStudent.meta}
          level={shareStudent.level}
          stats={shareStudent.stats}
          footLabel={shareStudent.footLabel}
          footValue={shareStudent.footValue}
          footClass="text-warning"
        />
        <p className="mb-2 fs-13 text-muted">Send to</p>
        <RadioGroup
          name="shp_who"
          label="Audience"
          options={shareAudienceOptions}
          value={shareAudience}
          onChange={setShareAudience}
        />
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="channel">
                Channel
              </label>
              <CommonSelect
                inputId="channel"
                className="select"
                options={toOptions(shareChannels)}
                value={{ value: shareChannel, label: shareChannel }}
                onChange={(option) => setShareChannel(option?.value ?? shareChannels[0])}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="link-expiry">
                Link Expiry
              </label>
              <CommonSelect
                inputId="link-expiry"
                className="select"
                options={toOptions(shareExpiry)}
                value={{ value: shareLinkExpiry, label: shareLinkExpiry }}
                onChange={(option) => setShareLinkExpiry(option?.value ?? shareExpiry[0])}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="include">
                Include
              </label>
              <CommonSelect
                inputId="include"
                className="select"
                options={toOptions(shareInclude)}
                value={{ value: shareIncludes, label: shareIncludes }}
                onChange={(option) => setShareIncludes(option?.value ?? shareInclude[0])}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="message">
                Message
              </label>
              <textarea
                className="form-control"
                rows={2}
                id="message"
                value={shareText}
                onChange={(event) => setShareText(event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-12">
            <Switches
              fields={shareSwitches}
              values={shareFlags}
              onToggle={(id) => setShareFlags((flags) => ({ ...flags, [id]: !flags[id] }))}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PerformanceModals;
