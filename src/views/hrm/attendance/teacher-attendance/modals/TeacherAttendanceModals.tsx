import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { AttendanceModalId } from '../data/attendanceWorkspace.data';
import {
  assignedTimetable,
  attendanceMethodOptions,
  attendanceStatusOptions,
  correctionOriginal,
  correctionReason,
  historyRows,
  historyTiles,
  teacherOptions,
} from '../data/attendanceWorkspace.data';
import type { AttendanceStatus, TeacherAttendanceRow } from '../data/teacherAttendance.data';

/** Badge tint the dialogs give each status. */
const statusBadge: Record<AttendanceStatus, string> = {
  Present: 'badge badge-soft-success',
  Absent: 'badge badge-soft-danger',
  Late: 'badge badge-soft-warning',
  Pending: 'badge badge-soft-warning',
  'On Leave': 'badge badge-soft-info',
  'Half Day': 'badge badge-soft-dark',
};

const ATTENDANCE_DATE = '26 Jul 2026';

export interface TeacherAttendanceModalsProps {
  active: AttendanceModalId | null;
  /** The row that opened the dialog; the page header's buttons pass the first. */
  row: TeacherAttendanceRow | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onOpenModal: (modal: AttendanceModalId) => void;
  onConfirmDelete: () => void;
}

interface IdentityProps {
  row: TeacherAttendanceRow;
  subtitle: string;
  withBadges?: boolean;
}

/** The header repeated at the top of the read-only dialogs. */
const Identity = ({ row, subtitle, withBadges = false }: IdentityProps) => (
  <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
    <span className="avatar avatar-lg me-3">
      <ImageWithBasePath src={row.avatar} className="rounded" alt={row.name} />
    </span>
    <div>
      {withBadges ? (
        <div className="d-flex align-items-center gap-2">
          <h5 className="mb-0">{row.name}</h5>
          <span className="badge bg-primary-transparent text-primary">{row.id}</span>
          <span className={statusBadge[row.status]}>{row.status}</span>
        </div>
      ) : (
        <h5 className="mb-0">{row.name}</h5>
      )}
      <p className="mb-0 text-muted fs-13">{subtitle}</p>
    </div>
  </div>
);

