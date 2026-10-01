import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { RoutineModalId, RoutinePeriod } from '../data/classRoutine.data';
import { attendanceSummary, timeSlots } from '../data/classRoutine.data';

export interface RoutineDraft {
  teacher: string;
  className: string;
  section: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  active: boolean;
}

export interface RoutineModalsProps {
  active: RoutineModalId | null;
  period: RoutinePeriod | null;
  selectedCount: number;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: RoutineDraft) => void;
  onSave: (id: string, draft: RoutineDraft) => void;
  onConfirmDelete: () => void;
  onEditFromView: () => void;
}

const TEACHER_OPTIONS = ['Erickson', 'Mori', 'Joseph', 'James'];
const CLASS_OPTIONS = ['I', 'II', 'III', 'IV'];
const SECTION_OPTIONS = ['A', 'B', 'C'];
/** The template's own list, misspelling and all. */
const DAY_OPTIONS = ['Monday', 'Tuesday', 'Wedneshday', 'Thursday', 'Friday'];
const ROOM_OPTIONS = ['101', '102', '103', '104', '105'];

const EMPTY: RoutineDraft = {
  teacher: 'Select',
  className: 'Select',
  section: 'Select',
  day: 'Select',
  startTime: '',
  endTime: '',
  room: 'Select',
  active: false,
};

