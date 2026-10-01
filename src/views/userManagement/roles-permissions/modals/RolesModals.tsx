import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import type { RoleRecord, RolesModalId } from '../data/rolesPermissions.data';

export interface RolesModalsProps {
  active: RolesModalId | null;
  /** The role the dialog was opened from; Add passes null. */
  role: RoleRecord | null;
  onClose: () => void;
  onAdd: (name: string) => void;
  onSave: (id: string, name: string) => void;
  onConfirmDelete: () => void;
}

const RolesModals = ({ active, role, onClose, onAdd, onSave, onConfirmDelete }: RolesModalsProps) => {
  const [addName, setAddName] = useState('');
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (active === 'edit_role' && role) setEditName(role.name);
  }, [active, role]);

  const closeAdd = () => {
    setAddName('');
    onClose();
  };

  return (
    <>
      {/* Add Role */}
      <Modal
        open={active === 'add_role'}
        onClose={closeAdd}
        title="Add Role"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(addName.trim() || 'New Role');
          closeAdd();
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Add Role
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-12">
            <div className="mb-0">
              <label className="form-label" htmlFor="role-name">
                Role Name
              </label>
              <input
                type="text"
                className="form-control"
                id="role-name"
                value={addName}
                onChange={(event) => setAddName(event.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Role */}
      <Modal
        open={active === 'edit_role'}
        onClose={onClose}
        title="Edit Role"
        onSubmit={(event) => {
          event.preventDefault();
          if (role) onSave(role.id, editName.trim() || role.name);
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
            <div className="mb-0">
              <label className="col-form-label" htmlFor="role-name-2">
                Role Name
              </label>
              <input
                type="text"
                className="form-control"
                id="role-name-2"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
              />
            </div>
          </div>
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

export default RolesModals;
