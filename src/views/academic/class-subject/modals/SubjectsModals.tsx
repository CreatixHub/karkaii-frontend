import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { SubjectModalId, SubjectRow } from '../data/classSubject.data';

export interface SubjectDraft {
  name: string;
  code: string;
  type: string;
}

export interface SubjectsModalsProps {
  active: SubjectModalId | null;
  subject: SubjectRow | null;
  selectedCount: number;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: SubjectDraft) => void;
  onSave: (id: string, draft: SubjectDraft) => void;
  onConfirmDelete: () => void;
  onEditFromView: () => void;
}

const CODE_OPTIONS = ['Select', '101', '102', '103', '104'];
const TYPE_OPTIONS = ['Select', 'Theory', 'Practical'];

const EMPTY: SubjectDraft = { name: '', code: 'Select', type: 'Select' };

const SubjectForm = ({
  prefix,
  draft,
  onChange,
}: {
  prefix: string;
  draft: SubjectDraft;
  onChange: (patch: Partial<SubjectDraft>) => void;
}) => (
  <div className="row">
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-name`}>
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id={`${prefix}-name`}
          value={draft.name}
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-code`}>
          Code
        </label>
        <select
          className="form-select"
          id={`${prefix}-code`}
          value={draft.code}
          onChange={(event) => onChange({ code: event.target.value })}
        >
          {CODE_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="mb-0">
        <label className="form-label" htmlFor={`${prefix}-type`}>
          Type
        </label>
        <select
          className="form-select"
          id={`${prefix}-type`}
          value={draft.type}
          onChange={(event) => onChange({ type: event.target.value })}
        >
          {TYPE_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

const SubjectsModals = ({
  active,
  subject,
  selectedCount,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
  onEditFromView,
}: SubjectsModalsProps) => {
  const [addDraft, setAddDraft] = useState<SubjectDraft>(EMPTY);
  const [editDraft, setEditDraft] = useState<SubjectDraft>(EMPTY);
  const [importMode, setImportMode] = useState('Create new subjects');

  useEffect(() => {
    if (active !== 'edit' || !subject) return;
    setEditDraft({ name: subject.name, code: subject.id.split('-')[1] ?? 'Select', type: 'Theory' });
  }, [active, subject]);

  const closeAdd = () => {
    setAddDraft(EMPTY);
    onClose();
  };

  return (
    <>
      {/* Add Subject */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Subject"
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
              Add Subject
            </button>
          </>
        }
      >
        <SubjectForm
          prefix="sub-add"
          draft={addDraft}
          onChange={(patch) => setAddDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Edit Subject */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Subject"
        onSubmit={(event) => {
          event.preventDefault();
          if (subject) onSave(subject.id, editDraft);
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
        <SubjectForm
          prefix="sub-edit"
          draft={editDraft}
          onChange={(patch) => setEditDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Subject Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="Subject Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to="#" className="btn btn-primary" onClick={onEditFromView}>
              Edit Subject
            </Link>
          </>
        }
      >
        {subject ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span
                className={`avatar avatar-lg bg-light text-${subject.iconTone} rounded d-inline-flex align-items-center justify-content-center me-2 flex-shrink-0`}
              >
                <i className={`${subject.icon} fs-20`} />
              </span>
              <div>
                <h5 className="mb-0">
                  {subject.name}{' '}
                  <span className={`dt-pill ${subject.pillClass} ms-1`}>
                    {subject.pillIcon ? (
                      <i className={subject.pillIcon} />
                    ) : (
                      <span className="dt-pill-dot" />
                    )}
                    {subject.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">
                  {subject.id} · {subject.category} · Class {subject.className}-{subject.section} ·{' '}
                  {subject.year} · {subject.teacher.name}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-file-description" />
                  Description
                </h6>
                <p className="fs-13 mb-0">
                  {subject.name} ({subject.category}) covering {subject.units} units across the{' '}
                  {subject.year} session.
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-list-numbers" />
                  Curriculum
                </h6>
                <p className="fs-13 mb-0">
                  {subject.units} units · {subject.lessons} lessons · {subject.assignments} assignments ·{' '}
                  {subject.exams} exams
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-clock-hour-4" />
                  Load
                </h6>
                <p className="fs-13 mb-0">
                  {subject.periods} periods / week · {subject.credits} credit hours
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-user" />
                  Teacher
                </h6>
                <div className="d-flex align-items-center gap-2">
                  <span className="avatar avatar-sm">
                    <ImageWithBasePath
                      src={subject.teacher.avatar}
                      className="rounded-circle flex-shrink-0"
                      alt={subject.teacher.name}
                    />
                  </span>
                  <div>
                    <span className="fw-medium d-block">{subject.teacher.name}</span>
                    <span className="fs-12 text-muted">{subject.department} Dept</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Import Subjects */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Subjects"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          onToast('File queued — 10 subjects validated.');
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
          <input type="file" aria-label="Subject file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="sub-import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="sub-import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            <option>Create new subjects</option>
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

export default SubjectsModals;
