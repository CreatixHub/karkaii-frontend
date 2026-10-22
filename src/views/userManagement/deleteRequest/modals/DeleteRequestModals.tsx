import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import type { DeleteRequestModalId } from '../data/deleteRequest.data';

export interface DeleteRequestModalsProps {
  active: DeleteRequestModalId | null;
  onClose: () => void;
  onConfirmDelete: () => void;
}

const DeleteRequestModals = ({ active, onClose, onConfirmDelete }: DeleteRequestModalsProps) => (
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
);

export default DeleteRequestModals;
