import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import type { ClassroomModalId, ClassroomRow } from '../data/classrooms.data';

export interface ClassroomDraft {
  roomNo: string;
  capacity: string;
  active: boolean;
}

export interface ClassroomsModalsProps {
  active: ClassroomModalId | null;
  room: ClassroomRow | null;
  selectedCount: number;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: ClassroomDraft) => void;
  onSave: (id: string, draft: ClassroomDraft) => void;
  onConfirmDelete: () => void;
  onEditFromView: () => void;
}

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

const ClassroomsModals = ({
  active,
  room,
  selectedCount,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
  onEditFromView,
}: ClassroomsModalsProps) => {
  const [addDraft, setAddDraft] = useState<ClassroomDraft>({ roomNo: '', capacity: '', active: false });
  const [editDraft, setEditDraft] = useState<ClassroomDraft>({ roomNo: '', capacity: '', active: true });
  const [importMode, setImportMode] = useState('Create new rooms');

  useEffect(() => {
    if (active !== 'edit' || !room) return;
    setEditDraft({
      roomNo: room.roomNo,
      capacity: String(room.capacity),
      active: room.status !== 'Inactive',
    });
  }, [active, room]);

  const closeAdd = () => {
    setAddDraft({ roomNo: '', capacity: '', active: false });
    onClose();
  };

  return (
    <>
      {/* Add Class Room */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Class Room"
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
              Add Class Room
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="room-add-no">
                Room No
              </label>
              <input
                type="text"
                className="form-control"
                id="room-add-no"
                value={addDraft.roomNo}
                onChange={(event) => setAddDraft((current) => ({ ...current, roomNo: event.target.value }))}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="room-add-capacity">
                Capacity
              </label>
              <input
                type="text"
                className="form-control"
                id="room-add-capacity"
                value={addDraft.capacity}
                onChange={(event) => setAddDraft((current) => ({ ...current, capacity: event.target.value }))}
              />
            </div>
            <StatusToggle
              id="room-add-switch"
              checked={addDraft.active}
              onChange={(checked) => setAddDraft((current) => ({ ...current, active: checked }))}
            />
          </div>
        </div>
      </Modal>

      {/* Edit Class Room */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Class Room"
        onSubmit={(event) => {
          event.preventDefault();
          if (room) onSave(room.id, editDraft);
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
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="room-edit-no">
                Room No
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Room no"
                id="room-edit-no"
                value={editDraft.roomNo}
                onChange={(event) => setEditDraft((current) => ({ ...current, roomNo: event.target.value }))}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="room-edit-capacity">
                Capacity
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Capacity"
                id="room-edit-capacity"
                value={editDraft.capacity}
                onChange={(event) => setEditDraft((current) => ({ ...current, capacity: event.target.value }))}
              />
            </div>
            <StatusToggle
              id="room-edit-switch"
              checked={editDraft.active}
              onChange={(checked) => setEditDraft((current) => ({ ...current, active: checked }))}
            />
          </div>
        </div>
      </Modal>

      {/* Classroom Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="Classroom Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to="#" className="btn btn-primary" onClick={onEditFromView}>
              Edit Classroom
            </Link>
          </>
        }
      >
        {room ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-lg bg-light text-primary rounded d-inline-flex align-items-center justify-content-center me-2">
                <i className="ti ti-door fs-20" />
              </span>
              <div>
                <h5 className="mb-0">
                  {room.name} <span className="badge badge-soft-primary ms-1">{room.type}</span>
                </h5>
                <span className="fs-12 text-muted">
                  {room.id} · Building {room.building} · Floor {room.floor} · {room.capacity} seats
                </span>
              </div>
              <span className={`dt-pill ${room.pillClass} ms-auto`}>
                {room.pillIcon ? <i className={room.pillIcon} /> : <span className="dt-pill-dot" />}
                {room.status}
              </span>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-info-circle" />
                  Assignment
                </h6>
                <ul className="list-unstyled fs-13 mb-0">
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Assigned Class</span>
                    <span className="fw-medium">{room.assignedClass}</span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Class Teacher</span>
                    <span className="fw-medium">{room.teacher?.name ?? '—'}</span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Students</span>
                    <span className="fw-medium">
                      {room.students} / {room.capacity}
                    </span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Academic Year</span>
                    <span className="fw-medium">{room.year}</span>
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-checklist" />
                  Facilities
                </h6>
                <div className="d-flex flex-wrap gap-1">
                  {room.facilities.map((facility) => (
                    <span className="badge badge-soft-secondary" key={facility.label}>
                      {facility.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Import Class Rooms */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Class Rooms"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          onToast('File queued — 10 rows validated.');
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
          <input type="file" aria-label="Classroom list file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="room-import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="room-import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            <option>Create new rooms</option>
            <option>Update existing by room ID</option>
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

export default ClassroomsModals;
