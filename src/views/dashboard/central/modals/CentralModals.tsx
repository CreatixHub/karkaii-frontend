import { useEffect } from 'react';
import Modal from '@components/ui/Modal';
import { useForm } from '@hooks/useForm';
import { required } from '@utils/validation';
import type { Branch, BranchStatus } from '../data/centralDashboard.data';
import { STATUS_FORM_OPTIONS } from '../data/centralDashboard.data';

export type CentralModalId = 'add' | 'edit' | 'delete';

interface BranchValues extends Record<string, unknown> {
  name: string;
  status: string;
  description: string;
}

export interface CentralModalsProps {
  active: CentralModalId | null;
  /** The row Edit/Delete was opened from. */
  target: Branch | null;
  onClose: () => void;
  onCreate: (values: { name: string; status: BranchStatus; description: string }) => void;
  onUpdate: (id: string, values: { name: string; status: BranchStatus }) => void;
  onDelete: (id: string) => void;
}

const CentralModals = ({
  active,
  target,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: CentralModalsProps) => {
  const addForm = useForm<BranchValues, void>({
    initialValues: { name: '', status: STATUS_FORM_OPTIONS[0], description: '' },
    validationSchema: { name: required('Name is required') },
    onSubmit: async () => undefined,
    onSuccess: () => {
      onCreate({
        name: addForm.values.name,
        status: addForm.values.status as BranchStatus,
        description: addForm.values.description,
      });
      addForm.reset();
      onClose();
    },
  });

  const editForm = useForm<BranchValues, void>({
    initialValues: { name: '', status: STATUS_FORM_OPTIONS[0], description: '' },
    validationSchema: { name: required('Name is required') },
    onSubmit: async () => undefined,
    onSuccess: () => {
      if (target) {
        onUpdate(target.id, {
          name: editForm.values.name,
          status: editForm.values.status as BranchStatus,
        });
      }
      onClose();
    },
  });

  // Seed the edit form from whichever row was chosen.
  useEffect(() => {
    if (active !== 'edit' || !target) return;
    editForm.reset({
      name: target.name,
      status: target.status,
      description: '',
    });
    // `editForm` is stable enough for this seeding effect; keying on the row is
    // what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, target]);

  const fieldError = (message?: string, touched?: boolean) =>
    touched && message ? (
      <span className="text-danger fs-12 d-block mt-1">{message}</span>
    ) : null;

  const renderFields = (form: typeof addForm, idSuffix: string) => (
    <>
      <div className="mb-3">
        <label className="form-label" htmlFor={`name${idSuffix}`}>
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id={`name${idSuffix}`}
          name="name"
          value={form.values.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
        {fieldError(form.errors.name, form.touched.name)}
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor={`status${idSuffix}`}>
          Status
        </label>
        <select
          className="form-select"
          id={`status${idSuffix}`}
          name="status"
          value={form.values.status}
          onChange={form.handleChange}
        >
          {STATUS_FORM_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="mb-0">
        <label className="form-label" htmlFor={`description${idSuffix}`}>
          Description
        </label>
        <input
          type="text"
          className="form-control"
          id={`description${idSuffix}`}
          name="description"
          value={form.values.description}
          onChange={form.handleChange}
        />
      </div>
    </>
  );

  return (
    <>
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Branch"
        onSubmit={addForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Branch
            </button>
          </>
        }
      >
        {renderFields(addForm, '')}
      </Modal>

      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Branch"
        onSubmit={editForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        {renderFields(editForm, '-2')}
      </Modal>

      <Modal open={active === 'delete'} onClose={onClose} title="Confirm Deletion">
        <div className="text-center">
          <span className="avatar avatar-xl bg-danger-transparent text-danger rounded-circle mb-3 d-inline-flex align-items-center justify-content-center">
            <i className="ti ti-trash-x fs-24" />
          </span>
          <h4 className="mb-1">Confirm Deletion</h4>
          <p className="mb-3">
            You want to delete all the marked items, this cant be undone once you delete.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                if (target) onDelete(target.id);
                onClose();
              }}
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CentralModals;
