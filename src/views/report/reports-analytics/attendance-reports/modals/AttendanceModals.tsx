import { useEffect, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { AttendanceRecord, RecordType } from '../data/attendance.data';
import {
  academicYearOptions,
  attendancePctOf,
  bandOf,
  bandOptions,
  classOptions,
  departmentOptions,
  designationOptions,
  effectivePresentOf,
  exceptionLabelOf,
  pctLabel,
  presentOf,
  REPORT_RANGE,
  sectionOptions,
  statusOf,
  statusPill,
  timelineTone,
  workingDaysOf,
} from '../data/attendance.data';

export type AttendanceModalId =
  | 'generate'
  | 'compare'
  | 'export'
  | 'print'
  | 'share'
  | 'template'
  | 'schedule'
  | 'exceptions'
  | 'history';

export interface AttendanceModalsProps {
  active: AttendanceModalId | null;
  onClose: () => void;
  /** The record a row-level dialog was opened from. */
  row: AttendanceRecord | null;
  /** Every record the report currently shows. */
  rows: AttendanceRecord[];
  /** Records ticked in the grid. */
  selected: AttendanceRecord[];
  /** The register the report reads from, before any filter. */
  registerTotal: number;
  analyticsOpen: boolean;
  onCloseAnalytics: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Marks an exception closed on the record that raised it. */
  onCloseException: (recordId: string, exception: string) => void;
}

/* --------------------------------- Helpers --------------------------------- */

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

const Select = ({ options, id }: { options: string[]; id?: string }) => (
  <select className="form-select" id={id} defaultValue={options[0]}>
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

/** One line of the exception register, open or resolved. */
interface ExceptionRow {
  key: string;
  recordId: string;
  name: string;
  where: string;
  type: RecordType;
  exception: string;
  raised: string;
  open: boolean;
}

const AttendanceModals = ({
  active,
  onClose,
  row,
  rows,
  selected,
  registerTotal,
  analyticsOpen,
  onCloseAnalytics,
  onToast,
  onCloseException,
}: AttendanceModalsProps) => {
  const [comparison, setComparison] = useState('Record type');
  const [metric, setMetric] = useState('Attendance percentage');

  /* Escape closes whichever dialog is open; Modal owns the rest of that. */
  useEffect(() => {
    if (!active) setComparison('Record type');
  }, [active]);

  const selectionLabel = `${selected.length} selected of ${registerTotal.toLocaleString()}`;

  /* ---------------------------- The exception list --------------------------- */

  const exceptionRows = useMemo<ExceptionRow[]>(() => {
    const open: ExceptionRow[] = rows.flatMap((record) =>
      record.exceptions.map((exception) => ({
        key: `${record.id}-${exception}`,
        recordId: record.id,
        name: record.name,
        where: record.type === 'Student' ? `${record.group} ${record.unit.replace('Section ', '')}` : record.code,
        type: record.type,
        exception,
        raised: record.remarks[0]?.date ?? record.lastDate,
        open: true,
      })),
    );
    const resolved: ExceptionRow[] = rows
      .filter((record) => record.exceptions.length === 0)
      .map((record) => ({
        key: `${record.id}-resolved`,
        recordId: record.id,
        name: record.name,
        where: record.type === 'Student' ? `${record.group} ${record.unit.replace('Section ', '')}` : record.code,
        type: record.type,
        exception: record.exceptionsNote.title,
        raised: record.exceptionsNote.detail.split(' · ')[0],
        open: false,
      }));
    return [...open, ...resolved];
  }, [rows]);

  /** The four counters, counting what the list above them actually holds. */
  const exceptionCounts = useMemo(() => {
    const openOnes = exceptionRows.filter((item) => item.open);
    const has = (needle: string) =>
      openOnes.filter((item) => item.exception.toLowerCase().includes(needle)).length;
    return [
      { id: 'below', tint: 'danger', label: 'below policy', value: has('below') },
      { id: 'late', tint: 'warning', label: 'late threshold', value: has('late threshold') },
      { id: 'unapproved', tint: 'info', label: 'unapproved days', value: has('unapproved') },
      { id: 'unmarked', tint: 'secondary', label: 'unmarked days', value: has('unmarked') },
    ];
  }, [exceptionRows]);

  /* ------------------------------- Comparison -------------------------------- */

  /**
   * The comparison groups the roster the way the Compare By select asks, and
   * reads each group on the chosen metric. Report A is the term to date and
   * Report B is July within it, so the change is what the month did to the term.
   */
  const comparisonRows = useMemo(() => {
    const keyOf = (record: AttendanceRecord) => {
      switch (comparison) {
        case 'Class':
          return record.type === 'Student' ? record.group : record.group;
        case 'Section':
          return record.unit;
        case 'Department':
          return record.type === 'Student' ? record.group : record.group;
        case 'Designation':
          return record.unit;
        case 'Shift':
          return `${record.shift} shift`;
        default:
          return `${record.type}s`;
      }
    };

    const groups = new Map<string, AttendanceRecord[]>();
    rows.forEach((record) => {
      const key = keyOf(record);
      groups.set(key, [...(groups.get(key) ?? []), record]);
    });

    const readOn = (group: AttendanceRecord[], july: boolean) => {
      if (metric === 'Absent days') return group.reduce((total, r) => total + r.absent, 0);
      if (metric === 'Late marks') return group.reduce((total, r) => total + r.lateMarks, 0);
      if (metric === 'Leave days') return group.reduce((total, r) => total + r.leave, 0);
      if (metric === 'Half days') return group.reduce((total, r) => total + r.halfDays, 0);

      const present = group.reduce(
        (total, r) => total + (july ? r.months[r.months.length - 1].present : effectivePresentOf(r)),
        0,
      );
      const working = group.reduce(
        (total, r) => total + (july ? r.months[r.months.length - 1].working : workingDaysOf(r)),
        0,
      );
      return working === 0 ? 0 : Math.round((present / working) * 1000) / 10;
    };

    const isPct = metric === 'Attendance percentage';

    return [...groups.entries()].map(([label, group]) => {
      const a = readOn(group, false);
      const b = readOn(group, true);
      return {
        label,
        a: isPct ? pctLabel(a) : `${a}`,
        b: isPct ? pctLabel(b) : `${b}`,
        change: Math.round((b - a) * 10) / 10,
        isPct,
      };
    });
  }, [comparison, metric, rows]);

  const biggestMove = useMemo(
    () =>
      comparisonRows.reduce(
        (worst, item) => (Math.abs(item.change) > Math.abs(worst?.change ?? 0) ? item : worst),
        comparisonRows[0],
      ),
    [comparisonRows],
  );

  /* -------------------------------- Analytics -------------------------------- */

  const distribution = useMemo(() => {
    const total = rows.length || 1;
    return bandOptions.map((band) => {
      const count = rows.filter((record) => bandOf(record) === band).length;
      return {
        band,
        count,
        share: Math.round((count / total) * 1000) / 10,
      };
    });
  }, [rows]);

  const typeMeans = useMemo(() => {
    const types: RecordType[] = ['Student', 'Teacher', 'Staff'];
    return types
      .map((type) => {
        const group = rows.filter((record) => record.type === type);
        const present = group.reduce((total, r) => total + effectivePresentOf(r), 0);
        const working = group.reduce((total, r) => total + workingDaysOf(r), 0);
        return { type, mean: working === 0 ? 0 : Math.round((present / working) * 1000) / 10, size: group.length };
      })
      .filter((item) => item.size > 0);
  }, [rows]);

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
        title="Generate Attendance Report"
        dialogClassName="modal-lg"
        footer={footerButtons('Generate Report', 'ti ti-player-play', confirm('Attendance report generated'))}
      >
        <p className="text-muted fs-13 mb-3">Build an attendance report for students, teachers or staff</p>

        <div className="border rounded p-3 mb-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
            <div>
              <h6 className="fs-14 mb-0">Term 1 — 1 Jul to 31 Jul 2026</h6>
              <span className="fs-12 text-muted">
                {rows.length > 0 ? workingDaysOf(rows[0]) : 96} working days ·{' '}
                {registerTotal.toLocaleString()} records in scope
              </span>
            </div>
            <span className="badge badge-soft-success">
              <i className="ti ti-lock me-1" />
              Register Closed
            </span>
          </div>
          <div className="row g-2 fs-13">
            <div className="col-sm-6">
              <span className="text-muted">Days Marked</span>{' '}
              <span className="fw-medium">
                {(registerTotal - 11).toLocaleString()} of {registerTotal.toLocaleString()}
              </span>
            </div>
            <div className="col-sm-6">
              <span className="text-muted">Unmarked Days</span>{' '}
              <span className="fw-medium">
                {rows.reduce((total, record) => total + (record.unmarked ?? 0), 0)} days across{' '}
                {rows.filter((record) => record.unmarked).length} records
              </span>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <Field label="Report Name" span="col-12">
            <input type="text" className="form-control" defaultValue="Term 1 Attendance Report" />
          </Field>
          <Field label="Report Type">
            <Select
              options={[
                'Consolidated Attendance Report',
                'Student Attendance Report',
                'Teacher Attendance Report',
                'Staff Attendance Report',
                'Low Attendance Report',
                'Late Arrival Report',
                'Leave Summary Report',
              ]}
            />
          </Field>
          <Field label="Applies To">
            <Select options={['Students, Teachers and Staff', 'Students only', 'Teachers only', 'Staff only']} />
          </Field>
          <Field label="Academic Year" span="col-md-4">
            <Select options={academicYearOptions} />
          </Field>
          <Field label="Shift" span="col-md-4">
            <Select options={['All shifts', 'Morning', 'General', 'Afternoon']} />
          </Field>
          <Field label="Class" span="col-md-4">
            <Select options={['All classes', ...classOptions]} />
          </Field>
          <Field label="Section" span="col-md-4">
            <Select options={['All sections', ...sectionOptions]} />
          </Field>
          <Field label="Department" span="col-md-4">
            <Select options={['All departments', ...departmentOptions]} />
          </Field>
          <Field label="Designation" span="col-md-4">
            <Select options={['All designations', ...designationOptions]} />
          </Field>
          <Field label="From Date">
            <DateField value="01-07-2026" onChange={() => undefined} format="d-m-Y" id="ar-from" />
          </Field>
          <Field label="To Date">
            <DateField value="31-07-2026" onChange={() => undefined} format="d-m-Y" id="ar-to" />
          </Field>

          <div className="col-12">
            <h6 className="fs-14 mb-2 mt-2">Calculation &amp; Output</h6>
          </div>
          <Field label="Working Days Basis">
            <Select options={['Term working days · 96', 'Month working days · 24', 'Days marked only']} />
          </Field>
          <Field label="Half Day Counts As">
            <Select options={['Half a working day', 'A full present day', 'A full absent day']} />
          </Field>
          <Field label="Template" span="col-12">
            <Select
              options={[
                'Attendance register, A4 landscape',
                'Attendance summary, A4 portrait',
                'Low attendance notice, A4 portrait',
              ]}
            />
          </Field>
        </div>
      </Modal>

      {/* ---------------------------- Compare Reports ---------------------------- */}
      <Modal
        open={active === 'compare'}
        onClose={onClose}
        title="Compare Reports"
        dialogClassName="modal-lg"
        footer={footerButtons('Run Comparison', 'ti ti-arrows-diff', confirm('Comparison run'))}
      >
        <div className="row g-3 mb-3">
          <Field label="Report A">
            <Select options={['Term 1 · 1 Jul – 31 Jul 2026', 'June 2026 · monthly', 'Term 1 · 2025-2026']} />
          </Field>
          <Field label="Report B">
            <Select options={['June 2026 · monthly', 'Term 1 · 1 Jul – 31 Jul 2026', 'Term 1 · 2025-2026']} />
          </Field>
          <Field label="Compare By">
            <select
              className="form-select"
              value={comparison}
              onChange={(event) => setComparison(event.target.value)}
            >
              {['Record type', 'Class', 'Section', 'Department', 'Designation', 'Shift'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
          <Field label="Metric">
            <select className="form-select" value={metric} onChange={(event) => setMetric(event.target.value)}>
              {['Attendance percentage', 'Absent days', 'Late marks', 'Leave days', 'Half days'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="table-responsive border rounded">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Group</th>
                <th className="text-center">Report A</th>
                <th className="text-center">Report B</th>
                <th className="text-center">Change</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((item) => (
                <tr key={item.label}>
                  <td className="fs-13">{item.label}</td>
                  <td className="text-center fs-13">{item.a}</td>
                  <td className="text-center fs-13">{item.b}</td>
                  <td className="text-center">
                    <span className={`badge badge-soft-${item.change >= 0 ? 'success' : 'danger'}`}>
                      <i className={`ti ti-arrow-${item.change >= 0 ? 'up' : 'down'} me-1`} />
                      {Math.abs(item.change)}
                      {item.isPct ? '' : ''}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {biggestMove ? (
          <p className="fs-12 text-muted mt-3 mb-0">
            {comparisonRows.every((item) => item.change <= 0)
              ? 'Every group fell against the term.'
              : 'Not every group moved the same way against the term.'}{' '}
            {biggestMove.label} moved the most, at {Math.abs(biggestMove.change)} points.
          </p>
        ) : null}
      </Modal>

      {/* ------------------------------ Export Report ---------------------------- */}
      <Modal
        open={active === 'export'}
        onClose={onClose}
        title="Export Report"
        footer={footerButtons('Export', 'ti ti-file-export', confirm(`${rows.length} records exported`))}
      >
        <div className="row g-3">
          <Field label="Format" span="col-12">
            <Radios name="ar-format" options={['PDF', 'Excel', 'CSV']} />
          </Field>
          <div className="col-12">
            <ul className="list-unstyled fs-13 border rounded p-3 mb-0">
              <li className="d-flex justify-content-between py-1">
                <span className="text-muted">Report</span>
                <span className="fw-medium">Term 1 Attendance Report</span>
              </li>
              <li className="d-flex justify-content-between py-1">
                <span className="text-muted">Range</span>
                <span className="fw-medium">{REPORT_RANGE.replace(' - ', ' – ')}</span>
              </li>
              <li className="d-flex justify-content-between py-1">
                <span className="text-muted">Records</span>
                <span className="fw-medium">{selectionLabel}</span>
              </li>
            </ul>
          </div>
          <Field label="Rows To Export">
            <Select
              options={['Selected records only', 'Current page', 'All filtered records', 'All records']}
            />
          </Field>
          <Field label="Columns">
            <Select options={['Visible columns', 'All columns', 'Summary columns only']} />
          </Field>
          <Field label="Page Size" span="col-md-4">
            <Select options={['A4', 'Letter', 'Legal']} />
          </Field>
          <Field label="Orientation" span="col-md-4">
            <Select options={['Landscape', 'Portrait']} />
          </Field>
          <Field label="File Name" span="col-md-4">
            <input type="text" className="form-control" defaultValue="term-1-attendance" />
          </Field>
          <div className="col-12">
            <Switch id="ar-ex-strip" label="Include the attendance summary strip" on />
            <Switch id="ar-ex-detail" label="Include the expanded row detail for each record" />
            <Switch id="ar-ex-head" label="Print on the school letterhead" on />
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
          <h6 className="fs-14 mb-1">Term 1 Attendance Report</h6>
          <span className="fs-12 text-muted">
            {REPORT_RANGE.replace(' - ', ' – ')} · {rows.length > 0 ? workingDaysOf(rows[0]) : 96} working days
          </span>
          <div className="row g-2 fs-13 mt-2">
            <div className="col-6">
              <span className="text-muted">Pages</span>{' '}
              <span className="fw-medium">{Math.max(1, Math.ceil(rows.length / 20))}</span>
            </div>
            <div className="col-6">
              <span className="text-muted">Records</span>{' '}
              <span className="fw-medium">{rows.length} rows</span>
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
            <Select options={['All pages', 'Current page', 'Selected records only']} />
          </Field>
          <div className="col-12">
            <Switch id="ar-pr-head" label="Repeat the column header on every page" on />
            <Switch id="ar-pr-sum" label="Print the attendance summary on the first page" on />
            <Switch id="ar-pr-sign" label="Leave a signature block for the coordinator" />
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
            <Radios name="ar-share" options={['Email', 'Portal', 'Link']} />
          </Field>
          <div className="col-12">
            <ul className="list-unstyled fs-13 border rounded p-3 mb-0">
              <li className="d-flex justify-content-between py-1">
                <span className="text-muted">Report</span>
                <span className="fw-medium">Term 1 Attendance Report</span>
              </li>
              <li className="d-flex justify-content-between py-1">
                <span className="text-muted">Records Included</span>
                <span className="fw-medium">{selectionLabel}</span>
              </li>
            </ul>
          </div>
          <Field label="Share With" span="col-12">
            <Select
              options={[
                'Principal and the coordinators',
                'Class teachers of the selected sections',
                'Department heads',
                'Guardians of the flagged students',
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
              defaultValue={`July attendance is final. ${
                rows.filter((record) => record.exceptions.length > 0).length
              } records carry an open exception and are flagged in the report.`}
            />
          </Field>
          <div className="col-12">
            <Switch id="ar-sh-copy" label="Send a copy to the school office" on />
            <Switch id="ar-sh-audit" label="Record the share in the report audit history" on />
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
            {[
              'Students, Teachers and Staff',
              '2026-2027',
              REPORT_RANGE.replace(' - ', ' – '),
              `${rows.length > 0 ? workingDaysOf(rows[0]) : 96} working days`,
              'All shifts',
              `${rows.filter((record) => record.exceptions.length > 0).length} with exceptions`,
            ].map((chip) => (
              <span className="badge badge-soft-secondary" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="row g-3">
          <Field label="Template Name" span="col-12">
            <input type="text" className="form-control" defaultValue="Monthly attendance — all records" />
          </Field>
          <Field label="Visibility">
            <Select options={['Only me', 'School office', 'All coordinators']} />
          </Field>
          <Field label="Category">
            <Select options={['Attendance', 'Compliance', 'Payroll input']} />
          </Field>
          <Field label="Description" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue="Run at the close of each month with the working days basis set to the term."
            />
          </Field>
          <div className="col-12">
            <Switch id="ar-tpl-cols" label="Save the column visibility and sort order" on />
            <Switch id="ar-tpl-filters" label="Save the active filters and quick filter" on />
            <Switch id="ar-tpl-default" label="Make this the default view for this page" />
          </div>
        </div>
      </Modal>

      {/* -------------------------- Schedule Automatic Reports ------------------- */}
      <Modal
        open={active === 'schedule'}
        onClose={onClose}
        title="Schedule Automatic Reports"
        dialogClassName="modal-lg"
        footer={footerButtons('Save Schedule', 'ti ti-calendar-time', confirm('Schedule saved'))}
      >
        <div className="alert alert-soft-info fs-13 d-flex align-items-center gap-2">
          <i className="ti ti-info-circle" />
          The next run is 1 Aug 2026. The July register locks on 31 Jul 2026.
        </div>
        <div className="row g-3">
          <Field label="Frequency">
            <Select options={['Monthly', 'Daily', 'Weekly', 'Each Term']} />
          </Field>
          <Field label="Report Template">
            <Select
              options={[
                'Monthly attendance — all records',
                'Low attendance report — students',
                'Staff late arrival report',
                'Leave summary — teachers',
              ]}
            />
          </Field>
          <Field label="Run Date">
            <DateField value="01-08-2026" onChange={() => undefined} format="d-m-Y" id="ar-run-date" />
          </Field>
          <Field label="Run Time">
            <input type="text" className="form-control" defaultValue="06:00 AM" />
          </Field>
          <Field label="Applies To">
            <Select options={['Students, Teachers and Staff', 'Students only', 'Teachers only', 'Staff only']} />
          </Field>
          <Field label="Deliver To">
            <Select options={['Principal and the coordinators', 'School office', 'Department heads']} />
          </Field>
          <Field label="Format">
            <Select options={['PDF', 'Excel', 'PDF and Excel']} />
          </Field>
          <Field label="Ends">
            <Select options={['End of the academic year', 'After 12 runs', 'Never']} />
          </Field>
          <Field label="Schedule Note" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue="Runs on the first working day of each month, one day after the register locks."
            />
          </Field>
          <div className="col-12">
            <Switch id="ar-sc-hold" label="Hold the run if any register day is still unmarked" on />
            <Switch id="ar-sc-notify" label="Notify the school office when the run finishes" on />
          </div>
        </div>
      </Modal>

      {/* --------------------------- Attendance Exceptions ----------------------- */}
      <Modal
        open={active === 'exceptions'}
        onClose={onClose}
        title="Attendance Exceptions"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={confirm('Review assigned')}>
              <i className="ti ti-user-check me-1" />
              Assign Review
            </button>
          </>
        }
      >
        <p className="text-muted fs-13 mb-3">
          Records that break an attendance policy or need a manual decision
        </p>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {exceptionCounts.map((item) => (
            <span className={`badge badge-soft-${item.tint}`} key={item.id}>
              {item.value} {item.label}
            </span>
          ))}
        </div>

        <div className="table-responsive border rounded mb-3">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Record</th>
                <th>Type</th>
                <th>Exception</th>
                <th>Raised</th>
                <th className="text-end">Status</th>
              </tr>
            </thead>
            <tbody>
              {exceptionRows.map((item) => (
                <tr key={item.key}>
                  <td className="fs-13 fw-medium text-nowrap">
                    {item.name}
                    <span className="fs-12 text-muted d-block">{item.where}</span>
                  </td>
                  <td>
                    <span className="badge badge-soft-secondary">{item.type}</span>
                  </td>
                  <td className="fs-13">{item.exception}</td>
                  <td className="fs-12 text-muted text-nowrap">{item.raised}</td>
                  <td className="text-end">
                    {item.open ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        onClick={() => {
                          onCloseException(item.recordId, item.exception);
                          onToast(`${item.exception} closed for ${item.name}`);
                        }}
                      >
                        <i className="ti ti-check me-1" />
                        Close
                      </button>
                    ) : (
                      <span className="badge badge-soft-success">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row g-3">
          <Field label="Assign Review To">
            <Select
              options={[
                'Mrs. Kalpana Menon · Academic Coordinator',
                'Ms. Fatima Sheikh · HR Executive',
                'Mr. Suresh Pillai · Transport Manager',
              ]}
            />
          </Field>
          <Field label="Due By">
            <DateField value="07-08-2026" onChange={() => undefined} format="d-m-Y" id="ar-exc-due" />
          </Field>
          <Field label="Review Note" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue={`Close the ${
                exceptionRows.filter((item) => item.open).length
              } open exceptions before the August payroll cut off.`}
            />
          </Field>
        </div>
      </Modal>

      {/* ----------------------------- Complete History -------------------------- */}
      <Modal
        open={active === 'history' && row !== null}
        onClose={onClose}
        title={row?.name ?? 'Complete History'}
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
            <button type="button" className="btn btn-primary" onClick={confirm('History exported')}>
              <i className="ti ti-file-export me-1" />
              Export
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-3 border-bottom pb-3 mb-3">
              <span className="avatar avatar-lg rounded flex-shrink-0">
                <ImageWithBasePath src={row.image} alt={row.name} className="rounded" />
              </span>
              <div>
                <h6 className="fs-15 mb-0">{row.name}</h6>
                <span className="fs-12 text-muted">
                  {row.code} · {row.group} {row.type === 'Student' ? row.unit.replace('Section ', '') : row.unit} ·{' '}
                  {row.type} · {row.shift} shift
                </span>
              </div>
              <span className={`dt-pill ms-auto ${statusPill[statusOf(row)]}`}>
                <span className="dt-pill-dot" />
                {statusOf(row)}
              </span>
            </div>

            <div className="row g-2 text-center mb-3">
              {[
                { label: 'Working', value: `${workingDaysOf(row)}` },
                { label: 'Present', value: `${presentOf(row)}` },
                { label: 'Absent', value: `${row.absent}` },
                { label: 'Late', value: `${row.lateMarks}` },
                { label: 'Leave', value: `${row.leave}` },
                { label: 'Percent', value: pctLabel(attendancePctOf(row)) },
              ].map((item) => (
                <div className="col-4 col-md-2" key={item.label}>
                  <div className="border rounded py-2">
                    <h6 className="fs-16 mb-0">{item.value}</h6>
                    <span className="fs-12 text-muted">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <h6 className="fs-14 mb-2">Attendance Register</h6>
            <div className="table-responsive border rounded mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {row.timeline.map((event) => {
                    const tone = timelineTone(event.kind);
                    return (
                      <tr key={`${event.kind}-${event.date}`}>
                        <td className="fs-13 text-nowrap">{event.date}</td>
                        <td>
                          <span className={`badge badge-soft-${tone.tint}`}>
                            <i className={`${tone.icon} me-1`} />
                            {event.kind}
                          </span>
                        </td>
                        <td className="fs-12 text-muted">{event.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <h6 className="fs-14 mb-2">Audit History</h6>
            <ul className="list-unstyled mb-0">
              {row.audit.map((entry) => (
                <li className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
                  <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                    <i className="ti ti-history" />
                  </span>
                  <div>
                    <h6 className="fs-13 mb-0 fw-medium">{entry.title}</h6>
                    <span className="fs-12 text-muted">{entry.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Modal>

      {/* -------------------------- Advanced Analytics panel --------------------- */}
      <Offcanvas
        open={analyticsOpen}
        onClose={onCloseAnalytics}
        title="Advanced Attendance Analytics"
        className="offcanvas-lg"
        titleAccessory={
          <span className="fs-12 text-muted">
            {REPORT_RANGE.replace(' - ', ' – ')} · {rows.length > 0 ? workingDaysOf(rows[0]) : 96} working days ·{' '}
            {rows.length} records
          </span>
        }
      >
        <h6 className="fs-14 mb-2">Attendance by record type</h6>
        <ul className="list-unstyled mb-4">
          {typeMeans.map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.type}>
              <span className="fs-13">
                {item.type}s
                <span className="fs-12 text-muted ms-1">
                  ({item.size} {item.size === 1 ? 'record' : 'records'})
                </span>
              </span>
              <span className="fs-13 fw-semibold">{pctLabel(item.mean)}</span>
            </li>
          ))}
        </ul>

        <h6 className="fs-14 mb-2">Attendance Distribution</h6>
        <ul className="list-unstyled mb-4">
          {distribution.map((item) => (
            <li className="mb-3" key={item.band}>
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fs-13">{item.band}</span>
                <span className="fs-12 text-muted">
                  {item.count} {item.count === 1 ? 'record' : 'records'} · {item.share}%
                </span>
              </div>
              <div className="meter meter-primary">
                <span style={{ width: `${item.share}%` }} />
              </div>
            </li>
          ))}
        </ul>

        <h6 className="fs-14 mb-2">Open exceptions</h6>
        <ul className="list-unstyled mb-0">
          {rows
            .filter((record) => record.exceptions.length > 0)
            .map((record) => (
              <li className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={record.id}>
                <span className="avatar avatar-sm rounded flex-shrink-0">
                  <ImageWithBasePath src={record.image} alt={record.name} className="rounded" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 fw-medium text-truncate">{record.name}</h6>
                  <span className="fs-12 text-muted">{exceptionLabelOf(record)}</span>
                </div>
                <span className="fs-13 fw-semibold">{pctLabel(attendancePctOf(record))}</span>
              </li>
            ))}
          {rows.every((record) => record.exceptions.length === 0) ? (
            <li className="text-muted fs-13">Nothing is open against this report.</li>
          ) : null}
        </ul>
      </Offcanvas>
    </>
  );
};

export default AttendanceModals;
