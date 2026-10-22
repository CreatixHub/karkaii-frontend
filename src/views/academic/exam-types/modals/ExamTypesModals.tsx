import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import type {
  CfgToggleKey,
  EditConfigValues,
  EditFieldKey,
  ExamType,
  ExamTypeFormValues,
  ExamTypeModalId,
} from '../data/examTypes.data';
import {
  buildConfig,
  buildEditValues,
  buildToggles,
  configAuditNote,
  defaultToggles,
  editOptions,
  emptyForm,
  examinationRuleToggles,
  itemOptions,
  toggleLabels,
} from '../data/examTypes.data';

export interface ExamTypesModalsProps {
  active: ExamTypeModalId | null;
  row: ExamType | null;
  onClose: () => void;
  onAdd: (values: ExamTypeFormValues) => void;
  onSave: (id: string, values: ExamTypeFormValues) => void;
  onSaveConfig: (id: string, values: EditConfigValues, toggles: Record<CfgToggleKey, boolean>) => void;
  onConfirmDelete: () => void;
  /** The sheet's primary button hands off to the Edit Configuration dialog. */
  onEditConfig: () => void;
  onPrintConfig: () => void;
}

/* -------------------------------------------------------------------------- */
/*                              Shared field parts                            */
/* -------------------------------------------------------------------------- */

const SectionCard = ({
  icon,
  tone,
  title,
  badge,
  wide,
  children,
}: {
  icon: string;
  tone: string;
  title: string;
  badge?: string;
  /** The Edit dialog lays its sections out two-up; the sheet is three-up. */
  wide?: boolean;
  children: ReactNode;
}) => (
  <div className={wide ? 'col-12 col-lg-6 d-flex' : 'col-12 col-xl-4 col-lg-6 d-flex'}>
    <div className="card flex-fill">
      <div
        className={`card-header d-flex align-items-center${
          badge ? ' justify-content-between' : ''
        }`}
      >
        <div className="d-flex align-items-center">
          <span className={`avatar avatar-sm ${tone} rounded me-2`}>
            <i className={icon} />
          </span>
          <h6 className="mb-0">{title}</h6>
        </div>
        {badge ? <span className="badge badge-soft-bordered fs-10">{badge}</span> : null}
      </div>
      {children}
    </div>
  </div>
);

/** The sheet's `list-group` rows — a muted label with either a badge or plain text. */
const ConfigList = ({
  rows,
}: {
  rows: { label: string; value: string; badgeClass?: string }[];
}) => (
  <ul className="list-group list-group-flush">
    {rows.map((entry) => (
      <li
        className="list-group-item d-flex align-items-center justify-content-between"
        key={entry.label}
      >
        <span className="fs-13 text-muted">{entry.label}</span>
        {entry.badgeClass ? (
          <span className={`badge ${entry.badgeClass} d-inline-flex align-items-center`}>
            {entry.badgeClass.includes('success') ? (
              <i className="ti ti-circle-filled fs-5 me-1" />
            ) : null}
            {entry.value}
          </span>
        ) : (
          <span className="fs-13 fw-medium">{entry.value}</span>
        )}
      </li>
    ))}
  </ul>
);

