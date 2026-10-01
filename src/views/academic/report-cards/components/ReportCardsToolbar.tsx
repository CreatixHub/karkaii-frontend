import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type {
  ClassId,
  ExamId,
  ReportCardRecord,
  SectionId,
  SelectOption,
  YearId,
} from '../data/reportCards.data';
import {
  academicYears,
  classes,
  exams,
  pad2,
  sections,
} from '../data/reportCards.data';

interface ScopeSelectProps<Id extends string> {
  /** Page-slugged so the ids stay unique once every page shares one SPA. */
  domId: string;
  label: string;
  colClass: string;
  value: Id;
  options: SelectOption<Id>[];
  onChange: (value: Id) => void;
}

const ScopeSelect = <Id extends string>({
  domId,
  label,
  colClass,
  value,
  options,
  onChange,
}: ScopeSelectProps<Id>) => (
  <div className={colClass}>
    <label className="form-label fs-12 mb-1" htmlFor={domId}>
      {label}
    </label>
    <select
      className="form-select"
      id={domId}
      value={value}
      onChange={(event) => onChange(event.target.value as Id)}
    >
      {options.map((option) => (
        <option value={option.id} key={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export interface ReportCardsToolbarProps {
  year: YearId;
  onYear: (value: YearId) => void;
  exam: ExamId;
  onExam: (value: ExamId) => void;
  classId: ClassId;
  onClass: (value: ClassId) => void;
  sectionId: SectionId;
  onSection: (value: SectionId) => void;
  query: string;
  onQuery: (value: string) => void;
  /** The scoped cohort, already narrowed by the query. */
  matches: ReportCardRecord[];
  pickerOpen: boolean;
  onPickerOpen: (open: boolean) => void;
  selectedId: string | null;
  onSelectStudent: (id: string) => void;
  generatedAt: string;
  readyCount: number;
  totalCount: number;
  onPrint: () => void;
  onDownload: () => void;
  onGenerate: () => void;
  generating: boolean;
}

const ReportCardsToolbar = ({
  year,
  onYear,
  exam,
  onExam,
  classId,
  onClass,
  sectionId,
  onSection,
  query,
  onQuery,
  matches,
  pickerOpen,
  onPickerOpen,
  selectedId,
  onSelectStudent,
  generatedAt,
  readyCount,
  totalCount,
  onPrint,
  onDownload,
  onGenerate,
  generating,
}: ReportCardsToolbarProps) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) onPickerOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onPickerOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pickerOpen, onPickerOpen]);

  return (
    <div className="card">
      <div className="card-body">
        <div className="row g-2 align-items-end">
          <ScopeSelect
            domId="rc-academic-year"
            label="Academic Year"
            colClass="col-xxl-2 col-lg-4 col-sm-6"
            value={year}
            options={academicYears}
            onChange={onYear}
          />
          <ScopeSelect
            domId="rc-exam"
            label="Exam"
            colClass="col-xxl-3 col-lg-4 col-sm-6"
            value={exam}
            options={exams}
            onChange={onExam}
          />
          <ScopeSelect
            domId="rc-class"
            label="Class"
            colClass="col-xxl-2 col-lg-4 col-sm-6"
            value={classId}
            options={classes}
            onChange={onClass}
          />
          <ScopeSelect
            domId="rc-section"
            label="Section"
            colClass="col-xxl-2 col-lg-4 col-sm-6"
            value={sectionId}
            options={sections}
            onChange={onSection}
          />

          <div className="col-xxl-3 col-lg-8 col-sm-12">
            <label className="form-label fs-12 mb-1" htmlFor="rc-student">
              Student
            </label>
            <div className="dropdown" ref={pickerRef}>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0">
                  <i className="ti ti-search" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search name, roll or admission number"
                  id="rc-student"
                  role="combobox"
                  autoComplete="off"
                  aria-expanded={pickerOpen}
                  aria-controls="rc-student-matches"
                  value={query}
                  onFocus={() => onPickerOpen(true)}
                  onChange={(event) => {
                    onQuery(event.target.value);
                    onPickerOpen(true);
                  }}
                />
                {query ? (
                  <button
                    type="button"
                    className="input-group-text bg-white border-start-0"
                    aria-label="Clear student search"
                    onClick={() => {
                      onQuery('');
                      onPickerOpen(false);
                    }}
                  >
                    <i className="ti ti-x" />
                  </button>
                ) : null}
              </div>

              <ul
                className={`dropdown-menu w-100 p-2${pickerOpen ? ' show' : ''}`}
                id="rc-student-matches"
              >
                {matches.length === 0 ? (
                  <li>
                    <span className="dropdown-item-text fs-12 text-muted">
                      No students match this search
                    </span>
                  </li>
                ) : (
                  matches.map((student) => (
                    <li key={student.id}>
                      <Link
                        to="#"
                        className={`dropdown-item rounded-1 d-flex align-items-center${
                          student.id === selectedId ? ' active' : ''
                        }`}
                        onClick={() => {
                          onSelectStudent(student.id);
                          onPickerOpen(false);
                        }}
                      >
                        <span className="avatar avatar-xs rounded me-2">
                          <ImageWithBasePath src={student.avatar} alt={student.name} />
                        </span>
                        <span>
                          <span className="fs-13 fw-medium d-block">{student.name}</span>
                          <span className="fs-11 text-muted">
                            {student.rollNo} &middot; {student.admissionNo}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
        <p className="mb-0 fs-12 text-muted">
          <i className="ti ti-history me-1" />
          Generated on {generatedAt} &nbsp;&#8226;&nbsp; {pad2(readyCount)} of {pad2(totalCount)}{' '}
          report cards ready
        </p>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-sm btn-icon"
            aria-label="Print"
            title="Print"
            onClick={onPrint}
          >
            <i className="ti ti-printer" />
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
            onClick={onDownload}
          >
            <i className="ti ti-file-type-pdf me-1" />
            Download PDF
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm d-inline-flex align-items-center"
            onClick={onGenerate}
            disabled={generating}
          >
            <i className="ti ti-file-check me-1" />
            {generating ? 'Generating…' : 'Generate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCardsToolbar;
