import { useState } from 'react';
import Modal from '@components/ui/Modal';
import { importModes } from '../data/teachersWorkspace.data';
import type { TeacherModalId } from '../data/teachersWorkspace.data';

export interface TeacherModalsProps {
  active: TeacherModalId | null;
  /** How many cards the delete confirmation is about to remove. */
  deleteCount: number;
  /** Rows the import dialog reports as validated — the roster size. */
  rowCount: number;
  onClose: () => void;
  onToast: (message: string) => void;
  onConfirmDelete: () => void;
}

const TeacherModals = ({
  active,
  deleteCount,
  rowCount,
  onClose,
  onToast,
  onConfirmDelete,
}: TeacherModalsProps) => {
  const [importMode, setImportMode] = useState(importModes[0]);

  return (
    <>
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
        <h3 className="fs-18">Confirm Deletion</h3>
        <p>
          You want to delete all the marked items, this cant be undone once you delete.
        </p>
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-light me-3" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-danger">
            Yes, Delete{deleteCount > 1 ? ` (${deleteCount})` : ''}
          </button>
        </div>
      </Modal>
      {/* /Delete Modal */}

      {/* Import Teachers */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Teachers"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          setImportMode(importModes[0]);
          onToast(`File queued — ${rowCount} rows validated.`);
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
          <input type="file" aria-label="Teacher list file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            {importModes.map((mode) => (
              <option key={mode}>{mode}</option>
            ))}
          </select>
        </div>
        <div className="alert alert-light border d-flex align-items-start gap-2 mb-0" role="note">
          <i className="ti ti-download fs-16" />
          <span className="fs-12">
            Not sure about the format? Download the template with all required columns and sample
            rows.
          </span>
        </div>
      </Modal>
      {/* /Import Teachers */}
    </>
  );
};

export default TeacherModals;
