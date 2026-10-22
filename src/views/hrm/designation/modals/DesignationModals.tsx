import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import type { DesignationModalId, DesignationRow, DesignationStatus } from '../data/designation.data';

export interface DesignationDraft {
  name: string;
  status: DesignationStatus;
}

export interface DesignationModalsProps {
  active: DesignationModalId | null;
  /** The row that opened the dialog; Add passes null. */
  designation: DesignationRow | null;
  onClose: () => void;
  onAdd: (draft: DesignationDraft) => void;
  onSave: (id: string, draft: DesignationDraft) => void;
  onConfirmDelete: () => void;
}

/** The Status block is identical in both forms; only the switch id differs. */
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

const DesignationModals = ({
  active,
  designation,
  onClose,
  onAdd,
  onSave,
  onConfirmDelete,
}: DesignationModalsProps) => {
  const [addName, setAddName] = useState('');
  const [addActive, setAddActive] = useState(false);
  const [editName, setEditName] = useState('');
  const [editActive, setEditActive] = useState(false);

  useEffect(() => {
    if (active === 'edit' && designation) {
      setEditName(designation.name);
      setEditActive(designation.status === 'Active');
    }
  }, [active, designation]);

  const closeAdd = () => {
    setAddName('');
    setAddActive(false);
    onClose();
  };

  return (
    <>
      {/* Add Designation */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Designation"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd({ name: addName.trim() || 'New Designation', status: addActive ? 'Active' : 'Inactive' });
          closeAdd();
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Add Designation
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="designation">
                Designation
              </label>
              <input
                type="text"
                className="form-control"
                id="designation"
                value={addName}
                onChange={(event) => setAddName(event.target.value)}
              />
            </div>
          </div>
          <StatusToggle id="switch-sm" checked={addActive} onChange={setAddActive} />
        </div>
      </Modal>

      {/* Edit Designation */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Designation"
        onSubmit={(event) => {
          event.preventDefault();
          if (designation) {
            onSave(designation.id, {
              name: editName.trim() || designation.name,
              status: editActive ? 'Active' : 'Inactive',
            });
          }
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
              <label className="form-label" htmlFor="designation-2">
                Designation
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Designation"
                id="designation-2"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
              />
            </div>
          </div>
          <StatusToggle id="switch-sm2" checked={editActive} onChange={setEditActive} />
        </div>
      </Modal>

      {/* Delete */}
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
        <p>You want to delete all the marked items, this cant be undone once you delete.</p>
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

export default DesignationModals;
