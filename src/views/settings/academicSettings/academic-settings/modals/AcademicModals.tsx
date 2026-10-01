import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import { ActionLink } from '@components/workspace';
import {
  BANDS,
  bandOf,
  bandPointOf,
  PASS_MARK,
  PREVIEW_MARKS,
  RESTORE_NOTE,
  STUDENTS_ENROLLED,
  TERMS,
  WORKING_DAYS,
  YEAR_LABEL,
} from '../data/academic.data';

export type AcademicModalId =
  | 'year'
  | 'curriculum'
  | 'grading'
  | 'promotion'
  | 'calendar'
  | 'report'
  | 'export'
  | 'restore';

export interface AcademicModalsProps {
  active: AcademicModalId | null;
  onClose: () => void;
  panelOpen: boolean;
  onClosePanel: () => void;
  /** What the workspace was opened from, where the page knows it. */
  panelTitle?: string | null;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
}

/* ----------------------------- Small helpers ----------------------------- */

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

const Check = ({
  id,
  label,
  checked,
  onChange,
  last = false,
}: {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: () => void;
  last?: boolean;
}) => (
  <div className={`form-check ${last ? 'mb-0' : 'mb-2'}`}>
    <input
      className="form-check-input"
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
    />
    <label className="form-check-label fs-13" htmlFor={id}>
      {label}
    </label>
  </div>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="acd-row">
    <span className="acd-row-key">{label}</span>
    <span className="acd-row-fill" />
    <div className="acd-row-val">{value}</div>
  </div>
);

const Footer = ({
  icon,
  label,
  onClose,
  danger = false,
}: {
  icon: string;
  label: string;
  onClose: () => void;
  danger?: boolean;
}) => (
  <>
    <ActionLink className="btn btn-light me-2" onClick={onClose}>
      Cancel
    </ActionLink>
    <button
      type="submit"
      className={`btn ${danger ? 'btn-danger' : 'btn-primary'} d-inline-flex align-items-center`}
    >
      <i className={`${icon} me-1`} />
      {label}
    </button>
  </>
);

const useForm = <T extends Record<string, string>>(defaults: T, open: boolean) => {
  const [values, setValues] = useState<T>(defaults);
  const initial = JSON.stringify(defaults);

  useEffect(() => {
    if (open) setValues(JSON.parse(initial) as T);
  }, [open, initial]);

  const set = (key: keyof T) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  return [values, set] as const;
};

/* -------------------------------- Dialogs -------------------------------- */

