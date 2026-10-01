import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { SyllabusModalId, SyllabusRow } from '../data/classSyllabus.data';

export interface SyllabusDraft {
  className: string;
  section: string;
  group: string;
}

export interface SyllabusModalsProps {
  active: SyllabusModalId | null;
  syllabus: SyllabusRow | null;
  selectedCount: number;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: SyllabusDraft) => void;
  onSave: (id: string, draft: SyllabusDraft) => void;
  onConfirmDelete: () => void;
  onEditFromView: () => void;
}

const CLASSES = ['Select', 'I', 'II', 'III'];
const SECTIONS = ['Select', 'A', 'B', 'C'];

const EMPTY: SyllabusDraft = { className: 'Select', section: 'Select', group: '' };

const SyllabusForm = ({
  prefix,
  draft,
  onChange,
}: {
  prefix: string;
  draft: SyllabusDraft;
  onChange: (patch: Partial<SyllabusDraft>) => void;
}) => (
  <div className="row">
    <div className="col-md-12">
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
      <div className="mb-0">
        <label className="form-label" htmlFor={`${prefix}-group`}>
          Subject Group
        </label>
        <input
          type="text"
          className="form-control"
          id={`${prefix}-group`}
          value={draft.group}
          onChange={(event) => onChange({ group: event.target.value })}
        />
      </div>
    </div>
  </div>
);

const SyllabusModals = ({
  active,
  syllabus,
  selectedCount,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
  onEditFromView,
}: SyllabusModalsProps) => {
  const [addDraft, setAddDraft] = useState<SyllabusDraft>(EMPTY);
  const [editDraft, setEditDraft] = useState<SyllabusDraft>(EMPTY);
  const [importMode, setImportMode] = useState('Create new syllabi');

  useEffect(() => {
    if (active !== 'edit' || !syllabus) return;
    const [className, section] = syllabus.className.split(', ');
    setEditDraft({ className: className ?? 'Select', section: section ?? 'Select', group: syllabus.name });
  }, [active, syllabus]);

  const closeAdd = () => {
    setAddDraft(EMPTY);
    onClose();
  };

  return (
    <>
      {/* Add Subject Group */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Subject Group"
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
              Add Subject Group
            </button>
          </>
        }
      >
        <SyllabusForm
          prefix="syl-add"
          draft={addDraft}
          onChange={(patch) => setAddDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Edit Subject Group */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Subject Group"
        onSubmit={(event) => {
          event.preventDefault();
          if (syllabus) onSave(syllabus.id, editDraft);
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
        <SyllabusForm
          prefix="syl-edit"
          draft={editDraft}
          onChange={(patch) => setEditDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Syllabus Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="Syllabus Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to="#" className="btn btn-primary" onClick={onEditFromView}>
              Edit Syllabus
            </Link>
          </>
        }
      >
        {syllabus ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span
                className={`avatar avatar-lg bg-light text-${syllabus.tone} rounded d-inline-flex align-items-center justify-content-center me-2 flex-shrink-0`}
              >
                <i className="ti ti-book-2 fs-20" />
              </span>
              <div>
                <h5 className="mb-0">
                  {syllabus.name}{' '}
                  <span className={`dt-pill ${syllabus.pillClass} ms-1`}>
                    {syllabus.pillIcon ? (
                      <i className={syllabus.pillIcon} />
                    ) : (
                      <span className="dt-pill-dot" />
                    )}
                    {syllabus.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">
                  {syllabus.id} · {syllabus.subtitle} · Class {syllabus.className} · {syllabus.year} ·{' '}
                  {syllabus.term}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-stack-2" />
                  Structure
                </h6>
                <p className="fs-13 mb-0">
                  {syllabus.units} units · {syllabus.topics} topics · {syllabus.lessons} lessons
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-progress" />
                  Progress
                </h6>
                <div className={`meter ${syllabus.meterClass} mb-1`}>
                  <span style={{ width: `${syllabus.percent}%` }} />
                </div>
                <p className="fs-12 text-muted mb-0">
                  {syllabus.percent}% · {syllabus.topicsDone}/{syllabus.topics} topics ·{' '}
                  {syllabus.pending} pending
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-clock-hour-4" />
                  Estimated Effort
                </h6>
                <p className="fs-13 mb-0">{syllabus.hours} hours · due {syllabus.due}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-user" />
                  Teacher
                </h6>
                <div className="d-flex align-items-center gap-2">
                  <span className="avatar avatar-sm">
                    <ImageWithBasePath
                      src={syllabus.teacher.avatar}
                      className="rounded-circle flex-shrink-0"
                      alt={syllabus.teacher.name}
                    />
                  </span>
                  <div>
                    <span className="fw-medium d-block">{syllabus.teacher.name}</span>
                    <span className="fs-12 text-muted">{syllabus.term}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Import Syllabus */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Syllabus"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          onToast('File queued — 10 syllabi validated.');
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
          <input type="file" aria-label="Syllabus file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="syl-import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="syl-import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            <option>Create new syllabi</option>
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

export default SyllabusModals;