const StatusToggle = ({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div className="d-flex align-items-center justify-content-between">
    <div className="status-title">
      <h5>Status</h5>
      <p>Change the Status by toggle </p>
    </div>
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={id}
        aria-label="Toggle option"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </div>
  </div>
);

/** Add and Edit are the same form; only the ids, values and copy differ. */
const RoutineForm = ({
  prefix,
  draft,
  onChange,
}: {
  prefix: string;
  draft: RoutineDraft;
  onChange: (patch: Partial<RoutineDraft>) => void;
}) => (
  <div className="row">
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-teacher`}>
          Teacher
        </label>
        <select
          className="select"
          id={`${prefix}-teacher`}
          value={draft.teacher}
          onChange={(event) => onChange({ teacher: event.target.value })}
        >
          <option>Select</option>
          {TEACHER_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-class`}>
          Class
        </label>
        <select
          className="select"
          id={`${prefix}-class`}
          value={draft.className}
          onChange={(event) => onChange({ className: event.target.value })}
        >
          <option>Select</option>
          {CLASS_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-section`}>
          Section
        </label>
        <select
          className="select"
          id={`${prefix}-section`}
          value={draft.section}
          onChange={(event) => onChange({ section: event.target.value })}
        >
          <option>Select</option>
          {SECTION_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-day`}>
          Day
        </label>
        <select
          className="select"
          id={`${prefix}-day`}
          value={draft.day}
          onChange={(event) => onChange({ day: event.target.value })}
        >
          <option>Select</option>
          {DAY_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={`${prefix}-start`}>
              Start Time
            </label>
            <div className="date-pic">
              <input
                type="text"
                className="form-control"
                placeholder="Choose"
                id={`${prefix}-start`}
                value={draft.startTime}
                onChange={(event) => onChange({ startTime: event.target.value })}
              />
              <span className="cal-icon">
                <i className="ti ti-clock" />
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={`${prefix}-end`}>
              End Time
            </label>
            <div className="date-pic">
              <input
                type="text"
                className="form-control"
                placeholder="Choose"
                id={`${prefix}-end`}
                value={draft.endTime}
                onChange={(event) => onChange({ endTime: event.target.value })}
              />
              <span className="cal-icon">
                <i className="ti ti-clock" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-room`}>
          Class Room
        </label>
        <select
          className="select"
          id={`${prefix}-room`}
          value={draft.room}
          onChange={(event) => onChange({ room: event.target.value })}
        >
          <option>Select</option>
          {ROOM_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <StatusToggle
        id={`${prefix}-switch`}
        checked={draft.active}
        onChange={(checked) => onChange({ active: checked })}
      />
    </div>
  </div>
);

const RoutineModals = ({
  active,
  period,
  selectedCount,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
  onEditFromView,
}: RoutineModalsProps) => {
  const [addDraft, setAddDraft] = useState<RoutineDraft>(EMPTY);
  const [editDraft, setEditDraft] = useState<RoutineDraft>(EMPTY);
  const [importMode, setImportMode] = useState('Create new periods');

  useEffect(() => {
    if (active !== 'edit' || !period) return;
    const slot = timeSlots.find((entry) => entry.time === period.time);
    setEditDraft({
      teacher: period.teacher?.name ?? 'Select',
      className: 'III',
      section: 'A',
      day: period.day,
      startTime: slot?.start ?? '',
      endTime: slot?.end ?? '',
      room: period.room || 'Select',
      active: period.status !== 'Cancelled',
    });
  }, [active, period]);

  const closeAdd = () => {
    setAddDraft(EMPTY);
    onClose();
  };

  const slot = period ? timeSlots.find((entry) => entry.time === period.time) : undefined;
  const attendanceRate = period && period.students ? Math.round(((period.students - 2) / period.students) * 100) : 0;

  return (
    <>
      {/* Add Class Routine */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Class Routine"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(addDraft);
          closeAdd();
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Add Class Routine
            </button>
          </>
        }
      >
        <RoutineForm
          prefix="rt-add"
          draft={addDraft}
          onChange={(patch) => setAddDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Edit Class Routine */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Class Routine"
        onSubmit={(event) => {
          event.preventDefault();
          if (period) onSave(period.id, editDraft);
          onClose();
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <RoutineForm
          prefix="rt-edit"
          draft={editDraft}
          onChange={(patch) => setEditDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Period Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="Period Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to="#" className="btn btn-primary" onClick={onEditFromView}>
              Edit Period
            </Link>
          </>
        }
      >
        {period ? (
          <>
            <div className="d-flex align-items-center mb-3 routine">
              <span className="avatar avatar-lg bg-primary-transparent text-primary rounded d-inline-flex align-items-center justify-content-center me-2">
                <i className="ti ti-book-2 fs-20" />
              </span>
              <div>
                <h5 className="mb-0">
                  {period.subject}{' '}
                  <span className={`dt-pill ${period.pillClass} ms-1`}>
                    {period.pillIcon ? <i className={period.pillIcon} /> : <span className="dt-pill-dot" />}
                    {period.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">
                  Class III-A · {period.day} · {slot ? `${slot.start} – ${slot.end}` : period.time}
                  {period.room ? ` · Room ${period.room}` : ''}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-user" />
                  Teacher
                </h6>
                {period.teacher ? (
                  <div className="d-flex align-items-center gap-2">
                    <span className="avatar avatar-sm">
                      <ImageWithBasePath
                        src={period.teacher.avatar}
                        className="rounded-circle flex-shrink-0"
                        alt={period.teacher.name}
                      />
                    </span>
                    <div>
                      <span className="fw-medium d-block">{period.teacher.name}</span>
                      <span className="fs-12 text-muted">{period.teacher.qualification} · 8 yrs</span>
                    </div>
                  </div>
                ) : (
                  <p className="fs-13 mb-0">—</p>
                )}
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-clipboard-list" />
                  Lesson Plan
                </h6>
                <p className="fs-13 mb-0">
                  {period.objective} · {period.homework}
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-calendar-check" />
                  Attendance
                </h6>
                <p className="fs-13 mb-0">
                  {attendanceSummary(period)}
                  {period.students ? (
                    <span className="badge badge-soft-success ms-1">{attendanceRate}%</span>
                  ) : null}
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-file-certificate" />
                  Upcoming Exam
                </h6>
                <p className="fs-13 mb-0">Unit test — 28 Jul 2025</p>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Import Routine */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Routine"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          onToast('File queued — 29 periods validated.');
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
          <input type="file" aria-label="Routine file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="rt-import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="rt-import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            <option>Create new periods</option>
            <option>Update existing routine</option>
            <option>Replace week</option>
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

export default RoutineModals;
