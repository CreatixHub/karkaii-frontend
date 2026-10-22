import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Teacher } from '../data/teachers.data';
import type { TeacherModalId } from '../data/teacherWorkspace.data';

const IMPORT_MODES = [
  'Create new teachers',
  'Update existing by teacher ID',
  'Create and update',
];

export interface TeacherListModalsProps {
  active: TeacherModalId | null;
  /** The row that opened the dialog; the bulk bar passes null. */
  teacher: Teacher | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onConfirmDelete: () => void;
}

const TeacherListModals = ({
  active,
  teacher,
  onClose,
  onToast,
  onConfirmDelete,
}: TeacherListModalsProps) => {
  const [importMode, setImportMode] = useState(IMPORT_MODES[0]);
  const [importFile, setImportFile] = useState('');
  const [importValidated, setImportValidated] = useState(false);

  // Reset the import form each time the dialog is reopened, as Bootstrap did.
  useEffect(() => {
    if (active !== 'import') return;
    setImportMode(IMPORT_MODES[0]);
    setImportFile('');
    setImportValidated(false);
  }, [active]);

  const handleImport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!importFile) {
      setImportValidated(true);
      return;
    }
    onClose();
    onToast('File queued — 11 rows validated.');
  };

  return (
    <>
      {/* Login Details */}
      <Modal
        open={active === 'login'}
        onClose={onClose}
        title="Login Details"
        dialogClassName="modal-lg"
        footer={
          <button type="button" className="btn btn-light me-2" onClick={onClose}>
            Cancel
          </button>
        }
      >
        <div className="student-detail-info">
          <span className="student-img">
            <ImageWithBasePath
              src={teacher?.avatar ?? 'assets/img/teachers/teacher-01.jpg'}
              alt="img"
            />
          </span>
          <div className="name-info">
            <h5 className="fs-15">
              {teacher?.name ?? 'Teresa'} <span>{teacher?.classes ?? 'III, A'}</span>
            </h5>
          </div>
        </div>
        <div className="table-responsive custom-table no-datatable_length">
          <table className="table datanew">
            <thead className="thead-light">
              <tr>
                <th>User Type</th>
                <th>User Name</th>
                <th>Password </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Teacher</td>
                <td>teacher20</td>
                <td>teacher@53</td>
              </tr>
              <tr>
                <td>Parent</td>
                <td>parent53</td>
                <td>parent@53</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
      {/* /Login Details */}

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
          <button type="button" className="btn btn-light me-3" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-danger">
            Yes, Delete
          </button>
        </div>
      </Modal>
      {/* /Delete Modal */}

      {/* Import Teachers */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Teachers"
        formClassName={`validated-form${importValidated ? ' was-validated' : ''}`}
        onSubmit={handleImport}
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
          <input
            type="file"
            aria-label="Teacher list file"
            required
            onChange={(event) => {
              setImportFile(event.target.value);
              setImportValidated(false);
            }}
          />
        </div>
        {importValidated && !importFile ? (
          <div className="invalid-feedback d-block mb-3">Choose a CSV or Excel file to import.</div>
        ) : null}
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
            {IMPORT_MODES.map((mode) => (
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

export default TeacherListModals;
