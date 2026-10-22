import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import type { AcademicReport } from '../data/academic.data';
import {
  ACADEMIC_YEAR,
  atPassMarkOf,
  averageOf,
  breakdownOf,
  classOptions,
  enteredOf,
  examOptions,
  gradeTint,
  highestOf,
  isCompleteOf,
  lineGradeOf,
  lowestOf,
  obtainedOf,
  overallGradeOf,
  reportTypeOptions,
  sectionOptions,
  statusOf,
  statusPill,
  totalOf,
} from '../data/academic.data';

export type AcademicModalId =
  | 'generate'
  | 'customize'
  | 'schedule'
  | 'export'
  | 'share'
  | 'print'
  | 'view';

export interface AcademicModalsProps {
  active: AcademicModalId | null;
  onClose: () => void;
  row: AcademicReport | null;
  rows: AcademicReport[];
  registerTotal: number;
  panelOpen: boolean;
  onClosePanel: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Stamps a generated date, which is what moves the row's status. */
  onGenerate: (id: string) => void;
  onShare: (id: string) => void;
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

const Select = ({ options }: { options: string[] }) => (
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

const Facts = ({ items }: { items: { label: string; value: React.ReactNode }[] }) => (
  <ul className="list-unstyled fs-13 border rounded p-3 mb-3">
    {items.map((item) => (
      <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
        <span className="text-muted">{item.label}</span>
        <span className="fw-medium">{item.value}</span>
      </li>
    ))}
  </ul>
);

const AcademicModals = ({
  active,
  onClose,
  row,
  rows,
  registerTotal,
  panelOpen,
  onClosePanel,
  onToast,
  onGenerate,
  onShare,
}: AcademicModalsProps) => {
  /** The report each dialog opens on, falling back to whichever fits its job. */
  const runnable = row ?? rows.find((item) => statusOf(item) === 'Ready to Generate') ?? rows[0] ?? null;
  const scheduled = row ?? rows.find((item) => statusOf(item) === 'Scheduled') ?? rows[0] ?? null;
  const shareable = row ?? rows.find((item) => statusOf(item) === 'Published') ?? rows[0] ?? null;
  const held = rows.find((item) => statusOf(item) === 'Reviewed');
  const detail = row ?? rows[0] ?? null;

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
        title="Generate Report"
        dialogClassName="modal-lg"
        footer={footerButtons('Generate Report', 'ti ti-player-play', () => {
          if (runnable) {
            onGenerate(runnable.id);
            onToast(`${runnable.id} generated`);
          }
          onClose();
        })}
      >
        <p className="text-muted fs-13 mb-3">Build a report from the marks already closed for the term</p>

        {runnable ? (
          <div className="border rounded p-3 mb-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
              <div>
                <h6 className="fs-14 mb-0">{runnable.name}</h6>
                <span className="fs-12 text-muted">
                  {runnable.id} · {runnable.scopeNote}
                </span>
              </div>
              <span className={`dt-pill ${statusPill[statusOf(runnable)]}`}>
                <span className="dt-pill-dot" />
                {statusOf(runnable)}
              </span>
            </div>
            <div className="row g-2 fs-13">
              <div className="col-sm-4">
                <span className="text-muted">Subjects Closed</span>{' '}
                <span className="fw-medium">
                  {enteredOf(runnable)} of {runnable.lines.length}
                </span>
              </div>
              <div className="col-sm-4">
                <span className="text-muted">Mean</span>{' '}
                <span className="fw-medium">
                  {averageOf(runnable) ?? '—'} · Grade {overallGradeOf(runnable)?.grade ?? '—'}
                </span>
              </div>
              <div className="col-sm-4">
                <span className="text-muted">Marks Closed</span>{' '}
                <span className="fw-medium">{runnable.marksClosedOn ?? '—'}</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="row g-3">
          <Field label="Report ID" span="col-md-4">
            <input type="text" className="form-control" defaultValue={runnable?.id ?? ''} readOnly />
          </Field>
          <Field label="Report Name" span="col-md-8">
            <input type="text" className="form-control" defaultValue={runnable?.name ?? ''} />
          </Field>
          <Field label="Report Type">
            <Select options={reportTypeOptions} />
          </Field>
          <Field label="Academic Year">
            <Select options={[ACADEMIC_YEAR, '2025-2026']} />
          </Field>
          <div className="col-12">
            <h6 className="fs-14 mb-2 mt-2">Scope</h6>
          </div>
          <Field label="Class" span="col-md-4">
            <Select options={classOptions} />
          </Field>
          <Field label="Section" span="col-md-4">
            <Select options={[...sectionOptions, 'All sections']} />
          </Field>
          <Field label="Exam / Term" span="col-md-4">
            <Select options={examOptions} />
          </Field>
          <Field label="Subjects" span="col-12">
            <Select options={['All subjects in the scheme', 'Core subjects only', 'Selected subjects']} />
          </Field>
          <div className="col-12">
            <h6 className="fs-14 mb-2 mt-2">Grading &amp; Output</h6>
          </div>
          <Field label="Grading Scale">
            <Select options={['A+ to E · 8 point', 'A to D · 5 point', 'Descriptive bands']} />
          </Field>
          <Field label="Template">
            <Select
              options={['Term report card, A4 portrait', 'Consolidated term sheet', 'Detailed subject analysis']}
            />
          </Field>
        </div>
      </Modal>

      {/* --------------------------- Customize Report ---------------------------- */}
      <Modal
        open={active === 'customize'}
        onClose={onClose}
        title="Customize Report"
        footer={footerButtons('Save Layout', 'ti ti-device-floppy', confirm('Layout saved'))}
      >
        <div className="row g-3">
          <Field label="Template">
            <Select
              options={['Term report card, A4 portrait', 'Consolidated term sheet', 'Junior progress report']}
            />
          </Field>
          <Field label="Applies To">
            <Select options={reportTypeOptions} />
          </Field>
          <div className="col-12">
            <h6 className="fs-14 mb-2">Sections to print</h6>
            {[
              ['ar-c1', 'Cover page with the school crest', true],
              ['ar-c2', 'Subject-wise mark table', true],
              ['ar-c3', 'Grade breakdown and the grading scale', true],
              ['ar-c4', 'Class rank and movement from the last exam', true],
              ['ar-c5', 'Attendance summary for the term', true],
              ['ar-c6', 'Teacher remarks', true],
              ['ar-c7', 'Previous term comparison', false],
              ['ar-c8', 'Fee status line in the footer', false],
            ].map(([id, label, on]) => (
              <Switch key={id as string} id={id as string} label={label as string} on={on as boolean} />
            ))}
          </div>
          <Field label="Page Size" span="col-md-4">
            <Select options={['A4', 'Letter', 'Legal']} />
          </Field>
          <Field label="Orientation" span="col-md-4">
            <Select options={['Portrait', 'Landscape']} />
          </Field>
          <Field label="Header" span="col-md-4">
            <Select options={['School letterhead', 'Crest only', 'No header']} />
          </Field>
          <Field label="Signatory" span="col-12">
            <Select options={['Mrs. Kalpana Menon · Academic Coordinator', 'Principal', 'Class Teacher']} />
          </Field>
          <Field label="Footer Note" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue="Marks are shown out of 100 for each subject. The pass mark is 33."
            />
          </Field>
        </div>
      </Modal>

      {/* ---------------------------- Schedule Report ---------------------------- */}
      <Modal
        open={active === 'schedule'}
        onClose={onClose}
        title="Schedule Report"
        footer={footerButtons('Save Schedule', 'ti ti-calendar-time', confirm('Schedule saved'))}
      >
        {scheduled?.scheduledFor ? (
          <div className="alert alert-soft-info fs-13 d-flex align-items-center gap-2">
            <i className="ti ti-info-circle" />
            {scheduled.id} runs on {scheduled.scheduledFor}. {scheduled.exam} marks close on 4 Aug 2026.
          </div>
        ) : null}
        {scheduled ? (
          <Facts
            items={[
              { label: 'Report', value: scheduled.name },
              { label: 'Scope', value: scheduled.scopeNote },
              { label: 'Status', value: statusOf(scheduled) },
              { label: 'Source Exam', value: scheduled.examRef },
              { label: 'Next Run', value: scheduled.scheduledNote ?? '—' },
            ]}
          />
        ) : null}
        <div className="row g-3">
          <Field label="Frequency">
            <Select options={['Once', 'Each Term', 'Monthly']} />
          </Field>
          <Field label="Report">
            <Select options={rows.map((item) => `${item.id} · ${item.scope}`)} />
          </Field>
          <Field label="Run Date">
            <DateField value="05-08-2026" onChange={() => undefined} format="d-m-Y" id="acr-run-date" />
          </Field>
          <Field label="Run Time">
            <input type="text" className="form-control" defaultValue="08:00 AM" />
          </Field>
          <Field label="Exam / Term">
            <Select options={['Unit Test 2 · EXM-2026-017', 'Term 1 Exam · EXM-2026-014']} />
          </Field>
          <Field label="Deliver To">
            <Select
              options={['Academic Coordinator', 'Principal and the coordinators', 'Class teachers of IX and X']}
            />
          </Field>
          <Field label="Schedule Note" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue="Runs each term, one day after the marks window closes."
            />
          </Field>
          <div className="col-12">
            <Switch id="acr-sc-skip" label="Skip the run if any section still has open marks entry" on />
            <Switch id="acr-sc-notify" label="Notify the coordinator when the run finishes" on />
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Export Report ---------------------------- */}
      <Modal
        open={active === 'export'}
        onClose={onClose}
        title="Export Report"
        footer={footerButtons('Export', 'ti ti-file-export', confirm('Report exported'))}
      >
        <div className="row g-3">
          <Field label="Format" span="col-12">
            <Radios name="acr-format" options={['PDF', 'Excel', 'CSV']} />
          </Field>
          <Field label="Scope" span="col-12">
            <Radios
              name="acr-scope"
              options={['This Report', `Filtered (${rows.length})`, `All (${registerTotal})`]}
            />
          </Field>
          {detail ? (
            <div className="col-12">
              <Facts
                items={[
                  { label: 'Report', value: detail.id },
                  { label: 'Scope', value: `${detail.scope} · ${detail.scopeNote}` },
                  {
                    label: 'Last Export',
                    value: detail.exports[detail.exports.length - 1]?.detail.split(' · ')[0] ?? 'Never',
                  },
                ]}
              />
            </div>
          ) : null}
          <Field label="File Name" span="col-md-4">
            <input type="text" className="form-control" defaultValue={detail?.id.toLowerCase() ?? 'report'} />
          </Field>
          <Field label="Page Size" span="col-md-4">
            <Select options={['A4', 'Letter']} />
          </Field>
          <Field label="Orientation" span="col-md-4">
            <Select options={['Portrait', 'Landscape']} />
          </Field>
          <div className="col-12">
            <Switch id="acr-ex-marks" label="Include the subject-wise mark table" on />
            <Switch id="acr-ex-remarks" label="Include teacher remarks" on />
            <Switch id="acr-ex-history" label="Record the export in the report history" on />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Share Report ---------------------------- */}
      <Modal
        open={active === 'share'}
        onClose={onClose}
        title="Share Report"
        footer={footerButtons('Share Report', 'ti ti-share', () => {
          if (shareable) {
            onShare(shareable.id);
            onToast(`${shareable.id} shared`);
          }
          onClose();
        })}
      >
        {held ? (
          <div className="alert alert-soft-warning fs-13 d-flex align-items-center gap-2">
            <i className="ti ti-alert-triangle" />
            Only a published report can be shared. {held.id} is reviewed but still held.
          </div>
        ) : null}
        {shareable ? (
          <Facts
            items={[
              { label: 'Report', value: shareable.name },
              { label: 'Reference', value: `${shareable.id} · ${shareable.scopeNote}` },
              {
                label: 'Grade',
                value: overallGradeOf(shareable)?.grade ?? 'Withheld',
              },
              { label: 'Status', value: statusOf(shareable) },
            ]}
          />
        ) : null}
        <div className="row g-3">
          <Field label="Share with">
            <Select options={['Guardians', 'Student', 'Staff']} />
          </Field>
          <Field label="Channel">
            <Select options={['Parent portal', 'Email', 'SMS link']} />
          </Field>
          <Field label="Link Expiry" span="col-12">
            <Select options={['30 days', '7 days', 'End of the term', 'No expiry']} />
          </Field>
          <Field label="Message" span="col-12">
            <textarea
              className="form-control"
              rows={3}
              defaultValue="The Term 1 report card is now available on the parent portal. Please acknowledge before the guardian meeting."
            />
          </Field>
          <div className="col-12">
            <Switch id="acr-sh-download" label="Allow the PDF to be downloaded" on />
            <Switch id="acr-sh-ack" label="Ask the guardian to acknowledge" on />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Print Report ---------------------------- */}
      <Modal
        open={active === 'print'}
        onClose={onClose}
        title="Print Report"
        footer={footerButtons('Send to Printer', 'ti ti-printer', () => {
          onClose();
          window.print();
        })}
      >
        {detail ? (
          <Facts
            items={[
              { label: 'Report', value: detail.name },
              { label: 'Scope', value: detail.scopeNote },
              { label: 'Status', value: statusOf(detail) },
              { label: 'Copies', value: `${detail.attendance.strength ?? 1}` },
              { label: 'Pages per Copy', value: '2' },
            ]}
          />
        ) : null}
        <div className="row g-3">
          <Field label="Print scope" span="col-12">
            <Radios name="acr-print" options={['Whole Section', 'Summary Only', 'Selected Rows']} />
          </Field>
          <Field label="Printer">
            <Select options={['School Office · HP LaserJet', 'Staff Room · Canon', 'Print to PDF']} />
          </Field>
          <Field label="Paper">
            <Select options={['A4 bond, 100 gsm', 'A4 plain, 80 gsm', 'School letterhead']} />
          </Field>
          <Field label="Copies">
            <input type="number" className="form-control" defaultValue={detail?.attendance.strength ?? 1} min={1} />
          </Field>
          <Field label="Collect At">
            <Select options={['Class teacher', 'School office, counter 2', 'With the term report pack']} />
          </Field>
          <div className="col-12">
            <Switch id="acr-pr-duplex" label="Print both sides of the sheet" on />
            <Switch id="acr-pr-sort" label="Sort by roll number before printing" on />
            <Switch id="acr-pr-record" label="Record the print run in the report history" on />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- View Details ---------------------------- */}
      <Modal
        open={active === 'view' && detail !== null}
        onClose={onClose}
        title={detail?.id ?? 'Report'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-outline-light bg-white me-2" onClick={() => window.print()}>
              <i className="ti ti-printer me-1" />
              Print
            </button>
            <button type="button" className="btn btn-primary" onClick={confirm('Report exported')}>
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
                <h6 className="fs-15 mb-0">{detail.scope}</h6>
                <span className="fs-12 text-muted">
                  {detail.scopeNote} · {detail.exam} · {detail.year}
                </span>
              </div>
              <span className={`dt-pill ${statusPill[statusOf(detail)]}`}>
                <span className="dt-pill-dot" />
                {statusOf(detail)}
              </span>
            </div>

            <div className="row g-2 text-center mb-3">
              {[
                { label: `${detail.lineNoun === 'section' ? 'Sections' : 'Subjects'}`, value: `${detail.lines.length}` },
                { label: 'Percentage', value: averageOf(detail) === null ? '—' : `${averageOf(detail)}%` },
                { label: 'Grade', value: overallGradeOf(detail)?.grade ?? 'Withheld' },
                {
                  label: 'Rank',
                  value:
                    detail.rank.rank === undefined ? 'Withheld' : `${detail.rank.rank} of ${detail.rank.outOf}`,
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

            <h6 className="fs-14 mb-2">
              {detail.lineNoun === 'section' ? 'Section-wise Performance' : 'Subject-wise Performance'}
            </h6>
            <div className="table-responsive border rounded mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>{detail.lineNoun === 'section' ? 'Section' : 'Subject'}</th>
                    <th className="text-center">Marks</th>
                    <th className="text-center">Max</th>
                    <th className="text-center">Grade</th>
                    <th className="text-center">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.lines.map((line) => {
                    const grade = lineGradeOf(line);
                    return (
                      <tr key={line.label}>
                        <td className="fs-13">{line.label}</td>
                        <td className="text-center fs-13">{line.marks ?? 'Not entered'}</td>
                        <td className="text-center fs-13">{line.marks === null ? '—' : 100}</td>
                        <td className="text-center">
                          {grade ? (
                            <span className={`badge badge-soft-${gradeTint(grade)}`}>{grade}</span>
                          ) : (
                            <span className="text-muted fs-13">—</span>
                          )}
                        </td>
                        <td className="text-center fs-13">
                          {line.marks === null ? '—' : `${line.marks.toFixed(1)}%`}
                        </td>
                      </tr>
                    );
                  })}
                  {enteredOf(detail) > 0 ? (
                    <tr className="fw-semibold">
                      <td className="fs-13">Total</td>
                      <td className="text-center fs-13">{obtainedOf(detail)}</td>
                      <td className="text-center fs-13">{totalOf(detail)}</td>
                      <td className="text-center">
                        {overallGradeOf(detail) ? (
                          <span className={`badge badge-soft-${gradeTint(overallGradeOf(detail)!.grade)}`}>
                            {overallGradeOf(detail)!.grade}
                          </span>
                        ) : (
                          <span className="text-muted fs-13">Withheld</span>
                        )}
                      </td>
                      <td className="text-center fs-13">{averageOf(detail)}%</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fs-14 mb-2">Grade Breakdown</h6>
                <ul className="list-unstyled fs-13 mb-0">
                  {breakdownOf(detail).map((item) => (
                    <li className="d-flex align-items-center justify-content-between py-1" key={item.grade}>
                      <span className={`badge badge-soft-${gradeTint(item.grade)}`}>{item.grade}</span>
                      <span className="text-muted">
                        {item.count} {item.count === 1 ? detail.lineNoun : `${detail.lineNoun}s`}
                      </span>
                    </li>
                  ))}
                  {breakdownOf(detail).length === 0 ? (
                    <li className="text-muted">Grades are assigned when the run completes.</li>
                  ) : null}
                </ul>
              </div>
              <div className="col-md-6">
                <h6 className="fs-14 mb-2">Report Configuration</h6>
                <ul className="list-unstyled fs-13 mb-0">
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Template</span>
                    <span className="fw-medium">{detail.template}</span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Grading Scale</span>
                    <span className="fw-medium">{detail.gradingScale}</span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Generated By</span>
                    <span className="fw-medium">{detail.generatedBy ?? '—'}</span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Reviewed By</span>
                    <span className="fw-medium">{detail.reviewedBy ?? '—'}</span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">At Pass Mark</span>
                    <span className="fw-medium">
                      {atPassMarkOf(detail)} of {enteredOf(detail)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* --------------------------- Report Details panel ------------------------ */}
      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title="Report Details"
        className="offcanvas-lg"
        titleAccessory={
          detail ? (
            <span className="fs-12 text-muted">
              {detail.id} · {detail.scope}
            </span>
          ) : null
        }
      >
        {detail ? (
          <>
            <h6 className="fs-14 mb-2">Scope</h6>
            <ul className="list-unstyled fs-13 mb-4">
              {[
                { label: 'Report Type', value: detail.type },
                { label: 'Scope', value: detail.scope },
                { label: 'Reference', value: detail.scopeNote },
                { label: 'Academic Year', value: detail.year },
                { label: 'Status', value: statusOf(detail) },
              ].map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>

            <h6 className="fs-14 mb-2">Exam Details</h6>
            <ul className="list-unstyled fs-13 mb-4">
              {[
                { label: 'Exam', value: detail.exam },
                { label: 'Reference', value: detail.examRef },
                { label: 'Window', value: detail.examWindow },
                { label: 'Marks Closed', value: detail.marksClosedOn ?? 'Open' },
                {
                  label: 'Marks Entry',
                  value: isCompleteOf(detail)
                    ? 'Complete'
                    : `${enteredOf(detail)} of ${detail.lines.length}`,
                },
              ].map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>

            <h6 className="fs-14 mb-2">Result</h6>
            <ul className="list-unstyled fs-13 mb-4">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Marks Obtained</span>
                <span className="fw-medium">
                  {enteredOf(detail) === 0 ? 'Not published' : `${obtainedOf(detail)} of ${totalOf(detail)}`}
                </span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Percentage</span>
                <span className="fw-medium">{averageOf(detail) === null ? '—' : `${averageOf(detail)}%`}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Highest</span>
                <span className="fw-medium">
                  {highestOf(detail) ? `${highestOf(detail)!.label} ${highestOf(detail)!.marks}` : '—'}
                </span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Lowest</span>
                <span className="fw-medium">
                  {lowestOf(detail) ? `${lowestOf(detail)!.label} ${lowestOf(detail)!.marks}` : '—'}
                </span>
              </li>
            </ul>

            <h6 className="fs-14 mb-2">Export History</h6>
            {detail.exports.length > 0 ? (
              <ul className="list-unstyled mb-0">
                {detail.exports.map((entry) => (
                  <li className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
                    <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                      <i className="ti ti-file-export" />
                    </span>
                    <div>
                      <h6 className="fs-13 mb-0 fw-medium">{entry.title}</h6>
                      <span className="fs-12 text-muted">{entry.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="fs-13 text-muted mb-0">
                A report can only be exported, printed or shared after it has been generated.
              </p>
            )}
          </>
        ) : null}
      </Offcanvas>
    </>
  );
};

export default AcademicModals;
