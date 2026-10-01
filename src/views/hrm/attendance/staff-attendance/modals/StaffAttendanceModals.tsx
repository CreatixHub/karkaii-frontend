import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { StaffAttendanceModalId } from '../data/staffAttendanceWorkspace.data';
import {
  attendanceMethodOptions,
  attendanceStatusOptions,
  correctionOriginal,
  correctionReason,
  DEFAULT_ATTENDANCE_DATE,
  historyRows,
  historyTiles,
  shiftDetails,
  shiftOptions,
  staffOptions,
} from '../data/staffAttendanceWorkspace.data';
import type { AttendanceStatus, StaffAttendanceRow } from '../data/staffAttendance.data';

/** Badge tint the dialogs give each status. */
const statusBadge: Record<AttendanceStatus, string> = {
  Present: 'badge badge-soft-success',
  Absent: 'badge badge-soft-danger',
  Late: 'badge badge-soft-warning',
  Pending: 'badge badge-soft-warning',
  'On Leave': 'badge badge-soft-info',
  'Half Day': 'badge badge-soft-dark',
};

export interface StaffAttendanceModalsProps {
  active: StaffAttendanceModalId | null;
  /** The row that opened the dialog; the page header's buttons pass the first. */
  row: StaffAttendanceRow | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onOpenModal: (modal: StaffAttendanceModalId) => void;
  onConfirmDelete: () => void;
}

interface IdentityProps {
  row: StaffAttendanceRow;
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

/** The two-column read-only lists the details and shift dialogs share. */
const InfoColumns = ({
  left,
  right,
}: {
  left: { label: string; value: string }[];
  right: { label: string; value: string }[];
}) => (
  <div className="row">
    {[left, right].map((items, column) => (
      // eslint-disable-next-line react/no-array-index-key
      <div className="col-md-6" key={column}>
        <ul className="list-unstyled mb-0">
          {items.map((item, index) => (
            <li
              className={`d-flex justify-content-between py-1 fs-13${
                index === items.length - 1 ? '' : ' border-bottom'
              }`}
              key={item.label}
            >
              <span className="text-muted">{item.label}</span>
              <span className="text-dark">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const StaffAttendanceModals = ({
  active,
  row,
  onClose,
  onToast,
  onOpenModal,
  onConfirmDelete,
}: StaffAttendanceModalsProps) => {
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
    const dateId = mode === 'mark' ? 'attendance-date-2' : 'attendance-date-3';
    const shiftId = mode === 'mark' ? 'shift-2' : 'shift-3';
    const statusId = mode === 'mark' ? 'attendance-status-2' : 'attendance-status-3';

    const values =
      mode === 'edit' && row
        ? {
            checkIn: row.checkIn === '—' ? '' : row.checkIn,
            checkOut: row.checkOut === '—' ? '' : row.checkOut,
            overtime: row.overtime === '—' ? '' : row.overtime,
            shift: row.shift,
            status: row.status as string,
            method: row.method.label,
          }
        : {
            checkIn: '',
            checkOut: '',
            overtime: '',
            shift: shiftOptions[0],
            status: attendanceStatusOptions[0],
            method: attendanceMethodOptions[0],
          };

    /** Keeps a row's own value selectable when it is outside the template list. */
    const withValue = (options: string[], value: string) =>
      options.includes(value) ? options : [value, ...options];

    const staffLabel = row ? `${row.name} (${row.id})` : staffOptions[0];

    return (
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={`staff-member${suffix}`}>
              Staff Member
            </label>
            <select className="select" id={`staff-member${suffix}`} defaultValue={staffLabel}>
              {withValue(staffOptions, staffLabel).map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={dateId}>
              Attendance Date
            </label>
            <input type="text" className="form-control" defaultValue={DEFAULT_ATTENDANCE_DATE} id={dateId} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={shiftId}>
              Shift
            </label>
            <select className="select" id={shiftId} defaultValue={values.shift}>
              {withValue(shiftOptions, values.shift).map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={statusId}>
              Attendance Status
            </label>
            <select className="select" id={statusId} defaultValue={values.status}>
              {withValue(attendanceStatusOptions, values.status).map((option) => (
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
            <label className="form-label" htmlFor={`overtime${suffix}`}>
              Overtime
            </label>
            <input type="text" className="form-control" id={`overtime${suffix}`} defaultValue={values.overtime} />
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

  const subtitleFor = (target: StaffAttendanceRow) =>
    `${target.designation} · ${target.department} · ${DEFAULT_ATTENDANCE_DATE}`;

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
            <Identity row={row} withBadges subtitle={subtitleFor(row)} />
            <InfoColumns
              left={[
                { label: 'Shift', value: row.shift },
                { label: 'Check-In', value: row.checkIn },
                { label: 'Check-Out', value: row.checkOut },
                { label: 'Working Hours', value: row.workingHours },
              ]}
              right={[
                { label: 'Break', value: row.breakTime },
                { label: 'Overtime', value: row.overtime },
                { label: 'Method', value: row.method.label },
                { label: 'Recorded By', value: row.recordedBy },
              ]}
            />
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
            <Identity row={row} withBadges subtitle={subtitleFor(row)} />
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
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    defaultValue="03:35 PM"
                    id="check-out-3"
                  />
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

      {/* Shift Details */}
      <Modal
        open={active === 'shift'}
        onClose={onClose}
        title="Shift Details"
        dialogClassName="modal-lg"
        footer={cancelFooter(
          'Close',
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onToast('Shift editor opened');
              onClose();
            }}
          >
            <i className="ti ti-edit me-1" />
            Edit Shift
          </button>,
        )}
      >
        <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
          <span className="avatar avatar-lg bg-primary-transparent text-primary rounded me-3">
            <i className="ti ti-clock-hour-8 fs-24" />
          </span>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="mb-0">{shiftDetails.name}</h5>
              <span className="badge badge-soft-success">Active</span>
            </div>
            <p className="mb-0 text-muted fs-13">{shiftDetails.window}</p>
          </div>
        </div>
        <InfoColumns left={shiftDetails.left} right={shiftDetails.right} />
      </Modal>

      {/* Staff Attendance History */}
      <Modal
        open={active === 'history' && row !== null}
        onClose={onClose}
        title="Staff Attendance History"
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

export default StaffAttendanceModals;
