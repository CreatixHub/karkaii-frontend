import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import Modal from '@components/ui/Modal';
import { ActionLink } from '@components/workspace';

export type NameStatusDialog = 'add' | 'edit' | null;

export interface NameStatusDraft {
  name: string;
  active: boolean;
}

export interface NameStatusModalsProps {
  open: NameStatusDialog;
  /** The noun the dialog titles and its field use, e.g. "Category". */
  noun: string;
  /** The field's label, where it is not just the noun plus "Name". */
  fieldLabel?: string;
  /** What the dialog opens with when editing. */
  value: NameStatusDraft | null;
  onClose: () => void;
  onSave: (draft: NameStatusDraft) => void;
  /** Extra fields a page slots under the name, e.g. a parent country. */
  children?: ReactNode;
}

const NameStatusModals = ({
  open,
  noun,
  fieldLabel,
  value,
  onClose,
  onSave,
  children,
}: NameStatusModalsProps) => {
  const [name, setName] = useState('');
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(open === 'edit' && value ? value.name : '');
    setActive(open === 'edit' && value ? value.active : false);
  }, [open, value]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave({ name: name.trim(), active });
  };

  const body = (
    <div className="row">
      <div className="col-md-12">
        <div className="mb-3">
          <label className="form-label" htmlFor={`${noun.toLowerCase()}-name`}>
            {fieldLabel ?? `${noun} Name`}
          </label>
          <input
            type="text"
            className="form-control"
            id={`${noun.toLowerCase()}-name`}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        {children}
        <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
          <div className="status-title">
            <h5>Status</h5>
            <p>Change the Status by toggle </p>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id={`${noun.toLowerCase()}-status`}
              checked={active}
              aria-label="Toggle status"
              onChange={(event) => setActive(event.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const footer = (submitLabel: string) => (
    <>
      <ActionLink className="btn btn-light me-2" onClick={onClose}>
        Cancel
      </ActionLink>
      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </>
  );

  return (
    <>
      <Modal
        open={open === 'add'}
        onClose={onClose}
        title={`Add ${noun}`}
        onSubmit={submit}
        footer={footer(`Add ${noun}`)}
      >
        {body}
      </Modal>

      <Modal
        open={open === 'edit'}
        onClose={onClose}
        title={`Edit ${noun}`}
        onSubmit={submit}
        footer={footer('Save Changes')}
      >
        {body}
      </Modal>
    </>
  );
};

export default NameStatusModals;