const AcademicModals = ({
  active,
  onClose,
  panelOpen,
  onClosePanel,
  panelTitle,
  onToast,
}: AcademicModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const [flags, setFlags] = useState<Record<string, boolean>>({
    subjects: true,
    hours: true,
    outcomes: false,
    local: true,
    understand: false,
    detention: true,
    signoff: true,
    refer: true,
    recalc: true,
    notify: true,
    attendance: true,
    nonScholastic: true,
    remark: true,
    rank: false,
    average: false,
    structure: true,
    curriculum: true,
    policies: true,
    calendarExport: true,
    history: false,
  });
  const toggle = (key: string) => () => setFlags((current) => ({ ...current, [key]: !current[key] }));

  const [year, setYear] = useForm(
    {
      label: YEAR_LABEL,
      session: 'Annual — 3 terms',
      starts: '06 Apr 2026',
      ends: '31 Mar 2027',
      note: '',
    },
    active === 'year',
  );

  const [curriculum, setCurriculum] = useForm(
    { framework: 'CBSE 2026', applyTo: 'All grades' },
    active === 'curriculum',
  );

  const [grading, setGrading] = useForm(
    {
      scale: '9-point (A1 – E)',
      pass: String(PASS_MARK),
      method: 'Absolute',
      rounding: 'Round up at .5',
    },
    active === 'grading',
  );

  const [promotion, setPromotion] = useForm(
    {
      fails: 'Two — with a supplementary examination',
      attendance: '75',
      grace: '5',
    },
    active === 'promotion',
  );

  const [calendar, setCalendar] = useForm(
    {
      term: `Term 2 — ${TERMS[1].dates}`,
      kind: 'Holiday',
      from: '',
      to: '',
      title: '',
    },
    active === 'calendar',
  );

  const [report, setReport] = useForm(
    { template: 'CBSE terminal report', format: 'Marks and grade' },
    active === 'report',
  );

  const [exportForm, setExport] = useForm(
    { format: 'PDF — the academic policy document' },
    active === 'export',
  );

  return (
    <>
      {/* ------------------------------- Year -------------------------------- */}
      <Modal
        open={active === 'year'}
        onClose={onClose}
        title="Edit academic year"
        subtitle={`${YEAR_LABEL} · active`}
        dialogClassName="modal-lg"
        onSubmit={submit('Academic year saved.')}
        footer={<Footer icon="ti ti-device-floppy" label="Save year" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Year label">
            <input
              type="text"
              className="form-control"
              value={year.label}
              onChange={(event) => setYear('label')(event.target.value)}
            />
          </Field>
          <Field label="Session type">
            <Select
              value={year.session}
              onChange={setYear('session')}
              options={['Annual — 3 terms', 'Semester — 2', 'Trimester']}
            />
          </Field>
          <Field label="Starts">
            <DateField value={year.starts} onChange={setYear('starts')} />
          </Field>
          <Field label="Ends">
            <DateField value={year.ends} onChange={setYear('ends')} />
          </Field>
          <Field label="Change note" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={year.note}
              onChange={(event) => setYear('note')(event.target.value)}
            />
          </Field>
        </div>
        <div className="acd-check is-watch mt-3">
          <i className="ti ti-alert-circle" />
          <div>
            Moving the year boundary shifts every term
            <span>
              Term dates are held as offsets from the year start, so all {TERMS.length} would move
              with it.
            </span>
          </div>
        </div>
      </Modal>

      {/* ---------------------------- Curriculum ----------------------------- */}
      <Modal
        open={active === 'curriculum'}
        onClose={onClose}
        title="Configure curriculum"
        subtitle="CBSE 2026 · adopted 02 Feb 2026"
        onSubmit={submit('Curriculum applied.')}
        footer={<Footer icon="ti ti-books" label="Apply curriculum" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Framework">
            <Select
              value={curriculum.framework}
              onChange={setCurriculum('framework')}
              options={['CBSE 2026', 'CBSE 2025', 'NCERT core', 'Custom']}
            />
          </Field>
          <Field label="Apply to">
            <Select
              value={curriculum.applyTo}
              onChange={setCurriculum('applyTo')}
              options={['All grades', 'Middle stage only', 'Secondary and above']}
            />
          </Field>
          <div className="col-12">
            <span className="acd-lbl">Include</span>
            <Check
              id="acd-cur-subjects"
              label="Subject list and credit weights"
              checked={flags.subjects}
              onChange={toggle('subjects')}
            />
            <Check
              id="acd-cur-hours"
              label="Teaching hour minimums"
              checked={flags.hours}
              onChange={toggle('hours')}
            />
            <Check
              id="acd-cur-outcomes"
              label={
                <>
                  Learning outcomes <span className="text-muted">— not yet mapped</span>
                </>
              }
              checked={flags.outcomes}
              onChange={toggle('outcomes')}
            />
            <Check
              id="acd-cur-local"
              label="Keep local additions (Tamil, value education)"
              checked={flags.local}
              onChange={toggle('local')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ----------------------------- Grading ------------------------------- */}
      <Modal
        open={active === 'grading'}
        onClose={onClose}
        title="Update grading system"
        subtitle={`${BANDS.length} bands · 9-point scale`}
        onSubmit={submit('Grading system updated. Every mark this year re-grades.')}
        footer={<Footer icon="ti ti-chart-arrows-vertical" label="Update grading" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Scale">
            <Select
              value={grading.scale}
              onChange={setGrading('scale')}
              options={['9-point (A1 – E)', '5-point (A – E)', 'Percentage only']}
            />
          </Field>
          <Field label="Pass mark">
            <input
              type="text"
              className="form-control"
              value={grading.pass}
              onChange={(event) => setGrading('pass')(event.target.value)}
            />
          </Field>
          <Field label="Method">
            <Select
              value={grading.method}
              onChange={setGrading('method')}
              options={['Absolute', 'Relative to cohort', 'Percentile']}
            />
          </Field>
          <Field label="Rounding">
            <Select
              value={grading.rounding}
              onChange={setGrading('rounding')}
              options={['Round up at .5', 'Round down', 'No rounding']}
            />
          </Field>
        </div>
        <div className="acd-check is-watch mt-3 mb-3">
          <i className="ti ti-alert-triangle" />
          <div>
            {STUDENTS_ENROLLED.toLocaleString('en-IN')} report cards would re-grade
            <span>
              Marks already recorded are not changed, but the band each one falls in is recalculated
              the moment this is saved.
            </span>
          </div>
        </div>
        <Check
          id="acd-grade-understand"
          label="I understand this affects marks already recorded this year"
          checked={flags.understand}
          onChange={toggle('understand')}
          last
        />
      </Modal>

      {/* ---------------------------- Promotion ------------------------------ */}
      <Modal
        open={active === 'promotion'}
        onClose={onClose}
        title="Configure promotion rules"
        subtitle="Applied in order, at year end"
        onSubmit={submit('Promotion rules saved.')}
        footer={<Footer icon="ti ti-arrow-up-circle" label="Save rules" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Subjects a student may fail and still be promoted" span="col-12">
            <Select
              value={promotion.fails}
              onChange={setPromotion('fails')}
              options={['Two — with a supplementary examination', 'One', 'None']}
            />
          </Field>
          <Field label="Minimum attendance to sit the final examination">
            <input
              type="text"
              className="form-control"
              value={promotion.attendance}
              onChange={(event) => setPromotion('attendance')(event.target.value)}
            />
          </Field>
          <Field label="Maximum grace marks">
            <input
              type="text"
              className="form-control"
              value={promotion.grace}
              onChange={(event) => setPromotion('grace')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="acd-pro-detention"
              label={
                <>
                  No detention before Class VIII{' '}
                  <span className="text-muted">— required by statute</span>
                </>
              }
              checked={flags.detention}
              onChange={toggle('detention')}
            />
            <Check
              id="acd-pro-signoff"
              label="Every promotion signed off by a named teacher"
              checked={flags.signoff}
              onChange={toggle('signoff')}
            />
            <Check
              id="acd-pro-refer"
              label="Refer three or more failures to the academic committee"
              checked={flags.refer}
              onChange={toggle('refer')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ----------------------------- Calendar ------------------------------ */}
      <Modal
        open={active === 'calendar'}
        onClose={onClose}
        title="Edit academic calendar"
        subtitle={`${WORKING_DAYS} working days · published 04 Mar 2026`}
        dialogClassName="modal-lg"
        onSubmit={submit('Calendar entry saved.')}
        footer={<Footer icon="ti ti-calendar-event" label="Save entry" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Term">
            <Select
              value={calendar.term}
              onChange={setCalendar('term')}
              options={[
                `Term 2 — ${TERMS[1].dates}`,
                `Term 1 — ${TERMS[0].dates}`,
                `Term 3 — ${TERMS[2].dates}`,
              ]}
            />
          </Field>
          <Field label="Entry type">
            <Select
              value={calendar.kind}
              onChange={setCalendar('kind')}
              options={['Holiday', 'Examination', 'Event', 'Activity', 'Parent–teacher meeting']}
            />
          </Field>
          <Field label="From">
            <DateField value={calendar.from} onChange={setCalendar('from')} />
          </Field>
          <Field label="To">
            <DateField value={calendar.to} onChange={setCalendar('to')} />
          </Field>
          <Field label="Title" span="col-12">
            <input
              type="text"
              className="form-control"
              value={calendar.title}
              onChange={(event) => setCalendar('title')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="acd-cal-recalc"
              label="Recalculate working days after saving"
              checked={flags.recalc}
              onChange={toggle('recalc')}
            />
            <Check
              id="acd-cal-notify"
              label="Notify teaching staff and guardians"
              checked={flags.notify}
              onChange={toggle('notify')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* --------------------------- Report card ----------------------------- */}
      <Modal
        open={active === 'report'}
        onClose={onClose}
        title="Configure report card"
        subtitle="CBSE terminal · three-term layout"
        onSubmit={submit('Report card template saved.')}
        footer={<Footer icon="ti ti-file-description" label="Save template" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Template" span="col-12">
            <Select
              value={report.template}
              onChange={setReport('template')}
              options={['CBSE terminal report', 'Continuous assessment', 'Custom layout']}
            />
          </Field>
          <Field label="Grading format" span="col-12">
            <Select
              value={report.format}
              onChange={setReport('format')}
              options={['Marks and grade', 'Grade only', 'Marks only']}
            />
          </Field>
          <div className="col-12">
            <span className="acd-lbl">Show on the report card</span>
            <Check
              id="acd-rep-attendance"
              label="Attendance for the term"
              checked={flags.attendance}
              onChange={toggle('attendance')}
            />
            <Check
              id="acd-rep-nonschol"
              label="Non-scholastic grades"
              checked={flags.nonScholastic}
              onChange={toggle('nonScholastic')}
            />
            <Check
              id="acd-rep-remark"
              label="Class teacher remark"
              checked={flags.remark}
              onChange={toggle('remark')}
            />
            <Check
              id="acd-rep-rank"
              label={
                <>
                  Class rank{' '}
                  <span className="text-muted">
                    — switched off by the academic committee in 2024
                  </span>
                </>
              }
              checked={flags.rank}
              onChange={toggle('rank')}
            />
            <Check
              id="acd-rep-average"
              label="Class average alongside the student’s mark"
              checked={flags.average}
              onChange={toggle('average')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Export ------------------------------- */}
      <Modal
        open={active === 'export'}
        onClose={onClose}
        title="Export academic settings"
        subtitle="A snapshot of this configuration"
        onSubmit={submit('Academic configuration exported.')}
        footer={<Footer icon="ti ti-download" label="Export" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Format" span="col-12">
            <Select
              value={exportForm.format}
              onChange={setExport('format')}
              options={[
                'PDF — the academic policy document',
                'JSON — re-importable',
                'CSV — settings list only',
              ]}
            />
          </Field>
          <div className="col-12">
            <span className="acd-lbl">Include</span>
            <Check
              id="acd-exp-structure"
              label="Structure — year, terms, grades, sections"
              checked={flags.structure}
              onChange={toggle('structure')}
            />
            <Check
              id="acd-exp-curriculum"
              label="Curriculum, subjects and credits"
              checked={flags.curriculum}
              onChange={toggle('curriculum')}
            />
            <Check
              id="acd-exp-policies"
              label="Grading, assessment and promotion policies"
              checked={flags.policies}
              onChange={toggle('policies')}
            />
            <Check
              id="acd-exp-calendar"
              label="Academic calendar"
              checked={flags.calendarExport}
              onChange={toggle('calendarExport')}
            />
            <Check
              id="acd-exp-history"
              label="Audit history"
              checked={flags.history}
              onChange={toggle('history')}
              last
            />
          </div>
        </div>
        <p className="fs-12 text-muted mt-3 mb-0">
          The PDF is the document the board asks for at inspection, so it is laid out as a policy
          statement rather than a settings dump.
        </p>
      </Modal>

      {/* ------------------------------ Restore ------------------------------ */}
      <Modal
        open={active === 'restore'}
        onClose={onClose}
        title="Restore defaults"
        subtitle="Grading, assessment, promotion and attendance"
        onSubmit={submit('Academic policies restored to the board defaults.')}
        footer={<Footer icon="ti ti-rotate-2" label="Restore defaults" onClose={onClose} danger />}
      >
        <p className="fs-13 text-muted mb-0">{RESTORE_NOTE}</p>
      </Modal>

      {/* --------------------------- The workspace --------------------------- */}
      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title={`${panelTitle ?? 'Grading system'} — ${YEAR_LABEL}`}
        placement="end"
        labelledById="acdWorkspaceLabel"
        footer={
          <div className="d-flex gap-2">
            <ActionLink className="btn btn-light" onClick={onClosePanel}>
              Close
            </ActionLink>
            <button
              type="button"
              className="btn btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
              onClick={() => {
                onToast('Configuration saved as a draft');
                onClosePanel();
              }}
            >
              <i className="ti ti-device-floppy me-1" />
              Save configuration
            </button>
          </div>
        }
      >
        <p className="fs-12 text-muted">
          {BANDS.length} bands · nine-point scale · last changed 04 Jun 2026 by the academic
          committee
        </p>

        <span className="acd-lbl">Configuration details</span>
        <div className="mb-3">
          <Row label="Applies to" value="Classes VI – XII" />
          <Row label="Scale" value="9-point" />
          <Row label="Bands" value={String(BANDS.length)} />
          <Row label="Pass mark" value={String(PASS_MARK)} />
          <Row label="Adopted" value="02 Feb 2026" />
          <Row label="Last changed" value="04 Jun 2026" />
        </div>

        <span className="acd-lbl">Preview</span>
        <div className="acd-preview mb-3">
          <div className="acd-preview-head">
            <strong>PRESKOOL INTERNATIONAL SCHOOL</strong>
            <span className="fs-12 text-muted d-block">
              How a mark would print · Term 2 · Class IX
            </span>
          </div>
          {PREVIEW_MARKS.slice(0, 4).map((entry) => {
            const band = bandOf(entry.mark);
            return (
              <div className="acd-preview-line" key={entry.subject}>
                <span>
                  {entry.subject} · {entry.mark} marks
                </span>
                <strong>
                  {band.letter} · {bandPointOf(band)}
                </strong>
              </div>
            );
          })}
        </div>

        <span className="acd-lbl">Validation</span>
        <div className="mb-3">
          <Row label="Bands cover 0 to 100 with no gap or overlap" value="Pass" />
          <Row label="The pass mark sits on a band boundary" value="Pass" />
          <Row label="Grade points are monotonic" value="Pass" />
          <Row label="A1 covers ten marks, D covers eight" value="Note" />
        </div>

        <span className="acd-lbl">Dependencies</span>
        <p className="fs-13 text-muted">
          Report card template · Promotion rules · Transcript layout · Merit certificates. Changing a
          band boundary re-grades every mark already recorded this year. It does not change the marks
          themselves, but {STUDENTS_ENROLLED.toLocaleString('en-IN')} report cards would print
          differently.
        </p>
      </Offcanvas>
    </>
  );
};

export default AcademicModals;
