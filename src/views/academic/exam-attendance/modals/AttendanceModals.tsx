import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type {
  AttendanceModalId,
  AttendanceRow,
  FilterKey,
  VerificationStatus,
} from '../data/examAttendance.data';
import { advancedFilters, checkinBadge, verificationBadges } from '../data/examAttendance.data';

export interface AttendanceDraft {
  student: string;
  exam: string;
  status: string;
  checkin: string;
  verification: VerificationStatus;
  seat: string;
  remarks: string;
}

export interface AttendanceModalsProps {
  active: AttendanceModalId | null;
  record: AttendanceRow | null;
  selectedCount: number;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: AttendanceDraft) => void;
  onSave: (id: string, draft: AttendanceDraft) => void;
  onConfirmDelete: () => void;
  onEditFromView: () => void;
}

/** The dialogs offer the same exam and status lists the filter panel does. */
const optionsFor = (key: FilterKey) => advancedFilters.find((field) => field.key === key)?.options ?? [];

const VERIFICATION_OPTIONS: VerificationStatus[] = ['Verified', 'Pending', 'Under Review'];

const EMPTY: AttendanceDraft = {
  student: '',
  exam: '',
  status: 'Present',
  checkin: '',
  verification: 'Verified',
  seat: '',
  remarks: '',
};

