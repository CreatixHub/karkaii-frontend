import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { AttendanceState, RowEvaluation, RowMenuItem, StudentRow } from '../data/marksEntry.data';
import { entryStatuses, rowMenuItems } from '../data/marksEntry.data';

export interface EntryRow {
  row: StudentRow;
  evaluation: RowEvaluation;
}

export interface MarksEntryGridProps {
  rows: EntryRow[];
  className: string;
  section: string;
  subject: string;
  maxMarks: number;
  /** Rows edited since the last save — drives the card header's "Unsaved changes" pill. */
  dirtyCount: number;
  locked: boolean;
  onAttendance: (id: string, value: AttendanceState) => void;
  onMark: (id: string, value: string) => void;
  onRemark: (id: string, value: string) => void;
  openMenu: string | null;
  onOpenMenu: (id: string | null) => void;
  onRowAction: (item: RowMenuItem, row: StudentRow) => void;
  rangeTo: number;
  total: number;
  page: number;
  pageCount: number;
  onPage: (page: number) => void;
}

const TABLE_COLUMNS = 9;

/* ------------------------------- Field pieces ------------------------------ */

const AttendanceSelect = ({
  id,
  value,
  locked,
  onChange,
}: {
  id?: string;
  value: AttendanceState;
  locked: boolean;
  onChange: (value: AttendanceState) => void;
}) => (
  <select
    className="form-select"
    id={id}
    aria-label="Attendance"
    value={value}
    disabled={locked}
    onChange={(event) => onChange(event.target.value as AttendanceState)}
  >
    <option>Present</option>
    <option>Absent</option>
  </select>
);

const MarksField = ({
  id,
  evaluation,
  maxMarks,
  onChange,
}: {
  id?: string;
  evaluation: RowEvaluation;
  maxMarks: number;
  onChange: (value: string) => void;
}) => (
  <div className="input-group input-group-sm">
    <input
      type="text"
      className={`form-control text-center${evaluation.invalid ? ' is-invalid' : ''}`}
      id={id}
      placeholder="00"
      aria-label="Marks obtained"
      value={evaluation.value}
      disabled={evaluation.disabled}
      onChange={(event) => onChange(event.target.value)}
    />
    <span className="input-group-text">/{maxMarks}</span>
  </div>
);

const RemarksField = ({
  id,
  value,
  locked,
  onChange,
}: {
  id?: string;
  value: string;
  locked: boolean;
  onChange: (value: string) => void;
}) => (
  <input
    type="text"
    className="form-control form-control-sm"
    id={id}
    placeholder="Add remark"
    aria-label="Remarks"
    value={value}
    disabled={locked}
    onChange={(event) => onChange(event.target.value)}
  />
);

const StatusPillBadge = ({ evaluation }: { evaluation: RowEvaluation }) => {
  const pill = entryStatuses[evaluation.status];
  return (
    <span className={`badge ${pill.badge} d-inline-flex align-items-center`}>
      <i className={`${pill.icon} me-1`} />
      {pill.label}
    </span>
  );
};

