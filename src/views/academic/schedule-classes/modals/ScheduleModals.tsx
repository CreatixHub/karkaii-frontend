import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { ScheduleModalId, ScheduledClass } from '../data/classSchedule.data';
import { timeSlots } from '../data/classSchedule.data';

export interface ScheduleDraft {
  type: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleModalsProps {
  active: ScheduleModalId | null;
  item: ScheduledClass | null;
  selectedCount: number;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: ScheduleDraft) => void;
  onSave: (id: string, draft: ScheduleDraft) => void;
  onConfirmDelete: () => void;
  onEditFromView: () => void;
}

const TYPE_OPTIONS = ['Select', 'Class'];
const START_OPTIONS = ['Select', '09:30 AM', '10:30 AM', '11:30 AM', '12:30 PM'];
const END_OPTIONS = ['Select', '10:30 AM', '11:30 AM', '12:30 PM', '01:30 PM'];

const EMPTY: ScheduleDraft = { type: 'Select', startTime: 'Select', endTime: 'Select' };

/** Add and Edit share one form; only the ids and copy differ. */
const ScheduleForm = ({
  prefix,
  draft,
  onChange,
}: {
  prefix: string;
  draft: ScheduleDraft;
  onChange: (patch: Partial<ScheduleDraft>) => void;
}) => (
  <div className="row">
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-type`}>
          Type
        </label>
        <select
          className="select"
          id={`${prefix}-type`}
          value={draft.type}
          onChange={(event) => onChange({ type: event.target.value })}
        >
          {TYPE_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-start`}>
          Start Time
        </label>
        <select
          className="select"
          id={`${prefix}-start`}
          value={draft.startTime}
          onChange={(event) => onChange({ startTime: event.target.value })}
        >
          {START_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-end`}>
          End Time
        </label>
        <select
          className="select"
          id={`${prefix}-end`}
          value={draft.endTime}
          onChange={(event) => onChange({ endTime: event.target.value })}
        >
          {END_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

const ScheduleModals = ({
  active,
  item,
  selectedCount,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
  onEditFromView,
}: ScheduleModalsProps) => {
  const [addDraft, setAddDraft] = useState<ScheduleDraft>(EMPTY);
  const [editDraft, setEditDraft] = useState<ScheduleDraft>(EMPTY);
  const [importMode, setImportMode] = useState('Create new classes');

  useEffect(() => {
    if (active !== 'edit' || !item) return;
    const slot = timeSlots.find((entry) => entry.time === item.time);
    setEditDraft({ type: 'Class', startTime: slot?.start ?? 'Select', endTime: slot?.end ?? 'Select' });
  }, [active, item]);

  const closeAdd = () => {
    setAddDraft(EMPTY);
    onClose();
  };

  const slot = item ? timeSlots.find((entry) => entry.time === item.time) : undefined;

  return (
    <>
      {/* Add Schedule */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Schedule"
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
              Add Schedule
            </button>
          </>
        }
      >
        <ScheduleForm
          prefix="sch-add"
          draft={addDraft}
          onChange={(patch) => setAddDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Edit Schedule */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Schedule"
        onSubmit={(event) => {
          event.preventDefault();
          if (item) onSave(item.id, editDraft);
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
        <ScheduleForm
          prefix="sch-edit"
          draft={editDraft}
          onChange={(patch) => setEditDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Class Schedule Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="Class Schedule Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to="#" className="btn btn-primary" onClick={onEditFromView}>
              Edit Class
            </Link>
          </>
        }
      >
        {item ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-lg bg-primary-transparent text-primary rounded d-inline-flex align-items-center justify-content-center me-2">
                <i className="ti ti-book-2 fs-20" />
              </span>
              <div>
                <h5 className="mb-0">
                  {item.subject}{' '}
                  <span className={`dt-pill ${item.pillClass} ms-1`}>
                    {item.pillIcon ? <i className={item.pillIcon} /> : <span className="dt-pill-dot" />}
                    {item.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">
                  Class III-A · {item.day} · {slot ? `${slot.start} – ${slot.end}` : item.time}
                  {item.room ? ` · Room ${item.room}` : ''}
                  {item.teacher ? ` · ${item.teacher.name}` : ''}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-notebook" />
                  Lesson Topic
                </h6>
                <p className="fs-13 mb-0">{item.objective} · guided practice &amp; recap</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-calendar-check" />
                  Attendance
                </h6>
                <p className="fs-13 mb-0">
                  {item.status === 'Live' ? 'In progress' : item.status} · {item.students} students
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-door" />
                  Classroom
                </h6>
                <p className="fs-13 mb-0">{item.room ? `Room ${item.room} · Capacity 45` : '—'}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-user" />
                  Teacher
                </h6>
                {item.teacher ? (
                  <div className="d-flex align-items-center gap-2">
                    <span className="avatar avatar-sm">
                      <ImageWithBasePath
                        src={item.teacher.avatar}
                        className="rounded-circle flex-shrink-0"
                        alt={item.teacher.name}
                      />
                    </span>
                    <div>
                      <span className="fw-medium d-block">{item.teacher.name}</span>
                      <span className="fs-12 text-muted">{item.teacher.qualification}</span>
                    </div>
                  </div>
                ) : (
                  <p className="fs-13 mb-0">—</p>
                )}
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Import Schedule */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Schedule"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          onToast('File queued — 29 classes validated.');
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
          <input type="file" aria-label="Schedule file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="sch-import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="sch-import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            <option>Create new classes</option>
            <option>Update existing schedule</option>
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

export default ScheduleModals;
