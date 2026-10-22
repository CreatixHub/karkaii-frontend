import { useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { GradeEntry } from '../data/grades.data';
import {
  ACADEMIC_YEAR,
  ATTENDANCE_POLICY,
  bestPaperOf,
  breakdownOf,
  classLabelOf,
  classOptions,
  DISTINCTION_AT,
  EXAM,
  EXAM_REF,
  EXAM_WINDOW,
  GRADE_SCALE,
  gradeOf,
  gradeTint,
  isBelowPass,
  isDistinction,
  levelOf,
  levelPill,
  marksOf,
  overallGradeOf,
  overallPctOf,
  PASS_MARK,
  rankMovementOf,
  SCALE_NAME,
  scaleOptions,
  sectionOptions,
  statusOf,
  statusPill,
  subjectsAtPassOf,
  weakestPaperOf,
} from '../data/grades.data';

export type GradeModalId =
  | 'generate'
  | 'compare'
  | 'export'
  | 'print'
  | 'share'
  | 'template'
  | 'scale'
  | 'publish'
  | 'view';

export interface GradeModalsProps {
  active: GradeModalId | null;
  onClose: () => void;
  row: GradeEntry | null;
  rows: GradeEntry[];
  selected: GradeEntry[];
  registerTotal: number;
  panelOpen: boolean;
  onClosePanel: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  onPublish: (ids: string[]) => void;
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

const StudentStrip = ({ row }: { row: GradeEntry }) => (
  <div className="d-flex align-items-center gap-3 border rounded p-3 mb-3">
    <span className="avatar avatar-lg rounded flex-shrink-0">
      <ImageWithBasePath src={row.image} alt={row.student} className="rounded" />
    </span>
    <div className="flex-fill">
      <h6 className="fs-15 mb-0">{row.student}</h6>
      <span className="fs-12 text-muted">
        {row.admission} · {classLabelOf(row)} · {row.roll} · {row.subject}
      </span>
    </div>
    <span className={`dt-pill ${statusPill[statusOf(row)]}`}>
      <span className="dt-pill-dot" />
      {statusOf(row)}
    </span>
  </div>
);

const GradeModals = ({
  active,
  onClose,
  row,
  rows,
  selected,
  registerTotal,
  panelOpen,
  onClosePanel,
  onToast,
  onPublish,
}: GradeModalsProps) => {
  const [comparison, setComparison] = useState('Class');
  const [metric, setMetric] = useState('Average GPA');

  const detail = row ?? rows[0] ?? null;
  const publishable = selected.length > 0 ? selected : rows.filter((item) => statusOf(item) !== 'Published');
  const withheld = rows.filter((item) => statusOf(item) === 'Withheld');
  const rechecks = rows.filter((item) => item.recheckRequested);

  /* --------------------------- The scale's own counts ---------------------- */

  /**
   * How many entries each band holds, counted from the register. The template
   * writes these in; counting them means the table can never describe a
   * distribution the grid does not have.
   */
  const scaleCounts = useMemo(() => {
    const counts = new Map<string, number>();
    rows.forEach((entry) => {
      const grade = gradeOf(marksOf(entry)).grade;
      counts.set(grade, (counts.get(grade) ?? 0) + 1);
    });
    return counts;
  }, [rows]);

  /* ------------------------------- Comparison ------------------------------- */

  const comparisonRows = useMemo(() => {
    const keyOf = (entry: GradeEntry) => {
      switch (comparison) {
        case 'Section':
          return classLabelOf(entry);
        case 'Subject':
          return entry.subject;
        case 'Teacher':
          return entry.classTeacher;
        case 'Grade band':
          return gradeOf(marksOf(entry)).grade;
        default:
          return entry.className;
      }
    };

    const readOn = (group: GradeEntry[], previous: boolean) => {
      if (metric === 'Average marks') {
        const source = previous ? group.map((e) => e.previousPct) : group.map((e) => marksOf(e));
        return Math.round((source.reduce((a, b) => a + b, 0) / group.length) * 10) / 10;
      }
      if (metric === 'Pass percentage') {
        const passing = group.filter((entry) =>
          previous ? entry.previousPct >= PASS_MARK : marksOf(entry) >= PASS_MARK,
        ).length;
        return Math.round((passing / group.length) * 1000) / 10;
      }
      if (metric === 'Distinction count') {
        return group.filter((entry) => (previous ? entry.previousPct : overallPctOf(entry)) >= DISTINCTION_AT)
          .length;
      }
      if (metric === 'Failure count') {
        return group.filter((entry) => (previous ? entry.previousPct : marksOf(entry)) < PASS_MARK).length;
      }
      const source = previous ? group.map((e) => e.previousGpa) : group.map((e) => e.gpa);
      return Math.round((source.reduce((a, b) => a + b, 0) / group.length) * 100) / 100;
    };

    const groups = new Map<string, GradeEntry[]>();
    rows.forEach((entry) => {
      const key = keyOf(entry);
      groups.set(key, [...(groups.get(key) ?? []), entry]);
    });

    const list = [...groups.entries()].map(([label, group]) => {
      const a = readOn(group, false);
      const b = readOn(group, true);
      return { label, a, b, change: Math.round((a - b) * 100) / 100 };
    });

    if (rows.length > 0) {
      const a = readOn(rows, false);
      const b = readOn(rows, true);
      list.push({ label: 'School average', a, b, change: Math.round((a - b) * 100) / 100 });
    }
    return list;
  }, [comparison, metric, rows]);

  const fell = comparisonRows.filter((item) => item.change < 0 && item.label !== 'School average');

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
        title="Generate Grade Report"
        dialogClassName="modal-lg"
        footer={footerButtons('Generate Report', 'ti ti-player-play', confirm('Grade report generated'))}
      >
        <p className="text-muted fs-13 mb-3">
          Build a grading report from the marks already closed for the term
        </p>
        <div className="border rounded p-3 mb-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
            <div>
              <h6 className="fs-14 mb-0">
                {EXAM} — {EXAM_REF}
              </h6>
              <span className="fs-12 text-muted">
                {EXAM_WINDOW} · {registerTotal.toLocaleString()} graded entries
              </span>
            </div>
            <span className="badge badge-soft-success">
              <i className="ti ti-lock me-1" />
              Marks Entry Closed
            </span>
          </div>
          <div className="row g-2 fs-13">
            <div className="col-sm-6">
              <span className="text-muted">Entries In Scope</span>{' '}
              <span className="fw-medium">{rows.length}</span>
            </div>
            <div className="col-sm-6">
              <span className="text-muted">Mean</span>{' '}
              <span className="fw-medium">
                {rows.length === 0
                  ? '—'
                  : Math.round((rows.reduce((total, e) => total + marksOf(e), 0) / rows.length) * 10) / 10}{' '}
                · GPA{' '}
                {rows.length === 0
                  ? '—'
                  : Math.round((rows.reduce((total, e) => total + e.gpa, 0) / rows.length) * 100) / 100}
              </span>
            </div>
          </div>
        </div>
        <div className="row g-3">
          <Field label="Report Name" span="col-12">
            <input type="text" className="form-control" defaultValue="Term 1 Grade Report" />
          </Field>
          <Field label="Report Type">
            <Select
              options={[
                'Consolidated Grade Report',
                'Student Grade Report',
                'Class Grade Report',
                'Subject Analysis Report',
                'Exam Result Report',
                'Grade Distribution Report',
              ]}
            />
          </Field>
          <Field label="Academic Year">
            <Select options={[ACADEMIC_YEAR, '2025-2026']} />
          </Field>
          <Field label="Exam / Term" span="col-12">
            <Select
              options={[
                `${EXAM} · ${EXAM_REF}`,
                'Unit Test 1 · EXM-2026-011',
                'Unit Test 2 · EXM-2026-017',
                'Half Yearly · EXM-2026-021',
              ]}
            />
          </Field>
          <Field label="Class" span="col-md-4">
            <Select options={['All classes', ...classOptions]} />
          </Field>
          <Field label="Section" span="col-md-4">
            <Select options={['All sections', ...sectionOptions]} />
          </Field>
          <Field label="Grade Scale" span="col-md-4">
            <Select options={scaleOptions} />
          </Field>
          <Field label="Subjects" span="col-12">
            <Select options={['All subjects in the scheme', 'Core subjects only', 'Selected subject']} />
          </Field>
        </div>
      </Modal>

      {/* ---------------------------- Compare Reports ---------------------------- */}
      <Modal
        open={active === 'compare'}
        onClose={onClose}
        title="Compare Grade Reports"
        dialogClassName="modal-lg"
        footer={footerButtons('Run Comparison', 'ti ti-arrows-diff', confirm('Comparison run'))}
      >
        <div className="row g-3 mb-3">
          <Field label="Report A">
            <Select options={[`${EXAM} · ${ACADEMIC_YEAR}`, `Unit Test 1 · ${ACADEMIC_YEAR}`]} />
          </Field>
          <Field label="Report B">
            <Select options={[`Unit Test 1 · ${ACADEMIC_YEAR}`, `${EXAM} · ${ACADEMIC_YEAR}`]} />
          </Field>
          <Field label="Compare By">
            <Select
              options={['Class', 'Section', 'Subject', 'Teacher', 'Grade band']}
              value={comparison}
              onChange={setComparison}
            />
          </Field>
          <Field label="Metric">
            <Select
              options={[
                'Average GPA',
                'Average marks',
                'Pass percentage',
                'Distinction count',
                'Failure count',
              ]}
              value={metric}
              onChange={setMetric}
            />
          </Field>
        </div>

        <div className="table-responsive border rounded">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>{comparison}</th>
                <th className="text-center">Report A</th>
                <th className="text-center">Report B</th>
                <th className="text-center">Change</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((item) => (
                <tr key={item.label} className={item.label === 'School average' ? 'fw-semibold' : undefined}>
                  <td className="fs-13">{item.label}</td>
                  <td className="text-center fs-13">{item.a}</td>
                  <td className="text-center fs-13">{item.b}</td>
                  <td className="text-center">
                    <span className={`badge badge-soft-${item.change >= 0 ? 'success' : 'danger'}`}>
                      <i className={`ti ti-arrow-${item.change >= 0 ? 'up' : 'down'} me-1`} />
                      {Math.abs(item.change)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="fs-12 text-muted mt-3 mb-0">
          {fell.length === 0
            ? `Every ${comparison.toLowerCase()} held or improved against the unit test.`
            : fell.length === 1
              ? `${fell[0].label} is the only ${comparison.toLowerCase()} to fall against the unit test.`
              : `${fell.length} of the ${comparisonRows.length - 1} fell against the unit test.`}
        </p>
      </Modal>

      {/* ------------------------------ Export Report ---------------------------- */}
      <Modal
        open={active === 'export'}
        onClose={onClose}
        title="Export Report"
        footer={footerButtons('Export', 'ti ti-file-export', confirm(`${rows.length} entries exported`))}
      >
        <div className="row g-3">
          <Field label="Format" span="col-12">
            <Radios name="gr-format" options={['PDF', 'Excel', 'CSV']} />
          </Field>
          <div className="col-12">
            <ul className="list-unstyled fs-13 border rounded p-3 mb-0">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Report</span>
                <span className="fw-medium">Term 1 Grade Report</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Grade Scale</span>
                <span className="fw-medium">{SCALE_NAME}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Entries</span>
                <span className="fw-medium">
                  {selected.length} selected of {registerTotal.toLocaleString()}
                </span>
              </li>
            </ul>
          </div>
          <Field label="Rows To Export">
            <Select options={['Selected entries only', 'Current page', 'All filtered entries', 'All entries']} />
          </Field>
          <Field label="Columns">
            <Select options={['Visible columns', 'All columns', 'Marks and grade only']} />
          </Field>
          <Field label="Page Size" span="col-md-4">
            <Select options={['A4', 'Letter', 'Legal']} />
          </Field>
          <Field label="Orientation" span="col-md-4">
            <Select options={['Landscape', 'Portrait']} />
          </Field>
          <Field label="File Name" span="col-md-4">
            <input type="text" className="form-control" defaultValue="term-1-grades" />
          </Field>
          <div className="col-12">
            <Switch id="gr-ex-strip" label="Include the grade summary strip" on />
            <Switch id="gr-ex-detail" label="Include the expanded detail for each student" />
            <Switch id="gr-ex-head" label="Print on the school letterhead" on />
          </div>
        </div>
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
        <div className="border rounded p-3 mb-3">
          <h6 className="fs-14 mb-1">Term 1 Grade Report</h6>
          <span className="fs-12 text-muted">
            {rows.length} entries · {SCALE_NAME}
          </span>
          <div className="row g-2 fs-13 mt-2">
            <div className="col-6">
              <span className="text-muted">Pages</span>{' '}
              <span className="fw-medium">{Math.max(1, Math.ceil(rows.length / 20))}</span>
            </div>
            <div className="col-6">
              <span className="text-muted">Classes Covered</span>{' '}
              <span className="fw-medium">
                {new Set(rows.map((entry) => entry.className)).size} classes ·{' '}
                {new Set(rows.map(classLabelOf)).size} sections
              </span>
            </div>
          </div>
        </div>
        <div className="row g-3">
          <Field label="Printer">
            <Select options={['Office counter 2 · HP LaserJet', 'Staff room · Canon iR', 'Save as PDF']} />
          </Field>
          <Field label="Copies">
            <input type="number" className="form-control" defaultValue={1} min={1} />
          </Field>
          <Field label="Page Size" span="col-md-4">
            <Select options={['A4', 'Letter', 'Legal']} />
          </Field>
          <Field label="Orientation" span="col-md-4">
            <Select options={['Landscape', 'Portrait']} />
          </Field>
          <Field label="Page Range" span="col-md-4">
            <Select options={['All pages', 'Current page', 'Selected entries only']} />
          </Field>
          <div className="col-12">
            <Switch id="gr-pr-head" label="Repeat the column header on every page" on />
            <Switch id="gr-pr-legend" label="Print the grade scale legend on the first page" on />
            <Switch id="gr-pr-sign" label="Leave a signature block for the coordinator" />
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Share Report ----------------------------- */}
      <Modal
        open={active === 'share'}
        onClose={onClose}
        title="Share Report"
        footer={footerButtons('Share Report', 'ti ti-share', confirm('Report shared'))}
      >
        <div className="row g-3">
          <Field label="Share through" span="col-12">
            <Radios name="gr-share" options={['Email', 'Portal', 'Link']} />
          </Field>
          <div className="col-12">
            <ul className="list-unstyled fs-13 border rounded p-3 mb-0">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Report</span>
                <span className="fw-medium">Term 1 Grade Report</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Entries Included</span>
                <span className="fw-medium">
                  {selected.length} selected of {registerTotal.toLocaleString()}
                </span>
              </li>
            </ul>
          </div>
          <Field label="Share With" span="col-12">
            <Select
              options={[
                'Principal and the coordinators',
                'Class teachers of the selected sections',
                'Subject teachers',
                'Guardians of the selected students',
              ]}
            />
          </Field>
          <Field label="Access">
            <Select options={['View only', 'View and download']} />
          </Field>
          <Field label="Link Expires">
            <Select options={['In 7 days', 'In 30 days', 'Never']} />
          </Field>
          <Field label="Message" span="col-12">
            <textarea
              className="form-control"
              rows={3}
              defaultValue={`Term 1 grades are final. ${rows.filter(isDistinction).length} entries hold a distinction and ${
                rows.filter((entry) => levelOf(entry) === 'Needs Support').length
              } need academic support.`}
            />
          </Field>
          <div className="col-12">
            <Switch id="gr-sh-rank" label="Include ranks in the shared copy" on />
            <Switch id="gr-sh-audit" label="Record the share in the report audit history" on />
          </div>
        </div>
      </Modal>

      {/* --------------------------- Save Report Template ------------------------ */}
      <Modal
        open={active === 'template'}
        onClose={onClose}
        title="Save Report Template"
        footer={footerButtons('Save Template', 'ti ti-bookmark-plus', confirm('Template saved'))}
      >
        <div className="border rounded p-3 mb-3">
          <span className="fs-12 text-muted d-block mb-2">Current parameters</span>
          <div className="d-flex flex-wrap gap-1">
            {['Student report', ACADEMIC_YEAR, EXAM, SCALE_NAME, `${rows.length} entries`].map((chip) => (
              <span className="badge badge-soft-secondary" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="row g-3">
          <Field label="Template Name" span="col-12">
            <input type="text" className="form-control" defaultValue="Term grade report — all classes" />
          </Field>
          <Field label="Visibility">
            <Select options={['Only me', 'All coordinators', 'Class teachers']} />
          </Field>
          <Field label="Category">
            <Select options={['Academics', 'Examinations', 'Board submission']} />
          </Field>
          <Field label="Description" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue="Run at the close of each term once every subject mark sheet is locked."
            />
          </Field>
          <div className="col-12">
            <Switch id="gr-tpl-cols" label="Save the column visibility and sort order" on />
            <Switch id="gr-tpl-scale" label="Save the active filters and grade scale" on />
            <Switch id="gr-tpl-default" label="Make this the default view for this page" />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Grade Scale ----------------------------- */}
      <Modal
        open={active === 'scale'}
        onClose={onClose}
        title="Grade Scale Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={confirm('Scale exported')}>
              <i className="ti ti-file-export me-1" />
              Export Scale
            </button>
          </>
        }
      >
        <p className="text-muted fs-13 mb-3">
          {SCALE_NAME} scale applied to the {ACADEMIC_YEAR} academic year
        </p>
        <div className="table-responsive border rounded mb-3">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Grade</th>
                <th className="text-center">Marks Range</th>
                <th className="text-center">Grade Point</th>
                <th>Remark</th>
                <th className="text-center">Entries</th>
              </tr>
            </thead>
            <tbody>
              {GRADE_SCALE.map((step, index) => {
                const ceiling = index === 0 ? 100 : GRADE_SCALE[index - 1].floor - 1;
                return (
                  <tr key={step.grade}>
                    <td>
                      <span className={`badge badge-soft-${gradeTint(step.grade)}`}>{step.grade}</span>
                    </td>
                    <td className="text-center fs-13">
                      {step.floor === 0 ? `Below ${ceiling + 1}` : `${step.floor} – ${ceiling}`}
                    </td>
                    <td className="text-center fs-13">{step.point.toFixed(1)}</td>
                    <td className="fs-13">{step.remark}</td>
                    <td className="text-center fs-13">{scaleCounts.get(step.grade) ?? 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h6 className="fs-14 mb-2">Scale Configuration</h6>
        <ul className="list-unstyled fs-13 mb-0">
          {[
            { label: 'Scale Name', value: SCALE_NAME },
            { label: 'Pass Mark', value: `${PASS_MARK}% of the paper` },
            { label: 'Distinction', value: `At ${DISTINCTION_AT}% and above` },
            { label: 'Attendance Policy', value: `Results withheld below ${ATTENDANCE_POLICY}%` },
            { label: 'GPA Basis', value: 'Mean of subject grade points' },
            { label: 'Applies To', value: 'Classes V to X' },
          ].map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
              <span className="text-muted">{item.label}</span>
              <span className="fw-medium">{item.value}</span>
            </li>
          ))}
        </ul>
      </Modal>

      {/* ------------------------------ Publish Result --------------------------- */}
      <Modal
        open={active === 'publish'}
        onClose={onClose}
        title="Publish Grade Report"
        footer={footerButtons('Publish', 'ti ti-send', () => {
          const ids = publishable.filter((entry) => statusOf(entry) !== 'Withheld').map((entry) => entry.id);
          if (ids.length === 0) {
            onToast('Nothing in this selection can be published', 'warning');
            return;
          }
          onPublish(ids);
          onClose();
          onToast(`${ids.length} ${ids.length === 1 ? 'result' : 'results'} published`);
        })}
      >
        {rechecks.length > 0 || withheld.length > 0 ? (
          <div className="alert alert-soft-warning fs-13 d-flex align-items-center gap-2">
            <i className="ti ti-alert-triangle" />
            {rechecks.length} {rechecks.length === 1 ? 'recheck is' : 'rechecks are'} still open and{' '}
            {withheld.length} {withheld.length === 1 ? 'result is' : 'results are'} withheld. Publishing locks
            the ranks.
          </div>
        ) : null}
        <ul className="list-unstyled fs-13 border rounded p-3 mb-3">
          {[
            { label: 'Report', value: `Term 1 Grade Report · ${EXAM_REF}` },
            {
              label: 'Already Published',
              value: `${rows.filter((entry) => statusOf(entry) === 'Published').length} entries`,
            },
            {
              label: 'Pending Review',
              value: `${rows.filter((entry) => statusOf(entry) === 'Pending Review').length} entries`,
            },
            {
              label: 'To Publish Now',
              value: `${publishable.filter((entry) => statusOf(entry) !== 'Withheld').length} entries`,
            },
            { label: 'Held Back', value: `${withheld.length} withheld` },
          ].map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
              <span className="text-muted">{item.label}</span>
              <span className="fw-medium">{item.value}</span>
            </li>
          ))}
        </ul>
        <div className="row g-3">
          <Field label="Publish To" span="col-12">
            <Select
              options={[
                'Parent portal and student portal',
                'Parent portal only',
                'Student portal only',
                'Internal staff only',
              ]}
            />
          </Field>
          <Field label="Publish On">
            <DateField value="31-07-2026" onChange={() => undefined} format="d-m-Y" id="gr-pub-date" />
          </Field>
          <Field label="Approved By">
            <Select options={['Mrs. Kalpana Menon · Academic Coordinator', 'Principal']} />
          </Field>
          <Field label="Notify" span="col-12">
            <Select options={['Guardians and class teachers', 'Guardians only', 'No notification']} />
          </Field>
          <Field label="Publishing Note" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue="Ranks are final on publish. Rechecks after this date raise a revised report."
            />
          </Field>
          <div className="col-12">
            <Switch id="gr-pb-ranks" label="Show ranks to guardians" on />
            <Switch id="gr-pb-recheck" label="Hold back any entry with an open recheck" on />
            <Switch id="gr-pb-withheld" label={`Include the ${withheld.length} withheld results`} />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- View Record ----------------------------- */}
      <Modal
        open={active === 'view' && detail !== null}
        onClose={onClose}
        title={detail?.student ?? 'Record'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={confirm('Record exported')}>
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
                { label: 'Percentage', value: `${overallPctOf(detail)}%` },
                { label: 'GPA', value: detail.gpa.toFixed(1) },
                { label: 'Grade', value: overallGradeOf(detail).grade },
                { label: 'Rank', value: `${detail.rank} of ${detail.sectionStrength}` },
              ].map((item) => (
                <div className="col-6 col-md-3" key={item.label}>
                  <div className="border rounded py-2">
                    <h6 className="fs-16 mb-0">{item.value}</h6>
                    <span className="fs-12 text-muted">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <h6 className="fs-14 mb-2">Subject Record — {EXAM}</h6>
            <div className="table-responsive border rounded mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th className="text-center">Marks</th>
                    <th className="text-center">Grade</th>
                    <th className="text-center">Grade Point</th>
                    <th className="text-center">Section Mean</th>
                    <th>Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.subjects.map((subject) => {
                    const grade = gradeOf(subject.marks);
                    return (
                      <tr key={subject.subject}>
                        <td className="fs-13">{subject.subject}</td>
                        <td className="text-center fs-13">{subject.marks} / 100</td>
                        <td className="text-center">
                          <span className={`badge badge-soft-${gradeTint(grade.grade)}`}>{grade.grade}</span>
                        </td>
                        <td className="text-center fs-13">{grade.point.toFixed(1)}</td>
                        <td className="text-center fs-13">{subject.sectionMean ?? '—'}</td>
                        <td className="fs-12 text-muted">{subject.teacher ?? '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <h6 className="fs-14 mb-2">Exam History</h6>
            <div className="table-responsive border rounded mb-0">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th className="text-center">Percentage</th>
                    <th className="text-center">Grade</th>
                    <th className="text-center">GPA</th>
                    <th className="text-center">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fs-13">Unit Test 1 · {ACADEMIC_YEAR}</td>
                    <td className="text-center fs-13">{detail.previousPct}%</td>
                    <td className="text-center fs-13">{gradeOf(Math.round(detail.previousPct)).grade}</td>
                    <td className="text-center fs-13">{detail.previousGpa.toFixed(1)}</td>
                    <td className="text-center fs-13">
                      {detail.previousRank} of {detail.sectionStrength}
                    </td>
                  </tr>
                  <tr>
                    <td className="fs-13">
                      {EXAM} · {ACADEMIC_YEAR}
                    </td>
                    <td className="text-center fs-13">{overallPctOf(detail)}%</td>
                    <td className="text-center fs-13">{overallGradeOf(detail).grade}</td>
                    <td className="text-center fs-13">{detail.gpa.toFixed(1)}</td>
                    <td className="text-center fs-13">
                      {detail.rank} of {detail.sectionStrength}
                    </td>
                  </tr>
                  <tr className="text-muted">
                    <td className="fs-13">Unit Test 2 · {ACADEMIC_YEAR}</td>
                    <td className="text-center fs-13" colSpan={4}>
                      Awaiting marks
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* -------------------------- Grade Analysis panel ------------------------- */}
      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title="Grade Analysis"
        className="offcanvas-lg"
        titleAccessory={
          <span className="fs-12 text-muted">
            {EXAM} {ACADEMIC_YEAR} · {rows.length} entries
          </span>
        }
      >
        <h6 className="fs-14 mb-2">Grade Distribution</h6>
        <ul className="list-unstyled mb-4">
          {GRADE_SCALE.map((step) => {
            const count = scaleCounts.get(step.grade) ?? 0;
            const share = rows.length === 0 ? 0 : Math.round((count / rows.length) * 1000) / 10;
            return (
              <li className="mb-3" key={step.grade}>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fs-13">
                    <span className={`badge badge-soft-${gradeTint(step.grade)} me-2`}>{step.grade}</span>
                    {step.remark}
                  </span>
                  <span className="fs-12 text-muted">
                    {count} · {share}%
                  </span>
                </div>
                <div className="meter meter-primary">
                  <span style={{ width: `${share}%` }} />
                </div>
              </li>
            );
          })}
        </ul>

        <h6 className="fs-14 mb-2">Subject Performance</h6>
        <ul className="list-unstyled mb-4">
          {[...new Set(rows.map((entry) => entry.subject))]
            .map((subject) => {
              const group = rows.filter((entry) => entry.subject === subject);
              return {
                subject,
                mean: Math.round((group.reduce((total, e) => total + marksOf(e), 0) / group.length) * 10) / 10,
              };
            })
            .sort((a, b) => b.mean - a.mean)
            .map((item, index, list) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={item.subject}>
                <span className="fs-13">{item.subject}</span>
                <span className="fs-13 fw-semibold">
                  {item.mean}
                  {index === 0 ? <span className="text-muted ms-1">· Best</span> : null}
                  {index === list.length - 1 && list.length > 1 ? (
                    <span className="text-muted ms-1">· Weakest</span>
                  ) : null}
                </span>
              </li>
            ))}
        </ul>

        <h6 className="fs-14 mb-2">Class Comparison</h6>
        <div className="table-responsive border rounded mb-0">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Class</th>
                <th className="text-center">Avg GPA</th>
                <th className="text-center">Pass %</th>
                <th className="text-center">Distinction</th>
              </tr>
            </thead>
            <tbody>
              {[...new Set(rows.map((entry) => entry.className))].sort().map((className) => {
                const group = rows.filter((entry) => entry.className === className);
                const gpa = Math.round((group.reduce((t, e) => t + e.gpa, 0) / group.length) * 100) / 100;
                const pass =
                  Math.round((group.filter((e) => !isBelowPass(e)).length / group.length) * 1000) / 10;
                return (
                  <tr key={className}>
                    <td className="fs-13">{className}</td>
                    <td className="text-center fs-13">{gpa}</td>
                    <td className="text-center fs-13">{pass}%</td>
                    <td className="text-center fs-13">{group.filter(isDistinction).length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {detail ? (
          <>
            <h6 className="fs-14 mb-2 mt-4">This Record</h6>
            <ul className="list-unstyled fs-13 mb-0">
              {[
                { label: 'Student', value: `${detail.student} · ${classLabelOf(detail)}` },
                { label: 'Paper', value: `${detail.subject} · ${detail.subjectKind}` },
                {
                  label: 'Marks',
                  value: `${marksOf(detail)} of 100 · ${gradeOf(marksOf(detail)).grade}`,
                },
                { label: 'Level', value: levelOf(detail) },
                {
                  label: 'Rank Movement',
                  value: rankMovementOf(detail).label,
                },
                {
                  label: 'Best Paper',
                  value: `${bestPaperOf(detail).subject} ${bestPaperOf(detail).marks}`,
                },
                {
                  label: 'Weakest Paper',
                  value: `${weakestPaperOf(detail).subject} ${weakestPaperOf(detail).marks}`,
                },
                {
                  label: 'At Pass Mark',
                  value: `${subjectsAtPassOf(detail)} of ${detail.subjects.length}`,
                },
              ].map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>

            <h6 className="fs-14 mb-2 mt-4">Grade Breakdown</h6>
            <ul className="list-unstyled fs-13 mb-0">
              {breakdownOf(detail).map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.grade}>
                  <span className={`badge badge-soft-${gradeTint(item.grade)}`}>{item.grade}</span>
                  <span className="text-muted">
                    {item.count} {item.count === 1 ? 'subject' : 'subjects'}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3">
              <span className={`dt-pill ${levelPill[levelOf(detail)]}`}>
                <span className="dt-pill-dot" />
                {levelOf(detail)}
              </span>
            </div>
          </>
        ) : null}
      </Offcanvas>
    </>
  );
};

export default GradeModals;