const RowActions = ({
  row,
  open,
  onOpenMenu,
  onRowAction,
}: {
  row: StudentRow;
  open: boolean;
  onOpenMenu: (id: string | null) => void;
  onRowAction: (item: RowMenuItem, row: StudentRow) => void;
}) => (
  <div className="dropdown">
    <Link
      to="#"
      className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
      aria-expanded={open}
      aria-label="Row actions"
      onClick={(event) => {
        event.preventDefault();
        onOpenMenu(open ? null : row.id);
      }}
    >
      <i className="ti ti-dots-vertical" />
    </Link>
    <ul className={`dropdown-menu dropdown-menu-end p-2${open ? ' show' : ''}`}>
      {rowMenuItems.map((item) => (
        <li key={item.id}>
          <Link
            to="#"
            className="dropdown-item rounded-1"
            onClick={(event) => {
              event.preventDefault();
              onOpenMenu(null);
              onRowAction(item, row);
            }}
          >
            <i className={`${item.icon} me-2`} />
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

/* --------------------------------- The grid -------------------------------- */

const MarksEntryGrid = ({
  rows,
  className,
  section,
  subject,
  maxMarks,
  dirtyCount,
  locked,
  onAttendance,
  onMark,
  onRemark,
  openMenu,
  onOpenMenu,
  onRowAction,
  rangeTo,
  total,
  page,
  pageCount,
  onPage,
}: MarksEntryGridProps) => {
  const sheetPill = locked
    ? { badge: 'badge-soft-success', icon: 'ti ti-lock', label: 'Published' }
    : dirtyCount > 0
      ? { badge: 'badge-soft-warning', icon: 'ti ti-circle-filled fs-5', label: 'Unsaved changes' }
      : { badge: 'badge-soft-success', icon: 'ti ti-circle-check', label: 'All changes saved' };

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="d-flex align-items-center">
          <span className="avatar avatar-sm bg-primary-transparent text-primary rounded me-2">
            <i className="ti ti-table" />
          </span>
          <h6 className="mb-0">
            Marks Entry — {className} · {section}
          </h6>
        </div>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <span className="badge badge-soft-bordered fs-10">
            {subject} · Max {maxMarks}
          </span>
          <span className={`badge ${sheetPill.badge} d-inline-flex align-items-center`}>
            <i className={`${sheetPill.icon} me-1`} />
            {sheetPill.label}
          </span>
        </div>
      </div>

      {/* Desktop / tablet grid */}
      <div className="data-table dt-scroll d-none d-lg-block">
        <table className="table align-middle">
          <caption className="visually-hidden">
            Marks entry for {subject} — {className} {section}
          </caption>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student</th>
              <th>Admission No</th>
              <th>Attendance</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Remarks</th>
              <th>Status</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ row, evaluation }) => (
              <tr className={evaluation.status === 'Absent' ? 'dt-absent' : undefined} key={row.id}>
                <td className="fw-medium">{row.id}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-sm rounded me-2">
                      <ImageWithBasePath src={row.avatar} alt="Student" />
                    </span>
                    <h6 className="fs-14 mb-0">{row.name}</h6>
                  </div>
                </td>
                <td>{row.admissionNo}</td>
                <td>
                  <AttendanceSelect
                    value={row.attendance}
                    locked={locked}
                    onChange={(value) => onAttendance(row.id, value)}
                  />
                </td>
                <td>
                  <MarksField
                    evaluation={evaluation}
                    maxMarks={maxMarks}
                    onChange={(value) => onMark(row.id, value)}
                  />
                </td>
                <td>
                  <span className={`badge ${evaluation.grade.badge}`}>{evaluation.grade.grade}</span>
                  {evaluation.percent !== null ? (
                    <span className="fs-12 text-muted d-block mt-1">{evaluation.percent}%</span>
                  ) : null}
                </td>
                <td>
                  <RemarksField
                    value={row.remarks}
                    locked={locked}
                    onChange={(value) => onRemark(row.id, value)}
                  />
                </td>
                <td>
                  <StatusPillBadge evaluation={evaluation} />
                </td>
                <td className="text-end">
                  <RowActions
                    row={row}
                    open={openMenu === row.id}
                    onOpenMenu={onOpenMenu}
                    onRowAction={onRowAction}
                  />
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={TABLE_COLUMNS} className="text-center py-4 fs-13 text-muted">
                  No students match this search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Mobile entry cards */}
      <div className="card-body d-lg-none">
        {rows.map(({ row, evaluation }, index) => {
          const pill = entryStatuses[evaluation.status];
          return (
            <div
              className={`border rounded p-3${index === rows.length - 1 ? '' : ' mb-3'}${
                evaluation.status === 'Absent' ? ' bg-warning-transparent' : ''
              }`}
              key={row.id}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <span className="avatar avatar-sm rounded me-2">
                    <ImageWithBasePath src={row.avatar} alt="Student" />
                  </span>
                  <div>
                    <h6 className="fs-14 mb-0">{row.name}</h6>
                    <span className="fs-12 text-muted">
                      {row.id} · {row.admissionNo}
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge ${pill.badge}`}>{pill.short}</span>
                  <RowActions
                    row={row}
                    open={openMenu === `card-${row.id}`}
                    onOpenMenu={(id) => onOpenMenu(id === null ? null : `card-${id}`)}
                    onRowAction={onRowAction}
                  />
                </div>
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label fs-12 mb-1" htmlFor={`me-attendance-${row.id}`}>
                    Attendance
                  </label>
                  <AttendanceSelect
                    id={`me-attendance-${row.id}`}
                    value={row.attendance}
                    locked={locked}
                    onChange={(value) => onAttendance(row.id, value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fs-12 mb-1" htmlFor={`me-marks-${row.id}`}>
                    Marks
                  </label>
                  <MarksField
                    id={`me-marks-${row.id}`}
                    evaluation={evaluation}
                    maxMarks={maxMarks}
                    onChange={(value) => onMark(row.id, value)}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fs-12 mb-1" htmlFor={`me-remarks-${row.id}`}>
                    Remarks
                  </label>
                  <RemarksField
                    id={`me-remarks-${row.id}`}
                    value={row.remarks}
                    locked={locked}
                    onChange={(value) => onRemark(row.id, value)}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {rows.length === 0 ? <p className="mb-0 fs-13 text-muted text-center py-3">No students match this search.</p> : null}
      </div>

      <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
        <p className="mb-0 fs-13 text-muted">
          Showing {rangeTo} of {total} students
        </p>
        <nav>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
              <Link
                to="#"
                className="page-link"
                onClick={(event) => {
                  event.preventDefault();
                  if (page > 1) onPage(page - 1);
                }}
              >
                Previous
              </Link>
            </li>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <li className={`page-item${number === page ? ' active' : ''}`} key={number}>
                <Link
                  to="#"
                  className="page-link"
                  onClick={(event) => {
                    event.preventDefault();
                    onPage(number);
                  }}
                >
                  {number}
                </Link>
              </li>
            ))}
            <li className={`page-item${page === pageCount ? ' disabled' : ''}`}>
              <Link
                to="#"
                className="page-link"
                onClick={(event) => {
                  event.preventDefault();
                  if (page < pageCount) onPage(page + 1);
                }}
              >
                Next
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MarksEntryGrid;
