import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import type { RankingModalId, RankingRecord, RankingStatus } from '../data/rankingSystem.data';
import { statusFormOptions } from '../data/rankingSystem.data';

export interface RankingDraft {
  name: string;
  status: RankingStatus;
  description: string;
}

export interface RankingModalsProps {
  active: RankingModalId | null;
  /** The card that opened the dialog; Add passes null. */
  record: RankingRecord | null;
  onClose: () => void;
  onAdd: (draft: RankingDraft) => void;
  onSave: (id: string, draft: RankingDraft) => void;
  onConfirmDelete: () => void;
}

const EMPTY_DRAFT: RankingDraft = { name: '', status: 'Active', description: '' };

/**
 * Name / Status / Description in the template's 6–6–12 grid. Both forms are identical
 * apart from their field ids (`name` vs `name-2` and so on), so they share this block.
 */
const RankingFields = ({
  idSuffix,
  draft,
  onChange,
}: {
  idSuffix: string;
  draft: RankingDraft;
  onChange: (draft: RankingDraft) => void;
}) => (
  <div className="row">
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`rs-name${idSuffix}`}>
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id={`rs-name${idSuffix}`}
          value={draft.name}
          onChange={(event) => onChange({ ...draft, name: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`rs-status${idSuffix}`}>
          Status
        </label>
        <select
          className="form-select"
          id={`rs-status${idSuffix}`}
          value={draft.status}
          onChange={(event) => onChange({ ...draft, status: event.target.value as RankingStatus })}
        >
          {statusFormOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`rs-description${idSuffix}`}>
          Description
        </label>
        <input
          type="text"
          className="form-control"
          id={`rs-description${idSuffix}`}
          value={draft.description}
          onChange={(event) => onChange({ ...draft, description: event.target.value })}
        />
      </div>
    </div>
  </div>
);

const RankingModals = ({
  active,
  record,
  onClose,
  onAdd,
  onSave,
  onConfirmDelete,
}: RankingModalsProps) => {
  const [addDraft, setAddDraft] = useState<RankingDraft>(EMPTY_DRAFT);
  const [editDraft, setEditDraft] = useState<RankingDraft>(EMPTY_DRAFT);

  useEffect(() => {
    if (active === 'edit' && record) {
      setEditDraft({
        name: record.name,
        status: record.status,
        description: record.description,
      });
    }
  }, [active, record]);

  const closeAdd = () => {
    setAddDraft(EMPTY_DRAFT);
    onClose();
  };

  return (
    <>
      {/* Add Ranking System */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Ranking System"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd({
            ...addDraft,
            name: addDraft.name.trim() || 'Ranking System',
          });
          closeAdd();
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Add Ranking System
            </button>
          </>
        }
      >
        <RankingFields idSuffix="" draft={addDraft} onChange={setAddDraft} />
      </Modal>

      {/* Edit Ranking System */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Ranking System"
        onSubmit={(event) => {
          event.preventDefault();
          if (record) {
            onSave(record.id, {
              ...editDraft,
              name: editDraft.name.trim() || record.name,
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
        <RankingFields idSuffix="-2" draft={editDraft} onChange={setEditDraft} />
      </Modal>

      {/* Delete Modal */}
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

export default RankingModals;
