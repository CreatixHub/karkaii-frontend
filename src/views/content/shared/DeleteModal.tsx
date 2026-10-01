import Modal from '@components/ui/Modal';
import { ActionLink } from '@components/workspace';

export interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** How many rows are about to go. */
  count: number;
}

const DeleteModal = ({ open, onClose, onConfirm, count }: DeleteModalProps) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Confirm Deletion"
    hideHeader
    bodyClassName="text-center"
    onSubmit={(event) => {
      event.preventDefault();
      onConfirm();
    }}
  >
    <span className="delete-icon">
      <i className="ti ti-trash-x" />
    </span>
    <h4>Confirm Deletion</h4>
    <p>
      {count > 1
        ? `You want to delete all the ${count} marked items, this cant be undone once you delete.`
        : 'You want to delete all the marked items, this cant be undone once you delete.'}
    </p>
    <div className="d-flex justify-content-center">
      <ActionLink className="btn btn-light me-3" onClick={onClose}>
        Cancel
      </ActionLink>
      <button type="submit" className="btn btn-danger">
        Yes, Delete
      </button>
    </div>
  </Modal>
);

export default DeleteModal;