const TextField = ({
  domId,
  label,
  value,
  onChange,
  type = 'text',
  col = 'col-md-6',
}: {
  domId: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  col?: string;
}) => (
  <div className={col}>
    <div className="mb-3">
      <label className="form-label" htmlFor={domId}>
        {label}
      </label>
      <input
        type={type}
        className="form-control"
        id={domId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  </div>
);

const SelectField = ({
  domId,
  label,
  value,
  options,
  onChange,
  col = 'col-md-6',
}: {
  domId: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  col?: string;
}) => (
  <div className={col}>
    <div className="mb-3">
      <label className="form-label" htmlFor={domId}>
        {label}
      </label>
      <select
        className="form-select"
        id={domId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  </div>
);

/** One `form-check form-switch` row — the template's `cfg_*` controls. */
const ToggleRow = ({
  toggleKey,
  checked,
  onChange,
}: {
  toggleKey: CfgToggleKey;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <div className="form-check form-switch mb-0">
    <input
      className="form-check-input"
      type="checkbox"
      role="switch"
      id={toggleKey}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    <label className="form-check-label fs-13" htmlFor={toggleKey}>
      {toggleLabels[toggleKey]}
    </label>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                          Add / Edit Exam Type form                         */
/* -------------------------------------------------------------------------- */

const ExamTypeForm = ({
  prefix,
  values,
  onChange,
}: {
  prefix: string;
  values: ExamTypeFormValues;
  onChange: (patch: Partial<ExamTypeFormValues>) => void;
}) => (
  <div className="row">
    <TextField
      domId={`${prefix}-name`}
      label="Exam Type Name"
      value={values.name}
      onChange={(name) => onChange({ name })}
    />
    <TextField
      domId={`${prefix}-code`}
      label="Short Code"
      value={values.code}
      onChange={(code) => onChange({ code })}
    />
    <SelectField
      domId={`${prefix}-category`}
      label="Assessment Category"
      value={values.category}
      options={itemOptions.assessmentCategory}
      onChange={(category) => onChange({ category })}
    />
    <SelectField
      domId={`${prefix}-year`}
      label="Academic Year"
      value={values.academicYear}
      options={itemOptions.academicYear}
      onChange={(academicYear) => onChange({ academicYear })}
    />
    <TextField
      domId={`${prefix}-total`}
      label="Total Marks"
      value={values.totalMarks}
      onChange={(totalMarks) => onChange({ totalMarks })}
    />
    <TextField
      domId={`${prefix}-pass`}
      label="Pass Marks"
      value={values.passMarks}
      onChange={(passMarks) => onChange({ passMarks })}
    />
    <TextField
      domId={`${prefix}-duration`}
      label="Duration"
      value={values.duration}
      onChange={(duration) => onChange({ duration })}
    />
    <TextField
      domId={`${prefix}-weightage`}
      label="Weightage (%)"
      value={values.weightage}
      onChange={(weightage) => onChange({ weightage })}
    />
    <SelectField
      domId={`${prefix}-status`}
      label="Status"
      value={values.status}
      options={itemOptions.status}
      onChange={(status) => onChange({ status })}
    />
    <div className="col-md-12">
      <div className="mb-0">
        <label className="form-label" htmlFor={`${prefix}-description`}>
          Description
        </label>
        <textarea
          className="form-control"
          rows={3}
          id={`${prefix}-description`}
          value={values.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

const ExamTypesModals = ({
  active,
  row,
  onClose,
  onAdd,
  onSave,
  onSaveConfig,
  onConfirmDelete,
  onEditConfig,
  onPrintConfig,
}: ExamTypesModalsProps) => {
  const [addValues, setAddValues] = useState<ExamTypeFormValues>(emptyForm);
  const [editValues, setEditValues] = useState<ExamTypeFormValues>(emptyForm);
  const [config, setConfig] = useState<EditConfigValues | null>(null);
  const [toggles, setToggles] = useState<Record<CfgToggleKey, boolean>>(defaultToggles);

  // Seed the Edit Exam Type dialog from the row that opened it.
  useEffect(() => {
    if (active !== 'edit' || !row) return;
    setEditValues({
      name: row.name,
      code: row.code,
      category: row.category,
      academicYear: row.academicYear,
      totalMarks: row.totalMarks,
      passMarks: row.passMarks,
      duration: row.duration,
      weightage: `${row.weightage}`,
      status: row.status,
      description: row.description,
    });
  }, [active, row]);

  // Same for the Edit Configuration sheet, switches included.
  useEffect(() => {
    if (active !== 'editConfig' || !row) return;
    setConfig(buildEditValues(row));
    setToggles(buildToggles(row));
  }, [active, row]);

  const subtitle = row
    ? `${row.name}  •  ${row.code}  •  Academic Year ${row.academicYear}`
    : '';

  const patchConfig = (key: EditFieldKey, value: string) =>
    setConfig((current) => (current ? { ...current, [key]: value } : current));

  const patchToggle = (key: CfgToggleKey, value: boolean) =>
    setToggles((current) => ({ ...current, [key]: value }));

  const closeAdd = () => {
    setAddValues(emptyForm);
    onClose();
  };

  const sheet = row ? buildConfig(row) : null;

  return (
    <>
      {/* ------------------------- Configuration Settings ------------------------ */}
      <Modal
        open={active === 'config'}
        onClose={onClose}
        title="Configuration Settings"
        titleIcon="ti ti-settings"
        dialogClassName="modal-dialog-scrollable modal-xl"
        titleAccessory={<p className="mb-0 fs-13 text-muted">{subtitle}</p>}
        footer={
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100">
            <p className="mb-0 fs-12 text-muted">
              <i className="ti ti-history me-1" />
              {configAuditNote}
            </p>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={onPrintConfig}
              >
                <i className="ti ti-printer me-1" />
                Print
              </button>
              <Link to="#" className="btn btn-light" onClick={onClose}>
                Close
              </Link>
              <button type="button" className="btn btn-primary" onClick={onEditConfig}>
                Edit Configuration
              </button>
            </div>
          </div>
        }
      >
        {sheet ? (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <p className="mb-0 fs-13 text-muted">
                Rules applied to every examination created under this exam type
              </p>
              <span className="badge badge-soft-info d-none d-sm-inline-flex align-items-center">
                <i className="ti ti-lock me-1" />
                Read Only Preview
              </span>
            </div>
            <div className="row">
              <SectionCard
                icon="ti ti-info-circle"
                tone="bg-primary-transparent text-primary"
                title="General Information"
              >
                <ConfigList rows={sheet.general} />
              </SectionCard>

              <SectionCard
                icon="ti ti-list-numbers"
                tone="bg-info-transparent text-info"
                title="Marks Configuration"
              >
                <ConfigList rows={sheet.marks} />
              </SectionCard>

              <SectionCard
                icon="ti ti-award"
                tone="bg-purple-transparent text-purple"
                title="Grading System"
                badge={sheet.grading.badge}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="fs-13 text-muted">Grade Scale</span>
                    <span className="fs-13 fw-medium">{sheet.grading.scale}</span>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {sheet.grading.bands.map((band) => (
                      <span className={`badge ${band.badgeClass}`} key={band.grade}>
                        {band.grade}&nbsp;&nbsp;{band.range}
                      </span>
                    ))}
                  </div>
                  <hr className="my-3" />
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fs-13 text-muted">Grade Points</span>
                    <span className="fs-13 fw-medium">{sheet.grading.gradePoints}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fs-13 text-muted">CGPA Calculation</span>
                    <span className="fs-13 fw-medium">{sheet.grading.cgpa}</span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                icon="ti ti-circle-check"
                tone="bg-success-transparent text-success"
                title="Passing Criteria"
              >
                <ConfigList rows={sheet.passing} />
              </SectionCard>

              <SectionCard
                icon="ti ti-chart-pie"
                tone="bg-warning-transparent text-warning"
                title="Weightage"
                badge={sheet.weightage.badge}
              >
                <div className="card-body">
                  {sheet.weightage.components.map((component) => (
                    <div className="mb-3" key={component.label}>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fs-13 text-muted">{component.label}</span>
                        <span className="fs-13 fw-medium">{component.percent}%</span>
                      </div>
                      <div className="progress progress-sm">
                        <div
                          className={`progress-bar ${component.barClass}`}
                          role="progressbar"
                          style={{ width: `${component.percent}%` }}
                          aria-valuenow={component.percent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fs-13 text-muted">Contribution to Final Result</span>
                    <span className="fs-13 fw-medium">{sheet.weightage.contribution}</span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                icon="ti ti-flask"
                tone="bg-skyblue-transparent text-skyblue"
                title="Practical Assessment"
              >
                <ConfigList rows={sheet.practical} />
              </SectionCard>

              <SectionCard
                icon="ti ti-clipboard-text"
                tone="bg-pink-transparent text-pink"
                title="Internal Assessment"
              >
                <ConfigList rows={sheet.internal} />
              </SectionCard>

              <SectionCard
                icon="ti ti-calendar-check"
                tone="bg-teal-transparent text-teal"
                title="Attendance Requirement"
              >
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fs-13 text-muted">Minimum Attendance to Appear</span>
                    <span className="fs-13 fw-medium">{sheet.attendance.minimum}%</span>
                  </div>
                  <div className="progress progress-sm mb-3">
                    <div
                      className="progress-bar bg-teal"
                      role="progressbar"
                      style={{ width: `${sheet.attendance.minimum}%` }}
                      aria-valuenow={sheet.attendance.minimum}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <ul className="list-group list-group-flush">
                    {sheet.attendance.rows.map((entry) => (
                      <li
                        className="list-group-item px-0 d-flex align-items-center justify-content-between"
                        key={entry.label}
                      >
                        <span className="fs-13 text-muted">{entry.label}</span>
                        {entry.badgeClass ? (
                          <span className={`badge ${entry.badgeClass}`}>{entry.value}</span>
                        ) : (
                          <span className="fs-13 fw-medium">{entry.value}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionCard>

              <SectionCard
                icon="ti ti-send"
                tone="bg-danger-transparent text-danger"
                title="Result Publishing"
              >
                <ConfigList rows={sheet.publishing} />
              </SectionCard>

              <SectionCard
                icon="ti ti-stairs-up"
                tone="bg-dark-transparent text-dark"
                title="Promotion Rules"
              >
                <ConfigList rows={sheet.promotion} />
              </SectionCard>
            </div>
          </>
        ) : null}
      </Modal>

      {/* --------------------------- Edit Configuration -------------------------- */}
      <Modal
        open={active === 'editConfig'}
        onClose={onClose}
        title="Edit Configuration"
        titleIcon="ti ti-adjustments"
        dialogClassName="modal-dialog-scrollable modal-xl"
        titleAccessory={<p className="mb-0 fs-13 text-muted">{subtitle}</p>}
        onSubmit={(event) => {
          event.preventDefault();
          if (row && config) onSaveConfig(row.id, config, toggles);
        }}
        footer={
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100">
            <p className="mb-0 fs-12 text-muted">
              <i className="ti ti-history me-1" />
              {configAuditNote}
            </p>
            <div className="d-flex align-items-center gap-2">
              <Link to="#" className="btn btn-light" onClick={onClose}>
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary">
                Save Configuration
              </button>
            </div>
          </div>
        }
      >
        {config ? (
          <>
            <div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                Changes apply to all 18 examinations linked to this exam type and are recorded in
                the audit log.
              </span>
            </div>

            <div className="row">
              <SectionCard
                wide
                icon="ti ti-info-circle"
                tone="bg-primary-transparent text-primary"
                title="General Information"
              >
                <div className="card-body">
                  <div className="row">
                    <TextField
                      domId="exam-type-name"
                      label="Exam Type Name"
                      value={config.examTypeName}
                      onChange={(value) => patchConfig('examTypeName', value)}
                    />
                    <TextField
                      domId="short-code"
                      label="Short Code"
                      value={config.shortCode}
                      onChange={(value) => patchConfig('shortCode', value)}
                    />
                    <SelectField
                      domId="assessment-category-2"
                      label="Assessment Category"
                      value={config.assessmentCategory}
                      options={editOptions.assessmentCategory}
                      onChange={(value) => patchConfig('assessmentCategory', value)}
                    />
                    <SelectField
                      domId="academic-year-2"
                      label="Academic Year"
                      value={config.academicYear}
                      options={editOptions.academicYear}
                      onChange={(value) => patchConfig('academicYear', value)}
                    />
                    <SelectField
                      domId="term-2"
                      label="Term"
                      value={config.term}
                      options={editOptions.term}
                      onChange={(value) => patchConfig('term', value)}
                    />
                    <SelectField
                      domId="status-2"
                      label="Status"
                      value={config.status}
                      options={editOptions.status}
                      onChange={(value) => patchConfig('status', value)}
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                wide
                icon="ti ti-list-numbers"
                tone="bg-info-transparent text-info"
                title="Marks Configuration"
              >
                <div className="card-body">
                  <div className="row">
                    <TextField
                      domId="total-marks"
                      label="Total Marks"
                      value={config.totalMarks}
                      onChange={(value) => patchConfig('totalMarks', value)}
                    />
                    <TextField
                      domId="theory-marks"
                      label="Theory Marks"
                      value={config.theoryMarks}
                      onChange={(value) => patchConfig('theoryMarks', value)}
                    />
                    <TextField
                      domId="practical-marks"
                      label="Practical Marks"
                      value={config.practicalMarks}
                      onChange={(value) => patchConfig('practicalMarks', value)}
                    />
                    <TextField
                      domId="internal-marks"
                      label="Internal Marks"
                      value={config.internalMarks}
                      onChange={(value) => patchConfig('internalMarks', value)}
                    />
                    <SelectField
                      domId="decimal-places"
                      label="Decimal Places"
                      value={config.decimalPlaces}
                      options={editOptions.decimalPlaces}
                      onChange={(value) => patchConfig('decimalPlaces', value)}
                    />
                    <SelectField
                      domId="rounding-method"
                      label="Rounding Method"
                      value={config.roundingMethod}
                      options={editOptions.roundingMethod}
                      onChange={(value) => patchConfig('roundingMethod', value)}
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                wide
                icon="ti ti-award"
                tone="bg-purple-transparent text-purple"
                title="Grading System"
              >
                <div className="card-body">
                  <div className="row">
                    <SelectField
                      domId="grade-scale"
                      label="Grade Scale"
                      value={config.gradeScale}
                      options={editOptions.gradeScale}
                      onChange={(value) => patchConfig('gradeScale', value)}
                    />
                    <SelectField
                      domId="cgpa-calculation"
                      label="CGPA Calculation"
                      value={config.cgpaCalculation}
                      options={editOptions.cgpaCalculation}
                      onChange={(value) => patchConfig('cgpaCalculation', value)}
                    />
                    <TextField
                      domId="highest-grade-boundary"
                      label="Highest Grade Boundary"
                      value={config.highestGradeBoundary}
                      onChange={(value) => patchConfig('highestGradeBoundary', value)}
                    />
                    <TextField
                      domId="lowest-grade-boundary"
                      label="Lowest Grade Boundary"
                      value={config.lowestGradeBoundary}
                      onChange={(value) => patchConfig('lowestGradeBoundary', value)}
                    />
                    <div className="col-md-12">
                      <ToggleRow
                        toggleKey="cfg_grade_points"
                        checked={toggles.cfg_grade_points}
                        onChange={(value) => patchToggle('cfg_grade_points', value)}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                wide
                icon="ti ti-circle-check"
                tone="bg-success-transparent text-success"
                title="Passing Criteria"
              >
                <div className="card-body">
                  <div className="row">
                    <TextField
                      domId="overall-pass-mark"
                      label="Overall Pass Mark"
                      value={config.overallPassMark}
                      onChange={(value) => patchConfig('overallPassMark', value)}
                    />
                    <TextField
                      domId="aggregate-pass"
                      label="Aggregate Pass (%)"
                      value={config.aggregatePass}
                      onChange={(value) => patchConfig('aggregatePass', value)}
                    />
                    <TextField
                      domId="theory-minimum"
                      label="Theory Minimum"
                      value={config.theoryMinimum}
                      onChange={(value) => patchConfig('theoryMinimum', value)}
                    />
                    <TextField
                      domId="practical-minimum"
                      label="Practical Minimum"
                      value={config.practicalMinimum}
                      onChange={(value) => patchConfig('practicalMinimum', value)}
                    />
                    <TextField
                      domId="grace-marks-limit"
                      label="Grace Marks Limit"
                      value={config.graceMarksLimit}
                      onChange={(value) => patchConfig('graceMarksLimit', value)}
                    />
                    <div className="col-md-12">
                      <ToggleRow
                        toggleKey="cfg_subject_pass"
                        checked={toggles.cfg_subject_pass}
                        onChange={(value) => patchToggle('cfg_subject_pass', value)}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                wide
                icon="ti ti-chart-pie"
                tone="bg-warning-transparent text-warning"
                title="Weightage"
              >
                <div className="card-body">
                  <div className="row">
                    <TextField
                      domId="theory-component"
                      label="Theory Component (%)"
                      value={config.theoryComponent}
                      onChange={(value) => patchConfig('theoryComponent', value)}
                    />
                    <TextField
                      domId="practical-component-2"
                      label="Practical Component (%)"
                      value={config.practicalComponent}
                      onChange={(value) => patchConfig('practicalComponent', value)}
                    />
                    <TextField
                      domId="internal-assessment"
                      label="Internal Assessment (%)"
                      value={config.internalAssessment}
                      onChange={(value) => patchConfig('internalAssessment', value)}
                    />
                    <TextField
                      domId="contribution-to-final-result"
                      label="Contribution to Final Result (%)"
                      value={config.contributionToFinalResult}
                      onChange={(value) => patchConfig('contributionToFinalResult', value)}
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                wide
                icon="ti ti-flask"
                tone="bg-skyblue-transparent text-skyblue"
                title="Practical Assessment"
              >
                <div className="card-body">
                  <div className="row">
                    <SelectField
                      domId="applicable-subjects"
                      label="Applicable Subjects"
                      value={config.applicableSubjects}
                      options={editOptions.applicableSubjects}
                      onChange={(value) => patchConfig('applicableSubjects', value)}
                    />
                    <SelectField
                      domId="lab-session-duration"
                      label="Lab Session Duration"
                      value={config.labSessionDuration}
                      options={editOptions.labSessionDuration}
                      onChange={(value) => patchConfig('labSessionDuration', value)}
                    />
                    <TextField
                      domId="record-book-marks"
                      label="Record Book Marks"
                      value={config.recordBookMarks}
                      onChange={(value) => patchConfig('recordBookMarks', value)}
                    />
                    <TextField
                      domId="viva-component"
                      label="Viva Component"
                      value={config.vivaComponent}
                      onChange={(value) => patchConfig('vivaComponent', value)}
                    />
                    <div className="col-md-12 d-flex flex-column gap-2">
                      <ToggleRow
                        toggleKey="cfg_practical"
                        checked={toggles.cfg_practical}
                        onChange={(value) => patchToggle('cfg_practical', value)}
                      />
                      <ToggleRow
                        toggleKey="cfg_external"
                        checked={toggles.cfg_external}
                        onChange={(value) => patchToggle('cfg_external', value)}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                wide
                icon="ti ti-clipboard-text"
                tone="bg-pink-transparent text-pink"
                title="Internal Assessment"
              >
                <div className="card-body">
                  <div className="row">
                    <TextField
                      domId="class-participation"
                      label="Class Participation"
                      value={config.classParticipation}
                      onChange={(value) => patchConfig('classParticipation', value)}
                    />
                    <TextField
                      domId="homework"
                      label="Homework"
                      value={config.homework}
                      onChange={(value) => patchConfig('homework', value)}
                    />
                    <TextField
                      domId="portfolio"
                      label="Portfolio"
                      value={config.portfolio}
                      onChange={(value) => patchConfig('portfolio', value)}
                    />
                    <SelectField
                      domId="evaluated-by"
                      label="Evaluated By"
                      value={config.evaluatedBy}
                      options={editOptions.evaluatedBy}
                      onChange={(value) => patchConfig('evaluatedBy', value)}
                    />
                    <SelectField
                      domId="entry-deadline"
                      label="Entry Deadline"
                      value={config.entryDeadline}
                      options={editOptions.entryDeadline}
                      onChange={(value) => patchConfig('entryDeadline', value)}
                    />
                    <div className="col-md-12">
                      <ToggleRow
                        toggleKey="cfg_internal"
                        checked={toggles.cfg_internal}
                        onChange={(value) => patchToggle('cfg_internal', value)}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                wide
                icon="ti ti-calendar-check"
                tone="bg-teal-transparent text-teal"
                title="Attendance Requirement"
              >
                <div className="card-body">
                  <div className="row">
                    <TextField
                      domId="minimum-attendance"
                      label="Minimum Attendance (%)"
                      value={config.minimumAttendance}
                      onChange={(value) => patchConfig('minimumAttendance', value)}
                    />
                    <TextField
                      domId="condonation-limit"
                      label="Condonation Limit (%)"
                      value={config.condonationLimit}
                      onChange={(value) => patchConfig('condonationLimit', value)}
                    />
                    <SelectField
                      domId="approval-authority"
                      label="Approval Authority"
                      value={config.approvalAuthority}
                      options={editOptions.approvalAuthority}
                      onChange={(value) => patchConfig('approvalAuthority', value)}
                    />
                    <SelectField
                      domId="shortage-notification"
                      label="Shortage Notification"
                      value={config.shortageNotification}
                      options={editOptions.shortageNotification}
                      onChange={(value) => patchConfig('shortageNotification', value)}
                    />
                    <div className="col-md-12">
                      <ToggleRow
                        toggleKey="cfg_medical"
                        checked={toggles.cfg_medical}
                        onChange={(value) => patchToggle('cfg_medical', value)}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                wide
                icon="ti ti-send"
                tone="bg-danger-transparent text-danger"
                title="Result Publishing"
              >
                <div className="card-body">
                  <div className="row">
                    <SelectField
                      domId="publishing-mode"
                      label="Publishing Mode"
                      value={config.publishingMode}
                      options={editOptions.publishingMode}
                      onChange={(value) => patchConfig('publishingMode', value)}
                    />
                    <TextField
                      domId="publish-date"
                      label="Publish Date"
                      value={config.publishDate}
                      onChange={(value) => patchConfig('publishDate', value)}
                    />
                    <SelectField
                      domId="approval-workflow"
                      label="Approval Workflow"
                      value={config.approvalWorkflow}
                      options={editOptions.approvalWorkflow}
                      onChange={(value) => patchConfig('approvalWorkflow', value)}
                    />
                    <SelectField
                      domId="report-card-template"
                      label="Report Card Template"
                      value={config.reportCardTemplate}
                      options={editOptions.reportCardTemplate}
                      onChange={(value) => patchConfig('reportCardTemplate', value)}
                    />
                    <div className="col-md-12 d-flex flex-column gap-2">
                      <ToggleRow
                        toggleKey="cfg_parent_portal"
                        checked={toggles.cfg_parent_portal}
                        onChange={(value) => patchToggle('cfg_parent_portal', value)}
                      />
                      <ToggleRow
                        toggleKey="cfg_alerts"
                        checked={toggles.cfg_alerts}
                        onChange={(value) => patchToggle('cfg_alerts', value)}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                wide
                icon="ti ti-stairs-up"
                tone="bg-dark-transparent text-dark"
                title="Promotion Rules"
              >
                <div className="card-body">
                  <div className="row">
                    <TextField
                      domId="minimum-aggregate"
                      label="Minimum Aggregate (%)"
                      value={config.minimumAggregate}
                      onChange={(value) => patchConfig('minimumAggregate', value)}
                    />
                    <TextField
                      domId="maximum-failed-subjects"
                      label="Maximum Failed Subjects"
                      value={config.maximumFailedSubjects}
                      onChange={(value) => patchConfig('maximumFailedSubjects', value)}
                    />
                    <SelectField
                      domId="detention-policy"
                      label="Detention Policy"
                      value={config.detentionPolicy}
                      options={editOptions.detentionPolicy}
                      onChange={(value) => patchConfig('detentionPolicy', value)}
                    />
                    <SelectField
                      domId="compartment-exam"
                      label="Compartment Exam"
                      value={config.compartmentExam}
                      options={editOptions.compartmentExam}
                      onChange={(value) => patchConfig('compartmentExam', value)}
                    />
                    <div className="col-md-12 d-flex flex-column gap-2">
                      <ToggleRow
                        toggleKey="cfg_promotion"
                        checked={toggles.cfg_promotion}
                        onChange={(value) => patchToggle('cfg_promotion', value)}
                      />
                      <ToggleRow
                        toggleKey="cfg_committee"
                        checked={toggles.cfg_committee}
                        onChange={(value) => patchToggle('cfg_committee', value)}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Examination Rules — the six page-wide switches */}
              <div className="col-12 d-flex">
                <div className="card flex-fill">
                  <div className="card-header d-flex align-items-center">
                    <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded me-2">
                      <i className="ti ti-gavel" />
                    </span>
                    <h6 className="mb-0">Examination Rules</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      {examinationRuleToggles.map((toggle) => (
                        <div className="col-md-6 col-xl-4" key={toggle.key}>
                          <ToggleRow
                            toggleKey={toggle.key}
                            checked={toggles[toggle.key]}
                            onChange={(value) => patchToggle(toggle.key, value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* ------------------------------ Add Exam Type ---------------------------- */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Exam Type"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(addValues);
          setAddValues(emptyForm);
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Add Exam Type
            </button>
          </>
        }
      >
        <ExamTypeForm
          prefix="et-add"
          values={addValues}
          onChange={(patch) => setAddValues((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* ------------------------------ Edit Exam Type --------------------------- */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Exam Type"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          if (row) onSave(row.id, editValues);
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <ExamTypeForm
          prefix="et-edit"
          values={editValues}
          onChange={(patch) => setEditValues((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* ---------------------------- Delete confirmation ------------------------ */}
      <Modal
        open={active === 'delete'}
        onClose={onClose}
        title="Confirm Deletion"
        hideHeader
        bodyClassName="text-center"
        onSubmit={(event) => {
          event.preventDefault();
          onConfirmDelete();
        }}
      >
        <span className="delete-icon">
          <i className="ti ti-trash-x" />
        </span>
        <h4>Confirm Deletion</h4>
        <p>You want to delete all the marked items, this cant be undone once you delete.</p>
        <div className="d-flex justify-content-center">
          <Link to="#" className="btn btn-light me-3" onClick={onClose}>
            Cancel
          </Link>
          <button type="submit" className="btn btn-danger">
            Yes, Delete
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ExamTypesModals;