const AttendanceModals = ({
  active,
  record,
  selectedCount,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
  onEditFromView,
}: AttendanceModalsProps) => {
  const [addDraft, setAddDraft] = useState<AttendanceDraft>(EMPTY);
  const [editDraft, setEditDraft] = useState<AttendanceDraft>(EMPTY);
  const [importMode, setImportMode] = useState('Create new records');

  useEffect(() => {
    if (active !== 'edit' || !record) return;
    setEditDraft({
      student: `${record.name} — ${record.admissionNo}`,
      exam: record.exam,
      status: record.status,
      checkin: record.checkin === '—' ? '' : record.checkin,
      verification: record.verification,
      seat: record.seat,
      remarks: record.remarks,
    });
  }, [active, record]);

  const closeAdd = () => {
    setAddDraft(EMPTY);
    onClose();
  };

  const verified = record ? verificationBadges[record.verification] : null;
  const checkin = record ? checkinBadge(record) : null;

  return (
    <>
      {/* Mark Attendance */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Mark Attendance"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(addDraft);
          closeAdd();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary form-submit">
              Save Attendance
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="ea-student">
              Student
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Search student by name or admission no"
              required
              id="ea-student"
              value={addDraft.student}
              onChange={(event) => setAddDraft((current) => ({ ...current, student: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="ea-add-exam">
              Exam
            </label>
            <select
              className="form-select"
              required
              id="ea-add-exam"
              value={addDraft.exam}
              onChange={(event) => setAddDraft((current) => ({ ...current, exam: event.target.value }))}
            >
              <option value="">Select exam</option>
              {optionsFor('exam').map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="ea-add-status">
              Attendance Status
            </label>
            <select
              className="form-select"
              id="ea-add-status"
              value={addDraft.status}
              onChange={(event) => setAddDraft((current) => ({ ...current, status: event.target.value }))}
            >
              {optionsFor('status').map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="ea-check-in-time">
              Check-in Time
            </label>
            <input
              type="text"
              className="form-control timepicker"
              placeholder="09:30 AM"
              id="ea-check-in-time"
              value={addDraft.checkin}
              onChange={(event) => setAddDraft((current) => ({ ...current, checkin: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="ea-seat-number">
              Seat Number
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="A-14"
              id="ea-seat-number"
              value={addDraft.seat}
              onChange={(event) => setAddDraft((current) => ({ ...current, seat: event.target.value }))}
            />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="ea-remarks">
              Remarks
            </label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Optional remarks"
              id="ea-remarks"
              value={addDraft.remarks}
              onChange={(event) => setAddDraft((current) => ({ ...current, remarks: event.target.value }))}
            />
          </div>
        </div>
      </Modal>

      {/* Edit Attendance */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Attendance"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (record) onSave(record.id, editDraft);
          onClose();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary form-submit">
              Save Changes
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="ea-edit-student">
              Student
            </label>
            <input
              type="text"
              className="form-control"
              required
              id="ea-edit-student"
              value={editDraft.student}
              onChange={(event) => setEditDraft((current) => ({ ...current, student: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="ea-edit-status">
              Attendance Status
            </label>
            <select
              className="form-select"
              id="ea-edit-status"
              value={editDraft.status}
              onChange={(event) => setEditDraft((current) => ({ ...current, status: event.target.value }))}
            >
              {optionsFor('status').map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="ea-edit-check-in-time">
              Check-in Time
            </label>
            <input
              type="text"
              className="form-control timepicker"
              id="ea-edit-check-in-time"
              value={editDraft.checkin}
              onChange={(event) => setEditDraft((current) => ({ ...current, checkin: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="ea-verification">
              Verification
            </label>
            <select
              className="form-select"
              id="ea-verification"
              value={editDraft.verification}
              onChange={(event) =>
                setEditDraft((current) => ({
                  ...current,
                  verification: event.target.value as VerificationStatus,
                }))
              }
            >
              {VERIFICATION_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="ea-edit-seat-number">
              Seat Number
            </label>
            <input
              type="text"
              className="form-control"
              id="ea-edit-seat-number"
              value={editDraft.seat}
              onChange={(event) => setEditDraft((current) => ({ ...current, seat: event.target.value }))}
            />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="ea-edit-remarks">
              Remarks
            </label>
            <textarea
              className="form-control"
              rows={2}
              id="ea-edit-remarks"
              value={editDraft.remarks}
              onChange={(event) => setEditDraft((current) => ({ ...current, remarks: event.target.value }))}
            />
          </div>
        </div>
      </Modal>

      {/* Attendance Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="Attendance Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to="#" className="btn btn-primary" onClick={onEditFromView}>
              Edit Attendance
            </Link>
          </>
        }
      >
        {record && verified && checkin ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-lg me-2 flex-shrink-0">
                <ImageWithBasePath
                  src={record.avatar}
                  className="rounded-circle flex-shrink-0"
                  alt={record.name}
                />
              </span>
              <div>
                <h5 className="mb-0">
                  {record.name}{' '}
                  <span className={`dt-pill ${record.pillClass} ms-1`}>
                    {record.pillIcon ? <i className={record.pillIcon} /> : <span className="dt-pill-dot" />}
                    {record.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">
                  {record.admissionNo} · Class {record.className}-{record.section} · Roll {record.roll} ·{' '}
                  {record.exam} · {record.subject}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-building" />
                  Exam Hall
                </h6>
                <p className="fs-13 mb-0">
                  {record.hall} · Seat {record.seat} · {record.date}.
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-discount" />
                  Verification
                </h6>
                <div className="d-flex flex-wrap gap-1">
                  <span className={`badge ${verified.badge}`}>
                    <i className={`${verified.icon} me-1`} />
                    {verified.label}
                  </span>
                  <span className={`badge ${checkin.badge}`}>
                    <i className={`${checkin.icon} me-1`} />
                    {checkin.label}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-shield-check" />
                  Invigilator
                </h6>
                <div className="d-flex align-items-center gap-2">
                  <span className="avatar avatar-sm">
                    <ImageWithBasePath
                      src={record.invigilator.avatar}
                      className="rounded-circle flex-shrink-0"
                      alt={record.invigilator.name}
                    />
                  </span>
                  <div>
                    <span className="fw-medium d-block">{record.invigilator.name}</span>
                    <span className="fs-12 text-muted">Lead invigilator</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-message-2" />
                  Remarks
                </h6>
                <p className="fs-13 mb-0">{record.remarks}</p>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Import Attendance */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Attendance"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          onToast('File queued — 10 records validated.');
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary form-submit">
              Import
            </button>
          </>
        }
      >
        <div className="stacked-dropdown mb-3">
          <i className="ti ti-cloud-upload" />
          <b>Drop your CSV or Excel file here</b>
          <span className="fs-12 text-muted">or click to browse · max 10 MB</span>
          <input type="file" aria-label="Attendance file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="ea-import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="ea-import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            <option>Create new records</option>
            <option>Update existing by admission no</option>
            <option>Create and update</option>
          </select>
        </div>
        <div className="alert alert-light border d-flex align-items-start gap-2 mb-0" role="note">
          <i className="ti ti-download fs-16" />
          <span className="fs-12">
            Not sure about the format? Download the template with all required columns and sample rows.
          </span>
        </div>
      </Modal>

      {/* Delete confirmation */}
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
        <p>
          {selectedCount > 1
            ? `You want to delete all the ${selectedCount} marked items, this cant be undone once you delete.`
            : 'You want to delete all the marked items, this cant be undone once you delete.'}
        </p>
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

export default AttendanceModals;