const TeacherAttendanceModals = ({
  active,
  row,
  onClose,
  onToast,
  onOpenModal,
  onConfirmDelete,
}: TeacherAttendanceModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message);
    onClose();
  };

  const cancelFooter = (label: string, primary: React.ReactNode) => (
    <>
      <button type="button" className="btn btn-light me-2" onClick={onClose}>
        {label}
      </button>
      {primary}
    </>
  );

  /* ------------------------------ Mark / Edit ------------------------------- */

  const attendanceForm = (mode: 'mark' | 'edit') => {
    const suffix = mode === 'mark' ? '' : '-2';
    const values =
      mode === 'edit' && row
        ? {
            checkIn: row.checkIn === '—' ? '' : row.checkIn,
            checkOut: row.checkOut === '—' ? '' : row.checkOut,
            overtime: row.overtime === '—' ? '' : row.overtime,
            breakTime: row.breakTime === '—' ? '' : row.breakTime,
            status: row.status as string,
            method: row.method.label,
          }
        : { checkIn: '', checkOut: '', overtime: '', breakTime: '', status: attendanceStatusOptions[0], method: attendanceMethodOptions[0] };

    return (
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={`teacher${suffix}`}>
              Teacher
            </label>
            <select
              className="select"
              id={`teacher${suffix}`}
              defaultValue={row ? `${row.name} (${row.id})` : teacherOptions[0]}
            >
              {(row && !teacherOptions.includes(`${row.name} (${row.id})`)
                ? [`${row.name} (${row.id})`, ...teacherOptions]
                : teacherOptions
              ).map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={mode === 'mark' ? 'attendance-date-2' : 'attendance-date-3'}>
              Attendance Date
            </label>
            <input
              type="text"
              className="form-control"
              defaultValue={ATTENDANCE_DATE}
              id={mode === 'mark' ? 'attendance-date-2' : 'attendance-date-3'}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={mode === 'mark' ? 'attendance-status-2' : 'attendance-status-3'}>
              Attendance Status
            </label>
            <select
              className="select"
              id={mode === 'mark' ? 'attendance-status-2' : 'attendance-status-3'}
              defaultValue={values.status}
            >
              {(attendanceStatusOptions.includes(values.status)
                ? attendanceStatusOptions
                : [values.status, ...attendanceStatusOptions]
              ).map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={`attendance-method${suffix}`}>
              Attendance Method
            </label>
            <select className="select" id={`attendance-method${suffix}`} defaultValue={values.method}>
              {attendanceMethodOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={`check-in${suffix}`}>
              Check-In
            </label>
            <input type="text" className="form-control" id={`check-in${suffix}`} defaultValue={values.checkIn} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={`check-out${suffix}`}>
              Check-Out
            </label>
            <input type="text" className="form-control" id={`check-out${suffix}`} defaultValue={values.checkOut} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={`overtime${suffix}`}>
              Overtime
            </label>
            <input type="text" className="form-control" id={`overtime${suffix}`} defaultValue={values.overtime} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={`break-duration${suffix}`}>
              Break Duration
            </label>
            <input
              type="text"
              className="form-control"
              id={`break-duration${suffix}`}
              defaultValue={values.breakTime}
            />
          </div>
        </div>
        <div className="col-md-12">
          <div className="mb-0">
            <label className="form-label" htmlFor={`notes${suffix}`}>
              Notes
            </label>
            <textarea className="form-control" rows={2} id={`notes${suffix}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mark Attendance */}
      <Modal
        open={active === 'mark'}
        onClose={onClose}
        title="Mark Attendance"
        dialogClassName="modal-lg"
        onSubmit={submit('Attendance saved')}
        footer={cancelFooter(
          'Cancel',
          <button type="submit" className="btn btn-primary">
            Save Attendance
          </button>,
        )}
      >
        {attendanceForm('mark')}
      </Modal>

      {/* Edit Attendance */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Attendance"
        dialogClassName="modal-lg"
        onSubmit={submit('Attendance updated')}
        footer={cancelFooter(
          'Cancel',
          <button type="submit" className="btn btn-primary">
            Update
          </button>,
        )}
      >
        {attendanceForm('edit')}
      </Modal>

      {/* Attendance Details */}
      <Modal
        open={active === 'details' && row !== null}
        onClose={onClose}
        title="Attendance Details"
        dialogClassName="modal-lg"
        footer={cancelFooter(
          'Close',
          <button type="button" className="btn btn-primary" onClick={() => onOpenModal('edit')}>
            <i className="ti ti-edit me-1" />
            Edit
          </button>,
        )}
      >
        {row ? (
          <>
            <Identity
              row={row}
              withBadges
              subtitle={`${row.designation} · ${row.department} · ${ATTENDANCE_DATE}`}
            />
            <div className="row">
              <div className="col-md-6">
                <ul className="list-unstyled mb-0">
                  <li className="d-flex justify-content-between py-1 fs-13 border-bottom">
                    <span className="text-muted">Subjects</span>
                    <span className="text-dark">{row.subjects}</span>
                  </li>
                  <li className="d-flex justify-content-between py-1 fs-13 border-bottom">
                    <span className="text-muted">Assigned Classes</span>
                    <span className="text-dark">Grade {row.classes}</span>
                  </li>
                  <li className="d-flex justify-content-between py-1 fs-13 border-bottom">
                    <span className="text-muted">Check-In</span>
                    <span className="text-dark">{row.checkIn}</span>
                  </li>
                  <li className="d-flex justify-content-between py-1 fs-13">
                    <span className="text-muted">Check-Out</span>
                    <span className="text-dark">{row.checkOut}</span>
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-unstyled mb-0">
                  <li className="d-flex justify-content-between py-1 fs-13 border-bottom">
                    <span className="text-muted">Working Hours</span>
                    <span className="text-dark">{row.workingHours}</span>
                  </li>
                  <li className="d-flex justify-content-between py-1 fs-13 border-bottom">
                    <span className="text-muted">Break</span>
                    <span className="text-dark">{row.breakTime}</span>
                  </li>
                  <li className="d-flex justify-content-between py-1 fs-13 border-bottom">
                    <span className="text-muted">Method</span>
                    <span className="text-dark">{row.method.label}</span>
                  </li>
                  <li className="d-flex justify-content-between py-1 fs-13">
                    <span className="text-muted">Recorded By</span>
                    <span className="text-dark">{row.recordedBy}</span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Attendance Correction */}
      <Modal
        open={active === 'correction' && row !== null}
        onClose={onClose}
        title="Attendance Correction"
        dialogClassName="modal-lg"
        onSubmit={submit('Attendance correction applied')}
        footer={cancelFooter(
          'Cancel',
          <button type="submit" className="btn btn-primary">
            <i className="ti ti-check me-1" />
            Apply Correction
          </button>,
        )}
      >
        {row ? (
          <>
            <Identity
              row={row}
              withBadges
              subtitle={`${row.designation} · ${row.department} · ${ATTENDANCE_DATE}`}
            />
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Original</h6>
                <ul className="list-unstyled mb-0">
                  {correctionOriginal.map((item, index) => (
                    <li
                      className={`d-flex justify-content-between py-1 fs-13${
                        index === correctionOriginal.length - 1 ? '' : ' border-bottom'
                      }`}
                      key={item.label}
                    >
                      <span className="text-muted">{item.label}</span>
                      <span className="text-dark">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Corrected</h6>
                <div className="mb-2">
                  <label className="form-label fs-12" htmlFor="check-in-3">
                    Check-In
                  </label>
                  <input type="text" className="form-control form-control-sm" defaultValue="08:05 AM" id="check-in-3" />
                </div>
                <div className="mb-2">
                  <label className="form-label fs-12" htmlFor="check-out-3">
                    Check-Out
                  </label>
                  <input type="text" className="form-control form-control-sm" defaultValue="03:35 PM" id="check-out-3" />
                </div>
                <select className="form-select" aria-label="Present" defaultValue="Present">
                  <option>Present</option>
                  <option>Late</option>
                </select>
              </div>
              <div className="col-md-12">
                <label className="form-label" htmlFor="reason-for-correction">
                  Reason for Correction
                </label>
                <textarea
                  className="form-control"
                  rows={2}
                  id="reason-for-correction"
                  defaultValue={correctionReason}
                />
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Assigned Timetable */}
      <Modal
        open={active === 'timetable' && row !== null}
        onClose={onClose}
        title="Assigned Timetable"
        dialogClassName="modal-lg"
        footer={cancelFooter(
          'Close',
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onToast('Timetable download started');
              onClose();
            }}
          >
            <i className="ti ti-download me-1" />
            Download
          </button>,
        )}
      >
        {row ? (
          <>
            <Identity row={row} subtitle={`${row.id} · ${row.department} · Monday, ${ATTENDANCE_DATE}`} />
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Period</th>
                    <th>Time</th>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedTimetable.map((slot) => (
                    <tr key={slot.period}>
                      <td>{slot.period}</td>
                      <td>{slot.time}</td>
                      <td>{slot.className}</td>
                      <td>{slot.subject}</td>
                      <td>
                        <span className={slot.badge.className}>{slot.badge.label}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Teacher Attendance History */}
      <Modal
        open={active === 'history' && row !== null}
        onClose={onClose}
        title="Teacher Attendance History"
        dialogClassName="modal-lg"
        footer={cancelFooter(
          'Close',
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onToast('Attendance history export started');
              onClose();
            }}
          >
            <i className="ti ti-download me-1" />
            Export
          </button>,
        )}
      >
        {row ? (
          <>
            <Identity row={row} subtitle={`${row.id} · ${row.designation} · July 2026`} />
            <div className="row text-center g-2 mb-3">
              {historyTiles.map((tile) => (
                <div className="col-3" key={tile.label}>
                  <div className="border rounded p-2">
                    <h5 className={`mb-0 ${tile.className}`}>{tile.value}</h5>
                    <span className="fs-11 text-muted">{tile.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Hours</th>
                    <th>Classes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRows.map((entry) => (
                    <tr key={entry.date}>
                      <td>{entry.date}</td>
                      <td>{entry.checkIn}</td>
                      <td>{entry.checkOut}</td>
                      <td>{entry.hours}</td>
                      <td>{entry.classes}</td>
                      <td>
                        <span className={entry.badge.className}>{entry.badge.label}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Confirm Deletion */}
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
        <p>You want to delete this attendance record, this cant be undone once you delete.</p>
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-light me-3" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-danger">
            Yes, Delete
          </button>
        </div>
      </Modal>
    </>
  );
};

export default TeacherAttendanceModals;
