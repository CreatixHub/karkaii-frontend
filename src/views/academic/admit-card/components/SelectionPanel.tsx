import type { AdmitCardStudent, SelectOption } from '../data/admitCard.data';
import { academicYears, classes, examinations, sections, strings } from '../data/admitCard.data';

export interface SelectionDraft {
  academicYear: string;
  examination: string;
  classId: string;
  sectionId: string;
  studentId: string;
}

export interface SelectionPanelProps {
  draft: SelectionDraft;
  onDraft: (patch: Partial<SelectionDraft>) => void;
  /** Candidates left after the class, section, search and batch filters. */
  candidates: AdmitCardStudent[];
  dirty: boolean;
  onApply: () => void;
  onReset: () => void;
}

const examinationOptions: SelectOption[] = examinations.map((exam) => ({
  id: exam.id,
  label: exam.label,
}));

const SelectionPanel = ({
  draft,
  onDraft,
  candidates,
  dirty,
  onApply,
  onReset,
}: SelectionPanelProps) => (
  <div className="card">
    <div className="card-header d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <span className="avatar avatar-sm bg-primary-transparent text-primary rounded me-2">
          <i className="ti ti-filter" />
        </span>
        <h5 className="mb-0 fs-15">Student &amp; Exam Selection</h5>
      </div>
      <span className="badge badge-soft-bordered fs-10">{strings.batchSize}</span>
    </div>
    <div className="card-body">
      <div className="row g-3">
        <div className="col-xxl-2 col-lg-4 col-sm-6">
          <label className="form-label mb-1" htmlFor="ac-academic-year">
            Academic Year
          </label>
          <select
            className="form-select"
            id="ac-academic-year"
            value={draft.academicYear}
            onChange={(event) => onDraft({ academicYear: event.target.value })}
          >
            {academicYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-xxl-3 col-lg-4 col-sm-6">
          <label className="form-label mb-1" htmlFor="ac-examination">
            Examination
          </label>
          <select
            className="form-select"
            id="ac-examination"
            value={draft.examination}
            onChange={(event) => onDraft({ examination: event.target.value })}
          >
            {examinationOptions.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-xxl-2 col-lg-4 col-sm-6">
          <label className="form-label mb-1" htmlFor="ac-class">
            Class
          </label>
          <select
            className="form-select"
            id="ac-class"
            value={draft.classId}
            onChange={(event) => onDraft({ classId: event.target.value })}
          >
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-xxl-2 col-lg-4 col-sm-6">
          <label className="form-label mb-1" htmlFor="ac-section">
            Section
          </label>
          <select
            className="form-select"
            id="ac-section"
            value={draft.sectionId}
            onChange={(event) => onDraft({ sectionId: event.target.value })}
          >
            {sections.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-xxl-3 col-lg-8 col-sm-6">
          <label className="form-label mb-1" htmlFor="ac-student">
            Student
          </label>
          <select
            className="form-select"
            id="ac-student"
            value={draft.studentId}
            disabled={candidates.length === 0}
            onChange={(event) => onDraft({ studentId: event.target.value })}
          >
            {candidates.length === 0 ? (
              <option value="">No student in this selection</option>
            ) : null}
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name} · {candidate.id}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
    <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
      <p className="mb-0 fs-12 text-muted">
        <i className="ti ti-history me-1" />
        {strings.lastGenerated}
      </p>
      <div className="d-flex align-items-center gap-2">
        <button type="button" className="btn btn-light btn-sm" onClick={onReset}>
          Reset
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={!dirty || candidates.length === 0}
          onClick={onApply}
        >
          Apply Selection
        </button>
      </div>
    </div>
  </div>
);

export default SelectionPanel;
