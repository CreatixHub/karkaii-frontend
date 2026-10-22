import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { MaterialModalId, MaterialRow } from '../data/studyMaterials.data';

export interface MaterialDraft {
  title: string;
  subject: string;
  className: string;
  section: string;
  type: string;
  chapter: string;
  description: string;
  visibility: string;
}

export interface MaterialsModalsProps {
  active: MaterialModalId | null;
  material: MaterialRow | null;
  selectedCount: number;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: MaterialDraft) => void;
  onSave: (id: string, draft: MaterialDraft) => void;
  onConfirmDelete: () => void;
  onEditFromView: () => void;
}

const SUBJECTS = ['Select', 'Mathematics', 'Physics', 'English', 'Chemistry', 'Biology', 'Computer Science', 'Geography', 'History'];
const CLASSES = ['Select', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const SECTIONS = ['Select', 'A', 'B', 'C'];
const TYPES = ['Select', 'PDF', 'PPT', 'Video', 'Document', 'Link', 'Audio'];
const VISIBILITY = ['Draft', 'Published'];

const EMPTY: MaterialDraft = {
  title: '',
  subject: 'Select',
  className: 'Select',
  section: 'Select',
  type: 'Select',
  chapter: '',
  description: '',
  visibility: 'Draft',
};

const MaterialForm = ({
  prefix,
  draft,
  onChange,
}: {
  prefix: string;
  draft: MaterialDraft;
  onChange: (patch: Partial<MaterialDraft>) => void;
}) => (
  <div className="row">
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-title`}>
          Title
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. Algebra Fundamentals — Linear Equations"
          id={`${prefix}-title`}
          value={draft.title}
          onChange={(event) => onChange({ title: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-subject`}>
          Subject
        </label>
        <select
          className="form-select"
          id={`${prefix}-subject`}
          value={draft.subject}
          onChange={(event) => onChange({ subject: event.target.value })}
        >
          {SUBJECTS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="col-md-3">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-class`}>
          Class
        </label>
        <select
          className="form-select"
          id={`${prefix}-class`}
          value={draft.className}
          onChange={(event) => onChange({ className: event.target.value })}
        >
          {CLASSES.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="col-md-3">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-section`}>
          Section
        </label>
        <select
          className="form-select"
          id={`${prefix}-section`}
          value={draft.section}
          onChange={(event) => onChange({ section: event.target.value })}
        >
          {SECTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-type`}>
          Material Type
        </label>
        <select
          className="form-select"
          id={`${prefix}-type`}
          value={draft.type}
          onChange={(event) => onChange({ type: event.target.value })}
        >
          {TYPES.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-file`}>
          Upload File
        </label>
        <input type="file" className="form-control" id={`${prefix}-file`} />
      </div>
    </div>
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-chapter`}>
          Chapter
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. Chapter 3 · Linear Equations in Two Variables"
          id={`${prefix}-chapter`}
          value={draft.chapter}
          onChange={(event) => onChange({ chapter: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-description`}>
          Description
        </label>
        <textarea
          className="form-control"
          rows={3}
          placeholder="Briefly describe what this resource covers…"
          id={`${prefix}-description`}
          value={draft.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-0">
        <label className="form-label" htmlFor={`${prefix}-visibility`}>
          Visibility
        </label>
        <select
          className="form-select"
          id={`${prefix}-visibility`}
          value={draft.visibility}
          onChange={(event) => onChange({ visibility: event.target.value })}
        >
          {VISIBILITY.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

const MaterialsModals = ({
  active,
  material,
  selectedCount,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
  onEditFromView,
}: MaterialsModalsProps) => {
  const [addDraft, setAddDraft] = useState<MaterialDraft>(EMPTY);
  const [editDraft, setEditDraft] = useState<MaterialDraft>(EMPTY);
  const [importMode, setImportMode] = useState('Create new materials');

  useEffect(() => {
    if (active !== 'edit' || !material) return;
    const [className, section] = material.className.split('-');
    setEditDraft({
      title: material.title,
      subject: material.subject,
      className: className ?? 'Select',
      section: section ?? 'Select',
      type: material.type,
      chapter: material.chapter,
      description: '',
      visibility: material.status === 'Published' ? 'Published' : 'Draft',
    });
  }, [active, material]);

  const closeAdd = () => {
    setAddDraft(EMPTY);
    onClose();
  };

  return (
    <>
      {/* Add Study Material */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Study Material"
        dialogClassName="modal-lg"
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
              Add Study Material
            </button>
          </>
        }
      >
        <MaterialForm
          prefix="sm-add"
          draft={addDraft}
          onChange={(patch) => setAddDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Edit Study Material */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Study Material"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          if (material) onSave(material.id, editDraft);
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
        <MaterialForm
          prefix="sm-edit"
          draft={editDraft}
          onChange={(patch) => setEditDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Material Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="Material Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to="#" className="btn btn-primary" onClick={onEditFromView}>
              Edit Material
            </Link>
          </>
        }
      >
        {material ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span
                className={`avatar avatar-lg bg-light text-${material.tone} rounded d-inline-flex align-items-center justify-content-center me-2 flex-shrink-0`}
              >
                <i className={`${material.typeIcon} fs-20`} />
              </span>
              <div>
                <h5 className="mb-0">
                  {material.title}{' '}
                  <span className={`dt-pill ${material.pillClass} ms-1`}>
                    <i className={material.pillIcon} />
                    {material.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">
                  {material.id} · {material.subject} · Class {material.className} · {material.year}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-bookmark" />
                  Chapter
                </h6>
                <p className="fs-13 mb-0">{material.chapter}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-file-stack" />
                  File
                </h6>
                <p className="fs-13 mb-0">
                  {material.type} · {material.size}
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-download" />
                  Downloads
                </h6>
                <p className="fs-13 mb-0">{material.downloads} downloads</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-user" />
                  Uploaded By
                </h6>
                <div className="d-flex align-items-center gap-2">
                  <span className="avatar avatar-sm">
                    <ImageWithBasePath
                      src={material.teacher.avatar}
                      className="rounded-circle flex-shrink-0"
                      alt={material.teacher.name}
                    />
                  </span>
                  <div>
                    <span className="fw-medium d-block">{material.teacher.name}</span>
                    <span className="fs-12 text-muted">{material.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Import Study Materials */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Study Materials"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          onToast('File queued — 10 materials validated.');
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
          <input type="file" aria-label="Study material file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="sm-import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="sm-import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            <option>Create new materials</option>
            <option>Update existing by code</option>
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

export default MaterialsModals;
